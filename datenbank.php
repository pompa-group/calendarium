<?php
$db = mysqli_connect("localhost", "root", "", "termine");
if(!$db)
{
  exit("Verbindungsfehler: ".mysqli_connect_error());
}

$sql_query = "SELECT * FROM termine";
$ergebnis_termine = mysqli_query($db, $sql_query);
$termine = array();

while($rowin = mysqli_fetch_object($ergebnis_termine))
{
  /*echo $rowin->nummer;
  echo $rowin->name;
  echo $rowin->datum;
  echo $rowin->zeit_beginn;
  echo $rowin->zeit_ende;
  echo $rowin->ort;
  echo $rowin->link;
  echo $rowin->beschreibung;*/
  $termine[] = array('nummer' => $rowin->nummer,
                      'name' => $rowin->name,
                      'datum' => $rowin->datum,
                      'zeit_beginn' => $rowin->zeit_beginn,
                      'zeit_ende' => $rowin->zeit_ende,
                      'ort' => $rowin->ort,
                      'link' => $rowin->link,
                      'beschreibung' => $rowin->beschreibung,
                    );

}
?>
