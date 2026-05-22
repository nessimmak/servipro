<?php
// =============================================
//  API : upload_avatar.php – Upload photo profil
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

if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== 0) {
    echo json_encode(['success' => false, 'message' => 'Aucun fichier reçu.']);
    exit;
}

$file         = $_FILES['avatar'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
$maxSize      = 2 * 1024 * 1024; // 2MB

if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Format invalide. JPG, PNG ou WEBP uniquement.']);
    exit;
}

if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'message' => 'Fichier trop lourd. Maximum 2MB.']);
    exit;
}

$ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'avatar_' . $_SESSION['user_id'] . '_' . uniqid() . '.' . $ext;
$dest     = __DIR__ . '/../uploads/' . $filename;

if (move_uploaded_file($file['tmp_name'], $dest)) {
    $userClass = new User();
    $userClass->updateAvatar($_SESSION['user_id'], $filename);

    echo json_encode([
        'success'  => true,
        'message'  => 'Photo de profil mise à jour !',
        'filename' => $filename
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'upload.'
    ]);
}