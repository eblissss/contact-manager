const urlBase = "http://contacts.ninja/LAMPAPI/user";
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
    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let hash = md5(password);

    //document.getElementById("loginResult").innerHTML = "";

    // Create payload
    let tmp = { login: login, password: hash };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/login." + extension;

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
