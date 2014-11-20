<?php


include '../../config/dbconnect.php';


$id = $_POST['id'];
$name = $_POST['name'];

$query = "INSERT INTO dc (id,name,createddate,createdby,updateddate,updatedby) VALUES (" .
        "'" .  $id  . "'," .
        "'" .  $name  . "'," .
        "'" .  date('Y-m-d') . "'," .
        "'" .  $_SESSION['username']  . "'," .
        "'" .  date('Y-m-d') . "'," .
        "'" .  $_SESSION['username']  . "'" .
        ")";
$rs = mysql_query($query);
if ($rs) {    
    echo '{success: true,Message:"Create Successfully"}';
}else{
    if(mysql_errno() == 1062){
        echo '{success:false,errorMessage:"DC already exist"}';            
    }else{
        echo '{success:false,errorMessage:"' . mysql_error() . '"}';            
    }          
}
mysql_close();
?>
