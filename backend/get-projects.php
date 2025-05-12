<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'Off'); // Si estás trabajando en http (localhost), "Off"

session_start();
require 'db.php';
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if (!isset($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'message' => 'No autenticado']);
  exit;
}
$stmt = $conn->prepare("SELECT * FROM projects WHERE owner_id = ?");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$projects = $result->fetch_all(MYSQLI_ASSOC);
echo json_encode(['success' => true, 'projects' => $projects]);
