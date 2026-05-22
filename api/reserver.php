<?php
// =============================================
//  API : reserver.php – Créer une réservation
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

$serviceId = (int)($_POST['service_id'] ?? 0);
$date      = trim($_POST['date']        ?? '');
$heure     = trim($_POST['heure']       ?? '');
$note      = trim($_POST['note']        ?? '');

// Validation
if (empty($serviceId) || empty($date) || empty($heure)) {
    echo json_encode(['success' => false, 'message' => 'Service, date et heure sont obligatoires.']);
    exit;
}

// Vérifier que la date n'est pas dans le passé
if ($date < date('Y-m-d')) {
    echo json_encode(['success' => false, 'message' => 'La date ne peut pas être dans le passé.']);
    exit;
}

$reservationClass = new Reservation();
$result = $reservationClass->add(
    $_SESSION['user_id'],
    $serviceId,
    $date,
    $heure,
    $note
);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Réservation confirmée avec succès !'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la réservation.'
    ]);
}