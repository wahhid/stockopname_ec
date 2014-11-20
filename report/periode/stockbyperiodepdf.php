<?php
ob_start();
session_start();
include '../../config/dbconnect.php';
require('../lib/fpdf.php');

class PDF extends FPDF
{       
// Colored table
    
    function FancyTable($header, $data)
    {
        // Colors, line width and bold font
        $this->SetFillColor(255,0,0);
        $this->SetTextColor(255);
        $this->SetDrawColor(128,0,0);
        $this->SetLineWidth(.3);
        $this->SetFont('','B');
        // Header
        $w = array(40, 35, 40, 45);
        for($i=0;$i<count($header);$i++)
            $this->Cell($w[$i],7,$header[$i],1,0,'C',true);
        $this->Ln();
        // Color and font restoration
        $this->SetFillColor(224,235,255);
        $this->SetTextColor(0);
        $this->SetFont('');
        // Data
        $fill = false;
        foreach($data as $row)
        {
            $this->Cell($w[0],6,$row[0],'LR',0,'L',$fill);
            $this->Ln();
            $fill = !$fill;
        }
        // Closing line
        $this->Cell(array_sum($w),0,'','T');
    }    
}


$pdf = new PDF();
// Column headings
$header = array('id','warehouse');
// Data loading
$query = "SELECT * FROM stockbin";
$rs = mysql_query($query);
if($rs){
    while($row = mysql_fetch_array($rs)){
        $arr[] = $row;
    }
    $data = $arr;
    $pdf->SetFont('Arial','',14);
    $pdf->AddPage();
    $pdf->FancyTable($header,$data);
    $pdf->Output();    
}else{
    $pdf->SetFont('Arial','',14);
    $pdf->AddPage();
    $pdf->Output();    
}


?>
