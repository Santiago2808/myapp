<?php
// CORS HEADERS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';
header('Content-Type: application/json');

// Validar que se recibió el project_id
if (!isset($_GET['project_id'])) {
    echo json_encode(['success' => false, 'message' => 'ID de proyecto no proporcionado']);
    exit;
}

$projectId = $_GET['project_id'];

// Obtener tareas del proyecto
$stmt = $conn->prepare("SELECT id, title, due_date, completed FROM tasks WHERE project_id = ?");
$stmt->bind_param("i", $projectId);
$stmt->execute();
$result = $stmt->get_result();

$tasks = [];

while ($row = $result->fetch_assoc()) {
    $taskId = $row['id'];

    // Obtener usuarios asignados a esta tarea
    $stmtUsers = $conn->prepare("
        SELECT u.id, u.name, u.email, u.profile_picture 
        FROM users u
        INNER JOIN task_assignments ta ON ta.user_id = u.id
        WHERE ta.task_id = ?
    ");
    $stmtUsers->bind_param("i", $taskId);
    $stmtUsers->execute();
    $resUsers = $stmtUsers->get_result();

    $assignedUsers = [];
    while ($user = $resUsers->fetch_assoc()) {
        $assignedUsers[] = [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'profile_picture' => $user['profile_picture'] ?: 'default.png'
        ];
    }

    $tasks[] = [
        'id' => (int)$row['id'],
        'name' => $row['title'],
        'due_date' => $row['due_date'],
        'completed' => (bool)$row['completed'],
        'assigned_users' => $assignedUsers
    ];
}

echo json_encode(['success' => true, 'tasks' => $tasks]);