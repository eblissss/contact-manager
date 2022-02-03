let editing = false;
let sav, msnry;
const largeNum = 1000000000;

const buttonColors = ["blue", "purple", "green", "red"];
const gradients = ["#2c4a86bb", "#862c77bb", "#2c863bbb", "#872d2dbb"];

let contacList = [];
let colorIndex = 0;
let mainColorIndex = 0;

initializeColorMenu();

// Spawn a new contact on the div
function spawnContact(
    id,
    firstname,
    lastname,
    notes,
    email,
    phone,
    address,
    isFavorite,
    added = false
) {
    notes = notes ? notes : "some notes about ...";
    address = address ? address : "1000 Ionic Drive";
    // Create new contact
    const template = document.getElementById("contact-template");
    const contacOuter = template.content.cloneNode(true).children[0];
    const contac = contacOuter.children[0];
    contac.id = "contact-" + id;

    // Add info
    contac.children[2].innerHTML = firstname;
    contac.children[3].innerHTML = lastname;
    contac.children[4].innerHTML = notes;

    const infoSection = contac.children[5];

    infoSection.children[3].innerHTML = `${phone}`; // was 1
    infoSection.children[1].innerHTML = `${email}`; // was 3
    infoSection.children[5].innerHTML = `${address}`;

    // Set image
    contac.children[0].setAttribute("data-jdenticon-value", id);

    contac.style.background = gradients[mainColorIndex];

    // Set favorite
    contac.isFavorite = isFavorite;
    const favImg = contac.children[7].children[0];
    if (contac.isFavorite === 0) {
        favImg.src = "./images/bookmark-star.svg";
    } else {
        favImg.src = "./images/bookmark-star-fill.svg";
    }

    // Add listeners
    const dotMenu = contac.children[6].children[1];
    dotMenu.children[0].addEventListener("click", () => {
        if (!editing) {
            edit(contacOuter);
        }
    });
    dotMenu.children[1].addEventListener("click", () => {
        deleteContact(contac);
    });

    contac.children[1].addEventListener("click", () => {
        setColors(contac);
    });
    contac.children[7].addEventListener("click", () => {
        setFavorite(contac);
    });
    contac.children[8].addEventListener("click", () => {
        extend(contacOuter);
    });

    // Insert into div
    if (added) {
        document.getElementById("contactPane").prepend(contacOuter);
        add(contac);
    } else document.getElementById("contactPane").appendChild(contacOuter);

    contacList.push(contac);

    return contac;
}

function add(contac) {
    // Get slots
    const fnameSlot = contac.children[2];
    const lnameSlot = contac.children[3];
    const notesSlot = contac.children[4];

    const infoSection = contac.children[5];

    const phoneSlot = infoSection.children[3]; // was 1
    const emailSlot = infoSection.children[1]; // was 3
    const addrSlot = infoSection.children[5];

    // Get slot info
    const firstname = fnameSlot.innerText;
    const lastname = lnameSlot.innerText;
    const notes = notesSlot.innerText;
    const phoneNum = phoneSlot.innerText;
    const emailAddr = emailSlot.innerText;
    const address = addrSlot.innerText;

    const id = contac.id.substring(8);

    console.log(id, firstname, lastname, notes, phoneNum, emailAddr, address);

    // Save data
    data = {
        userId: userId,
        firstName: firstname,
        lastName: lastname,
        email: emailAddr,
        phone: phoneNum,
        isFavorite: 0,
        notes: notes,
        address: address,
    };

    // Create or Update
    makeRequest("create", data).then((res) => {
        if (res.error === "") {
            console.log("Contact has been added.");
            contac.id = "contact-" + res.id;
        } else {
            console.log(res.error);
        }
    });
}

