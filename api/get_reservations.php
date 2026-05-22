<?php
// =============================================
//  API : get_reservations.php – Réservations utilisateur
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/Reservation.php';

// Vérifier que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Vous devez être connecté.']);
    exit;
}

$reservationClass = new Reservation();
$reservations     = $reservationClass->getByUser($_SESSION['user_id']);

echo json_encode([
    'success'      => true,
    'reservations' => $reservations
]);