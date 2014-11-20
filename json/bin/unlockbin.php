<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}

include '../../config/dbconnect.php';

$id = $_POST['id'];

$query = "UPDATE bin SET status=0" . " WHERE id=" . $id; 
$rs = mysql_query($query);
if($rs){
   echo '{success:true,Message:"Unlock Successfully"}';             
}else{
    echo '{success:false,Message:"' . mysql_error() . '"}';            
}
mysql_close();
?>
