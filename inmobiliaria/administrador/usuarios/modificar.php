<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarAdmin();

// Validamos el ID
$id = intval($_GET['id'] ?? 0);
$mensaje = '';
$error = '';

if ($id <= 0) {
    header("Location: usuarios_listar.php");
    exit;
}

// Procesamos el formulario (UPDATE)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //  Limpiamos TODAS las variables
    $nombres = mysqli_real_escape_string($conn, $_POST['nombres']);
    $correo  = mysqli_real_escape_string($conn, $_POST['correo']);
    $rol     = mysqli_real_escape_string($conn, $_POST['tipo_usuario']); // ¡Este faltaba!

    $sql = "UPDATE usuario SET nombres='$nombres', correo='$correo', tipo_usuario='$rol' WHERE usuario_id=$id";
    
    if(mysqli_query($conn, $sql)) {
        $mensaje = "Usuario actualizado correctamente.";
    } else {
        $error = "Error al actualizar: " . mysqli_error($conn);
    }
}

// Obtenemos los datos (SELECT) para rellenar el formulario
$res = mysqli_query($conn, "SELECT * FROM usuario WHERE usuario_id=$id");
$u = mysqli_fetch_assoc($res);

// Si no existe, paramos
if(!$u) die("Usuario no encontrado.");

// Liberar memoria y Cerrar conexión SIEMPRE al final
mysqli_free_result($res);
mysqli_close($conn);
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modificar Usuario | GEMA Admin</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/admin.css">
</head>

<body>
    <div class="caja-principal" style="max-width: 500px;">
        <div class="admin-header">
            <h1 style="color: #1a5276;">Editar Usuario</h1>
            <p class="texto-rol">GESTIÓN DE ACCESOS</p>
        </div>

        <?php if($mensaje): ?>
        <div class="alerta alerta-exito">✅ <?php echo $mensaje; ?></div>
        <?php endif; ?>

        <?php if($error): ?>
        <div class="alerta alerta-error">⚠️ <?php echo $error; ?></div>
        <?php endif; ?>

        <form method="POST">
            <label class="label-bold">Nombre Completo:</label>
            <input type="text" name="nombres" class="input-gema" value="<?php echo htmlspecialchars($u['nombres']); ?>"
                required>

            <label class="label-bold">Correo Electrónico:</label>
            <input type="email" name="correo" class="input-gema" value="<?php echo htmlspecialchars($u['correo']); ?>"
                required>

            <label class="label-bold">Rol del Sistema:</label>
            <select name="tipo_usuario" class="select-gema">
                <option value="vendedor" <?php echo ($u['tipo_usuario'] == 'vendedor') ? 'selected' : ''; ?>>Vendedor
                </option>
                <option value="comprador" <?php echo ($u['tipo_usuario'] == 'comprador') ? 'selected' : ''; ?>>Comprador
                </option>
                <option value="administrador" <?php echo ($u['tipo_usuario'] == 'administrador') ? 'selected' : ''; ?>>
                    Administrador</option>
            </select>

            <button type="submit" class="boton-gema boton-admin" style="width: 100%; margin-top: 15px;">
                Guardar Cambios de Usuario
            </button>
        </form>

        <div class="separador-footer">
            <a href="listar.php" class="nav-link" style="color: #1a5276; font-weight: bold;">⬅ Volver al
                listado</a>
        </div>
    </div>
</body>

</html>