<?php
ob_start();
session_start();
include '../config/dbconnect.php';

if(!isset($_SESSION['user'])){
    header('Location: index.php');  
}

function bin($binname){
    $query = "SELECT * FROM bin WHERE name='" . $binname . "' AND dc='" .  $_SESSION['dc'] . "'";
    $rs = mysql_query($query);
    if($rs){
        if(mysql_num_rows($rs) == 1){
            $arr = mysql_fetch_array($rs);
            return $arr['id'];
        }else{
            return FALSE;
        }
    }else{
        return FALSE;
    }
    
}

if(isset($_POST['submit'])){
    if($_POST['binname'] != ''){
        $bin = bin($_POST['binname']);
        if($bin){
            $_SESSION['bin'] = $bin;
            $_SESSION['binname'] = $_POST['binname'];
            header('Location: starttrans.php');
        }else{
            $message = "Bin not found!";
        }        
    }else{
        $message = "Please define Bin name!";
    }           
}
?>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        Username : <?php echo $_SESSION['user']; ?> 
        <form method="POST">            
            <table border="1" width="25%">
                <tr>
                    <td>Site</td>
                    <td>:</td>
                    <td><?php echo $_SESSION['dc'] ?></td>
                </tr>
                <tr>
                    <td>Periode</td>
                    <td>:</td>
                    <td><?php echo $_SESSION['periodename'] ?></td>
                </tr>                
                <tr>
                    <td>Bin</td>
                    <td>:</td>
                    <td><input type="text" name="binname"></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td><input type="submit" name="submit" value="Find" /></td>
                </tr>
            </table> 
            <a href="periode.php">Back</a>
            <a href="index.php">Logout</a>            
       </form>                
       <?php
            if(isset($message)){
                echo $message;    
            }
            
       ?>
    </body>
</html>
