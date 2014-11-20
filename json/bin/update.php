<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}

include '../../config/dbconnect.php';

$id = $_POST['id'];
$name = $_POST['name'];
$description = $_POST['description'];
$dc = $_SESSION['dc']; 

$query = "UPDATE bin SET " . 
        "name='" . $name . "'," .
        "description='" . $description . "'," . 
        "dc='" . $dc . "'," . 
        "updateddate='" . date('Y-m-d h:i:s') . "'," .
        "updatedby='" . $_SESSION['login'] . "'" .
        " WHERE id=" . $id; 
$rs = mysql_query($query);
if($rs){
   echo '{success:true,Message:"Update successfully"}';             
}else{
    echo '{success:false,Message:"' . mysql_error() . '"}';            
}
mysql_close();
?>
