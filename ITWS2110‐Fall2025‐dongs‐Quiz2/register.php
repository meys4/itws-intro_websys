<?php
require 'db_connect.php';

$defaultUserId = isset($_GET['userId']) ? $_GET['userId'] : '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = $_POST["firstName"];
    $lastName = $_POST["lastName"];
    $nickName = $_POST["nickName"];
    $password = $_POST["password"];

    $salt = bin2hex(random_bytes(16));
    $passwordHash = password_hash($password . $salt, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (firstName, lastName, nickName, passwordHash, salt)
                           VALUES (?, ?, ?, ?, ?)");

    $stmt->execute([$firstName, $lastName, $nickName, $passwordHash, $salt]);

    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #e6f0ff;
            padding: 50px;
        }
        h2 {
            text-align: center;
        }
        form {
            background-color: white;
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
        }
        input, textarea, select, button[type="submit"] {
            width: 96.0%;
            margin: 8px 0;
            padding: 10px;
            border: 1px solid #ccc;
            font-size: 14px;
        }
        button[type="submit"] {
            background-color: #007BFF;
            width: 100%;
            color: white;
            border: none;
            cursor: pointer;
        } 

        div input {
            width: 30px;
        }
        .error { color: red; margin-bottom: 10px; }
    </style>
<body>
<h2>Register New User</h2>

<form method="post">
    First Name: <input type="text" name="firstName" required><br><br>
    Last Name: <input type="text" name="lastName" required><br><br>
    Nickname: <input type="text" name="nickName"><br><br>
    Password: <input type="password" name="password" required><br><br>

    <button type="submit">Register</button>
</form>
</body>
</html>
