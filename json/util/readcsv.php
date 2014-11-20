<?php
$file = fopen('../../upload/_product.csv',"r");
        while(! feof($file)){
            $row = fgetcsv($file,null,";","\"");
            echo $row[0] . "," . $row[1] . "," . $row[2] . "," .$row[3] . "," .$row[4]; 
            echo "<br/>";
        }
fclose($file);            
?>
