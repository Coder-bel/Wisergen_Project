<?php
// ============================================================
// Admin account settings — change username and/or password.
// Requires an active session AND the current password to confirm.
// ============================================================
require_once __DIR__ . '/../private/db.php';
require_admin();

$notice = '';
$error  = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  if (!csrf_check($_POST['csrf'] ?? '')) {
    $error = 'Security check failed. Please try again.';
  } else {
    $current = $_POST['current_password'] ?? '';
    $newUser = trim($_POST['new_username'] ?? '');
    $newPass = $_POST['new_password'] ?? '';
    $confirm = $_POST['confirm_password'] ?? '';

    // Always re-verify the current password before any change
    $stmt = pdo()->prepare('SELECT id, username, password_hash FROM admins WHERE id = ?');
    $stmt->execute([$_SESSION['admin_id']]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($current, $admin['password_hash'])) {
      $error = 'Current password is incorrect.';
    } elseif ($newUser === '' ) {
      $error = 'Username cannot be empty.';
    } elseif (strlen($newUser) < 3) {
      $error = 'Username must be at least 3 characters.';
    } elseif ($newPass !== '' && strlen($newPass) < 8) {
      $error = 'New password must be at least 8 characters.';
    } elseif ($newPass !== '' && $newPass !== $confirm) {
      $error = 'New password and confirmation do not match.';
    } else {
      try {
        if ($newPass !== '') {
          $hash = password_hash($newPass, PASSWORD_DEFAULT);
          pdo()->prepare('UPDATE admins SET username = ?, password_hash = ? WHERE id = ?')
               ->execute([$newUser, $hash, $admin['id']]);
          $notice = 'Username and password updated. Use them next time you sign in.';
        } else {
          pdo()->prepare('UPDATE admins SET username = ? WHERE id = ?')
               ->execute([$newUser, $admin['id']]);
          $notice = 'Username updated.';
        }
        // New session ID after a credential change
        session_regenerate_id(true);
      } catch (PDOException $e) {
        $error = 'That username is already taken.';
      }
    }
  }
}

// Current username for the form
$stmt = pdo()->prepare('SELECT username FROM admins WHERE id = ?');
$stmt->execute([$_SESSION['admin_id']]);
$me = $stmt->fetch();

$csrf = csrf_token();
function h($v) { return htmlspecialchars((string)$v, ENT_QUOTES); }
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Account — Wisergen Admin</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;background:#f1f5f9;color:#0f172a}
    header{background:#0F172A;color:#fff;padding:0 1.5rem;height:60px;display:flex;align-items:center;justify-content:space-between}
    header .brand{font-weight:700}
    header a{color:#cbd5e1;text-decoration:none;font-size:.9rem;margin-left:1rem}
    header a:hover{color:#fff}
    .wrap{max-width:520px;margin:0 auto;padding:1.5rem}
    .card{background:#fff;border-radius:14px;padding:1.5rem;margin-bottom:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.06)}
    .card h2{font-size:1.1rem;margin-bottom:.35rem}
    .card p.hint{color:#64748b;font-size:.85rem;margin-bottom:1rem}
    label{display:block;font-size:.8rem;color:#475569;margin:.9rem 0 .3rem}
    input{width:100%;padding:.6rem .8rem;border:1px solid #e2e8f0;border-radius:9px;font-size:.95rem}
    input:focus{outline:none;border-color:#0063ED}
    button{padding:.7rem 1.3rem;background:#0063ED;color:#fff;border:none;border-radius:9px;font-weight:600;cursor:pointer;font-size:.9rem;margin-top:1.2rem}
    button:hover{background:#0052c4}
    .notice{background:#dcfce7;color:#166534;padding:.7rem 1rem;border-radius:9px;margin-bottom:1rem;font-size:.9rem}
    .err{background:#fef2f2;color:#dc2626;padding:.7rem 1rem;border-radius:9px;margin-bottom:1rem;font-size:.9rem}
    .divider{border-top:1px solid #f1f5f9;margin:1.4rem 0}
    a.back{color:#0063ED;text-decoration:none;font-size:.85rem}
  </style>
</head>
<body>
<header>
  <span class="brand">Wisergen Admin</span>
  <div>
    <a href="index.php">Dashboard</a>
    <a href="logout.php">Logout</a>
  </div>
</header>

<div class="wrap">
  <?php if ($notice): ?><div class="notice"><?= h($notice) ?></div><?php endif; ?>
  <?php if ($error): ?><div class="err"><?= h($error) ?></div><?php endif; ?>

  <div class="card">
    <h2>Login Details</h2>
    <p class="hint">Change your username and/or password. Your current password is required to confirm.</p>

    <form method="post" autocomplete="off">
      <input type="hidden" name="csrf" value="<?= $csrf ?>">

      <label>Current Password *</label>
      <input type="password" name="current_password" required>

      <div class="divider"></div>

      <label>Username</label>
      <input type="text" name="new_username" value="<?= h($me['username'] ?? '') ?>" required>

      <label>New Password <span style="color:#94a3b8">(leave blank to keep current)</span></label>
      <input type="password" name="new_password" minlength="8">

      <label>Confirm New Password</label>
      <input type="password" name="confirm_password">

      <button type="submit">Save Changes</button>
    </form>
  </div>

  <p><a class="back" href="index.php">&larr; Back to dashboard</a></p>
</div>
</body>
</html>
