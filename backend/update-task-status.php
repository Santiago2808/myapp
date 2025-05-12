<?php
// CORS HEADERS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$taskId = $data['task_id'] ?? null;
$completed = isset($data['completed']) ? (int)$data['completed'] : 0;

if (!$taskId) {
    echo json_encode(['success' => false, 'message' => 'ID de tarea no proporcionado']);
    exit;
}

$stmt = $conn->prepare("UPDATE tasks SET completed = ? WHERE id = ?");
$stmt->bind_param("ii", $completed, $taskId);
$stmt->execute();

echo json_encode(['success' => true]);
