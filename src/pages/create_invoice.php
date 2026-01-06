<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// التعامل مع OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// التحقق من أن الطلب POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// ✅ إعدادات قاعدة البيانات
$host = 'localhost';
$dbname = 'u551556194_perfume_store';
$username = 'u551556194_perfume_store';
$password = 'YOUR_DATABASE_PASSWORD'; // ⚠️ حط الباسورد بتاع قاعدة البيانات هنا

// ✅ إعدادات MyFatoorah
$MYFATOORAH_API_KEY = 'rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs8_a6ZiIxv9PXU6G0PLvXA-xYFpVTb2jW1r_6u3qDj3_CSmDr0MNZCQqCIXx'; // ⚠️ حط الـ Test Token هنا
$MYFATOORAH_BASE_URL = 'https://apitest.myfatoorah.com'; // ⚠️ Test URL (غيرها للـ Live: https://api.myfatoorah.com)

// ✅ الاتصال بقاعدة البيانات
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database connection failed',
        'message' => $e->getMessage()
    ]);
    exit();
}

// ✅ قراءة البيانات من الـ Request
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

// ✅ التحقق من البيانات المطلوبة
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// ✅ استخراج البيانات
$session_id = $data['session_id'] ?? null;
$name = $data['name'] ?? null;
$phone = $data['phone'] ?? null;
$address = $data['address'] ?? null;
$street = $data['street'] ?? null;
$total_price = $data['total_price'] ?? 0;
$items = $data['items'] ?? [];

// ✅ التحقق من البيانات الأساسية
if (!$session_id || !$name || !$phone || !$address || !$street) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Missing required fields',
        'message' => 'يجب ملء جميع الحقول المطلوبة'
    ]);
    exit();
}

// ✅ التحقق من وجود منتجات
if (empty($items) || !is_array($items)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'No items provided',
        'message' => 'السلة فارغة'
    ]);
    exit();
}

// ✅ بدء Transaction
try {
    $pdo->beginTransaction();

    // ✅ 1️⃣ إدخال الطلب في جدول orders
    $sql = "INSERT INTO orders (session_id, name, phone, address, street, total_price, payment_status, created_at) 
            VALUES (:session_id, :name, :phone, :address, :street, :total_price, 'pending', NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':session_id' => $session_id,
        ':name' => $name,
        ':phone' => $phone,
        ':address' => $address,
        ':street' => $street,
        ':total_price' => $total_price
    ]);

    // ✅ الحصول على order_id
    $order_id = $pdo->lastInsertId();

    // ✅ 2️⃣ إدخال المنتجات في جدول order_items
    $sql_items = "INSERT INTO order_items (order_id, product_id, quantity, size) 
                  VALUES (:order_id, :product_id, :quantity, :size)";
    
    $stmt_items = $pdo->prepare($sql_items);

    foreach ($items as $item) {
        $product_id = $item['product_id'] ?? null;
        $quantity = $item['quantity'] ?? 1;
        $size = $item['size'] ?? '';

        if (!$product_id) {
            throw new Exception('Missing product_id in items');
        }

        $stmt_items->execute([
            ':order_id' => $order_id,
            ':product_id' => $product_id,
            ':quantity' => $quantity,
            ':size' => $size
        ]);
    }

    // ✅ 3️⃣ إنشاء رابط الدفع من MyFatoorah
    $callbackURL = 'https://blomengdalis-tester.com/payment-callback.php'; // ⚠️ صفحة الاستجابة بعد الدفع
    $errorURL = 'https://blomengdalis-tester.com/payment-error.php'; // ⚠️ صفحة الخطأ

    $paymentData = [
        'CustomerName' => $name,
        'InvoiceValue' => $total_price,
        'DisplayCurrencyIso' => 'KWD',
        'MobileCountryCode' => '+965',
        'CustomerMobile' => $phone,
        'CustomerEmail' => 'customer@example.com', // ⚠️ لو عندك إيميل من الفورم، حطه هنا
        'CallBackUrl' => $callbackURL,
        'ErrorUrl' => $errorURL,
        'Language' => 'ar',
        'CustomerReference' => 'ORD-' . $order_id,
        'CustomerCivilId' => '',
        'UserDefinedField' => 'Order ID: ' . $order_id,
        'CustomerAddress' => [
            'Block' => '',
            'Street' => $street,
            'HouseBuildingNo' => '',
            'Address' => $address,
            'AddressInstructions' => ''
        ]
    ];

    // ✅ إرسال الطلب لـ MyFatoorah
    $ch = curl_init($MYFATOORAH_BASE_URL . '/v2/SendPayment');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($paymentData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $MYFATOORAH_API_KEY
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $responseData = json_decode($response, true);

    // ✅ التحقق من استجابة MyFatoorah
    if ($httpCode !== 200 || !isset($responseData['Data']['InvoiceURL'])) {
        throw new Exception('MyFatoorah API Error: ' . ($responseData['Message'] ?? 'Unknown error'));
    }

    $payment_url = $responseData['Data']['InvoiceURL'];
    $invoice_id = $responseData['Data']['InvoiceId'];

    // ✅ تحديث الطلب بـ invoice_id (اختياري - لو عايز تحفظه)
    // يمكنك إضافة عمود invoice_id في جدول orders
    
    // ✅ تأكيد Transaction
    $pdo->commit();

    // ✅ إرجاع الاستجابة
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'order_id' => $order_id,
        'invoice_id' => $invoice_id,
        'payment_url' => $payment_url,
        'message' => 'تم إنشاء الطلب بنجاح'
    ]);

} catch (Exception $e) {
    // ✅ في حالة حدوث خطأ، التراجع عن Transaction
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Error creating invoice',
        'message' => $e->getMessage()
    ]);
}
?>