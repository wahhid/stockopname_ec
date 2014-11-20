<?php
ob_start();
session_start();
include '../config/dbconnect.php';
if(!isset($_SESSION['user'])){
    header('Location: index.php');
}

function changebinstatus(){
    $query = "UPDATE bin SET status=1 WHERE id=" . $_SESSION['bin'];
    $rs = mysql_query($query);    
}

function checktrans($periode,$bin){
    $query = "SELECT * FROM transstock WHERE periode=" . $periode . " AND bin=" . $bin ;
    $rs = mysql_query($query);
    if($rs){
        if(mysql_num_rows($rs) == 1){
            $arr = mysql_fetch_array($rs);
            $result = array(
                    "success" => TRUE,
                    "id" => $arr['id']
                );
            return $result;
        }else{
            $querycreate = "INSERT INTO transstock (periode,dc,bin,username,createddate,createdby,updateddate,updatedby) VALUES (" .
                    $periode . "," .
                    "'" . $_SESSION['dc'] . "'," .
                    $_SESSION['bin'] . "," .
                    "'" . $_SESSION['login'] . "'," .
                    "'" . date('Y-m-d h:i:s') . "'," .
                    "'" . $_SESSION['login'] . "'," .
                    "'" . date('Y-m-d h:i:s') . "'," .
                    "'" . $_SESSION['login'] . "'" .
                    ")";
            $rs = mysql_query($querycreate);
            if($rs){
                $result = array(
                    "success" => TRUE,
                    "id" => mysql_insert_id()
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
    }else{
        $result = array(
            "success" => FALSE,
            "error" => mysql_error()
        );
        return $result;        
    }
}

function findgondola($dc,$binname){
    $query = "SELECT * FROM bin WHERE name='" . $binname . "' AND dc='" . $dc . "'";
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
                "error" => "Bin not found"
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
?>
<?php
if(isset($_POST['submit'])){    
    $result = checktrans($_SESSION['periode'],$_SESSION['bin']);
    if($result['success']){
        $_SESSION['transstock'] = $result['id'];
        $_SESSION['message'] = "Transstock ID : " . $result['id'];    
        //changebinstatus();
        header('Location: inputdata.php');
    }else{
        $_SESSION['message'] = $result['error'];
    }    
    
}
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Find Gondola</title>
    </head>
    <body>
        <?php
            $result = findgondola($_SESSION['dc'],$_SESSION['binname']);
            if($result['success']){                               
                if($result['data']['status'] == 0){
                    $status = "Not Use";
                }else{
                    $status = "In Use";
                }
                echo "Username : " . $_SESSION['user'];
        ?>
        <table border="1">
            <tr>
                <td>Site</td>
                <td>:</td>
                <td><?php echo $_SESSION['dc']; ?></td>
            </tr>
            <tr>
                <td>Periode</td>
                <td>:</td>
                <td><?php echo $_SESSION['periodename']; ?></td>
            </tr>            
            <tr>
                <td>Gondola</td>
                <td>:</td>
                <td><?php echo $_SESSION['binname']; ?></td>
            </tr>            
            <tr>
                <td>Status</td>
                <td>:</td>
                <td><?php echo $status; ?></td>
            </tr>      
            <tr>
                <td></td>
                <td></td>
                <td>                                                               
                    <?php 
                        if($result['data']['status'] == 0){
                            echo '<form method="POST">';
                            echo '<input type="submit" name="submit" value="Start"/>';
                            echo '</form>';                            
                        }else{
                            echo 'Start';                                
                        }   
                        
                    ?>
                </td>
            </tr>              
        </table>        
        
        <?php             
            echo "<a href=gondola.php>Back</a></br>";                    
            echo $_SESSION['message'];
            }else{
                echo "Username : " . $_SESSION['user'];
                echo "<br/>";
                echo "Gondola not found";
                echo "<br/>";
                echo "<a href=gondola.php>Back</a>";                    
            }            
        ?>        
    </body>
</html>
<?php
    mysql_close();
?>
