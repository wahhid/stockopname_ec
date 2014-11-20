<?php
ob_start();
session_start();
$_SESSION['message'] = '';
include '../config/dbconnect.php';
if(!isset($_SESSION['user'])){
    header('Location : index.php');
}
function periodename($id){
    $query = "SELECT * FROM periode WHERE id=" . $id;
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
                "error" => "Periode not found"
            );           
            return $result;
        }
    }else{
        $result = array(
            "success" => FALSE,
            "data" => mysql_error()
        );        
        return $result;
    }
    
}

if(isset($_POST['submit'])){
    if($_POST['periode'] != ''){
        $result = periodename($_POST['periode']);
        if($result['success']){
            $_SESSION['periode'] = $_POST['periode'];
            $_SESSION['periodename'] = $result['data']['description'];
            $_SESSION['periodesession'] = $result['data']['periodesession'];
            header('Location: gondola.php');
        }else{
            $_SESSION['message'] = $result['error'];
        }        
    }else{
        $_SESSION['message'] = "Please Select Periode!";
    }           
}
?>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Periode</title>
    </head>
    <body>       
        <form method="post">
            Username : <?php echo $_SESSION['user'];?> 
            <table>
                <tr>
                    <td>Periode</td>
                    <td>:</td>
                    <td>
                        <select name="periode">
                            <?php
                                $query = "SELECT * FROM periode WHERE dc='" .$_SESSION['dc'] . "' AND status=1";
                                $rs = mysql_query($query);
                                if($rs){
                                    while($row = mysql_fetch_array($rs)){
                                        echo '<option value="' . $row['id'] . '">' . $row['description'] . '</option>';
                                    }
                                }else{
                                    $_SESSION['message'] = mysql_error();
                                }
                            ?>                            
                        </select>                      
                    </td>                   
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td>
                        <input type="submit" name="submit" value="Next" />
                    </td>
                </tr>                                        
            </table>
        </form>
        <?php
            echo $_SESSION['message'];
        ?>
    </body>
</html>
<?php
mysql_close();
?>
