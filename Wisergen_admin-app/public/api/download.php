<?php
// PUBLIC (token-gated): stream the source zip for a verified purchase.
// GET /api/download.php?token=xxxx  -> forces a file download if the token is valid.
require_once __DIR__ . '/../../private/db.php';

$token = $_GET['token'] ?? '';
if ($token === '' || !ctype_xdigit($token)) {
  http_response_code(400);
  exit('Invalid download link.');
}

$stmt = pdo()->prepare(
  'SELECT p.id, p.downloaded, pr.zip_path, pr.title
   FROM purchases p JOIN projects pr ON pr.id = p.project_id
   WHERE p.token = ?'
);
$stmt->execute([$token]);
$row = $stmt->fetch();

if (!$row || empty($row['zip_path'])) {
  http_response_code(404);
  exit('Download not found or expired.');
}

$file = rtrim(ZIP_DIR, '/') . '/' . basename($row['zip_path']);
if (!is_file($file)) {
  http_response_code(404);
  exit('File no longer available. Please contact support.');
}

// Mark as downloaded (allows a few retries within a short window if you extend this later)
pdo()->prepare('UPDATE purchases SET downloaded = downloaded + 1 WHERE id = ?')->execute([$row['id']]);

// A clean filename for the buyer
$safeName = preg_replace('/[^A-Za-z0-9_-]+/', '-', $row['title']);
$safeName = trim($safeName, '-') ?: 'source-code';

header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="' . $safeName . '.zip"');
header('Content-Length: ' . filesize($file));
header('Cache-Control: no-store');
readfile($file);
exit;
