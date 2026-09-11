<?php
// PUBLIC: chat proxy to Groq (api.groq.com). Keeps the API key server-side.
// Receives { messages: [{role, content}, ...] } and returns { reply }.
require_once __DIR__ . '/../../private/db.php';
cors_public();
only_method('POST');

if (!defined('GROQ_API_KEY') || GROQ_API_KEY === '' || GROQ_API_KEY === 'YOUR_GROQ_API_KEY') {
  json_out(['error' => 'Chatbot not configured'], 500);
}

$in = json_in();
$incoming = $in['messages'] ?? [];
if (!is_array($incoming) || count($incoming) === 0) {
  json_out(['error' => 'No messages provided'], 400);
}

$history = [];
foreach ($incoming as $m) {
  $role = $m['role'] ?? '';
  $content = trim((string)($m['content'] ?? ''));
  if (!in_array($role, ['user', 'assistant'], true) || $content === '') continue;
  $history[] = ['role' => $role, 'content' => mb_substr($content, 0, 2000)];
}
$history = array_slice($history, -12);

$system = [
  'role' => 'system',
  'content' =>
    "You are WiserBot, the friendly assistant for Wisergen Computing, an IT company based at " .
    "46 Lagos-Ibadan Expressway, Ogun State, Nigeria. " .
    "You help with three things: (1) explaining Wisergen's services (computer repair, CCTV installation, networking, " .
    "graphics design, IT support, POS system installation, and the phones & laptops marketplace); " .
    "(2) helping customers find devices in the marketplace and guiding them to browse or submit a device request; " .
    "(3) giving general help with common computer problems (slow PC, virus, wifi, storage, basic troubleshooting). " .
    "Keep replies short, warm, and practical. Use Naira for prices. " .
    "If a problem needs hands-on work, a quote, or is beyond quick advice, or after a few back-and-forth messages, " .
    "warmly direct the person to contact Wisergen: point them to the Contact page, call or WhatsApp: " .
    "+234 906 792 1361 or +234 903 654 7021, or email: info@wisergencomputing.com. " .
    "Do not invent specific prices or stock; suggest they check the marketplace " .
    "or contact the team. Never claim to be a human.",
];

$payload = [
  'model'       => 'openai/gpt-oss-120b',
  'messages'    => array_merge([$system], $history),
  'temperature' => 0.6,
  'max_tokens'  => 500,
];

$ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST           => true,
  CURLOPT_HTTPHEADER     => [
    'Content-Type: application/json',
    'Authorization: Bearer ' . GROQ_API_KEY,
  ],
  CURLOPT_POSTFIELDS     => json_encode($payload),
  CURLOPT_TIMEOUT        => 30,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($response === false) {
  json_out(['error' => DEBUG ? ('Request failed: ' . $curlErr) : 'Assistant unavailable'], 502);
}

$data = json_decode($response, true);
if ($httpCode !== 200 || !isset($data['choices'][0]['message']['content'])) {
  json_out(['error' => DEBUG ? ('Groq error: ' . $response) : 'Assistant unavailable'], 502);
}

json_out(['reply' => trim($data['choices'][0]['message']['content'])]);
