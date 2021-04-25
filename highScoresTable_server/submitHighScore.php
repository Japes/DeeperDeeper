<?php

    //this script lives on the server.

	include '../common.php';
	
	$database = mysqli_connect('localhost', $dbUser, $dbpw) or die('Could not connect: ' . mysqli_error($database));
	mysqli_select_db($database, $dbName) or die('Could not select database');

	// Strings must be escaped to prevent SQL injection attack. 
	$user = mysqli_real_escape_string($database, $_GET['name']);
	$score = mysqli_real_escape_string($database, $_GET['score']);
	
    // Send variables for the MySQL database class. 
    $query = "insert into DD_PlaySessions values (NULL, NOW(), '$user', $score);"; 
    $result = mysqli_query($database, $query) or die('Query failed: ' . mysqli_error($database)); 
    
?>