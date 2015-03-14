<?php
include('settings.php');
$db = @mysqli_connect($db_host, $db_user, $db_pass);
if(!$db)
{
  exit("Verbindungsfehler: ".mysqli_connect_error());
}
$sql_befehl = "CREATE DATABASE IF NOT EXISTS termine_in";

if ($db->query($sql_befehl)) {
  // Meldung bei erfolgreicher Erstellung der Datenbank
  echo "Datenbank erfolgreich angelegt.";
} else {
  // Meldung bei Fehlschlag
  echo "Datenbank konnte nicht angelegt werden!";
}
@mysql_close($db);


//tabelle erstellen
$dz = @mysql_connect("localhost", "root", "")
      OR die('Verbindung fehlgeschlagen');
    mysql_select_db("termine_in")
      OR die('Konnte Datenbank nicht benutzen');
    $sql_befehl = "CREATE TABLE `termine2` (
      `nummer` int(11) NOT NULL auto_increment,
      `name` char(255) NOT NULL,
      `datum` date NOT NULL,
      `zeit_beginn` char(255) NOT NULL,
      `zeit_ende` char(255) NOT NULL,
      `ort` char(255) NOT NULL,
      `link` longtext NOT NULL,
      `beschreibung` char(255) NOT NULL,
      PRIMARY KEY (`nummer`)
    ) AUTO_INCREMENT=1;";
    if (mysql_query($sql_befehl)) {
      echo "Datenbanktabelle erfolgreich angelegt.<br>" ;
    } else {
      echo "Datenbanktabelle konnte nicht angelegt werden!<br>" ;
    }





/*CREATE TABLE `termine2` (
  `nummer` int(11) NOT NULL auto_increment,
  `name` char(255) NOT NULL,
  `datum` date NOT NULL,
  `zeit_beginn` char(255) NOT NULL,
  `zeit_ende` char(255) NOT NULL,
  `ort` char(255) NOT NULL,
  `link` longtext NOT NULL,
  `beschreibung` char(255) NOT NULL,
  PRIMARY KEY (`nummer`)
) AUTO_INCREMENT=1;*/
?>
