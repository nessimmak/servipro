<?php
// =============================================
//  Classe Reservation – Gestion des réservations
// =============================================

require_once __DIR__ . '/../config/database.php';

class Reservation {

    private PDO $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // ── Ajouter une réservation ──
    public function add(int $userId, int $serviceId, string $date, string $heure, string $note = ''): bool {
        $sql  = "INSERT INTO reservations (user_id, service_id, date, heure, note) 
                 VALUES (:user_id, :service_id, :date, :heure, :note)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':user_id'    => $userId,
            ':service_id' => $serviceId,
            ':date'       => $date,
            ':heure'      => $heure,
            ':note'       => $note,
        ]);
    }

    // ── Réservations d'un utilisateur ──
    public function getByUser(int $userId): array {
        $sql  = "SELECT r.*, s.nom as service_nom, s.prix 
                 FROM reservations r
                 JOIN services s ON s.id = r.service_id
                 WHERE r.user_id = :user_id
                 ORDER BY r.created_at DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }

    // ── Toutes les réservations (admin) ──
    public function getAll(): array {
        $sql  = "SELECT r.*, 
                        CONCAT(u.prenom, ' ', u.nom) as client_nom,
                        s.nom as service_nom
                 FROM reservations r
                 JOIN users u ON u.id = r.user_id
                 JOIN services s ON s.id = r.service_id
                 ORDER BY r.created_at DESC";
        return $this->db->query($sql)->fetchAll();
    }

    // ── Trouver par ID ──
    public function findById(int $id): array|false {
        $sql  = "SELECT * FROM reservations WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    // ── Mettre à jour le statut ──
    public function updateStatut(int $id, string $statut): bool {
        $sql  = "UPDATE reservations SET statut = :statut WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':statut' => $statut,
            ':id'     => $id,
        ]);
    }

    // ── Annuler une réservation ──
    public function annuler(int $id, int $userId): bool {
        $sql  = "UPDATE reservations SET statut = 'annule' 
                 WHERE id = :id AND user_id = :user_id AND statut = 'en_attente'";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':id'      => $id,
            ':user_id' => $userId,
        ]);
    }

    // ── Compter toutes les réservations ──
    public function count(): int {
        $sql = "SELECT COUNT(*) FROM reservations";
        return (int) $this->db->query($sql)->fetchColumn();
    }

    // ── Statistiques pour le dashboard ──
    public function getStats(): array {
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN statut = 'en_attente' THEN 1 ELSE 0 END) as en_attente,
                    SUM(CASE WHEN statut = 'confirme'   THEN 1 ELSE 0 END) as confirme,
                    SUM(CASE WHEN statut = 'termine'    THEN 1 ELSE 0 END) as termine,
                    SUM(CASE WHEN statut = 'annule'     THEN 1 ELSE 0 END) as annule
                FROM reservations";
        return $this->db->query($sql)->fetch();
    }

    // ── Revenu total (réservations terminées) ──
    public function getRevenuTotal(): float {
        $sql = "SELECT SUM(s.prix) 
                FROM reservations r
                JOIN services s ON s.id = r.service_id
                WHERE r.statut = 'termine'";
        return (float) $this->db->query($sql)->fetchColumn();
    }
}