// Update (or add) the contact
function save(contac) {
    // Grab slots
    const fnameSlot = contac.children[2];
    const lnameSlot = contac.children[3];
    const notesSlot = contac.children[4];

    const infoSection = contac.children[5];

    const phoneSlot = infoSection.children[3]; // was 1
    const emailSlot = infoSection.children[1]; // was 3
    const addrSlot = infoSection.children[5];

    // Grab info
    const firstname = fnameSlot.children[0].value;
    const lastname = lnameSlot.children[0].value;
    const notes = notesSlot.children[0].value;
    const phoneNum = phoneSlot.children[0].value;
    const emailAddr = emailSlot.children[0].value;
    const address = addrSlot.children[0].value;

    const id = contac.id.substring(8);

    console.log(id, firstname, lastname, notes, phoneNum, emailAddr, address);

    // Insert info back in
    contac.children[2].innerHTML = firstname;
    contac.children[3].innerHTML = lastname;
    contac.children[4].innerHTML = notes;

    infoSection.children[3].innerHTML = `${phoneNum}`; // was 1
    infoSection.children[1].innerHTML = `${emailAddr}`; // was 3
    infoSection.children[5].innerHTML = `${address}`;

    // Save data
    data = {
        userId: userId,
        firstName: firstname,
        lastName: lastname,
        email: emailAddr,
        phone: phoneNum,
        isFavorite: 0,
        notes: notes,
        address: address,
    };

    // Update
    makeRequest("update", { ...data, id: id }).then((res) => {
        if (res.error === "") {
            console.log("Contact has been updated.");
        } else {
            console.log(res.error);
        }
    });

    editing = false;

    document.getElementById("dropdownMenu").style.visibility = "visible";
    infoSection.children[6].remove();
    infoSection.children[6].remove();
}

function cancel(contac, info) {
    const infoSection = contac.children[5];

    contac.children[2].innerHTML = info[0];
    contac.children[3].innerHTML = info[1];
    contac.children[4].innerHTML = info[2];

    infoSection.children[3].innerHTML = `${info[3]}`; // was 3
    infoSection.children[1].innerHTML = `${info[4]}`; // was 1
    infoSection.children[5].innerHTML = `${info[5]}`;

    editing = false;

    document.getElementById("dropdownMenu").style.visibility = "visible";
    infoSection.children[6].remove();
    infoSection.children[6].remove();
}

// Put contact in edit mode
function edit(contacOuter) {
    console.log("editing");
    extend(contacOuter, (stay = true));
    const contac = contacOuter.children[0];

    editing = true;
    // HIDE EDITING OPTION
    contac.children[6].style.display = "none";

    // Get slots
    const fnameSlot = contac.children[2];
    const lnameSlot = contac.children[3];
    const notesSlot = contac.children[4];

    const infoSection = contac.children[5];

    const phoneSlot = infoSection.children[3]; // was 1
    const emailSlot = infoSection.children[1]; // was 3
    const addrSlot = infoSection.children[5];

    // Get slot info
    const firstname = fnameSlot.innerText;
    const lastname = lnameSlot.innerText;
    const notes = notesSlot.innerText;
    const phoneNum = phoneSlot.innerText;
    const emailAddr = emailSlot.innerText;
    const address = addrSlot.innerText;

    // Replace text with inputs
    const editInput = `<input class="edits" type="text" maxlength="50"/>`;

    fnameSlot.innerHTML = editInput;
    fnameSlot.children[0].value = firstname;
    lnameSlot.innerHTML = editInput;
    lnameSlot.children[0].value = lastname;

    notesSlot.innerHTML = `<textarea class="edits noteInputEdit" maxlength="50"/>`;
    notesSlot.style.width = "300px"; // Gives more space to notes
    notesSlot.children[0].value = notes;

    emailSlot.innerHTML = editInput;
    emailSlot.children[0].value = emailAddr;

    phoneSlot.innerHTML = editInput;
    phoneSlot.children[0].value = phoneNum;

    addrSlot.innerHTML = editInput;
    addrSlot.children[0].value = address;

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("stn-btn", "editButton", "cancelButton");
    cancelButton.innerHTML = "CANCEL";

    const saveButton = document.createElement("button");
    saveButton.classList.add("stn-btn", "editButtonSave", "saveButton");
    saveButton.innerHTML = "SAVE";

    infoSection.appendChild(cancelButton);
    infoSection.appendChild(saveButton);

    // Ensure only one listener
    if (!cancelButton.classList.contains("listening")) {
        cancelButton.classList.add("listening");

        cancelButton.addEventListener("click", () => {
            cancel(
                contac,
                new Array(
                    firstname,
                    lastname,
                    notes,
                    phoneNum,
                    emailAddr,
                    address
                )
            );
            saveButton.style.visibility = "hidden";
            cancelButton.style.visibility = "hidden";
            contac.children[6].style.display = "inline";
        });
        saveButton.addEventListener("click", () => {
            if (fnameSlot.children[0].value && lnameSlot.children[0].value) {
                save(contac);
                saveButton.style.visibility = "hidden";
                cancelButton.style.visibility = "hidden";
                contac.children[6].style.display = "inline";
            } else {
                console.log("Err: Must have a first and last name");
            }
        });
    }
}

