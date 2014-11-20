<?php
ob_start();
session_start();

$_SESSION['message'] = '';

include '../config/dbconnect.php';

if(!isset($_SESSION['user'])){
    header('Location: index.php');
}

function insertseq($sequence){
    $total = $sequence + 1;
    $query = "INSERT INTO transseq (dc,periode,bin,sequence) VALUES (" . 
            "'" . $_SESSION['dc'] . "'," .
            $_SESSION['periode'] . "," .
            $_SESSION['bin'] . "," .
            $total .
            ")";
    $rs = mysql_query($query);
    if($rs){
        $result = array(
            "success" => TRUE,
            "data" => ''
        );
        return $result;
    }else{
        $result = array(
            "success" => FALSE,
            "error" => mysql_error()
        );
        return $result;
    }    
}

function updateseq($sequence){    
    $total = $sequence + 1;
    $query = "UPDATE transseq SET sequence=" . $total ." WHERE dc='" . $_SESSION['dc'] . "' AND periode=" . $_SESSION['periode'] . " AND bin=" . $_SESSION['bin'];
    $rs = mysql_query($query);
    if($rs){
        $result = array(
            "success" => TRUE,
            "data" => ''
        );
        return $result;
    }else{
        $result = array(
            "success" => FALSE,
            "error" => mysql_error()
        );
        return $result;
    }
}

function sequence(){
    $query = "SELECT * FROM transseq WHERE dc='" . $_SESSION['dc'] . "' AND periode=" . $_SESSION['periode'] . " AND bin=" . $_SESSION['bin'];
    $rs = mysql_query($query);
    if($rs){
        if(mysql_num_rows($rs) == 1){
            $arr = mysql_fetch_array($rs);
            $sequence = $arr['sequence'];
            $update = updateseq($sequence);
            if($update['success']){
                $result = array(
                    "success" => TRUE,
                    "data" => $arr['sequence']
                );
                return $result;
            }else{
                $result = array(
                    "success" => FALSE,
                    "error" => $update['error']
                );       
                return $result;
            }            
        }else{
            $sequence = 1;
            $insert = insertseq($sequence);
            if($insert['success']){
                $result = array(
                    "success" => TRUE,
                    "data" => $sequence
                );            
                return $result;
            }else{
                $result = array(
                    "success" => FALSE,
                    "error" => $insert['error']
                );                
                return $result;
            }                        
        }
    }else{
        $result = array(
            "success" => FALSE,
            "error" => mysql_error()
        );
        return $result;
    }
}

function finddetail(){
    //$query = "SELECT * FROM transstockdetail WHERE transstock=" . $_SESSION['transstock'] . " AND product='" . $_SESSION['product'] ."' AND batchno=" . $_SESSION['batchno'];
    if($_SESSION['batchno']!=''){   
        $query = "SELECT * FROM transstockdetail WHERE transstock=" . $_SESSION['transstock'] . " AND product='" . $_SESSION['ean'] ."' AND batchno='" . $_SESSION['batchno'] . "'";
    }else{
        $query = "SELECT * FROM transstockdetail WHERE transstock=" . $_SESSION['transstock'] . " AND product='" . $_SESSION['ean'] ."' AND batchno=''";
    }     
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
                "error" => "Detail not found",
                "query" => $query
            );            
            return $result;
        }
    }else{
        $result = array(
            "success" => FALSE,
            "error" => mysql_error(),
            "query" => $query
        );
        return $result;
    }
}

function inserttransstockdetail($qty){
    $sequence = sequence();
    if($sequence['success']){       
        if($_SESSION['batchno']!=''){
            $query = "INSERT INTO transstockdetail (sequence,transstock,batchno,product,transdate,qty1,qty2,nopid,status,createddate,createdby,updateddate,updatedby) VALUES (" .
                 $sequence['data'] . "," .
                 $_SESSION['transstock'] . "," .
                 "'" . $_SESSION['batchno'] . "'," .
                 "'" . $_SESSION['ean'] . "'," .
                 "'" . date('Y-m-d h:i:s') . "'," .
                 $qty . "," .
                 $qty . "," .
                 $_SESSION['nopid'] . "," .
                 "1" . "," .
                 "'" . date('Y-m-d h:i:s') . "'," .
                 "'" . $_SESSION['login'] . "'," .
                 "'" . date('Y-m-d h:i:s') . "'," .
                 "'" . $_SESSION['login'] . "'" .               
                 ")";                       
        }else{
            $query = "INSERT INTO transstockdetail (sequence,transstock,batchno,product,transdate,qty1,qty2,nopid,status,createddate,createdby,updateddate,updatedby) VALUES (" .
                 $sequence['data'] . "," .
                 $_SESSION['transstock'] . "," .                 
                 "''," .
                 "'" . $_SESSION['ean'] . "'," .
                 "'" . date('Y-m-d h:i:s') . "'," .
                 $qty . "," .
                 $qty . "," .
                 $_SESSION['nopid'] . "," .
                 "1" . "," .
                 "'" . date('Y-m-d h:i:s') . "'," .
                 "'" . $_SESSION['login'] . "'," .
                 "'" . date('Y-m-d h:i:s') . "'," .
                 "'" . $_SESSION['login'] . "'" .               
                 ")";                       
        }
        
        $rs = mysql_query($query);
        if($rs){
            $result = array(
                "success" => TRUE,
                "data" => ''
            );
            return $result;
        }else{
            $result = array(
                "success" => FALSE,
                "error" => mysql_error()
            );
            return $result;
        }           
    }else{
        $result = array(
            "success" => FALSE,
            "error" => $sequence['error']
        );
        return $result;        
    }
    
}

