<?php
// Beispiele für verschiedene Variablentypen in PHP (Integer, Float, String, Boolean, Array, Array mit Strings, Array mit gemischten Werten, assoziatives Array)
$integer = 42;
$float = 3.14;
$string = "Hello, world!";
$boolean = true;
$array = [1, 2, 3];
$arrayStrings = ["apple", "banana", "cherry"];
$arrayMixed = [1, "apple", true];
$associativeArray = ["name" => "John", "age" => 30];

// Ausgabe der Variablen
echo $integer . "\n";
echo $float . "\n";
echo $string . "\n";
echo $boolean . "\n";
print_r($array);
print_r($arrayStrings);
print_r($arrayMixed);
print_r($associativeArray);

// Ausgabe einzelner Werte aus dem assoziativen Array
echo $associativeArray["name"] . "\n";
echo $associativeArray["age"] . "\n";



// Bedingungen

// Schleifen

// Array mit Schleifen ausgeben

// Assoziatives Array mit Schleifen ausgeben

// Funktionen

?>
<!-- erstelle eine einfache HTML-Struktur und gebe alle oben erzeugten Werte in der Struktur aus -->