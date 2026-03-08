<?php

require_once "../config/sesiones.php";
require_once "../config/conexion.php";
comprobarAdmin();


mysqli_close($conn);
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración | GEMA</title>
    <link rel="stylesheet" href="../css/estilos.css">
    <link rel="stylesheet" href="../css/admin.css">
</head>

<body>
    <div class="caja-principal" style="max-width: 900px;">
        <div class="admin-header">
            <h1 class="titulo-hola" style="color: #1a5276;">Panel de Control</h1>
            <p class="texto-rol">Bienvenido, <strong><?php echo htmlspecialchars($_SESSION['nombre']); ?></strong></p>
        </div>

        <div class="menu-grid">
            <div class="seccion-admin">
                <h2>👥 Usuarios</h2>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                    <a href="usuarios/listar.php" class="boton-admin">VER Y EDITAR</a>
                </div>
            </div>

            <div class="seccion-admin">
                <h2>🏢 Inmuebles</h2>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                    <a href="pisos/listar.php" class="boton-admin">Listar todos los Pisos</a>
                    <a href="pisos/alta.php" class="boton-admin" style="background-color: #27ae60;">+ Nuevo Piso</a>
                </div>
            </div>
        </div>

        <div class="separador-footer">
            <a href="../autenticacion/logout.php" class="nav-link" style="color: #c0392b; font-weight: bold;">
                🔴 Cerrar Sesión Segura
            </a>
        </div>
    </div>

    <footer class="footer-gema">
        <p class="footer-logo">🏠 GEMA Admin</p>
        <p class="footer-subtexto">Gestión Interna de Sistema</p>
        <div class="footer-copyright">
            &copy; <?php echo date('Y'); ?> Panel Administrativo Privado.
        </div>
    </footer>
</body>

</html>