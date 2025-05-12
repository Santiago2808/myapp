<?php
session_start();
require 'db.php';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

if (!isset($_FILES['profile_picture'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Archivo no enviado',
        'debug' => $_FILES // Para ver si llegó algo incorrecto
    ]);
    exit;
}

$targetDir = "uploads/";
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

$filename = uniqid() . "_" . basename($_FILES["profile_picture"]["name"]);
$targetFile = $targetDir . $filename;

// Validación de errores en el archivo subido
if ($_FILES["profile_picture"]["error"] !== UPLOAD_ERR_OK) {
    echo json_encode([
        'success' => false,
        'message' => 'Error en archivo subido',
        'php_error_code' => $_FILES["profile_picture"]["error"]
    ]);
    exit;
}

// Mover archivo
if (move_uploaded_file($_FILES["profile_picture"]["tmp_name"], $targetFile)) {
    $stmt = $conn->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
    $stmt->bind_param("si", $filename, $_SESSION['user_id']);
    $stmt->execute();

    echo json_encode(['success' => true, 'filename' => $filename]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error moviendo imagen al destino',
        'debug_path' => $targetFile,
        'debug_tmp' => $_FILES["profile_picture"]["tmp_name"]
    ]);
}
