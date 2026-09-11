<?php
// Admin login — hardened.
// Protections: bcrypt verify, IP lockout, progressive delay, honeypot,
// session regeneration, generic error messages, login notification email.
require_once __DIR__ . '/../private/db.php';
start_secure_session();

if (!empty($_SESSION['admin_id'])) {
  header('Location: index.php');
  exit;
}

$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  $ip = client_ip();

  // --- Honeypot: real users never see or fill this field ---
  if (!empty($_POST['website'])) {
    record_attempt($ip, 'honeypot', false);
    sleep(2);
    $error = 'Invalid username or password.';
  }
  elseif (is_locked_out($ip)) {
    $error = 'Too many failed attempts. Please try again later.';
  }
  else {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = pdo()->prepare('SELECT id, password_hash FROM admins WHERE username = ?');
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password_hash'])) {
      record_attempt($ip, $username, true);
      session_regenerate_id(true);
      $_SESSION['admin_id'] = $admin['id'];
      $_SESSION['last_activity'] = time();

      notify_login($username, $ip);

      header('Location: index.php');
      exit;
    } else {
      record_attempt($ip, $username, false);

      // --- Progressive delay: each recent failure slows the next attempt ---
      $fails = recent_failures($ip);
      $delay = min($fails, 5);          // cap at 5 seconds
      if ($delay > 0) sleep($delay);

      $error = 'Invalid username or password.';
    }
  }
}

// Count recent failed attempts from this IP (used for the delay)
function recent_failures($ip) {
  $stmt = pdo()->prepare(
    'SELECT COUNT(*) FROM login_attempts
     WHERE ip = ? AND success = 0 AND attempted_at > (NOW() - INTERVAL ? SECOND)'
  );
  $stmt->execute([$ip, LOGIN_LOCKOUT_WINDOW]);
  return (int)$stmt->fetchColumn();
}

// Email the admin whenever a successful login happens
function notify_login($username, $ip) {
  if (!defined('ADMIN_NOTIFY_EMAIL') || ADMIN_NOTIFY_EMAIL === '') return;

  $when  = date('M j, Y g:i A');
  $agent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 200);

  $subject = 'Wisergen Admin: successful login';
  $body =
    "A successful admin login just occurred.\n\n" .
    "Username: $username\n" .
    "Time: $when\n" .
    "IP address: $ip\n" .
    "Browser: $agent\n\n" .
    "If this wasn't you, change the admin password immediately.";
  $headers = 'From: ' . ADMIN_NOTIFY_EMAIL . "\r\n";

  @mail(ADMIN_NOTIFY_EMAIL, $subject, $body, $headers);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Admin Login — Wisergen</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0F172A; display: flex; min-height: 100vh; align-items: center; justify-content: center; padding: 1rem; }
    .card { background: #fff; border-radius: 16px; padding: 2rem; width: 100%; max-width: 360px; box-shadow: 0 20px 40px rgba(0,0,0,.3); }
    h1 { font-size: 1.4rem; color: #0F172A; margin-bottom: .25rem; }
    p.sub { color: #64748b; font-size: .85rem; margin-bottom: 1.5rem; }
    label { display: block; font-size: .85rem; color: #334155; margin-bottom: .35rem; }
    input { width: 100%; padding: .7rem .9rem; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 1rem; font-size: 1rem; }
    input:focus { outline: none; border-color: #0063ED; box-shadow: 0 0 0 3px rgba(0,99,237,.15); }
    button { width: 100%; padding: .8rem; background: #0063ED; color: #fff; border: none; border-radius: 10px; font-weight: 600; font-size: 1rem; cursor: pointer; }
    button:hover { background: #0052c4; }
    .error { background: #fef2f2; color: #dc2626; padding: .7rem .9rem; border-radius: 10px; font-size: .85rem; margin-bottom: 1rem; }
    .hp { position: absolute; left: -9999px; opacity: 0; height: 0; width: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Admin Login</h1>
    <p class="sub">Wisergen Marketplace</p>
    <?php if ($error): ?><div class="error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <form method="post" autocomplete="off">
      <label>Username</label>
      <input type="text" name="username" autofocus required>
      <label>Password</label>
      <input type="password" name="password" required>

      <!-- Honeypot: hidden from humans, bots tend to fill every field -->
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">

      <button type="submit">Sign In</button>
    </form>
  </div>
</body>
</html>
