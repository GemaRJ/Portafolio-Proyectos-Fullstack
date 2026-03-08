<?php
require_once "../config/sesiones.php";
comprobarSesion(); 
$tipo_usuario = $_SESSION['tipo_usuario']; 
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Control | GEMA</title>
    <link rel="stylesheet" href="../css/estilos.css">
    <link rel="stylesheet" href="../css/cliente.css">
</head>

<body>

    <div class="caja-principal">
        <p class="texto-rol">PANEL DE <?php echo strtoupper($tipo_usuario); ?></p>
        <h1 class="titulo-hola">Hola, <?php echo htmlspecialchars($_SESSION['nombre']); ?> 👋</h1>

        <div class="menu-grid">
            <?php if($tipo_usuario === "vendedor"): ?>
            <a href="vendedor/alta_piso.php" class="tarjeta-opcion">
                <span>🏠</span>
                <h3>Publicar Propiedad</h3>
            </a>
            <a href="vendedor/mis_pisos.php" class="tarjeta-opcion">
                <span>📋</span>
                <h3>Mis Anuncios</h3>
            </a>
            <?php else: ?>
            <a href="comprador/buscar_pisos.php" class="tarjeta-opcion">
                <span>🔍</span>
                <h3>Buscar Pisos</h3>
            </a>
            <?php endif; ?>
        </div>

        <div class="separador-footer">
            <a href="../autenticacion/logout.php" class="boton-gema">Cerrar sesión segura</a>
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