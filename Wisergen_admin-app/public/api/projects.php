<?php
// PUBLIC: GET list of published projects, or POST a project inquiry.
require_once __DIR__ . '/../../private/db.php';
cors_public();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
  // Note: zip_path is intentionally NOT exposed publicly.
  $rows = pdo()->query(
    "SELECT id, title, summary, description, tech_stack,
            image_url, image_url2, image_url3, live_url, price, created_at
     FROM projects WHERE status = 'published' ORDER BY created_at DESC"
  )->fetchAll();
  json_out($rows);
}

if ($method === 'POST') {
  $in = json_in();
  if (!empty($in['company'])) json_out(['ok' => true]); // honeypot

  $projectId = (int)($in['project_id'] ?? 0) ?: null;
  $name  = trim($in['name'] ?? '');
  $email = trim($in['email'] ?? '');
  $msg   = trim($in['message'] ?? '');

  if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['error' => 'Name and a valid email are required'], 400);
  }

  pdo()->prepare('INSERT INTO project_inquiries (project_id, name, email, message) VALUES (?, ?, ?, ?)')
       ->execute([$projectId, $name, $email, $msg]);
  json_out(['ok' => true]);
}

json_out(['error' => 'Method not allowed'], 405);
