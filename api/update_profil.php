<?php
// =============================================
//  API : update_profil.php – Modifier le profil
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/User.php';

// Vérifier que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Non connecté.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$prenom    = trim($_POST['prenom']    ?? '');
$nom       = trim($_POST['nom']       ?? '');
$email     = trim($_POST['email']     ?? '');
$telephone = trim($_POST['telephone'] ?? '');

// Validation
if (empty($prenom) || empty($nom) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Champs obligatoires manquants.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email invalide.']);
    exit;
}

$userClass = new User();
$result    = $userClass->updateProfil(
    $_SESSION['user_id'],
    $prenom,
    $nom,
    $email,
    $telephone
);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Profil mis à jour avec succès !'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la mise à jour.'
    ]);
}