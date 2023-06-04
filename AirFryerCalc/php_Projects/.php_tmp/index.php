<?php

//Every time you press a button, a new todo is added along with another button to remove it

?>

<html>
<h1>Oven to air fryer converter</h1>
<form action="todoHandler.php" method="get">
    <label> Oven temperature
        <input type="text" name="first" placeholder="Enter oven time:">
        <br>
        <br>
    <label> Oven time
        <input type="text" name="second" style="width: 195px;" placeholder="Enter oven temperature:">
        <br>
        <br>
        <input type="submit">
</form>
</html>
