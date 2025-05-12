<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'Off'); // Si estás trabajando en http (localhost), "Off"

session_start();
require 'db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$query = "SELECT id, name, email, profile_picture FROM users";
$result = $conn->query($query);

$users = [];
while ($row = $result->fetch_assoc()) {
    if (empty($row['profile_picture'])) {
        $row['profile_picture'] = 'default.png';
    }
    $row['profile_picture_url'] = "http://localhost/myapp/backend/uploads/" . $row['profile_picture'];
    $users[] = $row;
}

// ⚠️ Agrega el campo "success" para que React lo detecte
echo json_encode([
    "success" => true,
    "users" => $users
]);
