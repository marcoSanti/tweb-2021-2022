<?php

/*
 * parametri richiesti in payload:
 * nil
 *
 * Questa api ritorna le università a db
 * */
function getBoughtNotes(array $payload, PDO $conn){

    loginCheck();
        $sql = "select idappunti as codice, Nome as titolo, uploadDate, price as prezzo, insegnamento_scuola as insegnamento, tipoAppunti, nomeDocente as docente, Path from appunti inner join acquisto on acquisto.appunto = appunti.idappunti where acquisto.user = :user;";
        try{
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":user",$_SESSION["username"], PDO::PARAM_STR);
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }catch (PDOException $e){jsonReturnEcho(500, "Error", $e);}
    
}