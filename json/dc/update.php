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

$query = "UPDATE dc SET name='" . $name .  "' WHERE id='" . $id . "'";
$rs = mysql_query($query);
if($rs){
    echo '{success:true,Message:"Update Successfully"}';
}else{
    echo '{success:false,errorMessage:"' . mysql_error() . '"}';
}
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
