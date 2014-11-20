<?php
ob_start();
session_start();


include '../../config/dbconnect.php';

$query = "SELECT * FROM dc";
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
