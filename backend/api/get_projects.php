<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite que React pueda hacer la petición

// Incluir la conexión existente
require_once '../db.php'; // Ajusta el path si tu archivo se llama diferente o está en otra carpeta

// Consulta los proyectos
$sql = "SELECT id, name FROM projects";
$result = $conn->query($sql);

$projects = [];

if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $projects[] = $row;
  }
}

echo json_encode($projects);
$conn->close();
?>
