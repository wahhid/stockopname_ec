<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$name = $_POST['name'];
$description = $_POST['description'];
$dc = $_SESSION['dc']; 


$query = "INSERT INTO bin (name,description,dc,createddate,createdby,updateddate,updatedby) VALUES (" .
        "'" .  $name  . "'," .
        "'" .  $description  . "'," .
        "'" .  $dc  . "'," .
        "'" .  date('Y-m-d h:i:s') . "'," .
        "'" .  $_SESSION['login']  . "'," .
        "'" .  date('Y-m-d h:i:s') . "'," .
        "'" .  $_SESSION['login']  . "'" .
        ")";
$rs = mysql_query($query);
if (!$rs) {
    echo '{success: false,message:"' . mysql_error() . '"}';    
}else{    
    echo '{success: true,message:"Create Successfully"}';
}
mysql_close();
?>
