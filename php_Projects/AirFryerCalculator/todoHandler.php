<?php

echo "<link rel='stylesheet' href='air.css'>";

$ovenTemp = $_GET['first'];

$newOvenTemp = $ovenTemp - 20;

$ovenTime = $_GET['second'];

$ovenTimePerc = ($ovenTime/100)*20;

$airTime = $ovenTime - $ovenTimePerc;

echo "<h2 class='ot'>";
echo "Air fryer temperature = ",$newOvenTemp," °C";
echo "</h2>";
echo "<h2 class='at'>";
echo "Air fryer time = ",round($airTime) , " minutes";
echo "</h2>";
