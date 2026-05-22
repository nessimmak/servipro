<?php
// =============================================
//  API : login.php – Connexion utilisateur
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/User.php';

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$email    = trim($_POST['email']    ?? '');
$password = trim($_POST['password'] ?? '');

// Validation basique
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email et mot de passe obligatoires.']);
    exit;
}

// Tentative de connexion
$userClass = new User();
$user      = $userClass->login($email, $password);

if ($user) {
    // Stocker en session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role']    = $user['role'];

    echo json_encode([
        'success'  => true,
        'redirect' => $user['role'] === 'admin' ? 'dashboard.html' : 'acceuil.html',
        'user'     => [
            'id'     => $user['id'],
            'prenom' => $user['prenom'],
            'nom'    => $user['nom'],
            'email'  => $user['email'],
            'role'   => $user['role'],
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Email ou mot de passe incorrect.'
    ]);
}