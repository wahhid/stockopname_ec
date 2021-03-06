<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

$start  = isset($_GET['start'])  ? $_GET['start']  :  0;
$count  = isset($_GET['limit'])  ? $_GET['limit']  : 25;

$jsonstring = stripslashes(str_replace('\"', '"', $_GET['sort']));
$sort =  json_decode($jsonstring);
$sortProperty = $sort[0]->property; 
$sortDirection = $sort[0]->direction;

$filter = isset($_GET['filter']) ? $_GET['filter'] : null;

$where = " 0 = 0 AND a.deleted=0 ";
$qs = '';

if(isset($filter)){
    $jsonfilter = stripslashes(str_replace('\"', '"', $filter));
    $filters = json_decode($jsonfilter);
    for($i=0;$i<count($filters);$i++){
        $rowfilter = $filters[$i];
        if($rowfilter->property == 'username'){
            $qs .=  " AND a." . $rowfilter->property . "='" . $rowfilter->value ."'"; 
        }
        if($rowfilter->property == 'fullname'){
            $qs .=  " AND a." . $rowfilter->property . "LIKE '" . $rowfilter->value . "%'"; 
        }    
    }    
}

$where .= $qs;

$query = "SELECT a.username, a.fullname, b.name AS usertype FROM user a LEFT JOIN usertype b ON a.usertype = b.id  WHERE " .$where;
$query .= " ORDER BY ".$sortProperty." ".$sortDirection;
$query .= " LIMIT ".$start.",".$count;

$rs = mysql_query($query);

if (!$rs) {
    echo '{success: false,message:"' . mysql_error() . '"}';    
}else{
    while($obj = mysql_fetch_object($rs)) {
        $arr[] = $obj;
    }
    $query = "SELECT * FROM user WHERE " . $where;
    $rs = mysql_query($query);
    if(!$rs){
        $totalItem = 0;
    }else{  
        $totalItem = mysql_num_rows($rs);
    }    
    echo '{"items":'.json_encode($arr).',"totalItem":' . $totalItem . '}';    
}
mysql_close();
?>
