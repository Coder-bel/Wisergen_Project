<?php
// ============================================================
// Admin dashboard — Devices (3 images) + Requests.
// Session-protected. Writes go through POST + CSRF check.
// ============================================================
require_once __DIR__ . '/../private/db.php';
require_once __DIR__ . '/../private/upload.php';
require_admin();

$tab    = $_GET['tab'] ?? 'devices';
$notice = '';
$error  = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  if (!csrf_check($_POST['csrf'] ?? '')) {
    $error = 'Security check failed. Please try again.';
  } else {
    $action = $_POST['action'] ?? '';
    try {
      switch ($action) {
        case 'save_device': {
          $id      = (int)($_POST['id'] ?? 0);
          $name    = trim($_POST['name'] ?? '');
          $cat     = in_array($_POST['category'] ?? '', ['phone','laptop'], true) ? $_POST['category'] : 'phone';
          $cond    = in_array($_POST['condition_type'] ?? '', ['new','used'], true) ? $_POST['condition_type'] : 'new';
          $desc    = trim($_POST['description'] ?? '');
          $price   = (float)($_POST['price'] ?? 0);
          $inStock = isset($_POST['in_stock']) ? 1 : 0;

          if ($name === '') throw new Exception('Device name is required');

          $img1 = handle_upload('image');
          $img2 = handle_upload('image2');
          $img3 = handle_upload('image3');

          if ($id) {
            $sets = ['name=?','category=?','condition_type=?','description=?','price=?','in_stock=?'];
            $args = [$name,$cat,$cond,$desc,$price,$inStock];
            if ($img1) { $sets[]='image_url=?';  $args[]=$img1; }
            if ($img2) { $sets[]='image_url2=?'; $args[]=$img2; }
            if ($img3) { $sets[]='image_url3=?'; $args[]=$img3; }
            $args[] = $id;
            pdo()->prepare('UPDATE products SET '.implode(',',$sets).' WHERE id=?')->execute($args);
            $notice = 'Device updated.';
          } else {
            pdo()->prepare('INSERT INTO products (name,category,condition_type,description,price,in_stock,image_url,image_url2,image_url3) VALUES (?,?,?,?,?,?,?,?,?)')
                 ->execute([$name,$cat,$cond,$desc,$price,$inStock,$img1,$img2,$img3]);
            $notice = 'Device added.';
          }
          break;
        }
        case 'delete_device': {
          pdo()->prepare('DELETE FROM products WHERE id=?')->execute([(int)$_POST['id']]);
          $notice = 'Device deleted.';
          break;
        }
        case 'handle_request': {
          pdo()->prepare('UPDATE requests SET status=? WHERE id=?')->execute(['handled',(int)$_POST['id']]);
          $notice = 'Request marked handled.';
          break;
        }
      }
    } catch (Exception $e) {
      $error = $e->getMessage();
    }
  }
}

$devices = pdo()->query('SELECT * FROM products ORDER BY created_at DESC')->fetchAll();
$requests = pdo()->query('SELECT * FROM requests ORDER BY created_at DESC')->fetchAll();
$newRequests = 0;
foreach ($requests as $r) if ($r['status'] === 'new') $newRequests++;

$editDevice = null;
if (!empty($_GET['edit'])) {
  $stmt = pdo()->prepare('SELECT * FROM products WHERE id=?');
  $stmt->execute([(int)$_GET['edit']]);
  $editDevice = $stmt->fetch();
}

