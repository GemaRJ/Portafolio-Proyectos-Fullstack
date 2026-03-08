<?php
require_once "../config/conexion.php";

// Obtenemos el código y validamos que sea un entero
$codigo = isset($_GET['codigo']) ? intval($_GET['codigo']) : 0;

// SEGURIDAD: Uso de sentencia preparada 
$sql = "SELECT * FROM pisos WHERE Codigo_piso = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $codigo);
$stmt->execute();
$resultado = $stmt->get_result();
$piso = $resultado->fetch_assoc();

// Redirección si no existe el inmueble
if (!$piso) { 
    $stmt->close();
    $conn->close();
    header("Location: ver_pisos.php"); 
    exit; 
}

//  Liberar recursos antes de generar el HTML
$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($piso['calle']); ?> | Detalles GEMA</title>
    <link rel="stylesheet" href="../css/estilos.css">
    <link rel="stylesheet" href="../css/cliente.css">
</head>

<body>
    <div class="caja-principal" style="max-width: 900px; margin-top: 50px;">
        <h1 class="titulo-hola" style="text-align: left; margin-bottom: 20px;">
            <?php echo htmlspecialchars($piso['calle']); ?>
        </h1>

        <div class="piso-img-container"
            style="height: auto; margin-bottom: 30px; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <img src="../img/<?php echo $piso['imagen']; ?>" class="detalles-img-grande" alt="Vista del chalet"
                style="width: 100%; display: block;">
        </div>

        <div class="ficha-tecnica">
            <div>
                <p class="info-item"><strong>📍 Zona:</strong> <?php echo htmlspecialchars($piso['zona']); ?></p>
                <p class="info-item"><strong>🏠 Dirección:</strong> Nº <?php echo $piso['numero']; ?>, Piso
                    <?php echo $piso['piso']; ?></p>
            </div>
            <div style="text-align: right;">
                <p class="precio-grande"><?php echo number_format($piso['precio'], 0, ',', '.'); ?> €</p>
                <p class="info-item"><strong>📏 Metros:</strong> <?php echo $piso['metros']; ?> m²</p>
            </div>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">

        <div style="text-align: center;">
            <p style="margin-bottom: 20px; color: #34495e;">¿Te interesa esta propiedad? Identifícate para continuar.
            </p>

            <a href="../autenticacion/login.php" class="boton-gema"
                style="padding: 15px 40px; font-size: 1.1rem; display: inline-block; width: auto;">
                🔑 Iniciar sesión para comprar
            </a>

            <p style="margin-top: 25px;">
                <a href="ver_pisos.php" style="color: #7f8c8d; text-decoration: none; font-weight: bold;">
                    ← Volver al catálogo público
                </a>
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