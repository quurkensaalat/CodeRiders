<?php

header('Access-Control-Allow-Origin: https://673330-7.web.fhgr.ch');
header('Content-Type: application/json');

//Database configuration
require_once 'config.php';

//Set Header for JSON
header('Content-Type: application/json');

//Request User parameters
if (isset($_GET['station_name'])) {

    //replace the %20 with space
    $publibike = $_GET['station_name'];
    $publibike = str_replace("%20", " ", $publibike);

} else {
    $publibike = '';
}

if(isset($_GET['start'])){
    $start = $_GET['start'];
    $start = str_replace("%20", " ", $start);
} else {
    $start = 0;
}

if(isset($_GET['end'])){
    $end = $_GET['end'];
    $end = str_replace("%20", " ", $end);
} else {
    $end = 0;
}

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

    if($publibike != ''){

        //SQL Query
        $sql = "SELECT * FROM bike_chur WHERE station_name = :station_name ORDER BY timestamp DESC";
        
        //Prepare the SQL Query
        $stmt = $pdo->prepare($sql);

        //Execute the SQL Query
        $stmt->execute(['station_name' => $publibike]);

        //Fetch the data
        $results = $stmt->fetchAll();
   
    } else {
        if($start != 0 && $end != 0){
            //SQL Query
            $sql = "SELECT * FROM bike_chur WHERE timestamp BETWEEN :start AND :end ORDER BY timestamp DESC";

            //Prepare the SQL Query
            $stmt = $pdo->prepare($sql);

            //Execute the SQL Query
            $stmt->execute(['start' => $start, 'end' => $end]);

            //Fetch the data
            $results = $stmt->fetchAll();

        } else if ($start != 0) {
            $sql = "SELECT * FROM bike_chur WHERE timestamp > :start ORDER BY timestamp DESC";


            //Prepare the SQL Query
            $stmt = $pdo->prepare($sql);

            //Execute the SQL Query
            $stmt->execute(['start' => $start]);

            //Fetch the data
            $results = $stmt->fetchAll();
        }

        else if ($end != 0) {
            $sql = "SELECT * FROM bike_chur WHERE timestamp < :end ORDER BY timestamp DESC";


            //Prepare the SQL Query
            $stmt = $pdo->prepare($sql);

            //Execute the SQL Query
            $stmt->execute(['end' => $end]);

            //Fetch the data
            $results = $stmt->fetchAll();
        }
        
        else {
            //SQL Query
            $sql = "SELECT * FROM bike_chur ORDER BY timestamp DESC";
            
            //Prepare the SQL Query
            $stmt = $pdo->prepare($sql);
    
            //Execute the SQL Query
            $stmt->execute();
    
            //Fetch the data
            $results = $stmt->fetchAll();
            }
        }
    
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    
    //Check if the data is empty
    if ($results && $stmt->rowCount() > 0) {
        //Output the data
        echo json_encode($results);
    } else {
        //Output error message
        echo json_encode(['message' => 'No data found']);
    }
    
    ?>