$csrf = csrf_token();
function h($v) { return htmlspecialchars((string)$v, ENT_QUOTES); }
function naira($v) { return '&#8358;' . number_format((float)$v); }
function condLabel($c) { return $c === 'new' ? 'New' : 'Fairly Used'; }
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Wisergen Admin</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;background:#f1f5f9;color:#0f172a}
    header{background:#0F172A;color:#fff;padding:0 1.5rem;height:60px;display:flex;align-items:center;justify-content:space-between}
    header .brand{font-weight:700}
    header nav a{color:#cbd5e1;text-decoration:none;font-size:.9rem;margin-left:1rem}
    header nav a:hover,header nav a.on{color:#fff}
    .wrap{max-width:1000px;margin:0 auto;padding:1.5rem}
    .tabs{display:flex;gap:.5rem;margin-bottom:1.5rem;flex-wrap:wrap}
    .tabs a{padding:.55rem 1.1rem;border-radius:999px;text-decoration:none;font-size:.9rem;font-weight:500;background:#fff;color:#334155}
    .tabs a.active{background:#0063ED;color:#fff}
    .badge{display:inline-block;background:#ef4444;color:#fff;border-radius:999px;font-size:.7rem;padding:0 .4rem;margin-left:.3rem}
    .card{background:#fff;border-radius:14px;padding:1.5rem;margin-bottom:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.06)}
    .card h2{font-size:1.1rem;margin-bottom:1rem}
    label{display:block;font-size:.8rem;color:#475569;margin:.6rem 0 .3rem}
    input,select,textarea{width:100%;padding:.6rem .8rem;border:1px solid #e2e8f0;border-radius:9px;font-size:.95rem;font-family:inherit}
    input:focus,select:focus,textarea:focus{outline:none;border-color:#0063ED}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .imgrow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem}
    .check{display:flex;align-items:center;gap:.5rem;margin-top:.8rem;font-size:.9rem}
    .check input{width:auto}
    button{padding:.6rem 1.2rem;background:#0063ED;color:#fff;border:none;border-radius:9px;font-weight:600;cursor:pointer;font-size:.9rem;margin-top:1rem}
    button:hover{background:#0052c4}
    button.small{padding:.35rem .7rem;font-size:.8rem;margin:0}
    button.danger{background:#fee2e2;color:#dc2626}
    button.danger:hover{background:#fecaca}
    button.ghost{background:#f1f5f9;color:#334155}
    table{width:100%;border-collapse:collapse}
    th,td{text-align:left;padding:.7rem .5rem;border-bottom:1px solid #f1f5f9;font-size:.9rem;vertical-align:middle}
    th{color:#64748b;font-weight:600;font-size:.8rem}
    .thumb{width:44px;height:44px;object-fit:cover;border-radius:8px;background:#f1f5f9;display:inline-block}
    .pill{display:inline-block;padding:.15rem .6rem;border-radius:999px;font-size:.75rem;background:#f1f5f9;color:#475569}
    .notice{background:#dcfce7;color:#166534;padding:.7rem 1rem;border-radius:9px;margin-bottom:1rem;font-size:.9rem}
    .err{background:#fef2f2;color:#dc2626;padding:.7rem 1rem;border-radius:9px;margin-bottom:1rem;font-size:.9rem}
    .actions{display:flex;gap:.4rem;align-items:center}
    .muted{color:#94a3b8;font-size:.85rem}
    a.editlink{color:#0063ED;text-decoration:none;font-size:.85rem}
    @media(max-width:640px){.row,.imgrow{grid-template-columns:1fr}}
  </style>
</head>
<body>
<header>
  <span class="brand">Wisergen Admin</span>
  <nav>
    <a href="index.php" class="on">Devices</a>
    <a href="manage-projects.php">Portfolio</a>
    <a href="manage-news.php">News</a>
    <a href="account.php">Account</a>
    <a href="logout.php">Logout</a>
  </nav>
</header>

<div class="wrap">
  <div class="tabs">
    <a href="?tab=devices" class="<?= $tab==='devices'?'active':'' ?>">Devices</a>
    <a href="?tab=requests" class="<?= $tab==='requests'?'active':'' ?>">Requests<?php if($newRequests):?><span class="badge"><?= $newRequests ?></span><?php endif;?></a>
  </div>

  <?php if ($notice): ?><div class="notice"><?= h($notice) ?></div><?php endif; ?>
  <?php if ($error): ?><div class="err"><?= h($error) ?></div><?php endif; ?>

  <?php if ($tab === 'devices'): ?>
    <div class="card">
      <h2><?= $editDevice ? 'Edit Device' : 'Add Device' ?></h2>
      <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="csrf" value="<?= $csrf ?>">
        <input type="hidden" name="action" value="save_device">
        <input type="hidden" name="id" value="<?= h($editDevice['id'] ?? '') ?>">
        <label>Device Name</label>
        <input name="name" value="<?= h($editDevice['name'] ?? '') ?>" placeholder="e.g. iPhone 14 Pro Max" required>
        <div class="row">
          <div>
            <label>Category</label>
            <select name="category">
              <option value="phone" <?= (($editDevice['category'] ?? 'phone')==='phone')?'selected':'' ?>>Phone</option>
              <option value="laptop" <?= (($editDevice['category'] ?? '')==='laptop')?'selected':'' ?>>Laptop</option>
            </select>
          </div>
          <div>
            <label>Condition</label>
            <select name="condition_type">
              <option value="new" <?= (($editDevice['condition_type'] ?? 'new')==='new')?'selected':'' ?>>New</option>
              <option value="used" <?= (($editDevice['condition_type'] ?? '')==='used')?'selected':'' ?>>Fairly Used</option>
            </select>
          </div>
        </div>
        <label>Specifications / Description</label>
        <textarea name="description" rows="3" placeholder="Storage, RAM, colour, etc."><?= h($editDevice['description'] ?? '') ?></textarea>
        <label>Price (&#8358;)</label>
        <input type="number" step="1" name="price" value="<?= h($editDevice['price'] ?? '') ?>">

        <label>Images (up to 3)<?= $editDevice ? ' — leave a slot empty to keep its current image' : '' ?></label>
        <div class="imgrow">
          <div>
            <input type="file" name="image" accept="image/*">
            <?php if (!empty($editDevice['image_url'])): ?><img src="<?= h($editDevice['image_url']) ?>" class="thumb" style="margin-top:.5rem"><?php endif; ?>
          </div>
          <div>
            <input type="file" name="image2" accept="image/*">
            <?php if (!empty($editDevice['image_url2'])): ?><img src="<?= h($editDevice['image_url2']) ?>" class="thumb" style="margin-top:.5rem"><?php endif; ?>
          </div>
          <div>
            <input type="file" name="image3" accept="image/*">
            <?php if (!empty($editDevice['image_url3'])): ?><img src="<?= h($editDevice['image_url3']) ?>" class="thumb" style="margin-top:.5rem"><?php endif; ?>
          </div>
        </div>

        <label class="check"><input type="checkbox" name="in_stock" <?= (($editDevice['in_stock'] ?? 1))?'checked':'' ?>> In stock</label>
        <button type="submit"><?= $editDevice ? 'Update Device' : 'Add Device' ?></button>
        <?php if ($editDevice): ?> <a href="?tab=devices" class="editlink" style="margin-left:.6rem">Cancel</a><?php endif; ?>
      </form>
    </div>

    <div class="card">
      <h2>All Devices (<?= count($devices) ?>)</h2>
      <?php if (!$devices): ?><p class="muted">No devices yet. Add one above.</p><?php else: ?>
      <table>
        <tr><th></th><th>Name</th><th>Category</th><th>Cond.</th><th>Price</th><th>Stock</th><th></th></tr>
        <?php foreach ($devices as $d): ?>
        <tr>
          <td><?php if($d['image_url']):?><img src="<?= h($d['image_url']) ?>" class="thumb"><?php else:?><span class="thumb"></span><?php endif;?></td>
          <td><?= h($d['name']) ?></td>
          <td><span class="pill"><?= $d['category']==='phone'?'Phone':'Laptop' ?></span></td>
          <td><?= condLabel($d['condition_type']) ?></td>
          <td><?= naira($d['price']) ?></td>
          <td><?= $d['in_stock']?'Yes':'No' ?></td>
          <td>
            <div class="actions">
              <a href="?tab=devices&edit=<?= $d['id'] ?>" class="editlink">Edit</a>
              <form method="post" onsubmit="return confirm('Delete this device?')">
                <input type="hidden" name="csrf" value="<?= $csrf ?>">
                <input type="hidden" name="action" value="delete_device">
                <input type="hidden" name="id" value="<?= $d['id'] ?>">
                <button class="small danger">Delete</button>
              </form>
            </div>
          </td>
        </tr>
        <?php endforeach; ?>
      </table>
      <?php endif; ?>
    </div>

  <?php else: /* requests */ ?>
    <div class="card">
      <h2>Device Requests (<?= count($requests) ?>)</h2>
      <?php if (!$requests): ?><p class="muted">No requests yet.</p><?php else: ?>
        <?php foreach ($requests as $r): ?>
        <div style="border-bottom:1px solid #f1f5f9;padding:1rem 0<?= $r['status']==='handled'?';opacity:.55':'' ?>">
          <div style="display:flex;justify-content:space-between;align-items:start;gap:1rem">
            <div>
              <strong><?= h($r['gadget_name']) ?></strong>
              <div class="muted"><?= h(date('M j, Y g:i A', strtotime($r['created_at']))) ?></div>
            </div>
            <?php if ($r['status']==='handled'): ?>
              <span class="pill">Handled</span>
            <?php else: ?>
              <form method="post">
                <input type="hidden" name="csrf" value="<?= $csrf ?>">
                <input type="hidden" name="action" value="handle_request">
                <input type="hidden" name="id" value="<?= $r['id'] ?>">
                <button class="small ghost">Mark handled</button>
              </form>
            <?php endif; ?>
          </div>
          <?php if (!empty($r['condition_pref'])): ?><p style="font-size:.9rem;margin-top:.5rem"><strong>Condition:</strong> <?= condLabel($r['condition_pref']) ?></p><?php endif; ?>
          <?php if ($r['spec']): ?><p style="font-size:.9rem;margin-top:.2rem"><strong>Spec:</strong> <?= h($r['spec']) ?></p><?php endif; ?>
          <?php if ($r['info']): ?><p style="font-size:.9rem;margin-top:.2rem"><strong>Info:</strong> <?= h($r['info']) ?></p><?php endif; ?>
          <p style="font-size:.9rem;margin-top:.2rem"><strong>Email:</strong> <a href="mailto:<?= h($r['email']) ?>" style="color:#0063ED"><?= h($r['email']) ?></a></p>
        </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  <?php endif; ?>
</div>
</body>
</html>
