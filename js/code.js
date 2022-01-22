const urlBase = "http://contacts.ninja/LAMPAPI/contact";
const extension = "php";

// Default login fields
let userId = 0;
let firstName = "";
let lastName = "";

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
        console.log("you shouldn't be here!");
        //window.location.href = "index.html";
    } else {
        document.getElementById("headerName").innerHTML =
            "Welcome, " + firstName + " " + lastName;
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
function searchContacts() {
    //userId = 1; // REMOVE THIS

    const srch = document.getElementById("searchForm").value;
    //document.getElementById("contactSearchResult").innerHTML = "";

    //let contactList = "";

    const tmp = { search: srch, userId: userId };
    const jsonPayload = JSON.stringify(tmp);

    const url = urlBase + "/SearchContacts." + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //document.getElementById("contactSearchResult").innerHTML =
                //"Contact(s) has been retrieved";
                const jsonObject = JSON.parse(xhr.responseText);

                console.log(window);
                for (let i = 0; i < jsonObject.results.length; i++) {
                    curContact = jsonObject.results[i];

                    spawnContact(
                        curContact.ID,
                        curContact.FirstName,
                        curContact.LastName,
                        curContact.Phone,
                        curContact.Email
                    );
                }

                //document.getElementsByTagName("p")[0].innerHTML = contactList;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err);
        //document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

// Update Contact - API request

// Delete Contact - API request

// Favorite Contact ???
