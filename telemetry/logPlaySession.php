<?php

	include '../common.php';
	
	$database = mysqli_connect('localhost', $dbUser, $dbpw) or die('Could not connect: ' . mysqli_error($database));
	mysqli_select_db($database, $dbName) or die('Could not select database');

	// Strings must be escaped to prevent SQL injection attack. 
	$user = mysqli_real_escape_string($database, $_GET['user']);
	
    // Send variables for the MySQL database class. 
    $ip = get_ip_address(); 
    $userField = $user. ': '. $ip;
    $query = "insert into RB_PlaySessions values (NULL, NOW(), '$userField');"; 
    $result = mysqli_query($database, $query) or die('Query failed: ' . mysqli_error($database)); 
    
    function get_ip_address(){
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
            if (array_key_exists($key, $_SERVER) === true){
                foreach (explode(',', $_SERVER[$key]) as $ip){
                    $ip = trim($ip); // just to be safe
    
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
                        return $ip;
                    }
                }
            }
        }
    }
?>