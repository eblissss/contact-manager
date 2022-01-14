<?php
	// Get Data from request
	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	// Connection vars incorrect
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	// Check for connection error
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Create SQL statement to search contacts
		$stmt = $conn->prepare("select * from Contacts where FirstName like ? or LastName like ? and UserID=?");
		$name = "%" . $inData["search"] . "%";
		$stmt->bind_param("ss", $name, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		// Section needs to be redone as json (so we can display all the info)
		// while($row = $result->fetch_assoc())
		// {
		// 	if( $searchCount > 0 )
		// 	{
		// 		$searchResults .= ",";
		// 	}
		// 	$searchCount++;
		// 	$searchResults .= '"' . $row["Name"] . '"';
		// }
		
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
		// $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		// $retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>