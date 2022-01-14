<?php
    // Get info from request
	$inData = getRequestInfo();
    
    $userId = $inData["userId"]
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phone = $inData["phone"];
    $time = $inData["dateTime"];

    // Need to find how to get var from .env
	//$conn = new mysqli("localhost", <username>, <password>, "COP4331");
    // Check for connection error
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        // Create SQL statement to add contact
		$stmt = $conn->prepare("INSERT into Contacts (UserId,FirstName,LastName,Email,Phone,DateTime) VALUES(?,?)");
		$stmt->bind_param("ss", $userId, $firstName, $lastName, $email, $phone, $time);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>