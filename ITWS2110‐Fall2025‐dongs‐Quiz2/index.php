<?php
session_start();

if (!isset($_SESSION["userId"])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
    <style>
        body {
            align-items: center;
            height: 100%;
            font-family: Arial, sans-serif;
            background-color: #e6f0ff;
        }

    </style>    
<body>

<ul>
    <li><a href="project.php">Projects</a></li>
    <li><a href="addProject.php">Projects Form</a></li>
</ul>

<a href="logout.php">Logout</a>

</body>
</html>
