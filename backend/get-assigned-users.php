<?php
session_start();
require 'db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (!isset($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'message' => 'No autenticado']);
  exit;
}

$taskId = $_GET['task_id'] ?? 0;

$stmt = $conn->prepare("
  SELECT u.id, u.username
  FROM users u
  JOIN task_user tu ON u.id = tu.user_id
  WHERE tu.task_id = ?
");
$stmt->bind_param("i", $taskId);
$stmt->execute();
$result = $stmt->get_result();
$assignedUsers = [];

while ($row = $result->fetch_assoc()) {
  $assignedUsers[] = $row;
}

echo json_encode(['success' => true, 'assigned' => $assignedUsers]);
