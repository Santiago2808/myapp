<?php
session_start();
require 'db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents("php://input"), true);
$taskId = $data['task_id'] ?? 0;
$userId = $data['user_id'] ?? 0;

if (!$taskId || !$userId) {
  echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
  exit;
}

$stmt = $conn->prepare("DELETE FROM task_user WHERE task_id = ? AND user_id = ?");
$stmt->bind_param("ii", $taskId, $userId);

if ($stmt->execute()) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'message' => 'Error eliminando']);
}
