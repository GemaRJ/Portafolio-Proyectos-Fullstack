<?php
require_once "../config/conexion.php";

$mensaje = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Limpiamos TODAS las variables (incluido el select)
    $nombres = mysqli_real_escape_string($conn, $_POST['nombres']);
    $correo = mysqli_real_escape_string($conn, $_POST['correo']);
    $tipo_usuario = mysqli_real_escape_string($conn, $_POST['tipo_usuario']); // ¡Este faltaba!
    
    // La clave se encripta, no hace falta escape
    $clave = password_hash($_POST['clave'], PASSWORD_DEFAULT);

    // Comprobamos si el correo existe
    $sql_check = "SELECT * FROM usuario WHERE correo='$correo'";
    $check = mysqli_query($conn, $sql_check);

    if(mysqli_num_rows($check) > 0){
        $error = "Ese correo electrónico ya está registrado.";
    } else {
        // Insertamos
        $sql = "INSERT INTO usuario (nombres, correo, clave, tipo_usuario) 
                VALUES ('$nombres', '$correo', '$clave', '$tipo_usuario')";
        
        if(mysqli_query($conn, $sql)){
            $mensaje = "¡Registro completado con éxito! Ya puedes iniciar sesión.";
        } else {
            $error = "Hubo un problema al crear tu cuenta: " . mysqli_error($conn);
        }
    }
    
    // Cerrar conexión siempre al final
    mysqli_close($conn);
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Usuario | GEMA</title>
    <link rel="stylesheet" href="../css/estilos.css">
</head>

<body class="cuerpo-centrado">

    <div class="caja-principal" style="max-width: 500px;">

        <div class="registro-header">
            <h1>Crea tu Cuenta</h1>
            <p>Únete a nuestra inmobiliaria para comprar o vender pisos.</p>
        </div>

        <?php if($mensaje): ?>
        <div class="alerta alerta-exito">
            ✅ <?php echo $mensaje; ?>
            <br>
            <a href="login.php" style="color: green; font-weight: bold;">Ir al Login</a>
        </div>
        <?php endif; ?>

        <?php if($error): ?>
        <div class="alerta alerta-error">
            ⚠️ <?php echo $error; ?>
        </div>
        <?php endif; ?>

        <?php if(!$mensaje): ?>
        <form method="POST">
            <div class="form-grupo">
                <label>Nombre Completo:</label>
                <input type="text" name="nombres" class="input-gema" placeholder="Ej: Gema Rodríguez" required>
            </div>

            <div class="form-grupo">
                <label>Correo Electrónico:</label>
                <input type="email" name="correo" class="input-gema" placeholder="correo@ejemplo.com" required>
            </div>

            <div class="form-grupo">
                <label>Contraseña:</label>
                <input type="password" name="clave" class="input-gema" placeholder="Mínimo 4 caracteres" required>
            </div>

            <div class="form-grupo">
                <label style="color: #b03a2e;">¿Qué deseas hacer?</label>
                <select name="tipo_usuario" class="select-gema" required>
                    <option value="comprador">Quiero comprar un piso</option>
                    <option value="vendedor">Quiero vender mi piso</option>
                </select>
            </div>

            <button type="submit" class="boton-gema" style="width: 100%; margin-top: 15px;">
                Registrarme
            </button>
        </form>
        <?php endif; ?>
        <div class="registro-footer">
            <p style="color: #666; font-size: 0.95rem;">
                ¿Ya tienes cuenta? <a href="login.php">Entra aquí</a>
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