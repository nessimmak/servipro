<?php
// =============================================
//  API : annuler_reservation.php – Annuler une réservation
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/Reservation.php';

// Vérifier que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Vous devez être connecté.']);
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

$reservationClass = new Reservation();
$result = $reservationClass->annuler($id, $_SESSION['user_id']);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Réservation annulée avec succès !'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Impossible d\'annuler cette réservation.'
    ]);
}