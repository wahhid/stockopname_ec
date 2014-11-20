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
$queryperiode = "SELECT * FROM periode WHERE dc='" . $_SESSION['dc'] . "' AND status=1";
$rsperiode = mysql_query($queryperiode);
while($rowperiode = mysql_fetch_array($rsperiode)){          
    $json .= '{';
    $json .= "id:'" . $rowperiode['id'] . "',";        
    $json .= "description:'" . $rowperiode['description'] ."',";
    $json .= "type:'s',";
    $json .= "iconCls:'task-folder',";  
    $json .= "expanded:false,";
    $json .= "children:[";    
    $queryusersite = "SELECT a.* FROM userbin a " .
                     "LEFT JOIN user b ON a.username = b.username  " . 
                     "LEFT JOIN  b ON a.username = b.username  " . 
                     " WHERE b.dc='" . $rowsite['id'] . "'";
    $rsuser = mysql_query($queryusersite);
    while( $rowuser = mysql_fetch_array($rsuser)){
        $json .= "{";          
        $json .= "name:'" . $rowuser['fullname'] . "',";        
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
