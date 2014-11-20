<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success: false,message:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';
function isempty($var){
    if(empty($var)){
        return 0;
    }else{
        return $var;
    }
}

function findbin($binname){
    $query = "SELECT * FROM bin WHERE name='" . $binname  . "' AND dc='" . $_SESSION['dc'] . "'" ;
    return objectsingle($query);
}

function updatebin($id,$row){
    $query = "UPDATE bin SET " . 
            "name='" . $row[0] . "'," .
            "description='" . $row[0] . "'," . 
            "updateddate='" . date('Y-m-d h:i:s') . "'," . 
            "updatedby='" . $_SESSION['login'] . "'" . 
            " WHERE id=" . $id;
    return update($query);
}

function insertbin($row){
    $query = "INSERT INTO bin (name,description,dc,createddate,createdby,updateddate,updatedby) VALUES (" . 
             "'" . $row[0] . "'," .
             "'" . $row[0] . "'," . 
             "'" . $_SESSION['dc'] . "'," . 
             "'" . date('Y-m-d h:i:s') . "'," . 
             "'" . $_SESSION['login'] . "'," . 
             "'" . date('Y-m-d h:i:s') . "'," . 
             "'" . $_SESSION['login'] . "'" . 
             ")";
    return insert($query);
}

$returnResponse = $_REQUEST['returnResponse'];
sleep(1);

if ($returnResponse != "") {
    header('HTTP/1.0 '.$returnResponse.' Server status', true, $returnResponse);
    echo '{success:false, message:"Faked error from server", errors:{"photo-path":"The server returned this"}}';
} else {    
    $temp_file_name = $_FILES['binfile']['tmp_name'];
    $original_file_name = $_FILES['binfile']['name'];
    
    $ext = explode ('.', $original_file_name);
    $ext = $ext [count ($ext) - 1];
    $file_name = str_replace ($ext, '', $original_file_name);
    $new_name = '_'.$file_name . $ext;              
    
    if (move_uploaded_file($temp_file_name, '../../upload/' . $new_name)) {        
        $file = fopen('../../upload/' . $new_name,"r");
        $totalrow = 0;
        $update = 0;
        $insert = 0;
        $message='';
        while(!feof($file)){
            $totalrow++;
            $row = fgetcsv($file,null,",","\"");      
            $resultbin = findbin($row[0]);
            if($resultbin['success']){
                $bin = $resultbin['data'];
                $resultupdatebin = updatebin($bin['id'], $row);             
                if($resultupdatebin['success']){
                    $update++;            
                }else{
                    $message .= $resultupdatebin['error'];
                }
            }else{
                $message .= $resultbin['error'];
                $bin = $resultbin['data'];
                $resultinsertbin = insertbin($row);             
                if($resultinsertbin['success']){
                    $insert++;            
                }else{
                    $message .= $resultupdatebin['error'];
                }                
            }
        }
        fclose($file);           
        echo json_encode(array(
            "success" => true,
            "Message" => "Update : " . $update . ", Insert : " . $insert . ", Total : " . $totalrow             
        ));          
    } else {    
        echo json_encode(array(
            "success" => false,
            "errorMessage" => "Error Process File"
        ));
    }                
}
mysql_close(); 
?>