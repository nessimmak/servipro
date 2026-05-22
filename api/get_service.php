<?php
// =============================================
//  API : get_service.php – Récupérer un service
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/Service.php';

$id = (int)($_GET['id'] ?? 0);

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'ID invalide.']);
    exit;
}

$serviceClass = new Service();
$service      = $serviceClass->findById($id);

if ($service) {
    echo json_encode([
        'success' => true,
        'service' => $service
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Service introuvable.'
    ]);
}