<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";

// Verificamos sesión
comprobarSesion();

// Validación más robusta del ID
$codigo = intval($_GET['codigo'] ?? 0);

if ($codigo <= 0) {
    mysqli_close($conn);
    header("Location: buscar_pisos.php");
    exit;
}

// Consulta
$res = mysqli_query($conn, "SELECT * FROM pisos WHERE Codigo_piso=$codigo");
$piso = mysqli_fetch_assoc($res);

if (!$piso) {
    mysqli_close($conn);
    die("Piso no encontrado.");
}

// Liberar memoria y Cerrar conexión antes del HTML
mysqli_free_result($res);
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalle del Inmueble | GEMA</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/cliente.css">
</head>

<body>

    <div class="caja-principal" style="max-width: 900px;">

        <div class="panel-header vendedor-header">
            <h1 class="titulo-hola">Detalles del Inmueble</h1>
            <p class="texto-rol">REFERENCIA: PISO-<?php echo $codigo; ?></p>
        </div>

        <div class="piso-img-container"
            style="height: auto; margin-bottom: 30px; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">

            <?php if($piso['imagen'] && $piso['imagen'] != 'default.jpg'): ?>
            <img src="../../img/<?php echo $piso['imagen']; ?>" class="detalles-img-grande" alt="Imagen del piso"
                style="margin: 0; width: 100%;">
            <?php else: ?>
            <div
                style="background: #eee; height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">
                [Imagen no disponible]
            </div>
            <?php endif; ?>
        </div>

        <div class="ficha-tecnica">
            <div>
                <p class="info-item"><strong>📍 Calle:</strong> <?php echo htmlspecialchars($piso['calle']); ?></p>
                <p class="info-item"><strong>🌍 Zona:</strong> <?php echo htmlspecialchars($piso['zona']); ?></p>
                <p class="info-item"><strong>🚪 Puerta:</strong> <?php echo htmlspecialchars($piso['puerta']); ?></p>
                <p class="info-item"><strong>🔢 Planta:</strong> <?php echo $piso['piso']; ?>º (Edificio Nº
                    <?php echo $piso['numero']; ?>)</p>
            </div>

            <div style="text-align: right;">
                <p class="precio-grande">
                    <?php echo number_format($piso['precio'], 2, ',', '.'); ?> €
                </p>
                <p class="info-item"><strong>📐 Superficie:</strong> <?php echo $piso['metros']; ?> m²</p>
                <p class="info-item"><strong>🆔 Ref:</strong> #<?php echo $piso['Codigo_piso']; ?></p>
            </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; margin-top: 30px;">
            <a href="comprar.php?codigo=<?php echo $piso['Codigo_piso']; ?>" class="boton-gema"
                onclick="return confirm('¿Estás seguro de que quieres comprar esta propiedad por <?php echo number_format($piso['precio'], 0, ',', '.'); ?> €?')"
                style="background-color: #27ae60; width: auto; padding: 12px 40px;">
                🛒 Comprar este piso
            </a>

            <a href="buscar_pisos.php" class="boton-outline" style="padding: 12px 25px;">
                ⬅ Volver al listado
            </a>
        </div>

        <div class="separador-footer">
            <a href="../menu.php" class="nav-link">🏠 Menú Principal</a>
        </div>
    </div>

    <footer class="footer-gema">
        <p class="footer-logo">🏠 GEMA Inmuebles</p>
        <p class="footer-subtexto">Tu agencia de confianza desde 2026</p>
        <div class="footer-copyright">
            &copy; <?php echo date('Y'); ?> Todos los derechos reservados.
        </div>
    </footer>

</body>

</html>