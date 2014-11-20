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


$query = "INSERT user (username,fullname,password,usertype) VALUES ('" . $username . "','" . $fullname . "','" . $password . "'," . $usertype . ")"; 
$rs = mysql_query($query);
if($rs){
   echo '{success:true,message:"Create successfully"}';             
}else{
    if(mysql_errno() == 1062){
        echo '{success:false,errorMessage:"User already exist"}';            
    }else{
        echo '{success:false,errorMessage:"' . mysql_error() . '"}';                
    }
    
}
mysql_close();
?>
