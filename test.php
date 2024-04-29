<?php
// Beispiele für verschiedene Variablentypen in PHP (Integer, Float, String, Boolean, Array, Array mit Strings, Array mit gemischten Werten, assoziatives Array)
$integer = 42;
$float = 3.14;
$string = "Hello, world!";
$boolean = true;
$array = [1, 2, 3];
$arrayStrings = ["apple", "banana", "cherry"];
$arrayMixed = [1, "apple", true];
$associativeArray = ["name" => "John", "age" => 30, "city" =>"New York"];

// Ausgabe der Variablen
echo $integer . "<br>";

echo $float . "<br>";

echo $string . "<br>";

echo $boolean . "<br>";

print_r($array);
echo "<br>";

print_r($arrayStrings);
echo "<br>";

print_r($arrayMixed);
echo "<br>";

print_r($associativeArray);
echo "<br>";

// Ausgabe einzelner Werte aus dem assoziativen Array
echo $associativeArray["name"] . "<br>";

echo $associativeArray["age"] . "<br>";

echo $associativeArray["city"] . "<br>";

// Bedingungen
if ($integer > 0) {
    echo "The integer is positive.<br>";
} else {
    echo "The integer is not positive.<br>";
}

if ($float > 0) {
    echo "The float is positive.<br>";
} else {
    echo "The float is not positive.<br>";
}

if ($string == "Hello, world!") {
    echo "The string is 'Hello, world!'.<br>";
} else {
    echo "The string is not 'Hello, world!'.<br>";
}

if ($boolean) {
    echo "The boolean is true.<br>";
} else {
    echo "The boolean is false.<br>";
}

// Array mit Schleifen ausgeben

// Assoziatives Array mit Schleifen ausgeben

// Funktionen

?>
<!-- erstelle eine einfache HTML-Struktur und gebe alle oben erzeugten Werte in der Struktur aus -->