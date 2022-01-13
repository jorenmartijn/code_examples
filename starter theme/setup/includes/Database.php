<?php

namespace Nordique;

class Database {

    private static $instance = null;
    private $db;

    private function __construct()
    {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET . "";

        $opt = [
            \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
            \PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $this->db = new \PDO($dsn, DB_USER, DB_PASSWORD, $opt);

        $this->maybe_create_table();
    }

    public static function getInstance()
    {
        if (self::$instance == null)
        {
            self::$instance = new Database();
        }

        return self::$instance;
    }

    public function sql($sql, $data = array()) {
        $pdo = $this->db;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($data);

        return $stmt->fetchAll();
    }

    public function db_get($field, $module){
        $pdo = $this->db;
        $sql = 'SELECT `value` FROM nrdq_setup WHERE `module` = :module AND `field` = :field';

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':field' => $field, ':module' => $module]);

        $val = $stmt->fetch();

        if(isset($val['value'])) {
            return $val['value'];
        }

        return false;
    }

    public function db_update($field, $module, $value)
    {
        $pdo = $this->db;
        if ($this->db_get($field, $module) !== false) {
            // Update
            $sql = 'UPDATE nrdq_setup SET `value`=:value WHERE `module` = :module AND `field` = :field';
        } else {
            // Insert
            $sql = 'INSERT INTO nrdq_setup (`module`, `field`, `value`) VALUES (:module, :field, :value)';
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':module' => $module, ':field' => $field, ':value' => $value]);
        return;
    }

    private function maybe_create_table() {
        $sql = 'CREATE TABLE IF NOT EXISTS `nrdq_setup` (
            `id` INT AUTO_INCREMENT NOT NULL,
            `module` varchar(200) NOT NULL,
            `field` varchar(200) NOT NULL,
            `value` TEXT,
            `creation_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `modification_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`))
        CHARACTER SET utf8 COLLATE utf8_general_ci';

        $pdo = $this->db;
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }
}
