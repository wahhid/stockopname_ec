<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}

include '../../config/dbconnect.php';
$id = $_POST['id'];
$periodedate = $_POST['periodedate'];
$description = $_POST['description'];

$query = "UPDATE periode SET periodedate='" . date('Y-m-d',  strtotime($periodedate)) . "'," .
        "description='" . $description . "'," .
        "updateddate='" . date('Y-m-d h:i:s')  . "'," . 
        "updatedby='" . $_SESSION['login'] . "' ".
        "WHERE id=" . $id;
$rs = mysql_query($query);
if($rs){
    echo '{success:true,Message:"Update successfully"}';             
}else{    
    echo '{success:false,errorMessage:"' . mysql_error() . '"}';                    
}
mysql_close();
?>
