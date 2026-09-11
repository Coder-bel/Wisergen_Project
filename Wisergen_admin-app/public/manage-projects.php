<?php
// ============================================================
// Admin: manage Portfolio projects + view inquiries.
// ============================================================
require_once __DIR__ . '/../private/db.php';
require_once __DIR__ . '/../private/upload.php';
require_admin();

$tab = $_GET['tab'] ?? 'projects';
$notice = ''; $error = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  if (!csrf_check($_POST['csrf'] ?? '')) {
    $error = 'Security check failed.';
  } else {
    try {
      switch ($_POST['action'] ?? '') {
        case 'save_project': {
          $id      = (int)($_POST['id'] ?? 0);
          $title   = trim($_POST['title'] ?? '');
          $summary = trim($_POST['summary'] ?? '');
          $desc    = trim($_POST['description'] ?? '');
          $tech    = trim($_POST['tech_stack'] ?? '');
          $live    = trim($_POST['live_url'] ?? '');
          $price   = ($_POST['price'] ?? '') === '' ? null : (float)$_POST['price'];
          $status  = in_array($_POST['status'] ?? '', ['published','draft'], true) ? $_POST['status'] : 'published';

          if ($title === '') throw new Exception('Title is required');

          $img1 = handle_upload('image');
          $img2 = handle_upload('image2');
          $img3 = handle_upload('image3');
          $zip  = handle_zip_upload('zip');

          if ($id) {
            $sets = ['title=?','summary=?','description=?','tech_stack=?','live_url=?','price=?','status=?'];
            $args = [$title,$summary,$desc,$tech,$live,$price,$status];
            if ($img1) { $sets[]='image_url=?';  $args[]=$img1; }
            if ($img2) { $sets[]='image_url2=?'; $args[]=$img2; }
            if ($img3) { $sets[]='image_url3=?'; $args[]=$img3; }
            if ($zip)  { $sets[]='zip_path=?';   $args[]=$zip;  }
            $args[] = $id;
            pdo()->prepare('UPDATE projects SET '.implode(',',$sets).' WHERE id=?')->execute($args);
            $notice = 'Project updated.';
          } else {
            pdo()->prepare('INSERT INTO projects (title,summary,description,tech_stack,live_url,price,status,image_url,image_url2,image_url3,zip_path) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
                 ->execute([$title,$summary,$desc,$tech,$live,$price,$status,$img1,$img2,$img3,$zip]);
            $notice = 'Project added.';
          }
          break;
        }
        case 'delete_project': {
          pdo()->prepare('DELETE FROM projects WHERE id=?')->execute([(int)$_POST['id']]);
          $notice = 'Project deleted.';
          break;
        }
        case 'handle_inquiry': {
          pdo()->prepare('UPDATE project_inquiries SET status=? WHERE id=?')->execute(['handled',(int)$_POST['id']]);
          $notice = 'Inquiry marked handled.';
          break;
        }
      }
    } catch (Exception $e) { $error = $e->getMessage(); }
  }
}

$projects = pdo()->query('SELECT * FROM projects ORDER BY created_at DESC')->fetchAll();
$inquiries = pdo()->query('SELECT i.*, p.title AS project_title FROM project_inquiries i LEFT JOIN projects p ON p.id=i.project_id ORDER BY i.created_at DESC')->fetchAll();
$newInq = 0; foreach ($inquiries as $i) if ($i['status']==='new') $newInq++;

$edit = null;
if (!empty($_GET['edit'])) {
  $stmt = pdo()->prepare('SELECT * FROM projects WHERE id=?');
  $stmt->execute([(int)$_GET['edit']]);
  $edit = $stmt->fetch();
}

