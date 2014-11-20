<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$username = $_POST['username'];
$dc = $_POST['dc'];

$query = "INSERT INTO userdc (username,dc) VALUES (" .
        "'" .  $username  . "'," .
        "'" .  $dc  . "'" .
        ")";
$rs = mysql_query($query);
if (!$rs) {
    if(mysql_errno() == 1062){
        echo '{success: false,errorMessage:"User already exist"}';    
    }else{
        echo '{success: false,errorMessage:"' . mysql_error() . '"}';    
    }    
}else{    
    echo '{success: true,message:"Create Successfully"}';
}
mysql_close();
?>
