<?php
	ini_set('display_errors', '1');
	ini_set('display_startup_errors', '1');
	error_reporting(E_ALL);
	require_once("../DotEnvLoader.php");
	(new DotEnvLoader(__DIR__ . '/../.env'))->load();

    // Get info from request
	$inData = getRequestInfo();
    
    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phone = $inData["phone"];
	$address = $inData["address"];
	$notes = $inData["notes"];
	$isFavorite = $inData["isFavorite"];

	$conn = new mysqli($_ENV["DB_LOCATION"], $_ENV["DB_USER"], $_ENV["DB_PWD"], $_ENV["DB_NAME"]);
	
    // Check for connection error
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        // Create SQL statement to add contact
		$stmt = $conn->prepare("INSERT into Contacts (UserID,FirstName,LastName,Email,Phone, Address, Notes,IsFavorite) VALUES (?,?,?,?,?,?,?,?)");
		$stmt->bind_param("isssissi", $userId, $firstName, $lastName, $email, $phone, $address, $notes, $isFavorite);
		$stmt->execute();

		// Get id of insert
		$stmt = $conn->prepare("Select LAST_INSERT_ID()");
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc();
		$ret = json_encode($row["LAST_INSERT_ID()"]);
		
		$stmt->close();
		$conn->close();

		returnWithInfo($ret);
	}


	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Methods: HEAD, GET, POST");
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $id )
	{
		// Wrap results for correct json string
		$retValue = '{"id":' . $id . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>