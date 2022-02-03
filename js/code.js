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
    // Get HTML stuff
    const editPane = document.getElementById("edit-container");
    const editForm = document.getElementById("edit-form");
    const cancelButton = document.getElementById("cancel-button");
    const saveButton = document.getElementById("save-button");

    // Set pane
    if (editPane.style.display == "none" || editPane.style.display == "") {
        editPane.style.display = "inline-flex";
    }

    // Remove add button
    const addButton = document.getElementById("addButton");
    addButton.style.display = "none";

    // Ensure only one listener
    if (!cancelButton.classList.contains("listening")) {
        cancelButton.classList.add("listening");

        // Cancel button
        cancelButton.addEventListener("click", () => {
            for (let i = 1; i <= 6; i++)
                editForm.children[i].children[1].value = "";
            editPane.style.display = "none";
            editPane.classList.add("translated");
            addButton.style.display = "inline-block";
            msnry.layout();
            return;
        });

        // Save button
        saveButton.addEventListener("click", () => {
            createContact();
            editPane.style.display = "none";
            editPane.classList.add("translated");
            addButton.style.display = "inline-block";
        });
    }

    // Force pane to resize (will not automatically :{ )
    const panepane = document.getElementById("contactPaneParent");
    panepane.style.width = "70%";

    // Animate in
    setTimeout(() => {
        editPane.classList.remove("translated");
    }, 100);

    msnry.reloadItems();
    msnry.layout();
}

function createContact() {
    console.log("create");
    const editForm = document.getElementById("edit-form");

    spawnContact(
        (id = largeNum), // will be saved as proper ID by DB
        editForm.children[1].children[1].value,
        editForm.children[2].children[1].value,
        editForm.children[6].children[1].value,
        editForm.children[3].children[1].value,
        editForm.children[4].children[1].value,
        editForm.children[5].children[1].value,
        (isFavorite = 0),
        (added = true) // put at top
    );

    for (let i = 1; i <= 6; i++) editForm.children[i].children[1].value = "";

    // Remove none found message
    const message = document.getElementById("noneFound");
    if (message !== null) {
        message.remove();
    }

    jdenticon.update(".contact-image");
    msnry.reloadItems();
    msnry.layout();
}

// Search Contacts - API request
function searchContacts() {
    const srch = document.getElementById("searchForm").value;
    //userId = -1; // TODO: REMOVE THIS (testing only)

    if (srch === "") return;

    document.getElementById("numResults").innerHTML = "Loading....";

    const pane = document.getElementById("contactPane");
    while (pane.hasChildNodes()) {
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
                    curContact.Notes,
                    curContact.Email,
                    curContact.Phone,
                    curContact.Address,
                    curContact.IsFavorite
                );
            }

            jdenticon.update(".contact-image");
            msnry.reloadItems();
            msnry.layout();
        } else {
            console.log(res.error);
            const message = document.createElement("h3");
            message.id = "noneFound";
            message.innerHTML = "No Records Found";
            pane.appendChild(message);
        }
    });
}
