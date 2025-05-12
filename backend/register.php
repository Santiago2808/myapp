<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'Off'); // Si estás trabajando en http (localhost), "Off"


session_start(); // ✅ Esto faltaba

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true'); // ✅ Permitir enviar cookies

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // Respuesta sin contenido
    exit;
}

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "superadmin2808", "myapp_db");

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

// Leer datos JSON enviados por React
$data = json_decode(file_get_contents("php://input"));

// Validar que se hayan recibido datos
if (!$data || !isset($data->name) || !isset($data->email) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

// Limpiar datos
$name = $conn->real_escape_string($data->name);
$email = $conn->real_escape_string($data->email);
$password = password_hash($data->password, PASSWORD_DEFAULT);

// Verificar si el email ya existe
$checkQuery = "SELECT id FROM users WHERE email = '$email'";
$checkResult = $conn->query($checkQuery);

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "El email ya está registrado"]);
    exit;
}

// Insertar nuevo usuario
$query = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$password')";

if ($conn->query($query) === TRUE) {
    $_SESSION['user'] = [
        "id" => $conn->insert_id,
        "name" => $name,
        "email" => $email
    ];
    echo json_encode(["success" => true, "message" => "Registro exitoso"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar"]);
}
?>
