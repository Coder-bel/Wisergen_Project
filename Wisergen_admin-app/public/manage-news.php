<?php
// ============================================================
// Admin: manage the News feed.
// ============================================================
require_once __DIR__ . '/../private/db.php';
require_once __DIR__ . '/../private/upload.php';
require_admin();

$notice = ''; $error = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  if (!csrf_check($_POST['csrf'] ?? '')) {
    $error = 'Security check failed.';
  } else {
    try {
      switch ($_POST['action'] ?? '') {
        case 'save_news': {
          $id      = (int)($_POST['id'] ?? 0);
          $title   = trim($_POST['title'] ?? '');
          $summary = trim($_POST['summary'] ?? '');
          $body    = trim($_POST['body'] ?? '');
          $source  = trim($_POST['source_url'] ?? '');
          $status  = in_array($_POST['status'] ?? '', ['published','draft'], true) ? $_POST['status'] : 'published';
          if ($title === '') throw new Exception('Title is required');

          $img = handle_upload('image');
          if ($id) {
            $sets = ['title=?','summary=?','body=?','source_url=?','status=?'];
            $args = [$title,$summary,$body,$source,$status];
            if ($img) { $sets[]='image_url=?'; $args[]=$img; }
            $args[] = $id;
            pdo()->prepare('UPDATE news SET '.implode(',',$sets).' WHERE id=?')->execute($args);
            $notice = 'News post updated.';
          } else {
            pdo()->prepare('INSERT INTO news (title,summary,body,source_url,status,image_url) VALUES (?,?,?,?,?,?)')
                 ->execute([$title,$summary,$body,$source,$status,$img]);
            $notice = 'News post added.';
          }
          break;
        }
        case 'delete_news': {
          pdo()->prepare('DELETE FROM news WHERE id=?')->execute([(int)$_POST['id']]);
          $notice = 'News post deleted.';
          break;
        }
      }
    } catch (Exception $e) { $error = $e->getMessage(); }
  }
}