function updatetransstokdetail($qty){
    if($_SESSION['periodesession'] == 1){
        $query = "UPDATE transstockdetail SET batchno='" . $_SESSION['batchno'] . "',qty1=" .  $qty . ",qty2=" . $qty . " WHERE transstock=" . $_SESSION['transstock'] . " AND product='" . $_SESSION['ean'] ."'";        
    }else{
        $query = "UPDATE transstockdetail SET batchno='" . $_SESSION['batchno'] . "',qty2=" . $qty . " WHERE transstock=" . $_SESSION['transstock'] . " AND product='" . $_SESSION['ean'] ."'";        
    }

    $rs = mysql_query($query);
    if($rs){
        $result = array(
            "success" => TRUE,
            "data" => ''
        );
        return $result;
    }else{
        $result = array(
            "success" => FALSE,
            "error" => mysql_error()
        );
        return $result;
    }
}

if(isset($_POST['submit'])){
    if($_POST['quantity'] != '' && $_POST['quantity'] > 0){
        if($_SESSION['batchno']!=''){
            $query = "SELECT * FROM transstockdetail WHERE transstock=" . $_SESSION['transstock'] . " AND product='" . $_SESSION['ean'] ."' AND batchno='" . $_SESSION['batchno'] . "'";
        }else{
            $query = "SELECT * FROM transstockdetail WHERE transstock=" . $_SESSION['transstock'] . " AND product='" . $_SESSION['ean'] ."' AND batchno=''";
        }        
        $rs = mysql_query($query);
        if($rs){
            if(mysql_num_rows($rs) == 1){            
                $result = updatetransstokdetail($_POST['quantity']);
                if($result['success']){
                    header('Location: gondola.php');
                }else{
                   $_SESSION['message'] = $result['error']; 
                }
            }else{
                $result = inserttransstockdetail($_POST['quantity']);
                if($result['success']){
                    header('Location: gondola.php');
                }else{
                   $_SESSION['message'] = $result['error']; 
                }
            }
        }else{
            $_SESSION['message'] = mysql_error();
        }        
    }else{
        $_SESSION['message'] = 'Qty cannot null or zero';
    }
}else{
    $resultfind = finddetail();
    if($resultfind['success']){        
        $data = $resultfind['data'];
        if($_SESSION['periodesession'] == 1){
            $_SESSION['lastqty'] = $data['qty1'];
        }
        if($_SESSION['periodesession'] == 2){
            $_SESSION['lastqty'] = $data['qty2'];
        }        
    }else{
        $_SESSION['lastqty'] = 0;        
        //$_SESSION['message'] = $resultfind['query'];
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
                    <td><?php echo $_SESSION['periodename'];?></td>
                </tr>
                <tr>
                    <td>Product</td>
                    <td><?php echo $_SESSION['productname'];?></td>
                </tr>
                <tr>
                    <td>Batch</td>
                    <td><?php echo $_SESSION['batchno'];?></td>
                </tr>                
                <tr>
                    <td>Last Qty</td>
                    <td><?php echo $_SESSION['lastqty'];?></td>
                </tr>                        
                <tr>
                    <td>Quantity</td>                    
                    <td><input type="text" name="quantity" value="0"/></td>                    
                </tr>
                <tr>
                    <td>Uom</td>                    
                    <td><?php echo $_SESSION['uom'];?></td>                    
                </tr>                
                <tr>
                    <td></td>
                    <td><input type="submit" name="submit" value="Submit" /></td>
                </tr>             
            </table>                    
            <a href="inputdata.php">Back</a></br>
            <?php
                echo $_SESSION['message'];
            ?>
        </form>
    </body>
</html>
