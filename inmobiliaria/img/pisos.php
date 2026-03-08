<?php
require_once "../config/conexion.php";

// Traer todos los pisos con el nombre del propietario
$sql = "SELECT p.*, u.nombres AS propietario 
        FROM pisos p 
        LEFT JOIN usuario u ON p.usuario_id = u.usuario_id";
$res = mysqli_query($conn, $sql);
$pisos = mysqli_fetch_all($res, MYSQLI_ASSOC);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Listado de Pisos</title>
    <link rel="stylesheet" href="../css/estilos.css">
    <style>
    /* Solo estilos básicos para mostrar las tarjetas de pisos */
    .pisos-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

    .piso-card {
        border: 1px solid #ccc;
        padding: 10px;
        width: 250px;
        text-align: center;
        background-color: #f9f9f9;
    }

    .piso-card img {
        width: 100%;
        height: 150px;
        object-fit: cover;
    }
    </style>
</head>

<body>
    <h1>Listado de Pisos</h1>
    <div class="pisos-container">
        <?php foreach($pisos as $p): ?>
        <div class="piso-card">
            <img src="../img/pisos/<?php echo $p['imagen'] ?: 'default.jpg'; ?>" alt="Piso">
            <h3><?php echo $p['calle'] . ', ' . $p['numero']; ?></h3>
            <p>Piso: <?php echo $p['piso']; ?> | Puerta: <?php echo $p['puerta']; ?></p>
            <p>Zona: <?php echo $p['zona']; ?></p>
            <p>Metros: <?php echo $p['metros']; ?> m²</p>
            <p>Precio: €<?php echo $p['precio']; ?></p>
            <p>Propietario: <?php echo $p['propietario']; ?></p>
        </div>
        <?php endforeach; ?>
    </div>
</body>

</html>