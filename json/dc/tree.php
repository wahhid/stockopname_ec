<?php
ob_start();
session_start();

if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}

include '../../config/dbconnect.php';

function validatestring($value){
   if(trim($value)){
       return 'No Value';       
   }else{
       return $value;
   }
}

function validatenull($value){
   if(is_null($value)){
       return 0;
   }else{
       return $value;
   }
}


$json = '{"text":".","children":[';
$querysite = "SELECT * FROM dc ORDER BY name";
$rssite = mysql_query($querysite);
while( $rowsite = mysql_fetch_array($rssite)){          
    $json .= '{';
    $json .= "id:'" . $rowsite['id'] . "',";        
    $json .= "name:'" . $rowsite['name'] ."',";
    $json .= "userdc:'0',";
    $json .= "type:'s',";
    $json .= "iconCls:'task-folder',";  
    $json .= "expanded:false,";
    $json .= "children:[";    
    $queryusersite = "SELECT a.* , b.fullname FROM userdc a LEFT JOIN user b ON a.username = b.username WHERE a.dc='" . $rowsite['id'] . "'";
    $rsuser = mysql_query($queryusersite);
    while( $rowuser = mysql_fetch_array($rsuser)){
        $json .= "{";          
        $json .= "name:'" . $rowuser['fullname'] . "',";  
        $json .= "userdc:'" . $rowuser['id'] ."',";
        $json .= "type:'u',";
        $json .= "icon:'images/icon01/icon_user.gif',";
        $json .= "leaf:true";
        $json .= "},";       
    }
    $json .= "]},";                                                                                    
}
$json .= "]}";                
echo $json;
mysql_close();
?>
