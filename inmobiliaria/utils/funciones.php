<?php

function esc($valor) {
    return htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
}


function formato_precio($precio) {
    return number_format($precio, 2, ',', '.') . ' €';
}


function redirigir($url) {
    header("Location: $url");
    exit;
}

function mensaje_exito($texto) {
    return "<div class='alert alert-success'>" . esc($texto) . "</div>";
}


function mensaje_error($texto) {
    return "<div class='alert alert-error'>" . esc($texto) . "</div>";
}