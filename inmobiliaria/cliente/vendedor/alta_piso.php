<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarSesion(); 

// Seguridad: Solo vendedores pueden estar aquí
if($_SESSION['tipo_usuario'] !== 'vendedor'){
    header("Location: ../menu.php");
    exit;
}

$mensaje = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Limpieza de datos
    $calle = mysqli_real_escape_string($conn, $_POST['calle']);
    $numero = intval($_POST['numero']);
    $piso_num = intval($_POST['piso']);
    $puerta = mysqli_real_escape_string($conn, $_POST['puerta']);
    $cp = intval($_POST['cp']);
    $metros = intval($_POST['metros']);
    $zona = mysqli_real_escape_string($conn, $_POST['zona']);
    $precio = floatval($_POST['precio']);
    
    // El ID lo sacamos de la sesión (Seguridad: así nadie publica a nombre de otro)
    $usuario_id = $_SESSION['id'];

    // Gestión de Imagen
    $imagen = 'default.jpg';
    if(isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0){
        $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
     
        $imagen = time() . "_" . uniqid() . "." . $extension;

        move_uploaded_file($_FILES['imagen']['tmp_name'], "../../img/" . $imagen);
    }

    $sql = "INSERT INTO pisos (calle, numero, piso, puerta, cp, metros, zona, precio, imagen, usuario_id)
            VALUES ('$calle', $numero, $piso_num, '$puerta', $cp, $metros, '$zona', $precio, '$imagen', $usuario_id)";
            
    if(mysqli_query($conn, $sql)){
        $mensaje = "¡Piso publicado con éxito!";
    } else {
        $error = "Error al guardar: " . mysqli_error($conn);
    }

    // Cerrar conexión siempre
    mysqli_close($conn);
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anunciar Propiedad | GEMA</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/cliente.css">
</head>

<body>

    <div class="caja-principal">
        <div class="panel-header vendedor-header">
            <h1 class="titulo-hola">Anunciar Propiedad</h1>
            <p class="texto-rol">NUEVO ANUNCIO DE VENTA</p>
        </div>

        <?php if ($mensaje): ?>
        <div class="alerta alerta-exito">✅ <?php echo $mensaje; ?></div>
        <?php endif; ?>

        <?php if ($error): ?>
        <div class="alerta alerta-error">⚠️ <?php echo $error; ?></div>
        <?php endif; ?>

        <form method="POST" enctype="multipart/form-data">

            <h3 class="form-seccion">Dirección y Ubicación</h3>

            <label class="label-bold">Calle:</label>
            <input type="text" name="calle" class="input-gema" placeholder="Nombre de la calle" required>

            <div class="grupo-triple">
                <div>
                    <label class="label-bold">Nº:</label>
                    <input type="number" name="numero" class="input-gema" placeholder="Ej: 12" required>
                </div>
                <div>
                    <label class="label-bold">Piso:</label>
                    <input type="number" name="piso" class="input-gema" placeholder="Ej: 3" required>
                </div>
                <div>
                    <label class="label-bold">Puerta:</label>
                    <input type="text" name="puerta" class="input-gema" placeholder="Ej: B" required>
                </div>
            </div>

            <h3 class="form-seccion">Detalles Técnicos</h3>

            <div class="grupo-doble">
                <div>
                    <label class="label-bold">C.P.:</label>
                    <input type="number" name="cp" class="input-gema" placeholder="Código Postal" required>
                </div>
                <div>
                    <label class="label-bold">Metros m²:</label>
                    <input type="number" name="metros" class="input-gema" placeholder="Metros totales" required>
                </div>
            </div>

            <div class="grupo-doble">
                <div>
                    <label class="label-bold">Zona:</label>
                    <input type="text" name="zona" class="input-gema" placeholder="Ej: Playa, Centro...">
                </div>
                <div>
                    <label class="label-bold">Precio (€):</label>
                    <input type="number" step="0.01" name="precio" class="input-gema" placeholder="Ej: 150000" required>
                </div>
            </div>

            <div class="contenedor-preview">
                <label class="label-bold">Fotografía de la Propiedad:</label>
                <input type="file" name="imagen" accept="image/*" class="input-gema"
                    style="border: none; padding: 10px 0;">
            </div>

            <div class="grupo-boton">
                <button type="submit" class="boton-gema boton-largo">
                    Publicar Propiedad
                </button>
            </div>
        </form>

        <div class="separador-footer">
            <a href="../menu.php" class="nav-link" style="font-weight: bold;">🏠 Volver al menú principal</a>
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