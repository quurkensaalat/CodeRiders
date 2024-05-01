<?php
include 'extract.php';

$filtered_data = [];

foreach ($station_data as $station) {
    if ($station['city'] === 'Chur') {
        // Prüfe, ob der vehicle_type "bike" entspricht
        if (isset($station['vehicle_type']) && $station['vehicle_type'] === 'Bike') {
            $station['ebike_battery_level'] = null;
        }
        $filtered_data[] = $station;
    }
}

if (count($filtered_data) > 0) {
    echo "Stationen nur in Chur:\n";
    print_r($filtered_data);
} else {
    echo "No stations found in Chur.";
}
?>