$csrf = csrf_token();
function h($v){return htmlspecialchars((string)$v,ENT_QUOTES);}
function naira($v){return $v===null?'—':'&#8358;'.number_format((float)$v);}
?>
<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Projects — Wisergen Admin</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#f1f5f9;color:#0f172a}
header{background:#0F172A;color:#fff;padding:0 1.5rem;height:60px;display:flex;align-items:center;justify-content:space-between}
header .brand{font-weight:700}header nav a{color:#cbd5e1;text-decoration:none;font-size:.9rem;margin-left:1rem}header nav a:hover,header nav a.on{color:#fff}
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
.row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.imgrow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem}
button{padding:.6rem 1.2rem;background:#0063ED;color:#fff;border:none;border-radius:9px;font-weight:600;cursor:pointer;font-size:.9rem;margin-top:1rem}
button:hover{background:#0052c4}button.small{padding:.35rem .7rem;font-size:.8rem;margin:0}
button.danger{background:#fee2e2;color:#dc2626}button.ghost{background:#f1f5f9;color:#334155}
table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:.7rem .5rem;border-bottom:1px solid #f1f5f9;font-size:.9rem;vertical-align:middle}
th{color:#64748b;font-weight:600;font-size:.8rem}.thumb{width:44px;height:44px;object-fit:cover;border-radius:8px;background:#f1f5f9;display:inline-block}
.pill{display:inline-block;padding:.15rem .6rem;border-radius:999px;font-size:.75rem;background:#f1f5f9;color:#475569}
.notice{background:#dcfce7;color:#166534;padding:.7rem 1rem;border-radius:9px;margin-bottom:1rem;font-size:.9rem}
.err{background:#fef2f2;color:#dc2626;padding:.7rem 1rem;border-radius:9px;margin-bottom:1rem;font-size:.9rem}
.actions{display:flex;gap:.4rem;align-items:center}.muted{color:#94a3b8;font-size:.85rem}a.editlink{color:#0063ED;text-decoration:none;font-size:.85rem}
@media(max-width:640px){.row,.imgrow{grid-template-columns:1fr}}
</style></head><body>
<header>
  <span class="brand">Wisergen Admin</span>
  <nav>
    <a href="index.php">Devices</a>
    <a href="manage-projects.php" class="on">Portfolio</a>
    <a href="manage-news.php">News</a>
    <a href="account.php">Account</a>
    <a href="logout.php">Logout</a>
  </nav>
</header>
<div class="wrap">
  <div class="tabs">
    <a href="?tab=projects" class="<?= $tab==='projects'?'active':'' ?>">Projects</a>
    <a href="?tab=inquiries" class="<?= $tab==='inquiries'?'active':'' ?>">Inquiries<?php if($newInq):?><span class="badge"><?= $newInq ?></span><?php endif;?></a>
  </div>
  <?php if($notice):?><div class="notice"><?= h($notice) ?></div><?php endif;?>
  <?php if($error):?><div class="err"><?= h($error) ?></div><?php endif;?>

  <?php if ($tab==='projects'): ?>
    <div class="card">
      <h2><?= $edit?'Edit Project':'Add Project' ?></h2>
      <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="csrf" value="<?= $csrf ?>">
        <input type="hidden" name="action" value="save_project">
        <input type="hidden" name="id" value="<?= h($edit['id'] ?? '') ?>">
        <label>Title</label>
        <input name="title" value="<?= h($edit['title'] ?? '') ?>" required>
        <label>Short summary (for cards)</label>
        <input name="summary" value="<?= h($edit['summary'] ?? '') ?>" placeholder="One-line tagline">
        <label>Full description</label>
        <textarea name="description" rows="4"><?= h($edit['description'] ?? '') ?></textarea>
        <div class="row">
          <div><label>Tech stack</label><input name="tech_stack" value="<?= h($edit['tech_stack'] ?? '') ?>" placeholder="React, PHP, MySQL"></div>
          <div><label>Live demo URL (optional)</label><input name="live_url" value="<?= h($edit['live_url'] ?? '') ?>" placeholder="https://..."></div>
        </div>
        <div class="row">
          <div><label>Source-code price (&#8358;, blank = not for sale)</label><input type="number" step="1" name="price" value="<?= h($edit['price'] ?? '') ?>"></div>
          <div><label>Status</label><select name="status">
            <option value="published" <?= (($edit['status'] ?? 'published')==='published')?'selected':'' ?>>Published</option>
            <option value="draft" <?= (($edit['status'] ?? '')==='draft')?'selected':'' ?>>Draft</option>
          </select></div>
        </div>
        <label>Interface images (up to 3)</label>
        <div class="imgrow">
          <div><input type="file" name="image" accept="image/*"><?php if(!empty($edit['image_url'])):?><img src="<?= h($edit['image_url']) ?>" class="thumb" style="margin-top:.5rem"><?php endif;?></div>
          <div><input type="file" name="image2" accept="image/*"><?php if(!empty($edit['image_url2'])):?><img src="<?= h($edit['image_url2']) ?>" class="thumb" style="margin-top:.5rem"><?php endif;?></div>
          <div><input type="file" name="image3" accept="image/*"><?php if(!empty($edit['image_url3'])):?><img src="<?= h($edit['image_url3']) ?>" class="thumb" style="margin-top:.5rem"><?php endif;?></div>
        </div>
        <label>Source-code ZIP (for paid download) <?php if(!empty($edit['zip_path'])):?><span class="muted">— current: uploaded ✓</span><?php endif;?></label>
        <input type="file" name="zip" accept=".zip">
        <button type="submit"><?= $edit?'Update Project':'Add Project' ?></button>
        <?php if($edit):?> <a href="manage-projects.php" class="editlink" style="margin-left:.6rem">Cancel</a><?php endif;?>
      </form>
    </div>
    <div class="card">
      <h2>All Projects (<?= count($projects) ?>)</h2>
      <?php if(!$projects):?><p class="muted">No projects yet.</p><?php else:?>
      <table><tr><th></th><th>Title</th><th>Price</th><th>Zip</th><th>Status</th><th></th></tr>
      <?php foreach($projects as $p):?>
      <tr>
        <td><?php if($p['image_url']):?><img src="<?= h($p['image_url']) ?>" class="thumb"><?php else:?><span class="thumb"></span><?php endif;?></td>
        <td><?= h($p['title']) ?></td>
        <td><?= naira($p['price']) ?></td>
        <td><?= $p['zip_path']?'✓':'—' ?></td>
        <td><span class="pill"><?= h($p['status']) ?></span></td>
        <td><div class="actions">
          <a href="?edit=<?= $p['id'] ?>" class="editlink">Edit</a>
          <form method="post" onsubmit="return confirm('Delete this project?')">
            <input type="hidden" name="csrf" value="<?= $csrf ?>"><input type="hidden" name="action" value="delete_project"><input type="hidden" name="id" value="<?= $p['id'] ?>">
            <button class="small danger">Delete</button>
          </form>
        </div></td>
      </tr>
      <?php endforeach;?></table>
      <?php endif;?>
    </div>

  <?php else: ?>
    <div class="card">
      <h2>Project Inquiries (<?= count($inquiries) ?>)</h2>
      <?php if(!$inquiries):?><p class="muted">No inquiries yet.</p><?php else:?>
        <?php foreach($inquiries as $i):?>
        <div style="border-bottom:1px solid #f1f5f9;padding:1rem 0<?= $i['status']==='handled'?';opacity:.55':'' ?>">
          <div style="display:flex;justify-content:space-between;gap:1rem">
            <div><strong><?= h($i['name']) ?></strong> <span class="muted">on <?= h($i['project_title'] ?: 'general') ?></span>
              <div class="muted"><?= h(date('M j, Y g:i A', strtotime($i['created_at']))) ?></div></div>
            <?php if($i['status']==='handled'):?><span class="pill">Handled</span>
            <?php else:?><form method="post"><input type="hidden" name="csrf" value="<?= $csrf ?>"><input type="hidden" name="action" value="handle_inquiry"><input type="hidden" name="id" value="<?= $i['id'] ?>"><button class="small ghost">Mark handled</button></form><?php endif;?>
          </div>
          <?php if($i['message']):?><p style="font-size:.9rem;margin-top:.5rem"><?= h($i['message']) ?></p><?php endif;?>
          <p style="font-size:.9rem;margin-top:.2rem"><strong>Email:</strong> <a href="mailto:<?= h($i['email']) ?>" style="color:#0063ED"><?= h($i['email']) ?></a></p>
        </div>
        <?php endforeach;?>
      <?php endif;?>
    </div>
  <?php endif; ?>
</div></body></html>
