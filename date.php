<?php

$timestamp = time();
$datum = date("Y-m-d",$timestamp);
$datum2 = date("d.m.Y", $timestamp);
$tag = date("d",$timestamp);
$monat_index = date("n",$timestamp);
$wochentag_index = date("w",$timestamp);


//Wochentag bestimmen
switch($wochentag_index)
{
  case ("1"):
  $wochentag = "Mo";
  break;

  case ("2"):
  $wochentag = "Di";
  break;

  case ("3"):
  $wochentag = "Mi";
  break;

  case ("4"):
  $wochentag = "Do";
  break;

  case ("5"):
  $wochentag = "Fr";
  break;

  case ("6"):
  $wochentag = "Sa";
  break;

  case ("7"):
  $wochentag = "So";
  break;
}
//Monat ausgeschrieben
switch($monat_index)
{
  case ("1"):
  $monat = "Januar";
  break;

  case ("2"):
  $monat = "Februar";
  break;

  case ("3"):
  $monat = "März";
  break;

  case ("4"):
  $monat = "April";
  break;

  case ("5"):
  $monat = "Mai";
  break;

  case ("6"):
  $monat = "Juni";
  break;

  case ("7"):
  $monat = "Juli";
  break;

  case ("8"):
  $monat = "August";
  break;

  case ("9"):
  $monat = "Septemper";
  break;

  case ("10"):
  $monat = "Oktober";
  break;

  case ("11"):
  $monat = "November";
  break;

  case ("12"):
  $monat = "Dezember";
  break;


}
?>
