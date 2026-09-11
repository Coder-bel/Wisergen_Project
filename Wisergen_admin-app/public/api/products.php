<?php
// PUBLIC read-only: list devices for the marketplace.
// Optional: ?category=phone|laptop  &condition=new|used
require_once __DIR__ . '/../../private/db.php';
cors_public();
only_method('GET');

$where = [];
$args  = [];

if (!empty($_GET['category']) && in_array($_GET['category'], ['phone','laptop'], true)) {
  $where[] = 'category = ?';
  $args[] = $_GET['category'];
}
if (!empty($_GET['condition']) && in_array($_GET['condition'], ['new','used'], true)) {
  $where[] = 'condition_type = ?';
  $args[] = $_GET['condition'];
}

$sql = 'SELECT id, name, category, condition_type, description, price,
               image_url, image_url2, image_url3, in_stock, created_at
        FROM products';
if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
$sql .= ' ORDER BY created_at DESC';

$stmt = pdo()->prepare($sql);
$stmt->execute($args);
json_out($stmt->fetchAll());
