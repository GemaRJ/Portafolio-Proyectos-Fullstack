<?php
require_once "../config/conexion.php";

// Consulta de todos los pisos disponibles
$sql = "SELECT * FROM pisos ORDER BY Codigo_piso DESC";
$resultado = $conn->query($sql);

// No cerramos la conexión aquí todavía porque necesitamos recorrer el objeto $resultado en el HTML
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pisos Disponibles | GEMA</title>
    <link rel="stylesheet" href="../css/estilos.css">
    <link rel="stylesheet" href="../css/cliente.css">
</head>

<body style="padding: 20px;">

    <div class="caja-principal" style="max-width: 1200px; background: none; box-shadow: none;">
        <h1 style="color: #b03a2e; margin-bottom: 40px; font-size: 2.5rem; text-align: center;">Nuestro Catálogo de
            Chalets</h1>

        <div class="contenedor-grid">
            <?php if($resultado && $resultado->num_rows > 0): ?>
            <?php while($piso = $resultado->fetch_assoc()): ?>
            <div class="piso-card">
                <div class="piso-img-container">
                    <?php 
                            $ruta_img = "../img/" . $piso['imagen'];
                            if(!empty($piso['imagen']) && file_exists($ruta_img)): ?>
                    <img src="<?php echo $ruta_img; ?>" alt="Imagen del chalet">
                    <?php else: ?>
                    <div
                        style="background: #eee; height: 100%; display: flex; align-items: center; justify-content: center; color: #999;">
                        Sin imagen
                    </div>
                    <?php endif; ?>
                </div>

                <div class="piso-info" style="padding: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">
                        <?php echo htmlspecialchars($piso['calle']) . " " . $piso['numero']; ?>
                    </h3>

                    <p class="precio-tag">
                        <?php echo number_format($piso['precio'], 0, ',', '.'); ?> €
                    </p>

                    <p class="zona-tag" style="margin-bottom: 15px; color: #7f8c8d;">
                        📍 Zona: <?php echo htmlspecialchars($piso['zona']); ?>
                    </p>

                    <a href="detalles.php?codigo=<?php echo $piso['Codigo_piso']; ?>" class="boton-gema"
                        style="display: block; text-align: center;">
                        Ver Detalles
                    </a>
                </div>
            </div>
            <?php endwhile; ?>
            <?php else: ?>
            <p style="text-align: center; grid-column: 1 / -1; padding: 50px; color: #999;">
                Actualmente no hay propiedades disponibles en el catálogo.
            </p>
            <?php endif; ?>
        </div>

        <?php 
        // Liberar memoria y cerrar conexión después del bucle
        $resultado->free();
        $conn->close();
        ?>

        <div style="margin-top: 50px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            <a href="../index.php" style="text-decoration: none; color: #7f8c8d; font-weight: bold;">🏠 Volver a la
                página de inicio</a>
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