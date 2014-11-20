<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

function deleteallproduct(){
    $query = "DELETE FROM product";
    return delete($query);
}

function insertproduct($row){    
    $query = "INSERT INTO product (ean,article,category,productname,uom,createddate,createdby,updateddate,updatedby) VALUES (" .
            "'" . $row[0] . "'," .
            "'" . $row[1] . "'," .
            "'" . $row[2] . "'," .
            "'" . $row[3] . "'," .
            "'" . $row[4] . "',"  .
            "'" . date('Y-m-d h:i:s') . "',"  .
            "'" . $_SESSION['login'] . "',"  .
            "'" . date('Y-m-d h:i:s') . "',"  .
            "'" . $_SESSION['login'] . "'"  .
            ")";
    return insert($query);
}

$returnResponse = $_REQUEST['returnResponse'];
sleep(1);
if ($returnResponse != "") {
    header('HTTP/1.0 '.$returnResponse.' Server status', true, $returnResponse);
    echo '{success:false, message:"Faked error from server", errors:{"photo-path":"The server returned this"}}';
} else {
    $temp_file_name = $_FILES['productfile']['tmp_name'];
    $original_file_name = $_FILES['productfile']['name'];
    
    $ext = explode ('.', $original_file_name);
    $ext = $ext [count ($ext) - 1];
    $file_name = str_replace ($ext, '', $original_file_name);
    $new_name = '_'.$file_name . $ext;        
    
    if (move_uploaded_file ($temp_file_name, '../../upload/' . $new_name)) {
        deleteallproduct();
        $file = fopen('../../upload/' . $new_name,"r");
        $success = 0;
        $failed = 0;
        while(! feof($file)){
            $row = fgetcsv($file,null,";","\"");
            $resultinsert = insertproduct($row);                        
            if($resultinsert['success']){
                $success++;
            }else{
                $failed++;                
            }
        }
        fclose($file);               
        echo json_encode(array(
            "success" => true,
            "data" => "Success : " . $success . " Failed: " . $failed
        ));        
    } else {
        echo json_encode(array(
            "success" => false,
            "error" => "Error file processing"
        ));
    }                
}
mysql_close(); 
?>