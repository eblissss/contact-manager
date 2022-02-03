<?php
	require_once("../DotEnvLoader.php");
	(new DotEnvLoader(__DIR__ . '/../.env'))->load();

	// Get Data from request
	$inData = getRequestInfo();
	
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
		// Create Search
		$search = trim($inData["search"]);
		$searchA = "%" . $search . "%";

		$split = explode(' ', $search, 2);
		if (sizeof($split) > 1)
		{
			$searchB = "%" . $split[0] . "%";
			$searchC = "%" . $split[1] . "%";

			// Create SQL statement to search contacts
			$sqlsearch = "select *, DATE_FORMAT(DateCreated, '%b %D %Y, %r') as DateCreated 
			from Contacts where 
			(FirstName like ? or FirstName like ? or 
			LastName like ? or LastName like ?) 
			and UserID=?";
			$stmt = $conn->prepare($sqlsearch);
			$stmt->bind_param("ssssi", $searchA, $searchB, $searchA, $searchC, $inData["userId"]);
		}
		else
		{
			// Create SQL statement to search contacts
			$sqlsearch = "select *, DATE_FORMAT(DateCreated, '%b %D %Y, %r') as DateCreated 
			from Contacts where 
			(FirstName like ? or LastName like ?) 
			and UserID=?";
			$stmt = $conn->prepare($sqlsearch);

			$stmt->bind_param("ssi", $searchA, $searchA, $inData["userId"]);
		}
		
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

		$stmt->close();
		$conn->close();
		
		// Return results
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
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