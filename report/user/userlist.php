<?php
   // include the PHPReports classes on the PHP path! configure your path here
   ini_set("include_path",ini_get("include_path").";D:\AppServ\www\stockopnam\phpreports"); 
   include "PHPReportMaker.php";

   $sSQL = "SELECT * from user ORDER BY fullname";
   $oRpt = new PHPReportMaker();

   $oRpt->setXML("userlist02.xml");
   $oRpt->setUser("root");
   $oRpt->setPassword("root");
   $oRpt->setConnection("localhost");
   $oRpt->setDatabaseInterface("mysql");
   $oRpt->setParameters(array("printeddate"=>date('d/m/Y h:i:s'),"printedby"=>$_SESSION['login']));
   $oRpt->setSQL($sSQL);   
   $oRpt->setDatabase("opnam");
   $oRpt->run();
?>
