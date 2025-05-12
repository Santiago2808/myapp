<?php
// CORS HEADERS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Manejar solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$taskId = $data['task_id'] ?? null;
$assignedTo = $data['assigned_to'] ?? [];

if (!$taskId) {
    echo json_encode(['success' => false, 'message' => 'ID de tarea no proporcionado']);
    exit;
}

// Eliminar asignaciones actuales
$stmtDelete = $conn->prepare("DELETE FROM task_assignments WHERE task_id = ?");
$stmtDelete->bind_param("i", $taskId);
$stmtDelete->execute();

// Insertar nuevas asignaciones
$stmtInsert = $conn->prepare("INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)");
foreach ($assignedTo as $userId) {
    $stmtInsert->bind_param("ii", $taskId, $userId);
    $stmtInsert->execute();
}

echo json_encode(['success' => true]);
