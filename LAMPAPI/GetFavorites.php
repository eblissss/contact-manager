<?php
	require_once("DotEnvLoader.php");
	(new DotEnvLoader(__DIR__ . '/.env'))->load();

	// Get Data from request
	$inData = getRequestInfo();

	$userId = $inData["userId"];
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli($_ENV["DB_LOCATION"], $_ENV["DB_USER"], $_ENV["DB_PWD"], $_ENV["DB_NAME"]);

	// Check for connection error
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Create SQL statement to search contacts
		$sqlsearch = "select * from Contacts where IsFavorite=1 and UserID=?";
		$stmt = $conn->prepare($sqlsearch);
		$stmt->bind_param("i", $userId);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		// Get results as array string
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= json_encode($row);
		}
		
		// Return results
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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