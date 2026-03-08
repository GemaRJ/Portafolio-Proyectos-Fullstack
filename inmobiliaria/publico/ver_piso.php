<?php
require_once "../config/conexion.php";

// Sanitizamos la entrada del código
$codigo = intval($_GET['codigo'] ?? 0);

if ($codigo <= 0) {
    mysqli_close($conn);
    header("Location: ver_pisos.php");
    exit;
}

// Consulta segura
$sql = "SELECT * FROM pisos WHERE Codigo_piso = $codigo";
$res = mysqli_query($conn, $sql);
$piso = mysqli_fetch_assoc($res);

if(!$piso){
    mysqli_close($conn);
    die("Piso no encontrado");
}

// Liberar recursos antes del HTML
mysqli_free_result($res);
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalle del Inmueble | GEMA</title>
    <link rel="stylesheet" href="../css/estilos.css">
    <link rel="stylesheet" href="../css/cliente.css">
</head>

<body>

    <div class="caja-principal" style="max-width: 800px; margin-top: 30px;">
        <h1 class="titulo-hola">Detalles del Inmueble</h1>

        <div class="piso-img-container" style="text-align: center; margin-bottom: 20px;">
            <img src="../img/<?php echo $piso['imagen']; ?>" class="detalles-img-grande" alt="Imagen del piso"
                style="max-width: 100%; border-radius: 10px;">
        </div>

        <div class="ficha-tecnica">
            <div>
                <p class="info-item"><strong>📍 Calle:</strong> <?php echo htmlspecialchars($piso['calle']); ?></p>
                <p class="info-item"><strong>🔢 Número:</strong> <?php echo $piso['numero']; ?></p>
                <p class="info-item"><strong>🏢 Planta:</strong> <?php echo $piso['piso']; ?>º</p>
                <p class="info-item"><strong>🌍 Zona:</strong> <?php echo htmlspecialchars($piso['zona']); ?></p>
            </div>
            <div style="text-align: right;">
                <p class="precio-grande"><?php echo number_format($piso['precio'], 2, ',', '.'); ?> €</p>
                <p class="info-item"><strong>📏 Superficie:</strong> <?php echo $piso['metros']; ?> m²</p>
                <p class="info-item"><strong>📮 C.P.:</strong> <?php echo $piso['cp']; ?></p>
            </div>
        </div>

        <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            <p style="color: #666; margin-bottom: 15px;">¿Deseas adquirir esta propiedad?</p>
            <a href="../autenticacion/login.php" class="boton-gema"
                style="display: inline-block; width: auto; padding: 12px 30px;">
                🔑 Iniciar sesión para comprar
            </a>
            <p style="margin-top: 20px;">
                <a href="ver_pisos.php" class="nav-link">⬅ Volver al catálogo</a>
            </p>
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