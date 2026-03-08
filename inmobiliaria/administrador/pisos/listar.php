<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarSesion();

// SEGURIDAD: Solo admin
if($_SESSION['tipo_usuario'] !== 'administrador'){
    header("Location: ../menu.php");
    exit;
}

// Consulta de todos los pisos
$sql = "SELECT * FROM pisos ORDER BY Codigo_piso DESC";
$res = mysqli_query($conn, $sql);
$pisos = mysqli_fetch_all($res, MYSQLI_ASSOC);

// Liberar memoria y cerrar
mysqli_free_result($res);
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Listado General | GEMA Admin</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/admin.css">
    <style>
    .img-miniatura {
        width: 70px;
        height: 50px;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
    </style>
</head>

<body>
    <div class="caja-principal" style="max-width: 1100px;">
        <div class="admin-header">
            <h1 class="titulo-hola">Gestión de Chalets</h1>
            <p class="texto-rol">ADMINISTRADOR: <?php echo strtoupper($_SESSION['nombre'] ?? 'ADMIN'); ?></p>
        </div>

        <table class="tabla-personalizada">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>ID</th>
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
                        <img src="../../img/<?php echo $p['imagen']; ?>" class="img-miniatura"
                            onerror="this.src='../../img/default.jpg'">
                    </td>
                    <td>#<?php echo $p['Codigo_piso']; ?></td>
                    <td><?php echo htmlspecialchars($p['calle'] . ", " . $p['numero']); ?></td>
                    <td><?php echo htmlspecialchars($p['zona']); ?></td>
                    <td><?php echo number_format($p['precio'], 0, ',', '.'); ?> €</td>
                    <td>
                        <a href="modificar.php?codigo=<?php echo $p['Codigo_piso']; ?>" class="enlace-editar">Editar</a>
                        <span style="color: #ccc; margin: 0 5px;">|</span>
                        <a href="baja.php?codigo=<?php echo $p['Codigo_piso']; ?>" class="enlace-borrar"
                            onclick="return confirm('¿Seguro que quieres eliminar este piso y su imagen?')">Borrar</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <div class="separador-footer">
            <a href="../menu.php" class="nav-link">🏠 Volver al Panel</a>
        </div>
    </div>
</body>

</html>