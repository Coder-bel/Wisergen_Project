<?php
// Shared image-upload helper for admin actions.
// Validates real MIME, random filename, saves to UPLOAD_DIR. Returns public URL or throws.
function handle_upload($fileKey) {
  if (empty($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] === UPLOAD_ERR_NO_FILE) {
    return null; // no new file provided
  }
  $file = $_FILES[$fileKey];

  if ($file['error'] !== UPLOAD_ERR_OK) {
    throw new Exception('Upload failed (error code ' . $file['error'] . ')');
  }
  if ($file['size'] > MAX_UPLOAD_BYTES) {
    throw new Exception('Image too large (max 3MB)');
  }

  $info = getimagesize($file['tmp_name']); // real image check, not just extension
  $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
  if (!$info || !isset($allowed[$info['mime']])) {
    throw new Exception('Only JPG, PNG or WEBP allowed');
  }

  if (!is_dir(UPLOAD_DIR)) {
    @mkdir(UPLOAD_DIR, 0755, true);
  }

  $name = bin2hex(random_bytes(16)) . '.' . $allowed[$info['mime']];
  $dest = rtrim(UPLOAD_DIR, '/') . '/' . $name;

  if (!move_uploaded_file($file['tmp_name'], $dest)) {
    throw new Exception('Could not save uploaded file');
  }
  return UPLOAD_URL_PREFIX . $name;
}

// Handle a source-code ZIP upload. Stored OUTSIDE the web root (ZIP_DIR).
// Returns the stored filename (not a URL) or null if none provided.
function handle_zip_upload($fileKey) {
  if (empty($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] === UPLOAD_ERR_NO_FILE) {
    return null;
  }
  $file = $_FILES[$fileKey];
  if ($file['error'] !== UPLOAD_ERR_OK) {
    throw new Exception('Zip upload failed (error ' . $file['error'] . ')');
  }
  if ($file['size'] > MAX_ZIP_BYTES) {
    throw new Exception('Zip too large (max 50MB)');
  }
  // Validate it's really a zip
  $finfo = finfo_open(FILEINFO_MIME_TYPE);
  $mime  = finfo_file($finfo, $file['tmp_name']);
  finfo_close($finfo);
  $okTypes = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'];
  $isZipExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) === 'zip';
  if (!$isZipExt || !in_array($mime, $okTypes, true)) {
    throw new Exception('Only .zip files are allowed');
  }
  if (!is_dir(ZIP_DIR)) {
    @mkdir(ZIP_DIR, 0700, true);
  }
  $name = bin2hex(random_bytes(16)) . '.zip';
  $dest = rtrim(ZIP_DIR, '/') . '/' . $name;
  if (!move_uploaded_file($file['tmp_name'], $dest)) {
    throw new Exception('Could not save zip file');
  }
  return $name;
}
