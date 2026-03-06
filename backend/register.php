<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name']) || !isset($data['email']) || !isset($data['phone']) || !isset($data['password'])) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit();
}

$name = $data['name'];
$email = $data['email'];
$phone = $data['phone'];
$password = $data['password'];

$sql = "INSERT INTO name (name, email, phone, password) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $name, $email, $phone, $password);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    echo json_encode([
        "success" => true,
        "message" => "Registration successful!",
        "user" => [
            "id" => $userId,
            "name" => $name,
            "email" => $email,
            "phone" => $phone
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Registration failed: " . $conn->error
    ]);
}

$conn->close();
?>

