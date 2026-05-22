<?php
// =============================================
//  API : update_statut_reservation.php – Modifier statut (admin)
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/Reservation.php';

// Vérifier que c'est un admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Accès refusé.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$id     = (int)($_POST['id']     ?? 0);
$statut = trim($_POST['statut']  ?? '');

$statutsValides = ['en_attente', 'confirme', 'termine', 'annule'];

if (empty($id) || !in_array($statut, $statutsValides)) {
    echo json_encode(['success' => false, 'message' => 'Données invalides.']);
    exit;
}

$reservationClass = new Reservation();
$result = $reservationClass->updateStatut($id, $statut);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Statut mis à jour avec succès !'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la mise à jour du statut.'
    ]);
}