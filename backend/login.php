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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['password']) || (!isset($data['identity']))) {
    echo json_encode([
        "success" => false,
        "message" => "Please provide email/phone and password"
    ]);
    exit();
}

$password = $data['password'];
$identity = $data['identity'];

$sql = "SELECT * FROM name WHERE (email = ? OR phone = ?) LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $identity, $identity);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "No user found with that email or phone"
    ]);
    exit();
}

$user = $result->fetch_assoc();

if ($user['password'] === $password) {
    echo json_encode([
        "success" => true,
        "message" => "Login successful!",
        "user" => [
            "id" => $user['id'] ?? 1,
            "name" => $user['name'],
            "email" => $user['email'],
            "phone" => $user['phone']
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Incorrect password"
    ]);
}

$conn->close();
?>

