<?php
// =============================================
//  API : get_profil.php – Récupérer le profil
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/User.php';
require_once __DIR__ . '/../classes/Reservation.php';

// Vérifier que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Non connecté.']);
    exit;
}

$userClass        = new User();
$reservationClass = new Reservation();

$user         = $userClass->findById($_SESSION['user_id']);
$reservations = $reservationClass->getByUser($_SESSION['user_id']);
$stats        = $reservationClass->getStats();

// Calculer les stats personnelles
$total_reservations = count($reservations);
$total_confirmes    = count(array_filter($reservations, fn($r) => $r['statut'] === 'confirme'));
$total_termines     = count(array_filter($reservations, fn($r) => $r['statut'] === 'termine'));

echo json_encode([
    'success' => true,
    'user'    => array_merge($user, [
        'total_reservations' => $total_reservations,
        'total_confirmes'    => $total_confirmes,
        'total_termines'     => $total_termines,
        'reservations'       => $reservations,
    ])
]);