<?php
session_start();
require 'db_connect.php';

$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userId = $_POST["userId"];
    $password = $_POST["password"];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE userId = ?");
    $stmt->execute([$userId]);

    if ($stmt->rowCount() == 0) {
        header("Location: register.php?userId=" . urlencode($userId));
        exit;
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (password_verify($password . $user['salt'], $user['passwordHash'])) {
        $_SESSION["userId"] = $user['userId'];
        header("Location: index.php");
        exit;
    } else {
        $error = "Incorrect password. Please try again.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            align-items: center;
            height: 100%;
            font-family: Arial, sans-serif;
            background-color: #e6f0ff;
        }
        form {
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 80%;
            padding: 30px;
            width: 320px;
        }
        h2 {
            text-align: center;
            color: #003366;
            margin-bottom: 20px;
        }
        input[type="text"], input[type="password"] {
            width: 91%;
            padding: 10px;
            margin: 8px 0 16px 0;
            border: 1px solid #007BFF;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
        p.error {
            color: red;
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <form method="post">
        <h2>Login</h2>
        User ID: <input type="text" name="userId" required><br>
        Password: <input type="password" name="password" required><br>
        <button type="submit">Login</button>
        <p class="error"><?php echo $error; ?></p>
    </form>
</body>
</html>

