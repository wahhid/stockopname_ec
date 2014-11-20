<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$username = $_POST['username'];
$query = "UPDATE user SET deleted=1 WHERE username='" . $username  ."'";
$rs = mysql_query($query);      
if($rs){
    echo '{success:true,Message:"Delete User successfully"}';                 
}else{
    echo '{success:true,errorMessage:"' . mysql_error() . '"}';                 
}

mysql_close();
?>
