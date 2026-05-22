<?php
// =============================================
//  API : get_services.php – Récupérer les services
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/Service.php';

$serviceClass = new Service();

// Si admin → tous les services
// Si utilisateur → seulement les actifs
if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
    $services = $serviceClass->getAll();
} else {
    $services = $serviceClass->getAllActifs();
}

echo json_encode([
    'success'  => true,
    'services' => $services
]);