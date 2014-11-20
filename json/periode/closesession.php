<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

function periode($id){
    $query = "SELECT * FROM periode WHERE id=" . $id;
    return objectsingle($query);
}

function closesession($id,$periodesession){   
    $query = "UPDATE periode SET periodesession=" . $periodesession . " WHERE id=" . $id;
    return update($query);
}

function closeperiode($id){
    $query = "UPDATE periode SET status=0 WHERE id=" . $id;
    return update($query);
}

$id=$_POST['id'];
$rstperiode = periode($id);
if($rstperiode['success']){
    $periode = $rstperiode['data'];
    if($periode['periodesession'] <= 1 ){        
        $periodesession = $periode['periodesession'] + 1;        
        $rstclosesession = closesession($periode['id'],$periodesession);        
        if($rstclosesession['success']){            
            echo '{success:true,Message:"Process Successfully"}';            
        }else{
            echo '{success:false,errorMessage:"' . $rstclosesession['error'] . '"}';            
        }        
    }else{
        echo '{success:false,Message:"Session achieve the limit"}';            
    }
}else{
    echo '{success:false,errorMessage:"' . $rstperiode['error'] . '"}';            
}
mysql_close();
?>
