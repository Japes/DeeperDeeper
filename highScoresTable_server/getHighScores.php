<?php
	
	include '../common.php';
	
    // Send variables for the MySQL database class.
    $database = mysqli_connect('localhost', $dbUser, $dbpw) or die('Could not connect: ' . mysqli_error($database));
    mysqli_select_db($database, $dbName) or die('Could not select database');
 
    //small hex world
    $query = "SELECT name, score FROM (
                SELECT max(SCORE) AS score, name 
                FROM DD_PlaySessions AS innerTable 
                GROUP BY name ) 
            AS outerTable
            ORDER BY score DESC 
            LIMIT 20";
    $result = mysqli_query($database, $query) or die('Query failed: ' . mysqli_error($database));
    $num_results = mysqli_num_rows($result); 

	$a = new stdClass();
	$a->results = [];
    for($i = 0; $i < $num_results; $i++)
    {
        $row = mysqli_fetch_array($result);
		$myObj = new stdClass();
		$myObj->name = $row['name'];
		$myObj->score = $row['score'];
		$a->results[] = $myObj;
    }
	$myJSON = json_encode($a);
	
	echo $myJSON;
?>