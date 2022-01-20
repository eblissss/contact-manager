const urlBase = "http://contacts.ninja/LAMPAPI"; //replace with actual site
const extension = "php";

// Default login fields
let userId = 0;
let firstName = "";
let lastName = "";

// Attempt login
function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    // Get login from page
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    let hash = md5(password);

    //document.getElementById("loginResult").innerHTML = "";

    // Create payload
    let tmp = { login: login, password: hash };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/Login." + extension;

    // Create connection
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    console.log(jsonPayload);

    try {
        // Whenever there is a state change (successful response) (Non-blocking)
        xhr.onreadystatechange = function () {
            console.log(xhr);

            if (this.readyState == 4 && this.status == 200) {
                // Parse response
                console.log(xhr.responseText);
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                // Check if login failed
                if (userId < 1) {
                    //document.getElementById("loginResult").innerHTML =
                      //  "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                // Change window href
                window.location.href = "contacts.html";
            }
        };
        // Send payload
        xhr.send(jsonPayload);
    } catch (err) {
        // Show error
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

// Set browser cookie
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie =
        "firstName=" +
        firstName +
        ",lastName=" +
        lastName +
        ",userId=" +
        userId +
        ";expires=" +
        date.toGMTString();
}

// Check login from cookie
function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    // If invalid user, kick back to index
    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        document.getElementById("headerName").innerHTML =
            "Logged in as " + firstName + " " + lastName;
    }
}

// Discard info and cookie, back to index
function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

// Create Contact - API request
// Not implemented
function addContact() {
    let newContact = document.getElementById("contactText").value;
    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = { contact: newContact, userId, userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/CreateContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactAddResult").innerHTML =
                    "Contact has been added"; // <-- say actual name
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

// Search Contacts - API request
// Not implemented
function searchContact() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    let contactList = "";

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/SearchContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactSearchResult").innerHTML =
                    "Contact(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactList += jsonObject.results[i];
                    if (i < jsonObject.results.length - 1) {
                        contactList += "<br />\r\n";
                    }
                }

                document.getElementsByTagName("p")[0].innerHTML = contactList;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function doSignUp() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let hash = md5(password);

    // To ensure no fields can be empty
    const formErrors = ["fnError", "lnError", "userError", "passError"];
    const formParams = [firstName, lastName, username, password];
    let retFlag = false;

    // Cycle through parameters
    for (let i = 0; i < 4; i++)
    {
        if(formParams[i] === ""){
            document.getElementById(formErrors[i]).innerHTML = "This field should not be empty";
            retFlag = true;
        }else{
            document.getElementById(formErrors[i]).innerHTML = "";
        }
    }

    if(retFlag) return;

    let loginCheck = {
        login : username
    };

    let jsonPayload = JSON.stringify(tmp);
    
    let url = urlBase + "/ExistingUser." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if(!(jsonObject.error == "")){
                    console.log("Duplicate Username Found");
                    return;
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        return;
    }

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash,
    };

    jsonPayload = JSON.stringify(tmp);

    url = urlBase + "/Signup." + extension;

    xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("loginResult").innerHTML =
                    "Account Created";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

// Update Contact - API request

// Delete Contact - API request

// Favorite Contact ???
