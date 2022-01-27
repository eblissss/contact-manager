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
function addContact() {
    // Replace Button with new Form
    document.getElementById("addButton").style.display = "none";

    const contact = spawnContact(
        (id = largeNum), // will be saved as proper ID by DB (also used to tell save() it is new)
        (firstname = ""),
        (lastname = ""),
        (phone = ""),
        (email = ""),
        (first = true) // put at top
    );
    edit(contact);
}

// Search Contacts - API request
function searchContacts() {
    const srch = document.getElementById("searchForm").value;
    userId = -1; // REMOVE THIS (testing only)

    if (srch === "") return;

    const pane = document.getElementById("contactPane");
    while (pane.childNodes.length > 2) {
        console.log(pane.lastChild);
        pane.removeChild(pane.lastChild);
    }

    makeRequest("search", { search: srch, userId: userId }).then((res) => {
        //console.log(res);
        numRes = res.results.length;
        document.getElementById("numResults").innerHTML =
            numRes + " contacts found.";

        if (res.error === "" && numRes > 0) {
            console.log("found contacts");

            for (let i = 0; i < numRes; i++) {
                curContact = res.results[i];

                spawnContact(
                    curContact.ID,
                    curContact.FirstName,
                    curContact.LastName,
                    curContact.Phone,
                    curContact.Email
                );
            }
            msnry.reloadItems();
            msnry.layout();
        } else {
            console.log(res.error);
            const message = document.createElement("h3");
            message.innerHTML = "No Records Found";
            pane.appendChild(message);
        }
    });
}
