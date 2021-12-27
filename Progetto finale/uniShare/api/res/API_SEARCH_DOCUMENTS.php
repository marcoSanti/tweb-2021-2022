<?php
/*
 * parametri richiesti in payload:
 * query
 *
 * Questa api ritorna le università a db
 * */

function ApiSearchNotes(array $payload, PDO $conn){

    loginCheck();

        try{
            $arrayReturn = Array();
            $stmtSearch = $conn->prepare("SELECT idappunti as codice, Nome as titolo, uploadDate, price as prezzo, insegnamento_scuola as insegnamento, tipoAppunti, nomeDocente as docente FROM appunti where visible=1 and ( nome like :input or nomeDocente like :input or insegnamento_scuola in ( select insegnamento.idInsegnamento from insegnamento where insegnamento.Nome like :input ) or insegnamento_scuola in ( select idInsegnamento from insegnamento  inner join scuola on scuola = scuola.idScuola where scuola.nomeScuola like :input ))");
            $stmtSearch->bindValue(":input", "%".$payload["query"] . "%", PDO::PARAM_STR); // % per poter cercare stringhe che anche solo contengono la query
            $stmtSearch->execute();

            foreach($stmtSearch->fetchAll(PDO::FETCH_ASSOC) as $row){
                //conteggio le recensioni
                $stmtGetReview = $conn->prepare("SELECT valore from recensione where appunto = " . $row["codice"]);
                $stmtGetReview->execute();
                $reviews = $stmtGetReview->fetchAll(PDO::FETCH_ASSOC);
                $count = 0;

                if($stmtGetReview->rowCount()>0){
                    foreach ($reviews as $item) {
                        $count+=$item["valore"];
                    }
                    $row["rating"] = $count/$stmtGetReview->rowCount();
                }
                else  $row["rating"] = 0;

                //verifico se l'appunto è stato acquistato dall'utente
                $stmtIsAcquired = $conn->prepare("SELECT * from acquisto WHERE user = :username and appunto = :idAppunto;");
                $stmtIsAcquired->bindValue(":username", $_SESSION["username"], PDO::PARAM_STR);
                $stmtIsAcquired->bindValue(":idAppunto", $row["codice"], PDO::PARAM_STR);
                $stmtIsAcquired->execute();
                $row["bought"] = ($stmtIsAcquired->rowCount()>0);
                $arrayReturn[] = $row;
            }

            echo json_encode($arrayReturn);

        }catch (PDOException $e){jsonReturnEcho(500, "Error", $e);}
    
}