<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'Off'); // Cambia a 'On' si usas HTTPS

session_start();
require 'db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Verificar sesión
if (!isset($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'message' => 'No autenticado']);
  exit;
}

// Obtener ID del proyecto desde la query
if (!isset($_GET['project_id'])) {
  echo json_encode(['success' => false, 'message' => 'Falta el ID del proyecto']);
  exit;
}

$project_id = intval($_GET['project_id']);

// Buscar el proyecto (sin importar quién lo creó)
$stmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
$stmt->bind_param("i", $project_id);
$stmt->execute();
$result = $stmt->get_result();
$project = $result->fetch_assoc();

if ($project) {
  echo json_encode(['success' => true, 'project' => $project]);
} else {
  echo json_encode(['success' => false, 'message' => 'Proyecto no encontrado']);
}