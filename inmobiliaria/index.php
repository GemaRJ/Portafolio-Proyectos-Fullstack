<?php
require_once "config/sesiones.php";
require_once "config/conexion.php";

if (isset($_SESSION['id'])) {
    if ($_SESSION['tipo_usuario'] == 'administrador') {
        header("Location: administrador/menu.php");
        exit;
    } else {
        header("Location: cliente/menu.php");
        exit;
    }
}

$sql = "SELECT * FROM pisos ORDER BY Codigo_piso DESC LIMIT 15"; 
$res = mysqli_query($conn, $sql);
$pisos = mysqli_fetch_all($res, MYSQLI_ASSOC);

mysqli_free_result($res);
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GEMA Inmobiliaria | Tu nuevo hogar</title>
    <link rel="stylesheet" href="css/estilos.css">
    <link rel="stylesheet" href="css/cliente.css">
</head>

<body>

    <nav class="navbar">
        <a href="index.php" class="nav-brand">🏠 GEMA Inmuebles</a>

        <div class="nav-links">
            <a href="publico/ver_pisos.php" class="nav-link">Catálogo</a>
            <span style="color: #eee;">|</span>
            <a href="autenticacion/login.php" class="boton-outline">Login</a>
            <a href="autenticacion/registro.php" class="boton-gema">Registro</a>
        </div>
    </nav>

    <header class="hero">
        <h1>Encuentra tu Chalet Ideal</h1>
        <p>Las mejores propiedades en las zonas más exclusivas</p>

        <div class="caja-principal" style="max-width: 600px; margin-top: 30px; padding: 20px;">
            <form action="publico/ver_pisos.php" method="GET" style="display: flex; gap: 10px;">
                <input type="text" name="zona" class="input-gema" placeholder="¿En qué zona buscas?"
                    style="margin-bottom: 0;">
                <button type="submit" class="boton-gema" style="width: auto;">Buscar</button>
            </form>
        </div>
    </header>

    <main class="caja-principal" style="max-width: 1200px; background: none; box-shadow: none;">
        <h2 class="titulo-hola" style="margin-bottom: 40px; text-align:center;">
            <span>Chalets Destacados</span>
        </h2>

        <div class="contenedor-grid">
            <?php foreach($pisos as $piso): ?>
            <article class="piso-card">
                <div class="piso-img-container">
                    <img src="img/<?php echo $piso['imagen']; ?>" alt="Chalet">
                </div>

                <div style="padding: 20px; text-align: left;">
                    <p class="precio-tag">
                        <?php echo number_format($piso['precio'], 0, ',', '.'); ?> €
                    </p>
                    <h3 style="margin-bottom: 10px;"><?php echo htmlspecialchars($piso['calle']); ?></h3>
                    <p class="info-item">📍 Zona: <?php echo htmlspecialchars($piso['zona']); ?></p>

                    <a href="publico/detalles.php?codigo=<?php echo $piso['Codigo_piso']; ?>" class="boton-gema"
                        style="display: block; text-align: center; margin-top: 15px;">
                        Ver Detalles
                    </a>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </main>

    <footer class="footer-gema">
        <p class="footer-logo">🏠 GEMA Inmuebles</p>
        <p class="footer-subtexto">Tu agencia de confianza desde 2026</p>
        <div class="footer-copyright">
            &copy; <?php echo date('Y'); ?> Todos los derechos reservados.
        </div>
    </footer>
</body>

</html>