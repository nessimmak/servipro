<?php
// =============================================
//  API : add_service.php – Ajouter un service
// =============================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../classes/Service.php';

// Vérifier que c'est un admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Accès refusé.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$nom         = trim($_POST['nom']         ?? '');
$categorie   = trim($_POST['categorie']   ?? '');
$prix        = trim($_POST['prix']        ?? '');
$description = trim($_POST['description'] ?? '');

// Validation
if (empty($nom) || empty($prix)) {
    echo json_encode(['success' => false, 'message' => 'Nom et prix sont obligatoires.']);
    exit;
}

$serviceClass = new Service();

// Upload image
$image = '';
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $uploaded = $serviceClass->uploadImage($_FILES['image']);
    if ($uploaded === false) {
        echo json_encode(['success' => false, 'message' => 'Image invalide. JPG, PNG ou WEBP · Max 2MB.']);
        exit;
    }
    $image = $uploaded;
}

// Ajouter le service
$result = $serviceClass->add($nom, $categorie, (float)$prix, $description, $image);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Service ajouté avec succès !'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'ajout du service.'
    ]);
}