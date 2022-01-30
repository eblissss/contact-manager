 <?php
	require_once("../DotEnvLoader.php");
	(new DotEnvLoader(__DIR__ . '/../.env'))->load();

    // Get info from request
	$inData = getRequestInfo();
    
    $id = $inData["id"];
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
        // Create SQL statement to update contact
		$sql = "UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=?, Address=?, Notes=?, IsFavorite=? WHERE ID=? and UserID=?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("sssissiii", $firstName, $lastName, $email, $phone, $address, $notes, $isFavorite, $id, $userId);
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
	
?>