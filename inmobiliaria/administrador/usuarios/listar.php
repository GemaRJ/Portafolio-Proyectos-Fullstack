<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarAdmin();

// Consultamos todos los usuarios
$res = mysqli_query($conn, "SELECT * FROM usuario");

// Guardamos los datos en un array (Memoria PHP)
$usuarios = mysqli_fetch_all($res, MYSQLI_ASSOC);

//  CERRAMOS la conexión
mysqli_free_result($res);
mysqli_close($conn);
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Lista de Usuarios | GEMA Admin</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/admin.css">
</head>

<body>
    <div class="caja-principal" style="max-width: 1000px;">
        <div class="admin-header">
            <h1 style="color: #1a5276;">Usuarios Registrados</h1>
            <a href="alta.php" class="boton-gema" style="background:#27ae60; width:auto;">+ Nuevo Usuario</a>
        </div>

        <table class="tabla-personalizada tabla-admin">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($usuarios as $u): ?>
                <tr>
                    <td>#<?php echo $u['usuario_id']; ?></td>
                    <td><?php echo htmlspecialchars($u['nombres']); ?></td>
                    <td><?php echo htmlspecialchars($u['correo']); ?></td>
                    <td>
                        <span class="etiqueta-rol rol-<?php echo $u['tipo_usuario']; ?>">
                            <?php echo ucfirst($u['tipo_usuario']); ?>
                        </span>
                    </td>
                    <td>
                        <a href="modificar.php?id=<?php echo $u['usuario_id']; ?>" class="enlace-editar">Editar</a>
                        |
                        <a href="baja.php?id=<?php echo $u['usuario_id']; ?>" class="enlace-borrar"
                            onclick="return confirm('¿Estás seguro de eliminar al usuario <?php echo $u['nombres']; ?>?')">Borrar</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <div class="separador-footer">
            <a href="../menu.php" class="boton-admin" style="text-decoration:none; display:inline-block; width:auto;">
                ⬅ Volver al Menú
            </a>
        </div>
    </div>

    <footer class="footer-gema">
        <p class="footer-logo">🏠 GEMA Admin</p>
        <div class="footer-copyright">&copy; <?php echo date('Y'); ?> Panel de Usuarios</div>
    </footer>
</body>

</html>