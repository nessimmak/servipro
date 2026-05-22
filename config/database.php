<?php
// =============================================
//  ServiPro – Connexion à la base de données
//  Utilise PDO pour une connexion sécurisée
// =============================================

class Database {

    private string $host     = 'localhost';
    private string $dbname   = 'servipro';
    private string $username = 'root';
    private string $password = '';         // XAMPP : pas de mot de passe par défaut
    private string $charset  = 'utf8mb4';

    private ?PDO $connection = null;

    /**
     * Retourne la connexion PDO (singleton)
     */
    public function getConnection(): PDO {

        if ($this->connection === null) {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            } catch (PDOException $e) {
                http_response_code(500);
                die(json_encode([
                    'success' => false,
                    'message' => 'Erreur de connexion à la base de données.'
                ]));
            }
        }

        return $this->connection;
    }
}