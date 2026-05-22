<?php
// =============================================
//  API : get_all_reservations.php – Toutes les réservations (admin)
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/Reservation.php';

// Vérifier que c'est un admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Accès refusé.']);
    exit;
}

$reservationClass = new Reservation();
$reservations     = $reservationClass->getAll();

echo json_encode([
    'success'      => true,
    'reservations' => $reservations
]);