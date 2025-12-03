<?php
session_start();
if (!isset($_SESSION['userId'])) {
    header("Location: login.php");
    exit;
}

require 'db_connect.php';
$error = "";
$success = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['projectName'];
    $description = $_POST['description'];
    $members = $_POST['members'];

    if (count($members) < 3) {
        $error = "Please select at least 3 members.";
    } else {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE name = ?");
        $stmt->execute([$name]);
        if ($stmt->rowCount() > 0) {
            $error = "Project name already exists.";
        } else {
            $stmt = $pdo->prepare("INSERT INTO projects (name, description) VALUES (?, ?)");
            $stmt->execute([$name, $description]);
            $projectId = $pdo->lastInsertId();

            $stmtMember = $pdo->prepare("INSERT INTO projectMembership (projectId, memberId) VALUES (?, ?)");
            foreach ($members as $memberId) {
                $stmtMember->execute([$projectId, $memberId]);
            }

            header("Location: index.php?newProjectId=".$projectId);
            exit;
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #e6f0ff;
            padding: 50px;
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
            color: white;
            border: none;
            cursor: pointer;
            width: 100%;
        } 

        .top-btn {
            text-decoration: none;
            background-color: #007BFF;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
        }

        .logout-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            text-decoration: none;
            background-color: #dc3545;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
        }
        div input {
            width: 30px;
        }
        .error { color: red; margin-bottom: 10px; }
    </style>
</head>
<body>

<h2 style="text-align:center;">Add a New Project</h2>
<div style="position: absolute; top: 20px; right: 20px;">
    <a href="project.php" class="top-btn" style="margin-left: 10px;">Projects</a>
    <a href="logout.php" class="top-btn">Logout</a>
</div>
<?php if ($error) echo "<p class='error'>{$error}</p>"; ?>

<form method="post">
    Name: <input type="text" name="projectName" required><br>
    Description: <textarea name="description" rows="4" required></textarea><br>
    Members (select at least 3):<br>
    <div style="border: 1px solid #ccc; padding: 10px; height: 150px; overflow-y: scroll;">
        <?php
        $stmt = $pdo->query("SELECT userId, firstName, lastName FROM users");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $fullName = $row['firstName'] . ' ' . $row['lastName'];
            echo "<label style='display:flex; margin:5px 0;'>";
            echo "<input type='checkbox' name='members[]' value='{$row['userId']}' style='margin-left:10px;'> {$fullName}";
            echo "</label>";
        }
        ?>
    </div>
    <br>
    <button type="submit">Submit Project</button>
</form>

</body>
</html>
