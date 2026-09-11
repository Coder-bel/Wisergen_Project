<?php
// PUBLIC: GET public settings (WhatsApp number), or POST a custom device request.
require_once __DIR__ . '/../../private/db.php';
cors_public();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
  json_out(['whatsapp' => WHATSAPP_NUMBER]);
}

if ($method === 'POST') {
  $in = json_in();
  if (!empty($in['company'])) json_out(['ok' => true]); // honeypot

  $gadget = trim($in['gadget_name'] ?? '');
  $spec   = trim($in['spec'] ?? '');
  $info   = trim($in['info'] ?? '');
  $email  = trim($in['email'] ?? '');
  $cond   = in_array($in['condition_pref'] ?? '', ['new','used'], true) ? $in['condition_pref'] : null;

  if ($gadget === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['error' => 'Device name and a valid email are required'], 400);
  }

  $stmt = pdo()->prepare('INSERT INTO requests (gadget_name, spec, info, email, condition_pref) VALUES (?, ?, ?, ?, ?)');
  $stmt->execute([$gadget, $spec, $info, $email, $cond]);
  json_out(['ok' => true]);
}

json_out(['error' => 'Method not allowed'], 405);
