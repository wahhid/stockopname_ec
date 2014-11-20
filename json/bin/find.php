<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$id = $_POST['id'];

$query = "SELECT * FROM bin WHERE id=" . $id;
$rs = mysql_query($query);
if (!$rs) {
    echo '{success: false,errorMessage:"' . mysql_error() . '"}';    
}else{
    $row = mysql_fetch_array($rs);
    echo '{success: true,data:' . json_encode($row) . '}';
}
mysql_close();
?>
