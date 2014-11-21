<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,errorMessage:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

function findbin($binname){
    $query = "SELECT * FROM bin WHERE name='" . $binname .  "' AND dc='" . $_SESSION['dc'] . "'";
    $rs = mysql_query($query);
    if($rs){
        if(mysql_num_rows($rs) == 1){
            $arr = mysql_fetch_array($rs);
            $result = array(
                "success"=>true,
                "data"=>$arr
            );           
            return $result;
        }else{
            $result = array(
                "success"=>false,
                "error"=>  "Data not found"
            );           
            return $result;
        }
    }else{
        $result = array(
            "success"=>false,
            "error"=>  mysql_error()
        );
        return $result;
    }
}

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=stock.csv');

// create a file pointer connected to the output stream
$output = fopen('php://output', 'w');

// output the column headings
fputcsv($output, array('id', 'sequence','transstockid','ean','batchno','transdate','qty1','qty2','nopid','status','createddate','createdby','updateddate','updatedby'));

// fetch the data
$periodeid = $_GET['periodeid'];
$binname = $_GET['binname'];
$pid = $_GET['pid'];

if($binname != '*'){
    $resultfindbin = findbin($binname);    
    if($resultfindbin['success']){
        $arr = $resultfindbin['data'];
       	if($pid == 'all'){
       		$query = "SELECT b.* FROM transstock a LEFT JOIN transstockdetail b on a.id = b.transstock WHERE a.periode=" .  $periodeid  . " AND a.bin=" . $arr['id'];       		
       	}
       	if($pid == 'wpid'){
       		$query = "SELECT b.* FROM transstock a LEFT JOIN transstockdetail b on a.id = b.transstock WHERE b.nopid=0 AND a.periode=" .  $periodeid  . " AND a.bin=" . $arr['id'];
       	}
       	if($pid == 'wopid'){
       		$query = "SELECT b.* FROM transstock a LEFT JOIN transstockdetail b on a.id = b.transstock WHERE b.nopid=1 AND a.periode=" .  $periodeid  . " AND a.bin=" . $arr['id'];
       	}              		         
    }
}else{
	if($pid == 'all'){
		$query = "SELECT b.* FROM transstock a LEFT JOIN transstockdetail b on a.id = b.transstock WHERE a.periode=" .  $periodeid;
	}
	if($pid == 'wpid'){
		$query = "SELECT b.* FROM transstock a LEFT JOIN transstockdetail b on a.id = b.transstock WHERE b.nopid=0 AND a.periode=" .  $periodeid;
	}
	if($pid == 'wopid'){
		$query = "SELECT b.* FROM transstock a LEFT JOIN transstockdetail b on a.id = b.transstock WHERE b.nopid=1 AND a.periode=" .  $periodeid;
	}
           
}

//$query = "SELECT b.* FROM transstock a LEFT JOIN transstockdetail b on a.id = b.transstock WHERE a.periode=15 AND a.bin=1";
$rows = mysql_query($query);
// loop over the rows, outputting them
while ($row = mysql_fetch_assoc($rows)) fputcsv($output, $row);
//while ($row = mysql_fetch_array($rows)) echo $row[0];
mysql_close();

?>
