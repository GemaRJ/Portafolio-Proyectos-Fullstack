<?php
require_once "../../config/sesiones.php";
require_once "../../config/conexion.php";
comprobarAdmin(); // Seguridad de sesión

$mensaje = '';
$error = '';

// Cargar usuarios para el select (Vendedores)
$sql_users = "SELECT usuario_id, nombres FROM usuario WHERE tipo_usuario='vendedor'";
$usuarios_res = mysqli_query($conn, $sql_users);

// Si falla la consulta de usuarios, mostramos error
if (!$usuarios_res) {
    die("Error al cargar propietarios: " . mysqli_error($conn));
}

$usuarios = mysqli_fetch_all($usuarios_res, MYSQLI_ASSOC);

// Procesar el formulario
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // Limpieza de variables de texto con real_escape_string
    $calle  = mysqli_real_escape_string($conn, $_POST['calle']);
    $puerta = mysqli_real_escape_string($conn, $_POST['puerta']);
    $zona   = mysqli_real_escape_string($conn, $_POST['zona']);
    
    // Los números se fuerzan con intval o floatval (más seguro que escape_string para números)
    $numero = intval($_POST['numero']);
    $piso   = intval($_POST['piso']);
    $cp     = intval($_POST['cp']);
    $metros = intval($_POST['metros']);
    $usuario_id = intval($_POST['usuario_id']);
    $precio = floatval($_POST['precio']);
    
    // Gestión de Imagen
    $imagen = 'default.jpg';
    if(isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0){
        // Renombro con tiempo para evitar duplicados
        $imagen = time() . "_" . $_FILES['imagen']['name'];
        
    
        if(move_uploaded_file($_FILES['imagen']['tmp_name'], "../../img/pisos/".$imagen)){
     
        } else {
            $error = "La imagen no se pudo subir, se usará la por defecto.";
            $imagen = 'default.jpg'; // Reset por si acaso
        }
    }

    // Insertar en Base de Datos
    $sql = "INSERT INTO pisos (calle, numero, piso, puerta, cp, metros, zona, precio, imagen, usuario_id)
            VALUES ('$calle','$numero','$piso','$puerta','$cp','$metros','$zona','$precio','$imagen','$usuario_id')";
    
    if(mysqli_query($conn, $sql)){
        $mensaje = "Piso registrado correctamente";
        
    } else {
        $error = "Error al registrar piso: " . mysqli_error($conn);
    }
}

// Liberar memoria y Cerrar conexión SIEMPRE al final de la lógica PHP

mysqli_free_result($usuarios_res); 
mysqli_close($conn); 
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alta Piso | Administración</title>
    <link rel="stylesheet" href="../../css/estilos.css">
    <link rel="stylesheet" href="../../css/admin.css">
</head>

<body>

    <div class="caja-principal" style="max-width: 650px;">
        <div class="admin-header">
            <h1 style="color: #1a5276;">Dar de Alta Piso</h1>
            <p class="texto-rol">GESTIÓN ADMINISTRATIVA</p>
        </div>

        <?php if($mensaje): ?><div class="alerta alerta-exito">✅ <?php echo $mensaje; ?></div><?php endif; ?>
        <?php if($error): ?><div class="alerta alerta-error">⚠️ <?php echo $error; ?></div><?php endif; ?>

        <form method="POST" enctype="multipart/form-data">

            <label class="label-bold">Calle:</label>
            <input type="text" name="calle" class="input-gema" placeholder="Calle" required>

            <div class="grupo-triple">
                <div>
                    <label class="label-bold">Nº:</label>
                    <input type="number" name="numero" class="input-gema" placeholder="Número" required>
                </div>
                <div>
                    <label class="label-bold">Piso:</label>
                    <input type="number" name="piso" class="input-gema" placeholder="Piso" required>
                </div>
                <div>
                    <label class="label-bold">Puerta:</label>
                    <input type="text" name="puerta" class="input-gema" placeholder="Puerta" required>
                </div>
            </div>

            <div class="grupo-doble">
                <div>
                    <label class="label-bold">C.P.:</label>
                    <input type="number" name="cp" class="input-gema" placeholder="Código Postal" required>
                </div>
                <div>
                    <label class="label-bold">Metros:</label>
                    <input type="number" name="metros" class="input-gema" placeholder="Metros m²" required>
                </div>
            </div>

            <div class="grupo-doble">
                <div>
                    <label class="label-bold">Zona:</label>
                    <input type="text" name="zona" class="input-gema" placeholder="Zona">
                </div>
                <div>
                    <label class="label-bold">Precio (€):</label>
                    <input type="number" step="0.01" name="precio" class="input-gema" placeholder="Precio" required>
                </div>
            </div>

            <label class="label-bold">Propietario Asignado:</label>
            <select name="usuario_id" class="select-gema" required>
                <option value="">Seleccionar propietario</option>
                <?php foreach($usuarios as $u): ?>
                <option value="<?php echo $u['usuario_id']; ?>"><?php echo $u['nombres']; ?></option>
                <?php endforeach; ?>
            </select>

            <div style="text-align: left; margin: 20px 0;">
                <label class="label-bold">Imagen del inmueble:</label>
                <input type="file" name="imagen" accept="image/*" class="input-gema" style="border:none; padding:0;">
            </div>

            <button type="submit" class="boton-gema boton-admin" style="width: 100%; padding: 15px;">
                Registrar Piso
            </button>
        </form>

        <div class="separador-footer">
            <a href="listar.php" class="nav-link" style="color: #1a5276; font-weight: bold;">⬅ Volver a la lista</a>
        </div>
    </div>


</body>

</html>