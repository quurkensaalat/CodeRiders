<?php

// include transform.php
include 'transform.php';

// require once config.php
require_once 'config.php';

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

    // SQL-Query mit korrekten Platzhaltern für das Einfügen von Daten
    $sql = "INSERT INTO bike_chur (station_id, station_name, address, zip, city, vehicle_id, vehicle_name, ebike_battery_level, vehicle_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Fügt jedes Element im Array in die Datenbank ein
    foreach ($filtered_data as $item) {
        // Bereite Daten für die SQL-Abfrage vor
        $stmt->execute([
            $item['station_id'],
            $item['station_name'],
            $item['address'],
            $item['zip'],
            $item['city'],
            $item['vehicle_id'],
            $item['vehicle_name'],
            $item['ebike_battery_level'] ?? null, // Berücksichtige, dass dieser Wert null sein könnte
            $item['vehicle_type']
        ]);
    }

    echo "Daten erfolgreich in die bike_chur Tabelle eingefügt.";
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}
?>