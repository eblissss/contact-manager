<?php
	require_once("DotEnvLoader.php");
	(new DotEnvLoader(__DIR__ . '/.env'))->load();

	// Get Data from request
	$inData = getRequestInfo();
	
    $login = $inData["login"];

	$conn = new mysqli($_ENV["DB_LOCATION"], $_ENV["DB_USER"], $_ENV["DB_PWD"], $_ENV["DB_NAME"]);

	// Check for connection error
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Create SQL statement to search contacts
		$sqlsearch = "SELECT * FROM Users WHERE (Login = ?)";
		$stmt = $conn->prepare($sqlsearch);
		$stmt->bind_param("s", $login);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		if( $row = $result->fetch_assoc()  )
		{
            returnWithError("Duplicate Username");
        }
		else
		{
			returnWithError("");
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"results":[],"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		// Wrap results for correct json string
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>