<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarSesion(); 

// Recogemos ID y validamos
$id = intval($_GET['codigo'] ?? 0);
$mensaje = '';
$error = '';

if ($id <= 0) {
    header("Location: listar.php");
    exit;
}

// Procesamos el formulario (UPDATE)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // Limpieza de datos
    $calle   = mysqli_real_escape_string($conn, $_POST['calle']);
    $puerta  = mysqli_real_escape_string($conn, $_POST['puerta']);
    $zona    = mysqli_real_escape_string($conn, $_POST['zona']);
    $numero  = intval($_POST['numero']);
    $piso_val = intval($_POST['piso']);
    $cp      = intval($_POST['cp'] ?? 0); 
    $metros  = intval($_POST['metros'] ?? 0);
    $precio  = floatval($_POST['precio']);


    $img_sql = ""; 
    if(isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0){
     
        $res_img = mysqli_query($conn, "SELECT imagen FROM pisos WHERE Codigo_piso = $id");
        $piso_actual = mysqli_fetch_assoc($res_img);
        
        if($piso_actual['imagen'] && $piso_actual['imagen'] != 'default.jpg'){
            $ruta_antigua = "../../img/" . $piso_actual['imagen'];
            if(file_exists($ruta_antigua)) unlink($ruta_antigua);
        }

        $nombre_img = time() . "_" . $_FILES['imagen']['name'];
        move_uploaded_file($_FILES['imagen']['tmp_name'], "../../img/" . $nombre_img);
        $img_sql = ", imagen='$nombre_img'";
    }

    $sql_update = "UPDATE pisos SET 
                   calle='$calle', numero=$numero, piso=$piso_val, puerta='$puerta', 
                   cp=$cp, metros=$metros, zona='$zona', precio=$precio $img_sql 
                   WHERE Codigo_piso=$id";
    
    if (mysqli_query($conn, $sql_update)) {
        $mensaje = "Datos e imagen actualizados correctamente.";
    } else {
        $error = "Error al actualizar: " . mysqli_error($conn);
    }
}

// Cargamos los datos del piso para el formulario
$res = mysqli_query($conn, "SELECT * FROM pisos WHERE Codigo_piso = $id");
$piso = mysqli_fetch_assoc($res);

if (!$piso) die("Inmueble no encontrado.");

// Liberar y cerrar antes del HTML
mysqli_free_result($res);
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Modificar Piso | GEMA Admin</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/admin.css">
</head>

<body>
    <div class="caja-principal" style="max-width: 650px;">
        <div class="admin-header">
            <h1 class="titulo-hola">Editar Propiedad</h1>
            <p class="texto-rol">CÓDIGO DE REGISTRO #<?php echo $id; ?></p>
        </div>

        <?php if($mensaje): ?><div class="alerta alerta-exito">✅ <?php echo $mensaje; ?></div><?php endif; ?>
        <?php if($error): ?><div class="alerta alerta-error">⚠️ <?php echo $error; ?></div><?php endif; ?>

        <form method="POST" enctype="multipart/form-data">
            <label class="label-bold">Calle:</label>
            <input type="text" name="calle" class="input-gema" value="<?php echo htmlspecialchars($piso['calle']); ?>"
                required>

            <div class="grupo-triple">
                <div>
                    <label class="label-bold">Nº:</label>
                    <input type="number" name="numero" class="input-gema" value="<?php echo $piso['numero']; ?>"
                        required>
                </div>
                <div>
                    <label class="label-bold">Piso:</label>
                    <input type="number" name="piso" class="input-gema" value="<?php echo $piso['piso']; ?>" required>
                </div>
                <div>
                    <label class="label-bold">Puerta:</label>
                    <input type="text" name="puerta" class="input-gema"
                        value="<?php echo htmlspecialchars($piso['puerta']); ?>" required>
                </div>
            </div>

            <div class="grupo-doble">
                <div>
                    <label class="label-bold">C.P.:</label>
                    <input type="number" name="cp" class="input-gema" value="<?php echo $piso['cp']; ?>">
                </div>
                <div>
                    <label class="label-bold">Metros:</label>
                    <input type="number" name="metros" class="input-gema" value="<?php echo $piso['metros']; ?>">
                </div>
            </div>

            <div class="grupo-doble">
                <div>
                    <label class="label-bold">Zona:</label>
                    <input type="text" name="zona" class="input-gema"
                        value="<?php echo htmlspecialchars($piso['zona']); ?>">
                </div>
                <div>
                    <label class="label-bold">Precio (€):</label>
                    <input type="number" step="0.01" name="precio" class="input-gema"
                        value="<?php echo $piso['precio']; ?>" required>
                </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; border: 1px dashed #ccc; border-radius: 8px;">
                <label class="label-bold">Imagen actual:</label><br>
                <img src="../../img/<?php echo $piso['imagen']; ?>"
                    style="width: 100px; height: auto; margin: 10px 0; border-radius: 5px;">
                <br>
                <label class="label-bold">Cambiar foto:</label>
                <input type="file" name="imagen" accept="image/*" class="input-file">
            </div>

            <button type="submit" class="boton-admin" style="width:100%; margin-top:20px; cursor: pointer;">Guardar
                Cambios</button>
        </form>

        <div class="separador-footer">
            <a href="listar.php" class="nav-link">⬅ Volver al listado</a>
        </div>
    </div>
</body>

</html>