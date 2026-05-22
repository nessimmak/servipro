<?php
// =============================================
//  API : delete_service.php – Supprimer un service
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/Service.php';

// Vérifier que c'est un admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Accès refusé.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$id = (int)($_POST['id'] ?? 0);

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'ID invalide.']);
    exit;
}

$serviceClass = new Service();

$result = $serviceClass->delete($id);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Service supprimé avec succès !'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la suppression du service.'
    ]);
}