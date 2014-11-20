<?php
ob_start();
session_start();
include 'config/dbconnect.php';

$username = $_POST['username'];
$password = $_POST['password'];
$dc = $_POST['dc'];
$queryuser = "SELECT * FROM user WHERE username='" . $username . "'";
$rsuser = mysql_query($queryuser);
if($rsuser){
    if(mysql_num_rows($rsuser) == 1){
        $queryuserdc = "SELECT * FROM userdc WHERE username='" . $username . "' AND dc='" . $dc . "'";
        $rsuserdc = mysql_query($queryuserdc);
        if($rsuserdc){
            if(mysql_num_rows($rsuserdc) == 1){
                $userrow = mysql_fetch_array($rsuser);
                $userdcrow = mysql_fetch_array($rsuserdc);
                if($userrow['password']  == $password){
                    $_SESSION['login'] = $userrow['username'];
                    $_SESSION['dc'] = $userdcrow['dc'];     
                    echo '{success:true,Message:"' . $_SESSION['login'] . ' - ' . $_SESSION['dc']  . '"}';
                }else{
                    echo '{success:false,errorMessage:"3 User or password not match"}';
                }
            }else{
                echo '{success:false,errorMessage:"2 User or password not match"}';
            }
        }else{
            echo '{success:false,errorMessage:"' . mysql_error() . '"}';
        }
    }else{
        echo '{success:false,errorMessage:"1 User or password not match"}';
    }
}else{
    echo '{success:false,errorMessage:"' . mysql_error() . '"}';   
}
mysql_close();
?>
