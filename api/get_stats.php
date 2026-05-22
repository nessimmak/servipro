<?php
// =============================================
//  API : get_stats.php – Statistiques dashboard (admin)
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/Reservation.php';
require_once __DIR__ . '/../classes/Service.php';
require_once __DIR__ . '/../classes/User.php';

// Vérifier que c'est un admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Accès refusé.']);
    exit;
}

$reservationClass = new Reservation();
$serviceClass     = new Service();
$userClass        = new User();

$statsReservations = $reservationClass->getStats();
$revenuTotal       = $reservationClass->getRevenuTotal();
$totalServices     = $serviceClass->countActifs();
$totalClients      = count($userClass->getAllClients());

echo json_encode([
    'success' => true,
    'stats'   => [
        'total_reservations' => $statsReservations['total'],
        'en_attente'         => $statsReservations['en_attente'],
        'confirme'           => $statsReservations['confirme'],
        'termine'            => $statsReservations['termine'],
        'annule'             => $statsReservations['annule'],
        'revenu_total'       => $revenuTotal,
        'total_services'     => $totalServices,
        'total_clients'      => $totalClients,
    ]
]);