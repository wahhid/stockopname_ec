<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,errorMessage:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=stock.csv');

// create a file pointer connected to the output stream
$output = fopen('php://output', 'w');

// output the column headings
fputcsv($output, array('Warehouse', 'Inventory Rec No','Storage Type','Item No','Storage Bin','Quant. No','Site','Storage Loc','Article No','Description','Batch No','Stk Cat','Special Stock','Counted Qty','Counted UoM','Stock SAP','Diff'));

// fetch the data
$periodeid = $_GET['periodeid'];
$query = "SELECT warehouse,pid,storagetype,itemno,storagebin,quantno,dc,storageloc,articleno,description,batchno,stkcat,specialstock,countedqty,counteduom,stocksap,diff FROM stockbin WHERE periode=" . $periodeid;  
$rows = mysql_query($query);

// loop over the rows, outputting them
while ($row = mysql_fetch_assoc($rows)) fputcsv($output, $row);

mysql_close();
?>
