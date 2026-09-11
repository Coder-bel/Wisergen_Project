<?php
// ============================================================
// Core bootstrap — DB connection, sessions, security helpers.
// Required by every endpoint. Depends on config.php (same folder).
// ============================================================
require_once __DIR__ . '/config.php';

// ---- PDO connection (prepared statements only) ----
function pdo() {
  static $pdo = null;
  if ($pdo === null) {
    try {
      $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER, DB_PASS,
        [
          PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
          PDO::ATTR_EMULATE_PREPARES   => false,
        ]
      );
    } catch (PDOException $e) {
      json_out(['error' => DEBUG ? $e->getMessage() : 'Database error'], 500);
    }
  }
  return $pdo;
}

// ---- JSON helpers ----
function json_out($data, $status = 200) {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data);
  exit;
}
function json_in() {
  $d = json_decode(file_get_contents('php://input'), true);
  return is_array($d) ? $d : [];
}

// ---- Is this request over HTTPS? ----
function is_https() {
  return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
      || (($_SERVER['SERVER_PORT'] ?? '') == 443)
      || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
}

// ---- Start a hardened session (call in admin pages, not the public API) ----
function start_secure_session() {
  session_set_cookie_params([
    'lifetime' => 0,
    'httponly' => true,
    'secure'   => is_https(),   // secure cookie once on HTTPS
    'samesite' => 'Lax',
  ]);
  session_start();

  // Idle timeout
  $now = time();
  if (isset($_SESSION['last_activity']) && ($now - $_SESSION['last_activity'] > SESSION_TIMEOUT)) {
    $_SESSION = [];
    session_destroy();
    session_start();
  }
  $_SESSION['last_activity'] = $now;
}

// ---- Guard: stop unless an admin is logged in ----
function require_admin() {
  start_secure_session();
  if (!empty($_SESSION['admin_id'])) return;

  $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
  $isApi  = strpos($_SERVER['REQUEST_URI'] ?? '', '/api/') !== false
            || strpos($accept, 'application/json') !== false;

  if ($isApi) {
    json_out(['error' => 'Not authorized'], 401);
  }
  header('Location: login.php');
  exit;
}

// ---- CSRF (for admin forms) ----
function csrf_token() {
  if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
  }
  return $_SESSION['csrf'];
}
function csrf_check($token) {
  return !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], (string)$token);
}

// ---- CORS for the PUBLIC read API only (scoped to allowed origins) ----
function cors_public() {
  global $ALLOWED_ORIGINS;
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin && in_array($origin, $ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
  }
  // Answer preflight immediately
  if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
  }
}

// ---- Only allow a given HTTP method (else 405) ----
function only_method($method) {
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
    json_out(['error' => 'Method not allowed'], 405);
  }
}

// ---- Brute-force helpers ----
function client_ip() {
  return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}
function is_locked_out($ip) {
  $stmt = pdo()->prepare(
    'SELECT COUNT(*) FROM login_attempts
     WHERE ip = ? AND success = 0 AND attempted_at > (NOW() - INTERVAL ? SECOND)'
  );
  $stmt->execute([$ip, LOGIN_LOCKOUT_WINDOW]);
  return (int)$stmt->fetchColumn() >= MAX_LOGIN_ATTEMPTS;
}
function record_attempt($ip, $username, $success) {
  $stmt = pdo()->prepare('INSERT INTO login_attempts (ip, username, success) VALUES (?, ?, ?)');
  $stmt->execute([$ip, $username, $success ? 1 : 0]);
}
