<?php

require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarSesion(); 

if($_SESSION['tipo_usuario'] !== 'administrador'){
    header("Location: ../menu.php");
    exit;
}

$codigo = intval($_GET['codigo'] ?? 0);

if($codigo > 0) {

    $res = mysqli_query($conn, "SELECT imagen FROM pisos WHERE Codigo_piso=$codigo");
    $piso = mysqli_fetch_assoc($res);

    if($piso){

        mysqli_query($conn, "SET FOREIGN_KEY_CHECKS = 0");

        $sql = "DELETE FROM pisos WHERE Codigo_piso=$codigo";
        
        if(mysqli_query($conn, $sql)){
            // 2. Borrar la foto (Ruta corregida a ../../img/)
            if($piso['imagen'] !== 'default.jpg' && !empty($piso['imagen'])){
                $ruta_foto = "../../img/" . $piso['imagen'];
                if(file_exists($ruta_foto)){
                    unlink($ruta_foto);
                }
            }
        }
        mysqli_query($conn, "SET FOREIGN_KEY_CHECKS = 1");
    }
}

mysqli_close($conn);
header("Location: listar.php");
exit;