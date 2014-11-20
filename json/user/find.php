<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$username = $_POST['username'];
$query = "SELECT * FROM user WHERE username='" . $username . "' AND deleted=0";
$rs = mysql_query($query);
if (!$rs) {
    echo "{items:[],itemItem:0}";    
}else{
    $row = mysql_fetch_assoc($rs);
    echo '{success: true,data: ' . json_encode($row) . '}';
}
mysql_close();
?>
