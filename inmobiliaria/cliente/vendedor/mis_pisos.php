<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarSesion(); 

// Seguridad básica de rol
if($_SESSION['tipo_usuario'] !== 'vendedor'){
    header("Location: ../menu.php");
    exit;
}

$usuario_id = $_SESSION['id'];

// Consultamos solo los pisos que pertenecen a este vendedor
$sql = "SELECT * FROM pisos WHERE usuario_id = $usuario_id";
$res = mysqli_query($conn, $sql);

//Cargamos los datos en un array
$pisos = mysqli_fetch_all($res, MYSQLI_ASSOC);

// Liberar recursos antes del HTML
mysqli_free_result($res);
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Propiedades | GEMA</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/cliente.css">
</head>

<body>
    <div class="caja-principal" style="max-width: 1000px;">
        <h1 class="titulo-hola">Mis Pisos Publicados</h1>

        <div style="text-align: right; margin-bottom: 20px;">
            <a href="alta_piso.php" class="boton-gema" style="width: auto; padding: 10px 20px;">➕ Publicar Nuevo</a>
        </div>

        <table class="tabla-personalizada">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Dirección</th>
                    <th>Zona</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($pisos as $p): ?>
                <tr>
                    <td>
                        <img src="../../img/<?php echo $p['imagen']; ?>" class="img-tabla" alt="Piso"
                            style="width: 80px; border-radius: 5px;">
                    </td>
                    <td><strong><?php echo htmlspecialchars($p['calle'] . ", " . $p['numero']); ?></strong></td>
                    <td><?php echo htmlspecialchars($p['zona']); ?></td>
                    <td><span class="precio-tag"
                            style="font-size: 1.1rem;"><?php echo number_format($p['precio'], 2, ',', '.'); ?> €</span>
                    </td>
                    <td>
                        <a href="modificar.php?codigo=<?php echo $p['Codigo_piso']; ?>" class="enlace-editar">Editar</a>
                        <span style="color: #ccc; margin: 0 5px;">|</span>

                        <a href="baja_piso.php?codigo=<?php echo $p['Codigo_piso']; ?>" class="enlace-borrar"
                            onclick="return confirm('¿Seguro que quieres borrar este anuncio?')">Borrar</a>
                    </td>
                </tr>
                <?php endforeach; ?>

                <?php if(empty($pisos)): ?>
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: #7f8c8d;">
                        No tienes pisos publicados todavía.
                    </td>
                </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <div class="separador-footer">
            <a href="../menu.php" class="nav-link" style="font-weight: bold;">🏠 Volver al menú de cliente</a>
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