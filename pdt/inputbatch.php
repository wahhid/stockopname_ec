<?php
ob_start();
session_start();

include '../config/dbconnect.php';
if(!isset($_SESSION['user'])){
    header('Location: index.php');
}


if(isset($_POST['submit'])){                    
    $_SESSION['batchno'] = $_POST['batchno'];
    header('Location: collectdata.php');     
}
?>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Stock System - Ranch Market</title>
    </head>
    <body>                
        <form method="POST">
            <table border="1">
                <tr>
                    <td>DC</td>
                    <td><?php echo $_SESSION['dc'];?></td>
                </tr>
                <tr>
                    <td>Periode</td>
                    <td><?php echo $_SESSION['periodename'] ?></td>
                </tr>
                <tr>
                    <td>Ean</td>
                    <td><?php echo $_SESSION['ean'];?></td>
                </tr>
                <tr>
                    <td>Product Name</td>
                    <td><?php echo $_SESSION['productname'];?></td>
                </tr>                
                <tr>
                    <td>Article No</td>
                    <td><?php echo $_SESSION['article'];?></td>
                </tr>                
                <tr>
                    <td>Batch#</td>
                    <td>
                        <select name="batchno">
                        <?php 
                            $query = "SELECT * FROM stockbin WHERE periode=" . $_SESSION['periode'] . " AND articleno='" . $_SESSION['article'] . "'";                        
                            $rs = mysql_query($query);
                            if($rs){
                                echo '<option value="">No Batch Number</option>';
                                while($row = mysql_fetch_array($rs)){
                                    echo '<option value="' . $row['batchno'] . '">' . $row['batchno'] . '</option>';
                                }                                
                            }else{
                                echo '<option value="">No Batch Number</option>';
                            }
                        ?>                            
                        </select>                       
                    </td>
                </tr>                       
                <tr>
                    <td></td>
                    <td><input type="submit" name="submit" value="submit" /></td>
                </tr>
                <tr>
                    <td></td>
                    <td><a href="inputdata.php">Back</a></td>
                </tr>
                <tr>
                    <td></td>
                    <td>Session <?php echo $_SESSION['periodesession']; ?></td>
                </tr>                   
            </table>                             
        </form>        
        <?php
            //echo $message;
        ?>
    </body>
</html>
