<?php
// ===================================
// GET CMS DATA BY MERCHANT
// ===================================
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Database connection - Same credentials as other endpoints
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

// Get merchant_id from query parameters
$merchant_id = isset($_GET['merchant_id']) ? intval($_GET['merchant_id']) : 1;

if ($merchant_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid merchant_id"
    ]);
    exit();
}

try {
    // Query CMS configurations by merchant
    // We assume there's a cms_configurations or similar table
    // Structure: id, merchant_id, modelSlug, configName, configValue, isActive
    
    $sql = "SELECT id, modelSlug, configName, configValue FROM cms_configurations 
            WHERE merchant_id = ? AND isActive = 1
            ORDER BY modelSlug, configName";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        // If table doesn't exist, return default configurations
        $defaultConfigs = generateDefaultConfigs($merchant_id);
        echo json_encode($defaultConfigs);
        exit();
    }
    
    $stmt->bind_param("i", $merchant_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Group configurations by modelSlug
    $cmsDataBySlug = [];
    
    while ($row = $result->fetch_assoc()) {
        $modelSlug = $row['modelSlug'];
        
        if (!isset($cmsDataBySlug[$modelSlug])) {
            $cmsDataBySlug[$modelSlug] = [
                'modelSlug' => $modelSlug,
                'cms' => []
            ];
        }
        
        // Add configuration value
        $cmsDataBySlug[$modelSlug]['cms'][$row['configName']] = [
            'fieldValue' => $row['configValue'],
            'fieldName' => $row['configName']
        ];
    }
    
    // Convert to indexed array
    $cmsData = array_values($cmsDataBySlug);
    
    // If no data found, provide defaults
    if (empty($cmsData)) {
        $cmsData = generateDefaultConfigs($merchant_id);
    }
    
    echo json_encode($cmsData);
    
} catch (Exception $e) {
    // If table doesn't exist, return default configurations
    $defaultConfigs = generateDefaultConfigs($merchant_id);
    echo json_encode($defaultConfigs);
}

$conn->close();

/**
 * Generate default CMS configurations for a merchant
 * This serves as fallback when database table doesn't exist
 */
function generateDefaultConfigs($merchant_id) {
    return [
        [
            'modelSlug' => 'homeUiConfiguration',
            'cms' => [
                'headerLogo' => [
                    'fieldValue' => 'https://via.placeholder.com/60',
                    'fieldName' => 'headerLogo'
                ],
                'headerBgColor' => [
                    'fieldValue' => '#000000',
                    'fieldName' => 'headerBgColor'
                ],
                'headerIconColor' => [
                    'fieldValue' => '#E50914',
                    'fieldName' => 'headerIconColor'
                ],
                'homeBgColor' => [
                    'fieldValue' => '#0B0B0F',
                    'fieldName' => 'homeBgColor'
                ]
            ]
        ],
        [
            'modelSlug' => 'loginConfiguration',
            'cms' => [
                'logoImage' => [
                    'fieldValue' => 'https://via.placeholder.com/120',
                    'fieldName' => 'logoImage'
                ],
                'bgColor' => [
                    'fieldValue' => '#ffffff',
                    'fieldName' => 'bgColor'
                ],
                'buttonColor' => [
                    'fieldValue' => '#E50914',
                    'fieldName' => 'buttonColor'
                ],
                'textColor' => [
                    'fieldValue' => '#000000',
                    'fieldName' => 'textColor'
                ]
            ]
        ],
        [
            'modelSlug' => 'registrationConfiguration',
            'cms' => [
                'logoImage' => [
                    'fieldValue' => 'https://via.placeholder.com/100',
                    'fieldName' => 'logoImage'
                ],
                'bgColor' => [
                    'fieldValue' => '#ffffff',
                    'fieldName' => 'bgColor'
                ],
                'buttonColor' => [
                    'fieldValue' => '#E50914',
                    'fieldName' => 'buttonColor'
                ],
                'titleColor' => [
                    'fieldValue' => '#000000',
                    'fieldName' => 'titleColor'
                ]
            ]
        ],
        [
            'modelSlug' => 'homeOrderingBanner',
            'cms' => []
        ],
        [
            'modelSlug' => 'homeCtaCards',
            'cms' => []
        ],
        [
            'modelSlug' => 'appWelcomeMessage',
            'cms' => [
                'message' => [
                    'fieldValue' => 'Welcome to our app!',
                    'fieldName' => 'message'
                ]
            ]
        ]
    ];
}
?>
