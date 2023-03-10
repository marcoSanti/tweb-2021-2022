<?php


/*
 * parametri richiesti in payload:
 * nil
 *
 * Questa api prepara i dati per poter essere visualizzati dal grafico degli incassi
 * delle vendite nella dashboard
 * esistono due colonne dell'array che viene ritornato:
 * values: i valori numerici,
 * labels: le labels dei numeri
 * */



function getIncomeChart(array $payload, PDO $conn)
{

    loginCheck();
   
        try {
            
            $retArray["values"] = Array();
            $retArray["labels"] = Array();

            $stmtGetSale = $conn->prepare("SELECT * FROM appunti WHERE user = :user");
            $stmtGetSale->bindValue(":user", $_SESSION["username"], PDO::PARAM_STR);
            $stmtGetSale->execute();
            while($row = $stmtGetSale->fetch(PDO::FETCH_ASSOC)){
                $retArray["labels"][] = $row["Nome"];
                $stmtGetEarnings = $conn->prepare("SELECT count(ID_acquisto) as c from acquisto where appunto = :appunto");
                $stmtGetEarnings->bindValue(":appunto", $row["idappunti"], PDO::PARAM_INT);
                $stmtGetEarnings->execute();
                $count = $stmtGetEarnings->fetch(PDO::FETCH_ASSOC)["c"];
                $retArray["values"][] = $count * $row["price"];
            }
            echo json_encode($retArray);
        } catch (PDOException $e) { jsonReturnEcho(500, "Error", $e); }

    }


