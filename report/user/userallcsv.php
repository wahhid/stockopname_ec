<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,errorMessage:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=data.csv');

// create a file pointer connected to the output stream
$output = fopen('php://output', 'w');

// output the column headings
fputcsv($output, array('username', 'fullname'));

// fetch the data

$rows = mysql_query('SELECT username,fullname FROM user');

// loop over the rows, outputting them
while ($row = mysql_fetch_assoc($rows)) fputcsv($output, $row);


mysql_close();
?>
