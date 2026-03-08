<?php
require_once "../config/conexion.php";
session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    

    $correo = mysqli_real_escape_string($conn, $_POST['correo']);
    $clave = $_POST['clave']; 

    // Hacemos la consulta
    $sql = "SELECT * FROM usuario WHERE correo='$correo'";
    $res = mysqli_query($conn, $sql);
    
    // Intentamos sacar al usuario
    $usuario = mysqli_fetch_assoc($res);

    // Verificamos si existe el usuario Y si la contraseña coincide
    if ($usuario && password_verify($clave, $usuario['clave'])) {
        
        // Guardamos datos en sesión
        $_SESSION['id'] = $usuario['usuario_id']; 
        $_SESSION['nombre'] = $usuario['nombres']; 
        $_SESSION['tipo_usuario'] = $usuario['tipo_usuario']; // (Corregido: tenía ;;)

        // CERRAR CONEXIÓN SIEMPRE ANTES DE IRNOS
       
        mysqli_free_result($res); // Liberamos la memoria de la consulta
        mysqli_close($conn);      // Cerramos la conexión a la BD

        // Redirección según rol
        if ($usuario['tipo_usuario'] == 'administrador') {
            header("Location: ../administrador/menu.php");
        } else {
            header("Location: ../cliente/menu.php");
        }
        exit; // Importante para que no se ejecute nada más
        
    } else {
        // Login fallido
        $error = "Usuario o clave incorrectos";
    }
    
    // Si hubo error y no nos fuimos, cerramos la conexión aquí también. 
    mysqli_close($conn);
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión | GEMA Inmobiliaria</title>
    <link rel="stylesheet" href="../css/estilos.css">
</head>

<body class="cuerpo-centrado">

    <div class="caja-principal" style="max-width: 450px;">
        <div class="login-header">
            <h1>Bienvenido</h1>
            <p>Ingresa tus credenciales para continuar</p>
        </div>

        <?php if($error): ?>
        <div class="alerta alerta-error">
            <?php echo $error; ?>
        </div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-grupo">
                <label>Correo Electrónico</label>
                <input type="email" name="correo" class="input-gema" placeholder="ejemplo@correo.com" required>
            </div>

            <div class="form-grupo">
                <label>Contraseña</label>
                <input type="password" name="clave" class="input-gema" placeholder="••••••••" required>
            </div>

            <button type="submit" class="boton-gema" style="width: 100%; margin-top: 10px;">
                Ingresar
            </button>
        </form>

        <div class="login-footer">
            <p>¿No tienes cuenta? <a href="registro.php">Regístrate aquí</a></p>
            <p style="margin-top: 15px;">
                <a href="../index.php" style="color: #7f8c8d; font-weight: normal; font-size: 0.85rem;">🏠 Volver a la
                    página principal</a>
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