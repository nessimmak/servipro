<?php
// =============================================
//  API : register.php – Inscription utilisateur
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/User.php';

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$prenom    = trim($_POST['prenom']    ?? '');
$nom       = trim($_POST['nom']       ?? '');
$email     = trim($_POST['email']     ?? '');
$password  = trim($_POST['password']  ?? '');
$telephone = trim($_POST['telephone'] ?? '');

// Validation
if (empty($prenom) || empty($nom) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Tous les champs obligatoires doivent être remplis.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email invalide.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Le mot de passe doit faire au moins 6 caractères.']);
    exit;
}

$userClass = new User();

// Vérifier si l'email existe déjà
if ($userClass->emailExists($email)) {
    echo json_encode(['success' => false, 'message' => 'Cet email est déjà utilisé.']);
    exit;
}

// Inscription
$result = $userClass->register($prenom, $nom, $email, $password, $telephone);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Compte créé avec succès !'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la création du compte.'
    ]);
}