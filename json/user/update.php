<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$username = $_POST['username'];
$fullname = $_POST['fullname'];
$password = $_POST['password'];
$usertype = $_POST['usertype'];

$query = "UPDATE user SET fullname='" . $fullname ."',password='" . $password . "',usertype=" . $usertype . " WHERE username='" . $username . "'"; 
$rs = mysql_query($query);
if($rs){
   echo "{success:true,Message:\"Update successfully\"}";             
}else{
    echo "{success:false,Message:\"Updating data error\"}";            
}
mysql_close();
?>
