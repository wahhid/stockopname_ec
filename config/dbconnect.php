<?php 
// Connects to Our Database 
$server='localhost';
$username='root';
$password='root';
$dbname='opnam';
$conn = mysql_connect($server, $username, $password);
if($conn){            
    $db_selected = mysql_select_db($dbname,$conn);        
} 

function insert($query){    
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

function autoid(){
    return mysql_insert_id();
}

function update($query){    
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

function delete($query){
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

function objectarray($query){    
    $rs = mysql_query($query);
    if($rs){
        while ($row = mysql_fetch_array($rs)) {
            $arr[] = $row;            
        }
        $result = array(
            "success" => TRUE,
            "data" => $arr
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

function objectsingle($query){
    $rs = mysql_query($query);
    if($rs){
        if(mysql_num_rows($rs) == 1){
            $arr = mysql_fetch_array($rs);
            $result = array(
                "success" => TRUE,
                "data" => $arr,
                "query" => $query
            );
            return $result;           
        }else{
            $result = array(
                "success" => FALSE,
                "error" => "Data not found"
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