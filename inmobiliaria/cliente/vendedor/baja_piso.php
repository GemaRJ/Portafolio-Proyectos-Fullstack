<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarSesion(); 

// Seguridad de rol: Solo vendedores
if($_SESSION['tipo_usuario'] !== 'vendedor'){
    header("Location: ../menu.php");
    exit;
}

$codigo = intval($_GET['codigo'] ?? 0);
$vendedor_id = $_SESSION['id'];

if($codigo > 0) {

    $res = mysqli_query($conn, "SELECT imagen FROM pisos WHERE Codigo_piso=$codigo AND usuario_id=$vendedor_id");
    $piso = mysqli_fetch_assoc($res);

    if($piso){

        mysqli_query($conn, "SET FOREIGN_KEY_CHECKS = 0");

        // Borramos el piso de la base de datos
        $sql = "DELETE FROM pisos WHERE Codigo_piso=$codigo AND usuario_id=$vendedor_id";
        
        if(mysqli_query($conn, $sql)){
            
            if($piso['imagen'] !== 'default.jpg' && file_exists("../../img/".$piso['imagen'])){
                unlink("../../img/".$piso['imagen']);
            }
        }

        // Reactivamos la restricción
        mysqli_query($conn, "SET FOREIGN_KEY_CHECKS = 1");
    }
    
    if($res) mysqli_free_result($res);
}

// Cerramos conexión
mysqli_close($conn);

// Redirigimos a la lista
header("Location: mis_pisos.php");
exit;
?>