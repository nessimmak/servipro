<?php
// =============================================
//  Classe Service – Gestion des services
// =============================================

require_once __DIR__ . '/../config/database.php';

class Service {

    private PDO $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // ── Tous les services ──
    public function getAll(): array {
        $sql = "SELECT * FROM services ORDER BY created_at DESC";
        return $this->db->query($sql)->fetchAll();
    }

    // ── Services actifs seulement ──
    public function getAllActifs(): array {
        $sql  = "SELECT * FROM services WHERE statut = 'actif' ORDER BY created_at DESC";
        return $this->db->query($sql)->fetchAll();
    }

    // ── Trouver par ID ──
    public function findById(int $id): array|false {
        $sql  = "SELECT * FROM services WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    // ── Ajouter un service ──
    public function add(string $nom, string $categorie, float $prix, string $description = '', string $image = ''): bool {
        $sql  = "INSERT INTO services (nom, categorie, prix, description, image) 
                 VALUES (:nom, :categorie, :prix, :description, :image)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':nom'         => $nom,
            ':categorie'   => $categorie,
            ':prix'        => $prix,
            ':description' => $description,
            ':image'       => $image,
        ]);
    }

    // ── Modifier un service ──
    public function update(int $id, string $nom, string $categorie, float $prix, string $description = '', string $image = ''): bool {
        // Si pas de nouvelle image, on garde l'ancienne
        if ($image !== '') {
            $sql  = "UPDATE services SET nom = :nom, categorie = :categorie, prix = :prix, 
                     description = :description, image = :image WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                ':nom'         => $nom,
                ':categorie'   => $categorie,
                ':prix'        => $prix,
                ':description' => $description,
                ':image'       => $image,
                ':id'          => $id,
            ]);
        } else {
            $sql  = "UPDATE services SET nom = :nom, categorie = :categorie, prix = :prix, 
                     description = :description WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                ':nom'         => $nom,
                ':categorie'   => $categorie,
                ':prix'        => $prix,
                ':description' => $description,
                ':id'          => $id,
            ]);
        }
    }

    // ── Supprimer un service ──
    public function delete(int $id): bool {
        $sql  = "DELETE FROM services WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    // ── Compter les services actifs ──
    public function countActifs(): int {
        $sql = "SELECT COUNT(*) FROM services WHERE statut = 'actif'";
        return (int) $this->db->query($sql)->fetchColumn();
    }

    // ── Upload image ──
    public function uploadImage(array $file): string|false {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        $maxSize      = 2 * 1024 * 1024; // 2MB

        if (!in_array($file['type'], $allowedTypes)) return false;
        if ($file['size'] > $maxSize) return false;

        $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('service_') . '.' . $ext;
        $dest     = __DIR__ . '/../uploads/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $dest)) {
            return $filename;
        }
        return false;
    }
}