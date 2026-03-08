<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";

// Usamos comprobarAdmin() para que solo entre el jefe
comprobarAdmin(); 

$mensaje = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // Limpiamos TODAS las variables, incluido el select
    $nombres = mysqli_real_escape_string($conn, $_POST['nombres']);
    $correo = mysqli_real_escape_string($conn, $_POST['correo']);
    $tipo_usuario = mysqli_real_escape_string($conn, $_POST['tipo_usuario']); // ¡Este faltaba!
    
    // La clave se encripta
    $clave = password_hash($_POST['clave'], PASSWORD_DEFAULT);

    // Comprobamos si existe el correo
    $check = mysqli_query($conn, "SELECT * FROM usuario WHERE correo='$correo'");
    
    if(mysqli_num_rows($check) > 0){
        $error = "Ese correo electrónico ya está registrado.";
    } else {
        // Insertamos
        $sql = "INSERT INTO usuario (nombres, correo, clave, tipo_usuario) 
                VALUES ('$nombres','$correo','$clave','$tipo_usuario')";
        
        if(mysqli_query($conn, $sql)){
            $mensaje = "Usuario registrado correctamente.";
        } else {
            $error = "Error técnico al registrar: " . mysqli_error($conn);
        }
    }
    
    // Liberamos la memoria de la comprobación
    mysqli_free_result($check);
    
    // Cerrar conexión siempre antes de salir
    mysqli_close($conn);
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alta de Usuario | GEMA Admin</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/admin.css">
</head>

<body>
    <div class="caja-principal" style="max-width: 500px; margin-top: 50px;">
        <div class="admin-header">
            <h1 class="titulo-hola" style="color: #1a5276;">Nuevo Usuario</h1>
            <p class="texto-rol">REGISTRO INTERNO DE PERSONAL</p>
        </div>

        <?php if($mensaje): ?>
        <div class="alerta alerta-exito">✅ <?php echo $mensaje; ?></div>
        <?php endif; ?>

        <?php if($error): ?>
        <div class="alerta alerta-error">⚠️ <?php echo $error; ?></div>
        <?php endif; ?>

        <?php if(!$mensaje): ?>
        <form method="POST">
            <div style="text-align: left; margin-bottom: 15px;">
                <label class="label-bold">Nombre Completo:</label>
                <input type="text" name="nombres" class="input-gema" placeholder="Ej: Gema Rodríguez" required>
            </div>

            <div style="text-align: left; margin-bottom: 15px;">
                <label class="label-bold">Correo Electrónico:</label>
                <input type="email" name="correo" class="input-gema" placeholder="correo@ejemplo.com" required>
            </div>

            <div style="text-align: left; margin-bottom: 15px;">
                <label class="label-bold">Contraseña:</label>
                <input type="password" name="clave" class="input-gema" placeholder="••••••••" required>
            </div>

            <div style="text-align: left; margin-bottom: 25px;">
                <label class="label-bold" style="color: #1a5276;">Asignar Rol del Usuario:</label>
                <select name="tipo_usuario" class="input-gema" required>
                    <option value="vendedor">Vendedor (Gestiona sus pisos)</option>
                    <option value="comprador">Comprador (Busca pisos)</option>
                    <option value="administrador">Administrador (Control Total)</option>
                </select>
            </div>

            <button type="submit" class="boton-admin" style="width: 100%;">
                Registrar Usuario
            </button>
        </form>
        <?php endif; ?>

        <div class="separador-footer" style="margin-top: 25px;">
            <a href="usuarios_listar.php" class="nav-link">⬅ Volver al listado</a>
        </div>
    </div>

    <footer class="footer-gema">
        <p class="footer-logo">🏠 GEMA Admin</p>
        <p class="footer-subtexto">Gestión Privada de Cuentas</p>
        <div class="footer-copyright">
            &copy; <?php echo date('Y'); ?> Panel de Administración GEMA.
        </div>
    </footer>
</body>

</html>