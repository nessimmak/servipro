<?php
// =============================================
//  API : change_password.php – Changer le MDP
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

$oldPassword = trim($_POST['old_password'] ?? '');
$newPassword = trim($_POST['new_password'] ?? '');

// Validation
if (empty($oldPassword) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Champs obligatoires manquants.']);
    exit;
}

if (strlen($newPassword) < 6) {
    echo json_encode(['success' => false, 'message' => 'Le nouveau mot de passe doit faire au moins 6 caractères.']);
    exit;
}

$userClass = new User();
$user      = $userClass->findById($_SESSION['user_id']);

// Vérifier l'ancien mot de passe
if (!password_verify($oldPassword, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Mot de passe actuel incorrect.']);
    exit;
}

$result = $userClass->changePassword($_SESSION['user_id'], $newPassword);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Mot de passe modifié avec succès !'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors du changement de mot de passe.'
    ]);
}