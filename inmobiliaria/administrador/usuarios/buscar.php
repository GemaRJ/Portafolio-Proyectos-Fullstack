<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarAdmin();

$busqueda = $_GET['busqueda'] ?? '';
$pisos = [];

if($busqueda){
    // Seguridad 
    $busqueda_safe = mysqli_real_escape_string($conn, $busqueda);
    
    // Consulta buscando en Calle, Zona o Nombre del Propietario
    $sql = "SELECT p.*, u.nombres as propietario 
            FROM pisos p 
            LEFT JOIN usuario u ON p.usuario_id = u.usuario_id
            WHERE p.calle LIKE '%$busqueda_safe%'
               OR p.zona LIKE '%$busqueda_safe%'
               OR u.nombres LIKE '%$busqueda_safe%'";
               
    $res = mysqli_query($conn, $sql);
    
    if($res){
        $pisos = mysqli_fetch_all($res, MYSQLI_ASSOC);
        mysqli_free_result($res); // Liberamos memoria
    }
}

// Cerrar conexión siempre antes del HTML
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Buscar Pisos | GEMA Admin</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/admin.css">
</head>

<body>
    <div class="caja-principal" style="max-width: 1000px;">
        <div class="admin-header">
            <h1 style="color: #1a5276;">Buscador de Inmuebles</h1>
            <a href="listar.php" class="boton-admin" style="width: auto;">⬅ Volver al listado</a>
        </div>

        <form method="GET" style="margin-bottom: 30px; display:flex; gap:10px;">
            <input type="text" name="busqueda" class="input-gema" placeholder="Escribe calle, zona o propietario..."
                value="<?php echo htmlspecialchars($busqueda); ?>" required style="margin:0;">
            <button type="submit" class="boton-gema" style="width: auto; margin:0;">🔍 Buscar</button>
        </form>

        <?php if($busqueda): ?>
        <h3 style="color: #666; margin-bottom: 20px;">
            Resultados para: <strong>"<?php echo htmlspecialchars($busqueda); ?>"</strong>
        </h3>

        <?php if(!empty($pisos)): ?>
        <table class="tabla-personalizada tabla-admin">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Calle</th>
                    <th>Nº</th>
                    <th>Piso</th>
                    <th>Zona</th>
                    <th>Precio</th>
                    <th>Propietario</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($pisos as $p): ?>
                <tr>
                    <td>#<?php echo $p['Codigo_piso']; ?></td>
                    <td><?php echo htmlspecialchars($p['calle']); ?></td>
                    <td><?php echo $p['numero']; ?></td>
                    <td><?php echo $p['piso']; ?></td>
                    <td><?php echo htmlspecialchars($p['zona']); ?></td>
                    <td><strong><?php echo number_format($p['precio'], 0, ',', '.'); ?> €</strong></td>
                    <td><?php echo htmlspecialchars($p['propietario'] ?? 'Sin asignar'); ?></td>
                    <td>
                        <a href="modificar.php?codigo=<?php echo $p['Codigo_piso']; ?>" class="enlace-editar">Editar</a>
                        |
                        <a href="baja.php?codigo=<?php echo $p['Codigo_piso']; ?>" class="enlace-borrar"
                            onclick="return confirm('¿Seguro que quieres eliminar este piso?')">Eliminar</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php else: ?>
        <div class="alerta alerta-error">❌ No se encontraron pisos que coincidan con tu búsqueda.</div>
        <?php endif; ?>
        <?php endif; ?>
    </div>

    <footer class="footer-gema">
        <p class="footer-logo">🏠 GEMA Admin</p>
        <div class="footer-copyright">&copy; <?php echo date('Y'); ?> Panel de Administración</div>
    </footer>
</body>

</html>