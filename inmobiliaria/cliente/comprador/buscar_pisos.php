<?php
require_once "../../config/conexion.php";
require_once "../../config/sesiones.php";

// Usamos comprobarCliente si existe, si no comprobarSesion
if(function_exists('comprobarCliente')){
    comprobarCliente();
} else {
    comprobarSesion();
}

$zona = $_GET['zona'] ?? '';
$precio_max = $_GET['precio_max'] ?? '';

$sql = "SELECT * FROM pisos WHERE 1=1";

if($zona !== '') {
    // Seguridad
    $zona_safe = mysqli_real_escape_string($conn, $zona);
    $sql .= " AND zona LIKE '%$zona_safe%'";
}

if($precio_max !== '') {
    // Para números usamos floatval o intval
    $precio_safe = floatval($precio_max);
    $sql .= " AND precio <= $precio_safe";
}

$res = mysqli_query($conn, $sql);

// Guardamos resultados en array para liberar la BD
$pisos = [];
if($res){
    $pisos = mysqli_fetch_all($res, MYSQLI_ASSOC);
    mysqli_free_result($res);
}

// Cerrar conexión siempre
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explorar Propiedades | GEMA</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/cliente.css">
</head>

<body>

    <div class="caja-principal" style="max-width: 1000px;">
        <div class="panel-header vendedor-header">
            <h1 class="titulo-hola">Explorar Propiedades</h1>
            <p class="texto-rol">BUSCADOR DE INMUEBLES</p>
        </div>

        <div class="form-seccion" style="background: #fdf2f2; padding: 25px; border-radius: 15px; margin-bottom: 40px;">
            <form method="GET" action=""
                style="display: flex; gap: 15px; justify-content: center; align-items: flex-end; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px;">
                    <label class="label-bold">Zona:</label>
                    <input type="text" name="zona" class="input-gema" value="<?php echo htmlspecialchars($zona); ?>"
                        placeholder="Ej: Playa">
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <label class="label-bold">Precio Máximo:</label>
                    <input type="number" name="precio_max" class="input-gema"
                        value="<?php echo htmlspecialchars($precio_max); ?>" placeholder="Ej: 500000">
                </div>
                <button type="submit" class="boton-gema" style="width: auto; margin-bottom: 15px; padding: 12px 30px;">
                    Filtrar Resultados
                </button>
            </form>
        </div>

        <div class="contenedor-grid">
            <?php if(!empty($pisos)): ?>
            <?php foreach($pisos as $piso): ?>
            <div class="piso-card">
                <div class="piso-img-container">
                    <img src="../../img/<?php echo $piso['imagen']; ?>" alt="Propiedad">
                </div>

                <div style="padding: 20px; text-align: left;">
                    <span class="precio-tag">
                        <?php echo number_format($piso['precio'], 0, ',', '.'); ?> €
                    </span>
                    <p style="margin: 15px 0;"><strong><?php echo htmlspecialchars($piso['calle']); ?></strong></p>
                    <p class="info-item" style="font-size: 0.9rem;">📍 Zona:
                        <?php echo htmlspecialchars($piso['zona']); ?></p>

                    <a href="ver_piso.php?codigo=<?php echo $piso['Codigo_piso']; ?>" class="boton-gema"
                        style="display: block; text-align: center; margin-top: 15px;">
                        Ver Detalles
                    </a>
                </div>
            </div>
            <?php endforeach; ?>
            <?php else: ?>
            <div style="grid-column: 1 / -1; padding: 50px;">
                <p style="color: #999; font-size: 1.2rem;">No se encontraron propiedades con esos criterios.</p>
            </div>
            <?php endif; ?>
        </div>

        <div class="separador-footer">
            <a href="../menu.php" class="nav-link" style="font-weight: bold;">🏠 Volver al menú principal</a>
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