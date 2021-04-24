<?php
	
	include 'common.php';
	
    // Send variables for the MySQL database class.
    $database = mysqli_connect('localhost', $dbUser, $dbpw) or die('Could not connect: ' . mysqli_error($database));
    mysqli_select_db($database, $dbName) or die('Could not select database');
 
    //rainbow blaster
    $query = "SELECT * FROM RB_PlaySessions order by date DESC limit 20";
    $result = mysqli_query($database, $query) or die('Query failed: ' . mysqli_error($database));
    $num_results = mysqli_num_rows($result); 
    echo "<table>";
    echo "<tr><th>RAINBOW BLASTER PLAY SESSIONS</th></tr>";
    echo "<tr><th>date</th><th>user</th></tr>";
    for($i = 0; $i < $num_results; $i++)
    {
        echo "<tr>";
        $row = mysqli_fetch_array($result);
        echo "<td>".$row['date']."</td><td>".$row['user']."</td>";
        echo "</tr>";
    }
    echo "</table>";
    echo "<br>";

    //small hex world
    $query = "SELECT name, score, dateAdded FROM SHW_scores ORDER BY dateAdded DESC LIMIT 50";
    $result = mysqli_query($database, $query) or die('Query failed: ' . mysqli_error($database));
    $num_results = mysqli_num_rows($result); 
    echo "<table>";
    echo "<tr><th>SMALL HEX WORLD PLAY SESSIONS</th></tr>";
    echo "<tr><th>dateAdded</th><th>name</th><th>score</th></tr>";
    for($i = 0; $i < $num_results; $i++)
    {
        echo "<tr>";
        $row = mysqli_fetch_array($result);
        echo "<td>".$row['dateAdded']."</td><td>".$row['name']."</td><td>".$row['score']."</td>";
        echo "</tr>";
    }
    echo "</table>";
    echo "<br>";

    //ice rink rally
    $query = "SELECT playerName, totalTime, raceDate FROM IRR_Races ORDER BY raceDate DESC LIMIT 50";
    $result = mysqli_query($database, $query) or die('Query failed: ' . mysqli_error($database));
    $num_results = mysqli_num_rows($result); 
    echo "<table>";
    echo "<tr><th>ICE RINK RALLY PLAY SESSIONS</th></tr>";
    echo "<tr><th>raceDate</th><th>playerName</th><th>totalTime</th></tr>";
    for($i = 0; $i < $num_results; $i++)
    {
        echo "<tr>";
        $row = mysqli_fetch_array($result);
        echo "<td>".$row['raceDate']."</td><td>".$row['playerName']."</td><td>".$row['totalTime']."</td>";
        echo "</tr>";
    }
    echo "</table>";
    echo "<br>";


?>