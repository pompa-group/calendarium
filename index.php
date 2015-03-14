<!DOCTYPE HTML>
<?php
  include('datenbank.php');
  include('date.php');
?>
<html>

  <head>
    <title>Kalender</title>
    <meta charset="UTF-8" />
  </head>

  <body>
    <h1><?php echo $wochentag.". ".$tag." ".$monat ?></h1>
    <div id="liste">
      <?php include('liste.php') ?>
    </div>
    <?php echo $datum ?>
  </body>

</html>
