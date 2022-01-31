let editing = false;
let sav, msnry;
const largeNum = 1000000000;

const buttonColors = ["blue", "red", "green", "orange"];
const gradients = [
    "linear-gradient(#548cff, #24272b)",
    "linear-gradient(#ea4c46, #24272b)",
    "linear-gradient(#57c84d, #24272b)",
    "linear-gradient(#ffad60, #24272b)",
];

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
    phone,
    email,
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
    contac.isFavorite = isFavorite;
    console.log(contac.id);

    // Add info
    contac.children[2].innerHTML = firstname;
    contac.children[3].innerHTML = lastname;
    contac.children[4].innerHTML = notes;

    const infoSection = contac.children[5];

    infoSection.children[1].innerHTML = `${phone}`;
    infoSection.children[3].innerHTML = `${email}`;
    infoSection.children[5].innerHTML = `${address}`;

    contac.style.background = gradients[mainColorIndex];

    const favImg = contac.children[7].children[0];
    if (contac.isFavorite === 0) {
        favImg.src = "./images/bookmark-star.svg";
    } else {
        favImg.src = "./images/bookmark-star-fill.svg";
    }

    const dotMenu = contac.children[6].children[1];
    // Add listeners
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

    const phoneSlot = infoSection.children[1];
    const emailSlot = infoSection.children[3];
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

    const phoneSlot = infoSection.children[1];
    const emailSlot = infoSection.children[3];
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

    infoSection.children[1].innerHTML = `${phoneNum}`;
    infoSection.children[3].innerHTML = `${emailAddr}`;
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

    extend(contac.parentNode)

    document.getElementById("dropdownMenu").style.visibility = "visible";
    infoSection.children[6].remove();
}

// Put contact in edit mode
function edit(contacOuter) {
    console.log("editing");
    extend(contacOuter, (stay = true));
    const contac = contacOuter.children[0];
    // HIDE EDITING OPTION

    editing = true;
    document.getElementById("dropdownMenu").style.visibility = "hidden";


    // Get slots
    const fnameSlot = contac.children[2];
    const lnameSlot = contac.children[3];
    const notesSlot = contac.children[4];

    const infoSection = contac.children[5];

    const phoneSlot = infoSection.children[1];
    const emailSlot = infoSection.children[3];
    const addrSlot = infoSection.children[5];

    // Get slot info
    const firstname = fnameSlot.innerText;
    const lastname = lnameSlot.innerText;
    const notes = notesSlot.innerText;
    const phoneNum = phoneSlot.innerText;
    const emailAddr = emailSlot.innerText;
    const address = addrSlot.innerText;

    // Replace text with inputs
    fnameSlot.innerHTML = `<input class="edits" type="text" />`;
    fnameSlot.children[0].value = firstname;
    lnameSlot.innerHTML = `<input class="edits" type="text" />`;
    lnameSlot.children[0].value = lastname;

    notesSlot.innerHTML = `<input class="edits" "type="text"/>`;
    notesSlot.style.width = "250px";// Gives more space to notes
    notesSlot.children[0].value = notes;

    emailSlot.innerHTML = `<input class="edits" type="text" />`;
    emailSlot.children[0].value = emailAddr;

    phoneSlot.innerHTML = `<input class="edits" "type="text" />`;
    phoneSlot.children[0].value = phoneNum;

    addrSlot.innerHTML = `<input class="edits" type="text" />`;
    addrSlot.children[0].value = address;

    //console.log(document.getElementById("address"));

    // const saveButton = document.createButton('button');
    //saveButton.display = "block";

    //  Add save button (should probably just show/hide instead of creating each time)
    const sabeButton = document.createElement("button");
    sabeButton.classList.add("btn");
    sabeButton.style.backgroundColor = "white";
    sabeButton.innerHTML = "SAVE";
    sabeButton.style.width = "75px";
    sabeButton.style.marginLeft = "-10px";
    sabeButton.style.marginTop = "-65px";
    sabeButton.style.marginBottom = "50px";

    sabeButton.addEventListener(
        "click",
        (sav = () => {
            if (fnameSlot.children[0].value && lnameSlot.children[0].value) {
                save(contac);
                sabeButton.style.visibility = "hidden";
            } else {
                console.log("Err: Must have a first and last name");
            }
        })
    );
    infoSection.appendChild(sabeButton);
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
    contac.remove();
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
        contacOuter.children[0].children[8].style.bottom = "0px";
    } else {
        contacOuter.children[0].children[8].children[0].src =
            "./images/arrows-collapse.svg";
        infoSection.style.display = "grid";
        if (!contacOuter.classList.contains("extended")) {
            contacOuter.classList.add("extended");
        }
        
        contacOuter.children[0].style.height = (editing) ? "310px" : "300px";
        contacOuter.children[0].children[8].style.bottom = (editing) ? "-10px" : "0px";
    }
    msnry.layout();
}

window.onload = function () {
    makeRequest("getFavorites", { userId: userId }).then((res) => {
        //console.log(res);

        if (res.error === "" && res.results.length > 0) {
            console.log("found favorite contacts");

            for (let i = 0; i < res.results.length; i++) {
                curContact = res.results[i];

                spawnContact(
                    curContact.ID,
                    curContact.FirstName,
                    curContact.LastName,
                    curContact.Phone,
                    curContact.Email,
                    curContact.Notes,
                    curContact.Address,
                    curContact.IsFavorite
                );
            }
        } else {
            console.log(res.error);
        }
    });

    for (let i = 0; i < 5; i++) {
        spawnContact(
            1000 + i,
            "Benedict",
            "Cucumberpatch",
            "not much bruv not much bruv",
            "808080808" + i,
            "jojo@gmail.com",
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
    console.log(msnry.getItemElements());
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
