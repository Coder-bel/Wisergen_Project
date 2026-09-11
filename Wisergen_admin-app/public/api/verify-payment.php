<?php
// PUBLIC: verify a Paystack payment server-side, then issue a one-time download token.
// Frontend sends { reference, project_id } after the Paystack popup succeeds.
require_once __DIR__ . '/../../private/db.php';
cors_public();
only_method('POST');

$in = json_in();
$reference = trim($in['reference'] ?? '');
$projectId = (int)($in['project_id'] ?? 0);

if ($reference === '' || !$projectId) {
  json_out(['error' => 'Missing reference or project'], 400);
}

// Look up the project + its price (server-side source of truth for the amount)
$stmt = pdo()->prepare("SELECT id, title, price, zip_path FROM projects WHERE id = ? AND status = 'published'");
$stmt->execute([$projectId]);
$project = $stmt->fetch();

if (!$project || $project['price'] === null) {
  json_out(['error' => 'Project not available for purchase'], 404);
}
if (empty($project['zip_path'])) {
  json_out(['error' => 'Source code not available for this project'], 409);
}

// Prevent replay: if this reference was already used, don't re-process
$stmt = pdo()->prepare('SELECT token FROM purchases WHERE reference = ?');
$stmt->execute([$reference]);
$existing = $stmt->fetch();
if ($existing) {
  json_out(['ok' => true, 'token' => $existing['token']]); // return same token
}

// --- Verify the transaction directly with Paystack (authoritative) ---
$ch = curl_init('https://api.paystack.co/transaction/verify/' . rawurlencode($reference));
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . PAYSTACK_SECRET_KEY],
  CURLOPT_TIMEOUT        => 30,
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($resp === false || $code !== 200) {
  json_out(['error' => 'Could not verify payment'], 502);
}

$data = json_decode($resp, true);
$tx = $data['data'] ?? null;

// Must be successful AND the amount paid must match the project price (in kobo)
$expectedKobo = (int) round((float)$project['price'] * 100);
if (!$tx || ($tx['status'] ?? '') !== 'success' || (int)($tx['amount'] ?? 0) < $expectedKobo) {
  json_out(['error' => 'Payment not confirmed'], 402);
}

$email = $tx['customer']['email'] ?? ($in['email'] ?? 'unknown');
$token = bin2hex(random_bytes(32));

pdo()->prepare('INSERT INTO purchases (project_id, email, reference, amount, token) VALUES (?, ?, ?, ?, ?)')
     ->execute([$projectId, $email, $reference, $expectedKobo / 100, $token]);

json_out(['ok' => true, 'token' => $token]);
