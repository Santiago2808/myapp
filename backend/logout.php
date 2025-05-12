<?php
// logout.php

session_start();

// Encabezados CORS
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // Sin contenido para preflight
    exit;
}

// Destruir sesión
session_unset();
session_destroy();

// Respuesta
header('Content-Type: application/json');
echo json_encode(["success" => true]);
?>
