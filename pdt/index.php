<?php
ob_start();
session_start();
$_SESSION['message'] = '';
include '../config/dbconnect.php';

if(isset($_POST['submit']) && isset($_POST['username']) && isset($_POST['password']) && isset($_POST['dc'])){
    $submit = $_POST['submit'];    
    $username = $_POST['username'];
    $password = $_POST['password'];
    $dc = $_POST['dc'];
}

if(isset($submit)){    
    $queryuser = "SELECT * FROM user WHERE username='" . $username . "'";
    $rs = mysql_query($queryuser);
    if($rs){
        if(mysql_num_rows($rs) == 1){
            $row = mysql_fetch_array($rs);
            if($row['password'] == $password){
                $_SESSION['user'] = $username;
                $_SESSION['dc'] = $dc;
                header('Location: periode.php');
            }else{
                $_SESSION['message'] = "Username or Password not match";    
            }            
        }else{
            $_SESSION['message'] = "Username or Password not match";
        }           
    }else{
        $_SESSION['message'] = "Error";
    }
}
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Stock System - Ranch Market</title>        
    </head>
    <body>                          
        <form id="form" action="index.php" method="POST">
            <table border="0">
                <tr>
                    <td>User ID</td>
                    <td>:</td>
                    <td><input type="text" name="username" value="" /></td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td>:</td>
                    <td><input type="password" name="password" value="" /></td>
                </tr>
                <tr>                    
                    <td>Site</td>                    
                    <td>:</td>                    
                    <td>
                        <select name="dc">
                            <?php
                                $query = "SELECT * FROM dc";
                                $rs = mysql_query($query);
                                while($row = mysql_fetch_array($rs)){
                                    echo '<option value="'. $row['id'] . '">' . $row['name']  . '</option>'; 
                                }
                            ?>        
                        </select>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td>
                        <input type="submit" name="submit" value="Login" />
                    </td>
                </tr>
            </table>                
            <?php 
                echo $_SESSION['message'];
            ?>
        </form>        
    </body>
</html>
<?php
    mysql_close();
?>
