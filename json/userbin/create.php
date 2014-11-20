<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$username = $_POST['username'];
$bin = $_POST['bin'];
$periode = $_POST['periode'];


$query = "INSERT userbin (username,bin,periode) VALUES ('" . $username . "'," . $bin . "," . $periode . ")"; 
$rs = mysql_query($query);
if($rs){
   echo '{success:true,message:"Create successfully"}';             
}else{
    if(mysql_errno() == 1062){
        echo '{success:false,errorMessage:"User Bin already exist"}';            
    }else{
        echo '{success:false,errorMessage:"' . mysql_error() . '"}';                
    }
    
}
mysql_close();
?>
