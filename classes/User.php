<?php
// =============================================
//  Classe User – Gestion des utilisateurs
// =============================================

require_once __DIR__ . '/../config/database.php';

class User {

    private PDO $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // ── Inscription ──
    public function register(string $prenom, string $nom, string $email, string $password, string $telephone = ''): bool {
        $sql  = "INSERT INTO users (prenom, nom, email, password, telephone) VALUES (:prenom, :nom, :email, :password, :telephone)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':prenom'    => $prenom,
            ':nom'       => $nom,
            ':email'     => $email,
            ':password'  => password_hash($password, PASSWORD_DEFAULT),
            ':telephone' => $telephone,
        ]);
    }

    // ── Connexion ──
    public function login(string $email, string $password): array|false {
        $sql  = "SELECT * FROM users WHERE email = :email AND statut = 'actif' LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return false;
    }

    // ── Trouver par ID ──
    public function findById(int $id): array|false {
        $sql  = "SELECT id, prenom, nom, email, telephone, avatar, role, statut, created_at FROM users WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    // ── Email déjà utilisé ? ──
    public function emailExists(string $email): bool {
        $sql  = "SELECT COUNT(*) FROM users WHERE email = :email";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':email' => $email]);
        return $stmt->fetchColumn() > 0;
    }

    // ── Mettre à jour le profil ──
    public function updateProfil(int $id, string $prenom, string $nom, string $email, string $telephone = ''): bool {
        $sql  = "UPDATE users SET prenom = :prenom, nom = :nom, email = :email, telephone = :telephone WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':prenom'    => $prenom,
            ':nom'       => $nom,
            ':email'     => $email,
            ':telephone' => $telephone,
            ':id'        => $id,
        ]);
    }

    // ── Changer le mot de passe ──
    public function changePassword(int $id, string $newPassword): bool {
        $sql  = "UPDATE users SET password = :password WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':password' => password_hash($newPassword, PASSWORD_DEFAULT),
            ':id'       => $id,
        ]);
    }

    // ── Mettre à jour l'avatar ──
    public function updateAvatar(int $id, string $filename): bool {
        $sql  = "UPDATE users SET avatar = :avatar WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':avatar' => $filename, ':id' => $id]);
    }

    // ── Supprimer le compte ──
    public function delete(int $id): bool {
        $sql  = "DELETE FROM users WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    // ── Tous les clients (admin) ──
    public function getAllClients(): array {
        $sql  = "SELECT u.id, CONCAT(u.prenom, ' ', u.nom) as nom, u.email, u.statut, u.created_at as date_inscription,
                        COUNT(r.id) as nb_reservations
                 FROM users u
                 LEFT JOIN reservations r ON r.user_id = u.id
                 WHERE u.role = 'user'
                 GROUP BY u.id
                 ORDER BY u.created_at DESC";
        return $this->db->query($sql)->fetchAll();
    }
}