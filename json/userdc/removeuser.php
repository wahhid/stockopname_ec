<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,errorMessage:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$id=$_POST['id'];
$query = "DELETE FROM userdc WHERE id=" . $id;

$rs=  mysql_query($query);
if($rs){
    echo '{success:true,Message:"Delete User Site Successfully"}';
}else{
     echo '{success:false,errorMessage:"' . mysql_error() . '"}';            
}
mysql_close();
?>
