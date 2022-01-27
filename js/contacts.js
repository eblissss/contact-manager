let editing = false;
let sav, msnry;
const largeNum = 1000000000;

// Spawn a new contact on the div
function spawnContact(
    id,
    firstname,
    lastname,
    phone,
    email,
    first = false,
    isFavorite = 0,
    notes = "some notes about ...",
    address = "1000 Ionic Drive"
) {
    // Create new contact
    const template = document.getElementById("contact-template");
    const contac = template.content.cloneNode(true).children[0];
    contac.id = "contact-" + id;
    contac.isFavorite = isFavorite;
    console.log(contac.id);

    // Add info
    contac.children[1].innerHTML = firstname;
    contac.children[2].innerHTML = lastname;
    contac.children[3].children[0] = notes;
    const infoSection = contac.children[3].children[1];
    infoSection.children[0].innerHTML = `📞: <h4 class="phoneData">${phone}</h4>`;
    infoSection.children[1].innerHTML = `📧: <h4 class="emailData">${email}</h4>`;
    infoSection.children[2].innerHTML = `📍: <h4 class="addrData">${address}</h4>`;

    const dotMenu = contac.children[4].children[1];
    // Add listeners
    dotMenu.children[0].addEventListener("click", () => {
        if (!editing) {
            edit(contac);
        }
    });
    dotMenu.children[1].addEventListener("click", () => {
        deleteContact(contac);
    });
    // content.children[7].addEventListener("click", () => {
    //     setFavorite(contac);
    // });
    contac.children[6].addEventListener("click", () => {
        extend(contac);
    });

    // Insert into div
    if (first) document.getElementById("newContactPlaceholder").after(contac);
    else document.getElementById("contactPane").appendChild(contac);

    return contac;
}

// Update (or add) the contact
function save(contac) {
    // Grab slots
    const fnameSlot = contac.children[1];
    const lnameSlot = contac.children[2];
    const notesSlot = contac.children[3].children[0];

    const infoSection = contac.children[3].children[1];

    const phoneSlot = infoSection.children[0];
    const emailSlot = infoSection.children[1];
    const addrSlot = infoSection.children[2];

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
    contac.children[1].innerHTML = firstname;
    contac.children[2].innerHTML = lastname;
    contac.children[3].children[0].innerHTML = notes;
    contac.children[3].children[1].children[0].innerHTML = `📞: <h4 class="phoneData">${phoneNum}</h4>`;
    contac.children[3].children[1].children[1].innerHTML = `📧: <h4 class="emailData">${emailAddr}</h4>`;
    contac.children[3].children[1].children[2].innerHTML = `📍: <h4 class="addrData">${address}</h4>`;
    console.log(contac.children[1].innerHTML);

    // Save data
    data = {
        userId: userId,
        firstName: firstname,
        lastName: lastname,
        email: emailAddr,
        phone: phoneNum,
        isFavorite: 0,
        notes: notes,
        address: address
        // ADD THE OTHER INFO
    };

    // Create or Update
    if (id == largeNum) {
        makeRequest("create", data).then((res) => {
            if (res.error === "") {
                console.log("Contact has been added.");
                contac.id = "contact-" + res.id;
            } else {
                console.log(res.error);
            }
            document.getElementById("addButton").style.display = "inline-block";
        });
    } else {
        makeRequest("update", { ...data, id: id }).then((res) => {
            if (res.error === "") {
                console.log("Contact has been updated.");
            } else {
                console.log(res.error);
            }
        });
    }

    infoSection.children[3].remove();
    editing = false;

    document.getElementById('dropdownMenu2').style.visibility = 'visible';
}

// Put contact in edit mode
function edit(contac) {
    extend(contac, (stay = true));
    // HIDE EDITING OPTION

    editing = true;
    document.getElementById('dropdownMenu2').style.visibility = 'hidden';

    // Get slots
    const fnameSlot = contac.children[1];
    const lnameSlot = contac.children[2];
    const notesSlot = contac.children[3].children[0];

    const infoSection = contac.children[3].children[1];

    const phoneSlot = infoSection.children[0];
    const emailSlot = infoSection.children[1];
    const addrSlot = infoSection.children[2];

    // Get slot info
    const firstname = fnameSlot.innerText;
    const lastname = lnameSlot.innerText;
    const notes = notesSlot.innerText;
    const phoneNum = phoneSlot.innerText.substring(3);
    const emailAddr = emailSlot.innerText.substring(3);
    const address = addrSlot.innerText.substring(3);

    // Replace text with inputs
    fnameSlot.innerHTML = `First Name: <input stype="text" />`;
    fnameSlot.children[0].value = firstname;
    lnameSlot.innerHTML = `Last Name: <input type="text" />`;
    lnameSlot.children[0].value = lastname;

    notesSlot.innerHTML = `Notes: <input "type="text"/>`;
    notesSlot.children[0].value = notes;

    emailSlot.innerHTML = `📧: <input type="text" />`;
    emailSlot.children[0].value = emailAddr;
    console.log(emailSlot.outerHTML);

    phoneSlot.innerHTML = `📞: <input "type="text" />`;
    phoneSlot.children[0].value = phoneNum;

    addrSlot.innerHTML = `📍: <input type="text" />`;
    addrSlot.children[0].value = address;

    // Add save button (should probably just show/hide instead of creating each time)
    const sabeButton = document.createElement("button");
    sabeButton.classList.add("btn");
    sabeButton.style.backgroundColor = "white";
    sabeButton.innerHTML = "SAVE";
    sabeButton.style.marginLeft = "310px";
    sabeButton.style.marginTop = "-65px";
    sabeButton.style.marginBottom = "50px";
    sabeButton.addEventListener(
        "click",
        (sav = () => {
            save(contac);
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

    // We should have animations too
    contac.remove();
}

// Set a contact as favorite
function setFavorite(contac) {
    const id = contac.id.substring(8);

    // Swap 0 and 1
    contac.isFavorite = 1 - contac.isFavorite;

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

function extend(contac, stay = false) {
    if (contac.classList.contains("extended") && !stay) {
        console.log("shortening");
        contac.style.height = "200px";
        contac.children[3].style.height = "100px";
        contac.children[3].children[1].style.display = "none";
        contac.classList.remove("extended");
    } else {
        contac.style.height = "300px";
        contac.children[3].style.height = "200px";
        contac.children[3].children[1].style.display = "flex";
        if (!contac.classList.contains("extended")) {
            contac.classList.add("extended");
        }
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
                    curContact.Email
                );
            }
        } else {
            console.log(res.error);
        }
    });

    // for (let i = 0; i < 5; i++) {
    //     spawnContact(
    //         1000 + i,
    //         "Benedict",
    //         "Cucumberpatch",
    //         "not much bruv",
    //         "808080808" + i,
    //         "jojo@gmail.com",
    //         "1000 Ionic Drive"
    //     );
    // }

    const grid = document.getElementById("contactPane");
    msnry = new Masonry(grid, {
        itemSelector: ".grid-item",
        columnWidth: 400,
        gutter: 10,
    });
    console.log(msnry.getItemElements());
};
