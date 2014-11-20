<?php
ob_start();
session_start();

$_SESSION['message'] = '';
$_SESSION['ean'] = '';
$_SESSION['productname'] = '';

include '../config/dbconnect.php';

if(!isset($_SESSION['user'])){
    header('Location: index.php');
}

function check_bin_article($binname,$articleno){    
    $query = "SELECT * FROM stockbin WHERE storagebin='" . $binname . "' AND articleno='" . $articleno . "'";    
    return objectsingle($query);    
}

function product($ean){
    $query = "SELECT * FROM product WHERE ean='" . $ean . "'";
    $rs = mysql_query($query);
    if($rs){
        if(mysql_num_rows($rs) == 1){
            $arr = mysql_fetch_array($rs);
            $result = array(
                "success" => TRUE,
                "data" => $arr
            );
            return $result;
        }else{
            $result = array(
                "success" => FALSE,
                "error" => "Product not found"
            );
            return $result;
        }
    }else{
        $result = array(
            "success" => FALSE,
            "error" => mysql_error()
        );
        return $result;
    }    
}

if(isset($_POST['submit'])){
    if($_POST['ean'] != ''){
        $rs_product = product($_POST['ean']);
        if($rs_product['success']){            
            $product = $rs_product['data'];
            $rs_stockbin = check_bin_article($_SESSION['binname'], $product['article']);
            if($rs_stockbin['success']){
                $_SESSION['ean'] = $_POST['ean'];
                $_SESSION['uom'] = $product['uom'];            
                $_SESSION['productname'] = $product['productname'];
                $_SESSION['article'] = $product['article'];
                $_SESSION['nopid'] = false;
                header('Location: inputbatch.php');
            }else{
               //No Data on Stockbin	
               //$_SESSION['message'] = "Product not found on bin";
            	$_SESSION['ean'] = $_POST['ean'];
            	$_SESSION['uom'] = $product['uom'];
            	$_SESSION['productname'] = $product['productname'];
            	$_SESSION['article'] = $product['article'];
            	$_SESSION['nopid'] = true;
            	header('Location: inputbatch.php');
            }                                                    
        }else{
            $_SESSION['message'] = $rs_product['error'];
        }        
    }else{
        $_SESSION['message'] = "Product not found!";
    }           
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
                    <td><?php echo $_SESSION['periodename']; ?></td>
                </tr>
                <tr>
                    <td>Bin</td>
                    <td><?php echo $_SESSION['binname']; ?></td>
                </tr>                
                <tr>
                    <td>Ean</td>
                    <td><input type="text" name="ean" value=""/></td>
                </tr>         
                <tr>
                    <td></td>
                    <td><input type="submit" name="submit" value="submit" /></td>
                </tr>
                <tr>
                    <td></td>
                    <td><a href="gondola.php">Back</a></td>
                </tr>
                <tr>
                    <td></td>
                    <td>Session <?php echo $_SESSION['periodesession']; ?></td>
                </tr>                   
            </table>                             
        </form>        
        <?php
            echo $_SESSION['message'];
        ?>
    </body>
</html>
