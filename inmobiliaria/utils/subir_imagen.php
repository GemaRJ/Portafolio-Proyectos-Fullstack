<?php

function subir_imagen($archivo, $ruta_destino, $nombre_default='default.jpg') {
    if(isset($archivo) && $archivo['error'] === 0) {
      
        $permitidos = ['image/jpeg','image/png','image/gif'];
        if(!in_array($archivo['type'], $permitidos)){
            return $nombre_default;
        }

     
        $nombre = time() . "_" . basename($archivo['name']);
        $destino = rtrim($ruta_destino, '/').'/'.$nombre;

        if(move_uploaded_file($archivo['tmp_name'], $destino)) {
            return $nombre;
        } else {
            return $nombre_default;
        }
    } else {
        return $nombre_default;
    }
}