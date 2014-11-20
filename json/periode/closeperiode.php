<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

function periode($id){
    $query = "SELECT * FROM periode WHERE id=" . $id;
    return objectsingle($query);
}


function closeperiode($id){
    $query = "UPDATE periode SET status=0 WHERE id=" . $id;
    return update($query);
}

$id=$_POST['id'];
$rstcloseperiode = closeperiode($id);
if($rstcloseperiode['success']){
    echo '{success:true,Message:"Process Successfully"}'; 
}else{
    echo '{success:false,errorMessage:"' . $rstcloseperiode['error'] . '"}';            
}
mysql_close();
?>
