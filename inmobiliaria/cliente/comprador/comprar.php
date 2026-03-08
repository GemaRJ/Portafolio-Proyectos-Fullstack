<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";

// Usamos comprobarCliente (o comprobarSesion si no tienes la otra)
if(function_exists('comprobarCliente')){
    comprobarCliente();
} else {
    comprobarSesion();
}

$usuario_id = $_SESSION['id'] ?? 0;
$mensaje_exito = false;
$error_sql = '';

// Validación fuerte del Código
$codigo = intval($_GET['codigo'] ?? 0);

if ($codigo <= 0 || !$usuario_id) {
    // Cerramos antes de morir
    mysqli_close($conn);
    die("Datos insuficientes para procesar la compra.");
}

// Obtenemos datos del piso
$sql_piso = "SELECT precio, calle FROM pisos WHERE Codigo_piso=$codigo";
$res = mysqli_query($conn, $sql_piso);
$piso = mysqli_fetch_assoc($res);

if(!$piso) {
    mysqli_close($conn);
    die("Piso no encontrado.");
}

// Guardamos datos en variables antes de liberar memoria
$precio_final = $piso['precio'];
$nombre_piso = $piso['calle'];

// Liberamos la memoria del SELECT
mysqli_free_result($res);

// Insertamos la compra en la tabla 'comprados'
$sql_insert = "INSERT INTO comprados (Codigo_piso, Precio_final, usuario_comprador) VALUES (
    '$codigo',
    '$precio_final',
    '$usuario_id'
)";

if(mysqli_query($conn, $sql_insert)){
    $mensaje_exito = true;
  
} else {
    $error_sql = mysqli_error($conn);
}

// Cerrar conexión siempre
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Compra | GEMA</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/cliente.css">
</head>

<body>

    <div class="caja-principal">
        <?php if($mensaje_exito): ?>
        <div class="panel-header vendedor-header">
            <h1 class="titulo-hola">¡Enhorabuena!</h1>
            <p class="texto-rol">PROCESO FINALIZADO</p>
        </div>

        <div class="alerta alerta-exito" style="font-size: 1.2rem; padding: 30px;">
            ✅ Has adquirido la propiedad en <br>
            <strong><?php echo htmlspecialchars($nombre_piso); ?></strong> <br>
            por un importe de <strong><?php echo number_format($precio_final, 2, ',', '.'); ?> €</strong>.
        </div>

        <p style="margin: 20px 0; color: #666;">Se ha generado un registro de compra en tu perfil.</p>

        <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
            <a href="buscar_pisos.php" class="boton-gema" style="width: auto; padding: 12px 30px;">
                Seguir buscando
            </a>
            <a href="../menu.php" class="boton-outline" style="padding: 12px 30px;">
                Ir al Menú
            </a>
        </div>

        <?php else: ?>
        <div class="panel-header" style="border-bottom: 4px solid #b03a2e;">
            <h1 class="titulo-hola" style="color: #b03a2e;">Error en la transacción</h1>
        </div>

        <div class="alerta alerta-error">
            ⚠️ No hemos podido procesar la compra: <?php echo $error_sql; ?>
        </div>

        <a href="buscar_pisos.php" class="boton-gema" style="margin-top: 20px;">Volver a intentarlo</a>
        <?php endif; ?>

        <div class="separador-footer">
            <p class="info-item">Gracias por confiar en GEMA Inmuebles</p>
        </div>
    </div>

    <footer class="footer-gema">
        <p class="footer-logo">🏠 GEMA Inmuebles</p>
        <p class="footer-subtexto">Tu agencia de confianza desde 2026</p>
        <div class="footer-copyright">
            &copy; <?php echo date('Y'); ?> Todos los derechos reservados.
        </div>
    </footer>

</body>

</html>