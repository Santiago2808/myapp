<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'Off'); // Si estás trabajando en http (localhost), "Off"

session_start(); // ✅ Esto faltaba
require 'db.php';
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true'); // ✅ Permitir enviar cookies

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$response = ['loggedIn' => false];

if (isset($_SESSION['user_id'])) {
    $response['loggedIn'] = true;
    $response['user'] = [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name']
    ];
}

echo json_encode($response);
?>
