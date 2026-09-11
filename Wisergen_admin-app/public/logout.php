<?php
require_once __DIR__ . '/../private/db.php';
start_secure_session();
$_SESSION = [];
session_destroy();
header('Location: login.php');
exit;
