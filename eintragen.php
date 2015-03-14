<?php
  include('datenbank.php');
  include('date.php');

  //datumskonventierfunktion

  function date_german2mysql($date) {
    $d    =    explode(".",$date);

    return    sprintf("%04d-%02d-%02d", $d[2], $d[1], $d[0]);
    }

  if (isset($_POST['formular_send']))
    {
      echo "Formular wurde abgesendet";
      if ($_POST['termin_titel'] != '' && $_POST['termin_datum'] != '' && $_POST['termin_beginn'] != '' && $_POST['termin_ende'] != '' && $_POST['termin_ort'] != '' && $_POST['termin_description'] != '')
        {
          //echo "Alle Felder wurden ausgefuellt";

          //Werte ggf. prüfen
          //Werte in DB schreiben
          $name = $_POST['termin_titel'];
          $datum = date_german2mysql($_POST['termin_datum']);
          $zeit_beginn = $_POST['termin_beginn'];
          $zeit_ende = $_POST['termin_ende'];
          $ort = $_POST['termin_ort'];
          $link = $_POST['termin_link'];
          $beschreibung = $_POST['termin_description'];
          $eintrag_termin = "INSERT INTO termine (name, datum, zeit_beginn, zeit_ende, ort, link, beschreibung) VALUES ('$name', '$datum', '$zeit_beginn', '$zeit_ende', '$ort', '$link', '$beschreibung')";
          $eintragen = mysqli_query($db, $eintrag_termin);
          echo "Termin wurde erfolgreich gespeichert!";
        } else {
          echo "Fuellen Sie bitte alle benoetigten Felder aus.";
        }
    }
?>
<!DOCTYPE HTML>
<html>

  <head>
    <title>Termin erstellen</title>
    <script type="text/javascript">
    //<![CDATA[
    var _calPickDir = "";
    var _calImageAlign = "top";
    var _calTopDistance = 5;
    var _calImageStyle = "margin-top:" + _calTopDistance + "px";
    //]]>
    </script>
    <script type="text/javascript" src="calpick.js"></script>
  </head>

  <body>

    <form name="dateform" id="dateform" method="post" action="eintragen.php">

    <ul>

    	<li>
        <label>Titel</label>
        <br/>
    		<input type='text' name='termin_titel' id='text_id' value='' />

    	</li>

      <li>
        <label>Datum</label>
        <br/>
        <input name="termin_datum" type="text" value="<?php echo $datum2 ?>"  size="10" readonly/>
      	<script type="text/javascript">
      		//<![CDATA[
      		AttachCalendarButton(document.dateform.termin_datum);
      		//]]>
      	</script>

    	</li>

    	<li>
        <label>Beginn</label>
        <br/>
    		<input type="text" name="termin_beginn" id="text_id" value="" />
        <input type="hidden" name="formular_send" id="text_id" value="" />
    	</li>

    	<li>
        <label>Ende</label>
        <br/>
    		<input type="text" name="termin_ende" id="text_id" value="" />
    	</li>

    	<li>
        <label>Ort</label>
        <br/>
    		<input type="text" name="termin_ort" id="text_id" value="" />
    	</li>

    	<li>
        <label>Link(maps, better integration comming soon)</label>
        <br/>
    		<input type="text" name="termin_link" id="text_id" value="" />
    	</li>

    	<li>
        <label>Beschreibung</label>
        <br />
    		<input type="text" name="termin_description" id="text_id" value="" />
    	</li>

      <li class="wmfg_q">
    		<input type="submit" name="submit_name" id="submit_id" value="Speichern" />
    	</li>

    </ul>

    </form>

  </body>

</html>
