<?php

//Every time you press a button, a new todo is added along with another button to remove it

?>

<html>
<head>
    <link rel="stylesheet" href="air.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>
<h1 class="ms-2">Oven to air fryer converter</h1>
<form action="todoHandler.php" method="get">
    <div class="mb-3 ms-2">
        <label> Oven temperature (Celsius °C)
        <input type="text" name="first" placeholder="Enter oven temperature:" >
    </div>
    <div class="mb-3 ms-2">
        <label> Oven time (Minutes)
        <input type="text" name="second" style="width: 195px; " placeholder="Enter oven time:">
    </div>
    <div class="ms-2">
        <input type="submit" class="btn btn-primary">
    </div>
</form>

</html>
