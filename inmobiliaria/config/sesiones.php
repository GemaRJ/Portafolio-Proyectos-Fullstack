<?php
session_start();


function comprobarSesion() {
    if (!isset($_SESSION['id'])) {
        header("Location: ../autenticacion/login.php");
        exit;
    }
}


function comprobarAdmin() {
    comprobarSesion();

    if ($_SESSION['tipo_usuario'] !== 'administrador') {
        header("Location: ../index.php");
        exit;
    }
}


function comprobarCliente() {
    comprobarSesion();

    if ($_SESSION['tipo_usuario'] !== 'comprador' && $_SESSION['tipo_usuario'] !== 'vendedor') {
        header("Location: ../index.php");
        exit;
    }
}