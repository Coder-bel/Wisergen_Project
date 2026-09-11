<?php
// PUBLIC read-only: list published news posts.
require_once __DIR__ . '/../../private/db.php';
cors_public();
only_method('GET');

// Single post by id?
if (!empty($_GET['id'])) {
  $stmt = pdo()->prepare("SELECT id, title, summary, body, image_url, source_url, created_at
                          FROM news WHERE id = ? AND status = 'published'");
  $stmt->execute([(int)$_GET['id']]);
  $row = $stmt->fetch();
  json_out($row ?: ['error' => 'Not found']);
}

$rows = pdo()->query(
  "SELECT id, title, summary, image_url, source_url, created_at
   FROM news WHERE status = 'published' ORDER BY created_at DESC"
)->fetchAll();
json_out($rows);
