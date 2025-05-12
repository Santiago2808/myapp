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

$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'] ?? '';

if (!$name) {
  echo json_encode(['success' => false, 'message' => 'Nombre requerido']);
  exit;
}

// Insertar el proyecto
$stmt = $conn->prepare("INSERT INTO projects (name, owner_id) VALUES (?, ?)");
$stmt->bind_param("si", $name, $_SESSION['user_id']);

if ($stmt->execute()) {
  $projectId = $conn->insert_id;

  // Obtener los datos completos del proyecto insertado
  $stmt = $conn->prepare("SELECT id, name FROM projects WHERE id = ?");
  $stmt->bind_param("i", $projectId);
  $stmt->execute();
  $result = $stmt->get_result();
  $project = $result->fetch_assoc();

  echo json_encode([
    'success' => true,
    'project' => $project
  ]);
} else {
  echo json_encode(['success' => false, 'message' => 'Error al insertar']);
}
