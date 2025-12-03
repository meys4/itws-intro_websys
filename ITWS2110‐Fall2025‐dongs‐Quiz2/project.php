<?php
session_start();
require 'db_connect.php';

// Redirect if not logged in
if (!isset($_SESSION["userId"])) {
    header("Location: login.php");
    exit;
}

$error = "";
$successProjectId = null;

$users = $pdo->query("SELECT userId, firstName, lastName FROM users ORDER BY firstName")->fetchAll(PDO::FETCH_ASSOC);

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST["name"]);
    $description = trim($_POST["description"]);
    $members = isset($_POST["members"]) ? $_POST["members"] : [];

    if (count($members) < 3) {
        $error = "A project must have at least 3 members.";
    }

    if ($error === "") {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE name = ?");
        $stmt->execute([$name]);

        if ($stmt->rowCount() > 0) {
            $error = "A project with that name already exists.";
        }
    }

    if ($error === "") {

        $stmt = $pdo->prepare("INSERT INTO projects (name, description) VALUES (?, ?)");
        $stmt->execute([$name, $description]);
        $successProjectId = $pdo->lastInsertId();

        $stmtMembership = $pdo->prepare("INSERT INTO projectMembership (projectId, memberId) VALUES (?, ?)");
        foreach ($members as $memberId) {
            $stmtMembership->execute([$successProjectId, $memberId]);
        }
    }
}

// Fetch all projects & their members
$projects = $pdo->query("
    SELECT p.projectId, p.name, p.description,
           GROUP_CONCAT(CONCAT(u.firstName, ' ', u.lastName) SEPARATOR ', ') AS members
    FROM projects p
    JOIN projectMembership pm ON p.projectId = pm.projectId
    JOIN users u ON pm.memberId = u.userId
    GROUP BY p.projectId
    ORDER BY p.projectId DESC;
")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html>
<head>
<style>
body {
    font-family: Arial, sans-serif;
    background-color: #e6f0ff;
    padding: 50px;
    position: relative;
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

.project-box {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
}

.error {
    color: red;
    font-weight: bold;
}
</style>
</head>

<body>

    <div style="position: absolute; top: 20px; right: 20px;">
        <a href="addProject.php" class="top-btn" style="margin-left: 10px;">Add Project</a>
        <a href="logout.php" class="top-btn">Logout</a>
    </div>

    <h2>Existing Projects</h2>

    <?php foreach ($projects as $p): ?>
        <div class="project-box <?php if($successProjectId == $p['projectId']) { echo 'added-project'; } ?>">
            <h3><?= htmlspecialchars($p['name']) ?></h3>
            <p><strong>Description:</strong> <?= nl2br(htmlspecialchars($p['description'])) ?></p>
            <p><strong>Members:</strong> <?= htmlspecialchars($p['members']) ?></p>
        </div>
    <?php endforeach; ?>

</body>
</html>
