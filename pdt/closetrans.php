<?php
ob_start();
session_start();
$_SESSION['message'] = '';
include '../config/dbconnect.php';
$query = "UPDATE bin SET status=0 WHERE id=" . $_SESSION['bin'];
$rs = mysql_query($query);    
header('Location: gondola.php');
mysql_close();
?>
