<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "127.0.0.1"; 
$username   = "root";
$password   = "";
$dbname     = "test_db"; 

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $e->getMessage()
    ]);
    exit();
}

// ✅ Fetch name, phone, email, gender from table `name`
$sql = "SELECT name, phone, email, Gender,password FROM name";
$result = $conn->query($sql);

$users = [];
if ($result->num_rows > 0) {
    $users = $result->fetch_all(MYSQLI_ASSOC);
}

$conn->close();

// ✅ Send JSON response
echo json_encode([
    "success" => true,
    "message" => "Fetched all users successfully",
    "users" => $users
]);
?>
