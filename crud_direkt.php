<?php
require_once 'config.php'; // DB-Verbindungsdaten aus externer Datei laden

// 0. Datenbankverbindung mit PDO herstellen

try {

  $pdo = new PDO($dsn, $db_user, $db_pass, $options);
  echo "Connected to the database successfully!";
} catch (PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}


?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>PHP mit HTML</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <h1><a href="crud_direkt.php">CRUD - PHP</a></h1>


</body>

</html>