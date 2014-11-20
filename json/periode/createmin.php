<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}

include '../../config/dbconnect.php';
$periodedate = $_POST['periodedate'];
$description = $_POST['description'];

$query = "INSERT periode (periodedate,description,dc,createddate,createdby,updateddate,updatedby) VALUES (" . 
        "'" . date('Y-m-d',strtotime($periodedate)) . "'," .
        "'" . $description . "',".
        "'" . $_SESSION['dc'] . "'," .
        "'" . date('Y-m-d h:i:s') . "'," .
        "'" . $_SESSION['login'] . "'," .
        "'" . date('Y-m-d h:i:s'). "'," .
        "'" . $_SESSION['login'] . "'" .
        ")"; 
$rs = mysql_query($query);
if($rs){
   echo '{success:true,Message:"Create successfully"}';             
}else{
    if(mysql_errno() == 1062){
        echo '{success:false,errorMessage:"Periode already exist"}';            
    }else{
        echo '{success:false,errorMessage:"' . mysql_error() . '"}';            
    }    
}
mysql_close();
?>
