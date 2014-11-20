<?php
ob_start();
session_start();
if(!isset($_SESSION['login'])){
    echo '{success:false,errorMessage:"Access Denied"}';    
    return;
}
include '../../config/dbconnect.php';

function periode($id){
    $query = "SELECT * FROM periode WHERE id=" . $id;
    return objectsingle($query);
}

function stockbins($periode){
    $query = "SELECT * FROM stockbin WHERE periode=" . $periode;
    return objectarray($query);
}

function updatestockbin($id, $stocksap, $qty){    
    $diff = $stocksap - $qty;
    $querystockbinupdate = "UPDATE stockbin SET countedqty=" . $qty . ",diff=" . $diff . " WHERE id=" . $id;   
    return update($querystockbinupdate);
}

function transstockdetail($articleno, $batchno, $periode, $periodesession){
    if($periodesession == 1){
        $query = "SELECT sum(a.qty1) AS qty FROM transstockdetail a ";
        $query .= " LEFT JOIN transstock b on a.transstock = b.id ";
        $query .= " LEFT JOIN product c on a.product = c.ean ";        
        $query .= " WHERE "; 
        $query .= " c.article='" . $articleno  . "'";
        if(isset($batchno)){
            $query .= " AND c.article='" . $articleno . "' and a.batchno='" . $batchno . "'";
        }else{
            $query .= " c.article='" . $articleno . "' and a.batchno is null";
        }
        $query .= " AND b.periode=" . $periode;
        
    }
    if($periodesession == 2){
        $query = "SELECT sum(a.qty1) AS qty FROM transstockdetail a ";
        $query .= " LEFT JOIN transstock b on a.transstock = b.id ";
        $query .= " LEFT JOIN product c on a.product = c.ean ";        
        $query .= " WHERE "; 
        $query .= " c.article='" . $articleno  . "'";
        if(isset($batchno)){
            $query .= " AND c.article='" . $articleno . "' and a.batchno='" . $batchno . "'";
        }else{
            $query .= " c.article='" . $articleno . "' and a.batchno is null";
        }
        $query .= " AND b.periode=" . $periode;
    }
    return objectsingle($query);    
}

function transstock($periode){
    $query = "SELECT * FROM transstock WHERE periode=" . $periode;
    return objectarray($query);        
}

$periodeid = $_POST['id'];
//Find Periode
$resultperiode = periode($periodeid);
//echo $resultperiode['data']['id'];
if($resultperiode['success']){            
    $periode = $resultperiode['data'];
    if($periode['status'] == 1){
        //Find Stockbin by periode
        $resultstockbins = stockbins($periodeid);     
        if($resultstockbins['success']){        
            $arrstockbin = $resultstockbins['data'];        
            for($i=0;$i<count($arrstockbin);$i++){
                $stockbin = $arrstockbin[$i];
                $resulttransstockdetail = transstockdetail($stockbin['articleno'],$stockbin['batchno'],$periodeid,$periode['periodesession']);
                if($resulttransstockdetail['success']){                    
                    $transstockdetail =  $resulttransstockdetail['data'];                                
                    $qty = $transstockdetail['qty'];                                        
                }else{                    
                    $qty = 0;
                }
                $resultupdatestockbin = updatestockbin($stockbin['id'], $stockbin['stocksap'], $qty);           
            }        
            echo '{success:true,Message:"Process All Successfully"}';            
        }else{
            echo '{success:false,errorMessage:"' . $resultstockbins['error'] . '"}';               
        }        
    }else{
        echo '{success:false,errorMessage:"Periode was closed"}';
    }    
}else{
    echo '{success:false,errorMessage:"' . $resultperiode['error'] . '"}';               
}
mysql_close();
?>