// Delete contact
function deleteContact(contac) {
    // Confirmation
    if (confirm("Are you sure you want to delete this contact?") == false)
        return;

    const id = contac.id.substring(8);

    // Make delete request
    makeRequest("delete", { id: id, userId: userId }).then((res) => {
        if (res.error === "") {
            console.log("Contact has been deleted.");
        } else {
            console.log(res.error);
        }
    });

    contacList.splice(contacList.indexOf(contac), 1);

    // We should have animations too
    contac.parentNode.remove();
    msnry.reloadItems();
    msnry.layout();

    // Update num
    const numResults = document.getElementById("numResults");
    if (numResults.innerHTML != "") {
        const numRes = numResults.innerHTML.slice(
            0,
            numResults.innerHTML.indexOf(" ")
        );
        numResults.innerHTML = numRes + " contacts found.";
    }
}

// Set a contact as favorite
function setFavorite(contac) {
    const id = contac.id.substring(8);

    // Swap 0 and 1
    contac.isFavorite = 1 - contac.isFavorite;

    // Update Image
    const favImg = contac.children[7].children[0];
    if (contac.isFavorite === 0) {
        favImg.src = "./images/bookmark-star.svg";
    } else {
        favImg.src = "./images/bookmark-star-fill.svg";
    }

    makeRequest("setFavorite", {
        id: id,
        userId: userId,
        isFavorite: contac.isFavorite,
    }).then((res) => {
        if (res.error === "") {
            console.log(
                "Favorite " + (contac.isFavorite ? "yes - 1" : "no - 0")
            );
        } else {
            console.log(res.error);
        }
    });
}

function extend(contacOuter, stay = false) {
    // Extend div
    const infoSection = contacOuter.children[0].children[5];
    if (contacOuter.classList.contains("extended") && !stay) {
        contacOuter.children[0].children[8].children[0].src =
            "./images/arrows-expand.svg";
        infoSection.style.display = "none";
        contacOuter.classList.remove("extended");
        contacOuter.children[0].style.height = "200px";
    } else {
        contacOuter.children[0].children[8].children[0].src =
            "./images/arrows-collapse.svg";
        infoSection.style.display = "grid";
        if (!contacOuter.classList.contains("extended")) {
            contacOuter.classList.add("extended");
        }

        contacOuter.children[0].style.height = "320px";
    }
    msnry.layout();
}

window.onload = function () {
    makeRequest("getFavorites", { userId: userId }).then((res) => {
        if (res.error === "" && res.results.length > 0) {
            console.log("found favorite contacts");

            for (let i = 0; i < res.results.length; i++) {
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

            msnry.reloadItems();
            msnry.layout();
        } else {
            console.log(res.error);
        }
    });

    // TODO: Remove after testing
    for (let i = 0; i < 5; i++) {
        spawnContact(
            1000 + i,
            "Benedict",
            "Cucumberpatch",
            "not much bruv not much bruv",
            "jojo@gmail.com",
            "808080808" + i,
            "1000 Ionic Drive",
            0
        );
    }

    const grid = document.getElementById("contactPane");
    msnry = new Masonry(grid, {
        itemSelector: ".grid-item",
        columnWidth: 400,
        gutter: 10,
        stagger: 25,
        fitWidth: true,
    });
    jdenticon.update(".contact-image");
};

function setColors(contac) {
    colorIndex = (colorIndex + 1) % 4;

    contac.style.background = gradients[colorIndex];
    contac.children[1].style.backgroundColor = buttonColors[colorIndex];
}

function initializeColorMenu() {
    const colorMenu = document.getElementById("colorMenu");

    for (let i = 0; i < 4; i++) {
        colorMenu.children[i].style.backgroundColor = buttonColors[i];
        colorMenu.children[i].addEventListener("click", () => {
            document.getElementById("chosenColor").style.backgroundColor =
                buttonColors[i];
            mainColorIndex = i;
            for (let contac of contacList) {
                contac.style.background = gradients[i];
            }
        });
    }
}
