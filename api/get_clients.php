<?php
// =============================================
//  API : get_clients.php – Récupérer les clients (admin)
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/User.php';

// Vérifier que c'est un admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Accès refusé.']);
    exit;
}

$userClass = new User();
$clients   = $userClass->getAllClients();

echo json_encode([
    'success' => true,
    'clients' => $clients
]);