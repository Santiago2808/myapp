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
$stmt = $conn->prepare("
  SELECT t.*, p.name AS project_name 
  FROM tasks t
  JOIN task_assignments ta ON t.id = ta.task_id
  JOIN projects p ON t.project_id = p.id
  WHERE ta.user_id = ?
");
$stmt->bind_param("i", $_SESSION['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$tasks = $result->fetch_all(MYSQLI_ASSOC);
echo json_encode(['success' => true, 'tasks' => $tasks]);
