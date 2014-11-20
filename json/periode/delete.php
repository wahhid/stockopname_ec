<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$id=$_POST['id'];
$query = "DELETE FROM periode WHERE id=" . $id;
$result = delete($query);
if($result['success']){
    echo '{success:true,Message:"Delete Successfully"}';
}else{
    echo '{success:false,errorMessage:"' . $result['error'] . '"}';
}
?>
