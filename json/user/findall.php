<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$query = "SELECT * FROM user WHERE deleted=0";
$rs = mysql_query($query);
if (!$rs) {
    echo "{items:[],itemItem:0}";    
}else{
    while($obj = mysql_fetch_object($rs)) {
        $arr[] = $obj;
    }
    echo '{"items":'.json_encode($arr).'}';
}
mysql_close();
?>
