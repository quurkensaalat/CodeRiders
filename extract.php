<?php
echo "PubliBike Stations and Available Bicycles\n";

$url = "https://api.publibike.ch/v1/public/partner/stations";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$output = curl_exec($ch);

if (!$output) {
    echo "Error fetching data\n";
    exit;
}

$data = json_decode($output, true);

if (!isset($data['stations'])) {
    echo "Unexpected data structure\n";
    exit;
}

$station_data = [];
foreach ($data['stations'] as $station) {
    $station_id = $station['id'] ?? 'unknown';
    $station_name = $station['name'] ?? 'unknown';
    $address = $station['address'] ?? 'No Address';
    $zip = $station['zip'] ?? 'No PLZ';
    $city = $station['city'] ?? 'No City';
    $capacity = $station['capacity'] ?? 'No Capacity'; 
    $vehicles = $station['vehicles'] ?? [];

    foreach ($vehicles as $vehicle) {
        $vehicle_id = $vehicle['id'] ?? 'unknown';
        $vehicle_name = $vehicle['name'] ?? 'unknown';
        $ebike_battery_level = $vehicle['ebike_battery_level'] ?? 'unknown';
        $vehicle_type = $vehicle['type']['name'] ?? 'Type Unknown';
        
        $station_data[] = [
            'station_id' => $station_id,
            'station_name' => $station_name,
            'address' => $address,
            'zip' => $zip,
            'city' => $city,
            'capacity' => $capacity,
            'vehicle_id' => $vehicle_id,
            'vehicle_name' => $vehicle_name,
            'ebike_battery_level' => $ebike_battery_level,
            'vehicle_type' => $vehicle_type // Typname hinzufügen
        ];
    }
}

 print_r($station_data);

curl_close($ch);

?>
