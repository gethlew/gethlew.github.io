<?php

$ovenTemp = $_GET['first'];

$newOvenTemp = $ovenTemp - 20;

$ovenTime = $_GET['second'];

$ovenTimePerc = ($ovenTime/100)*20;

$airTime = $ovenTime - $ovenTimePerc;

echo $newOvenTemp;
echo "<br>";
echo "<br>";
echo round($airTime) , " minutes";
