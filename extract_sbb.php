<?php
echo "PubliBike Stations and Available Bicycles\n";

$url = "https://transport.opendata.ch/v1/locations?query=Chur";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$output = curl_exec($ch);

if (!$output) {
    echo "Error fetching data\n";
    exit;
}

$data = json_decode($output, true);

if (!isset($data['stations']) && isset($data['stations'])) {
    $data['stations'] = $data['stations'];
} elseif (isset($data['stations'])) {
    $data['stations'] = $data['stations'];
} else {
    echo "Unexpected data structure\n";
    exit;
}

$station_data = [];
foreach ($data['stations'] as $station) {
    $station_id = $station['id'] ?? 'unknown';
    $station_name = $station['name'] ?? 'unknown';
    $latitude = $station['coordinate']['x'] ?? 'No Latitude';
    $longitude = $station['coordinate']['y'] ?? 'No Longitude';

    // Hier nehmen wir an, dass keine Fahrzeugdaten verfügbar sind
    $station_data[] = [
        'station_id' => $station_id,
        'station_name' => $station_name,
        'latitude' => $latitude,
        'longitude' => $longitude
    ];
}

print_r($station_data);

curl_close($ch);


?>
