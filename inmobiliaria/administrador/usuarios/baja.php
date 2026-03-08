<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";

// SEGURIDAD: Solo el admin puede borrar gente.
comprobarAdmin();

// Recogemos el ID y lo convertimos a entero 
$id = intval($_GET['id'] ?? 0);

if($id > 0) {
    
  
    // Usamos $_SESSION['id'] que guardaste en el login
    if($id == $_SESSION['id']) {
        mysqli_close($conn); // Cerramos antes de salir
        echo "<script>alert('No puedes eliminar tu propia cuenta activo.'); window.location.href='usuarios_listar.php';</script>";
        exit;
    }

    // Ejecutamos el borrado
    $sql = "DELETE FROM usuario WHERE usuario_id=$id";
    mysqli_query($conn, $sql);
}

// Cerrar siempre la conexión
mysqli_close($conn);

// Redirigimos
header("Location: usuarios_listar.php");
exit;
?>