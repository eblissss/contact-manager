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
    /*let newContact = document.getElementById("contactText").value;
    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = { contact: newContact, userId, userId };
    let jsonPayload = JSON.stringify(tmp);*/

    data = { ID: 5 };

    makeRequest("create", data).then((res) => {
        if (res.error === "") {
            console.log("Contact has been added.");

            curContact = data;

            spawnContact(
                curContact.ID,
                curContact.FirstName,
                curContact.LastName,
                curContact.Phone,
                curContact.Email
            );
        } else {
            console.log(res.error);
        }
    });
}

// Search Contacts - API request
// Not implemented
function searchContacts() {
    const srch = document.getElementById("searchForm").value;
    userId = 1; // REMOVE THIS (testing only)

    if (srch === "") return;

    makeRequest("search", { search: srch, userId: userId }).then((res) => {
        //console.log(res);
        if (res.error === "" && res.results.length > 0) {
            console.log("found contacts");

            for (let i = 0; i < res.results.length; i++) {
                curContact = res.results[i];

                spawnContact(
                    curContact.ID,
                    curContact.FirstName,
                    curContact.LastName,
                    curContact.Phone,
                    curContact.Email
                );
            }
        } else {
            console.log(res.error);
        }
    });
}

// Update Contact - API request

// Delete Contact - API request

// Favorite Contact ???
