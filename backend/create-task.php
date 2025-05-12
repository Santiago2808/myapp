<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'Off'); // Si estás en http

session_start();
require 'db.php';

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Leer datos JSON enviados desde React
$data = json_decode(file_get_contents("php://input"), true);

// ⚠️ Usar los mismos nombres de campos que el frontend
$title = $data['title'] ?? '';  // 'name' en lugar de 'title'
$due = $data['due_date'] ?? null;
$projectId = $data['project_id'] ?? null;
$assignedTo = $data['assigned_to'] ?? []; // opcional

if (!$title || !$projectId) {
  echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
  exit;
}

// Insertar tarea
$stmt = $conn->prepare("INSERT INTO tasks (project_id, title, due_date, completed) VALUES (?, ?, ?, 0)");
$stmt->bind_param("iss", $projectId, $title, $due);
$stmt->execute();
$taskId = $stmt->insert_id;

// Insertar asignaciones (si hay)
foreach ($assignedTo as $userId) {
  $stmt2 = $conn->prepare("INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)");
  $stmt2->bind_param("ii", $taskId, $userId);
  $stmt2->execute();
}

// Devolver la tarea recién creada
$task = [
  'id' => $taskId,
  'name' => $title,
  'due_date' => $due,
  'completed' => 0,
  'project_id' => $projectId,
];

echo json_encode(['success' => true, 'task' => $task]);
