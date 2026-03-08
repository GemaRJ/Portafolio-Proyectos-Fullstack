<?php 
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarSesion(); 

if($_SESSION['tipo_usuario'] !== 'vendedor'){
    header("Location: ../menu.php");
    exit;
}

$codigo = isset($_GET['codigo']) ? intval($_GET['codigo']) : 0;
$mensaje = '';
$error = '';

// Obtenemos los datos actuales
$res = mysqli_query(
    $conn,
    "SELECT * FROM pisos WHERE Codigo_piso=$codigo AND usuario_id=".$_SESSION['id']
);
$piso = mysqli_fetch_assoc($res);

if(!$piso){
    mysqli_close($conn); // Cerramos antes de detener el script
    die("Piso no encontrado o no tienes permiso para editarlo.");
}

// Procesamos la actualización
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $calle  = mysqli_real_escape_string($conn, $_POST['calle']);
    $numero = intval($_POST['numero']);
    $piso_n = intval($_POST['piso']);
    $puerta = mysqli_real_escape_string($conn, $_POST['puerta']);
    $cp     = intval($_POST['cp']);
    $metros = intval($_POST['metros']);
    $zona   = mysqli_real_escape_string($conn, $_POST['zona']);
    $precio = floatval($_POST['precio']);

    // Gestión de Imagen
    if(isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0){
        
        if($piso['imagen'] && $piso['imagen'] != 'default.jpg' && file_exists("../../img/".$piso['imagen'])){
            unlink("../../img/".$piso['imagen']);
        }
        $imagen = time().'_'.$_FILES['imagen']['name'];
        move_uploaded_file($_FILES['imagen']['tmp_name'], "../../img/".$imagen);
    } else {
        $imagen = $piso['imagen'];
    }

    $sql = "UPDATE pisos SET 
                calle='$calle',
                numero='$numero',
                piso='$piso_n',
                puerta='$puerta',
                cp='$cp',
                metros='$metros',
                zona='$zona',
                precio='$precio',
                imagen='$imagen'
            WHERE Codigo_piso=$codigo AND usuario_id=".$_SESSION['id'];

    if(mysqli_query($conn, $sql)){
        $mensaje = "Piso modificado correctamente.";
        // Actualizamos el array local para que el formulario muestre los datos nuevos inmediatamente
        $piso['calle'] = $calle;
        $piso['numero'] = $numero;
        $piso['piso'] = $piso_n;
        $piso['puerta'] = $puerta;
        $piso['cp'] = $cp;
        $piso['metros'] = $metros;
        $piso['zona'] = $zona;
        $piso['precio'] = $precio;
        $piso['imagen'] = $imagen;
    } else {
        $error = "Error al modificar el piso.";
    }
}

//  Liberar recursos y cerrar conexión antes del HTML
mysqli_free_result($res);
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modificar Piso | GEMA</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/cliente.css">
</head>

<body>

    <div class="caja-principal">
        <div class="panel-header vendedor-header">
            <h1 class="titulo-hola">Editar Propiedad</h1>
            <p class="texto-rol">REFERENCIA: PISO-<?php echo $codigo; ?></p>
        </div>

        <?php if($mensaje): ?><div class="alerta alerta-exito">✅ <?php echo $mensaje; ?></div><?php endif; ?>
        <?php if($error): ?><div class="alerta alerta-error">⚠️ <?php echo $error; ?></div><?php endif; ?>

        <form method="POST" enctype="multipart/form-data">
            <label class="label-bold">Calle / Dirección</label>
            <input type="text" name="calle" class="input-gema" value="<?php echo htmlspecialchars($piso['calle']); ?>"
                required>

            <div class="grupo-triple">
                <div>
                    <label class="label-bold">Nº</label>
                    <input type="number" name="numero" class="input-gema" value="<?php echo $piso['numero']; ?>"
                        required>
                </div>
                <div>
                    <label class="label-bold">Piso</label>
                    <input type="number" name="piso" class="input-gema" value="<?php echo $piso['piso']; ?>" required>
                </div>
                <div>
                    <label class="label-bold">Puerta</label>
                    <input type="text" name="puerta" class="input-gema"
                        value="<?php echo htmlspecialchars($piso['puerta']); ?>" required>
                </div>
            </div>

            <div class="grupo-doble">
                <div>
                    <label class="label-bold">C.P.</label>
                    <input type="number" name="cp" class="input-gema" value="<?php echo $piso['cp']; ?>" required>
                </div>
                <div>
                    <label class="label-bold">Metros Cuadrados</label>
                    <input type="number" name="metros" class="input-gema" value="<?php echo $piso['metros']; ?>"
                        required>
                </div>
            </div>

            <div class="grupo-doble">
                <div>
                    <label class="label-bold">Zona</label>
                    <input type="text" name="zona" class="input-gema"
                        value="<?php echo htmlspecialchars($piso['zona']); ?>">
                </div>
                <div>
                    <label class="label-bold">Precio (€)</label>
                    <input type="number" step="0.01" name="precio" class="input-gema"
                        value="<?php echo $piso['precio']; ?>" required>
                </div>
            </div>

            <div class="contenedor-preview" style="text-align: left; margin: 25px 0;">
                <label class="label-bold">Imagen actual:</label>
                <img src="../../img/<?php echo $piso['imagen']; ?>" class="img-tabla" alt="Piso"
                    style="width: 150px; height: auto; display: block; margin-bottom: 15px; border-radius: 8px;">

                <input type="file" name="imagen" class="input-file" accept="image/*">
            </div>

            <div style="clear: both; padding-top: 20px;">
                <button type="submit" class="boton-gema" style="width: 100%;">
                    Actualizar Anuncio
                </button>
            </div>
        </form>

        <div class="separador-footer">
            <a href="mis_pisos.php" class="nav-link">⬅ Volver a mis anuncios</a>
        </div>
    </div>

    <footer class="footer-gema">
        <p style="font-size: 1.2rem; margin-bottom: 10px;">🏠 GEMA Inmuebles</p>
        <p style="color: #bdc3c7; font-size: 0.9rem;">Tu agencia de confianza desde 2026</p>
        <div style="margin-top: 20px; font-size: 0.8rem; color: #7f8c8d;">
            &copy; <?php echo date('Y'); ?> Todos los derechos reservados.
        </div>
    </footer>
</body>

</html>