<?php
for($i=0; $i < count($termine); $i++)
   {
     echo "<hr />";
     echo "<h2>".$termine[$i]['datum']." - ".$termine[$i]['zeit_beginn']." Uhr</h2>";
     echo "<br />";
     echo "<h3>".$termine[$i]['name']."</h3>";
     echo "<br />";
     echo "<a href=\"".$termine[$i]['link']."\">".$termine[$i]['ort']."</a>";
     echo "<br />";
     echo "<p>".$termine[$i]['beschreibung']."</p>";
     echo "<br />";
     echo "<h4>".$termine[$i]['zeit_ende']."</h4>";
     echo "<hr />";
   }
?>
