<?php
header("Access-Control-Allow-Origin: *");
if (isset($_GET['id'])) {
    header("Content-Type: image/png");
    echo file_get_contents("https://fifa17.content.easports.com/fifa/fltOnlineAssets/CC8267B6-0817-4842-BB6A-A20F88B05418/2017/fut/playerheads/html5/single/512x512/p" . $_GET['id'] . ".png");
}