$posts = pdo()->query('SELECT * FROM news ORDER BY created_at DESC')->fetchAll();
$edit = null;
if (!empty($_GET['edit'])) {
  $stmt = pdo()->prepare('SELECT * FROM news WHERE id=?');
  $stmt->execute([(int)$_GET['edit']]);
  $edit = $stmt->fetch();
}
$csrf = csrf_token();
function h($v){return htmlspecialchars((string)$v,ENT_QUOTES);}
?>
<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>News — Wisergen Admin</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#f1f5f9;color:#0f172a}
header{background:#0F172A;color:#fff;padding:0 1.5rem;height:60px;display:flex;align-items:center;justify-content:space-between}
header .brand{font-weight:700}header nav a{color:#cbd5e1;text-decoration:none;font-size:.9rem;margin-left:1rem}header nav a:hover,header nav a.on{color:#fff}
.wrap{max-width:900px;margin:0 auto;padding:1.5rem}
.card{background:#fff;border-radius:14px;padding:1.5rem;margin-bottom:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.card h2{font-size:1.1rem;margin-bottom:1rem}
label{display:block;font-size:.8rem;color:#475569;margin:.6rem 0 .3rem}
input,select,textarea{width:100%;padding:.6rem .8rem;border:1px solid #e2e8f0;border-radius:9px;font-size:.95rem;font-family:inherit}
input:focus,select:focus,textarea:focus{outline:none;border-color:#0063ED}
button{padding:.6rem 1.2rem;background:#0063ED;color:#fff;border:none;border-radius:9px;font-weight:600;cursor:pointer;font-size:.9rem;margin-top:1rem}
button:hover{background:#0052c4}button.small{padding:.35rem .7rem;font-size:.8rem;margin:0}button.danger{background:#fee2e2;color:#dc2626}
table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:.7rem .5rem;border-bottom:1px solid #f1f5f9;font-size:.9rem;vertical-align:middle}
th{color:#64748b;font-weight:600;font-size:.8rem}.thumb{width:44px;height:44px;object-fit:cover;border-radius:8px;background:#f1f5f9;display:inline-block}
.pill{display:inline-block;padding:.15rem .6rem;border-radius:999px;font-size:.75rem;background:#f1f5f9;color:#475569}
.notice{background:#dcfce7;color:#166534;padding:.7rem 1rem;border-radius:9px;margin-bottom:1rem;font-size:.9rem}
.err{background:#fef2f2;color:#dc2626;padding:.7rem 1rem;border-radius:9px;margin-bottom:1rem;font-size:.9rem}
.actions{display:flex;gap:.4rem;align-items:center}.muted{color:#94a3b8;font-size:.85rem}a.editlink{color:#0063ED;text-decoration:none;font-size:.85rem}
</style></head><body>
<header>
  <span class="brand">Wisergen Admin</span>
  <nav>
    <a href="index.php">Devices</a>
    <a href="manage-projects.php">Portfolio</a>
    <a href="manage-news.php" class="on">News</a>
    <a href="account.php">Account</a>
    <a href="logout.php">Logout</a>
  </nav>
</header>
<div class="wrap">
  <?php if($notice):?><div class="notice"><?= h($notice) ?></div><?php endif;?>
  <?php if($error):?><div class="err"><?= h($error) ?></div><?php endif;?>

  <div class="card">
    <h2><?= $edit?'Edit News Post':'Add News Post' ?></h2>
    <form method="post" enctype="multipart/form-data">
      <input type="hidden" name="csrf" value="<?= $csrf ?>">
      <input type="hidden" name="action" value="save_news">
      <input type="hidden" name="id" value="<?= h($edit['id'] ?? '') ?>">
      <label>Title</label>
      <input name="title" value="<?= h($edit['title'] ?? '') ?>" required>
      <label>Short summary</label>
      <input name="summary" value="<?= h($edit['summary'] ?? '') ?>" placeholder="One-line preview">
      <label>Body</label>
      <textarea name="body" rows="6"><?= h($edit['body'] ?? '') ?></textarea>
      <label>Source URL (optional)</label>
      <input name="source_url" value="<?= h($edit['source_url'] ?? '') ?>" placeholder="https://...">
      <label>Status</label>
      <select name="status">
        <option value="published" <?= (($edit['status'] ?? 'published')==='published')?'selected':'' ?>>Published</option>
        <option value="draft" <?= (($edit['status'] ?? '')==='draft')?'selected':'' ?>>Draft</option>
      </select>
      <label>Image</label>
      <input type="file" name="image" accept="image/*">
      <?php if(!empty($edit['image_url'])):?><img src="<?= h($edit['image_url']) ?>" class="thumb" style="margin-top:.5rem"><?php endif;?>
      <br><button type="submit"><?= $edit?'Update Post':'Add Post' ?></button>
      <?php if($edit):?> <a href="manage-news.php" class="editlink" style="margin-left:.6rem">Cancel</a><?php endif;?>
    </form>
  </div>

  <div class="card">
    <h2>All News (<?= count($posts) ?>)</h2>
    <?php if(!$posts):?><p class="muted">No news yet.</p><?php else:?>
    <table><tr><th></th><th>Title</th><th>Status</th><th>Date</th><th></th></tr>
    <?php foreach($posts as $n):?>
    <tr>
      <td><?php if($n['image_url']):?><img src="<?= h($n['image_url']) ?>" class="thumb"><?php else:?><span class="thumb"></span><?php endif;?></td>
      <td><?= h($n['title']) ?></td>
      <td><span class="pill"><?= h($n['status']) ?></span></td>
      <td class="muted"><?= h(date('M j, Y', strtotime($n['created_at']))) ?></td>
      <td><div class="actions">
        <a href="?edit=<?= $n['id'] ?>" class="editlink">Edit</a>
        <form method="post" onsubmit="return confirm('Delete this post?')">
          <input type="hidden" name="csrf" value="<?= $csrf ?>"><input type="hidden" name="action" value="delete_news"><input type="hidden" name="id" value="<?= $n['id'] ?>">
          <button class="small danger">Delete</button>
        </form>
      </div></td>
    </tr>
    <?php endforeach;?></table>
    <?php endif;?>
  </div>
</div></body></html>
