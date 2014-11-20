<?php
session_start();
if (!isset($_SESSION['login'])){
    header('Location: index.php');
}else{
?>        
    <html>
    <head>
        <title>Stock Opnam Application</title>
        <link rel="stylesheet" type="text/css" href="scripts/extjs/resources/css/ext-all.css">
        <script type="text/javascript" src="scripts/extjs/ext-all.js"></script>
        <script type="text/javascript" src="scripts/main/app/app.js"></script>
    </head>
    <body></body>
    </html>
<?php
}
?>