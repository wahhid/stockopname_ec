<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$query = "SELECT * FROM product";
$rs = mysql_query($query);
if (!$rs) {
    echo '{"success": false,message:"Error Loading"}';    
}else{
    while($obj = mysql_fetch_object($rs)) {
        $arr[] = $obj;
    }
    echo '{"success": true,"items":'.json_encode($arr).'}';
}
mysql_close();
?>
