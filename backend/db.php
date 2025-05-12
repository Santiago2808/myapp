<?php
// db.php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "myapp_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
