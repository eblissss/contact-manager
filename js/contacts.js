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
    if (first) document.getElementById("addButton").after(contac);
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

    // Save data
    data = {
        userId: userId,
        firstName: firstname,
        lastName: lastname,
        email: emailAddr,
        phone: phoneNum,
        isFavorite: 0,
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
}

// Put contact in edit mode
function edit(contac) {
    extend(contac, (stay = true));
    // HIDE EDITING OPTION

    editing = true;

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
    fnameSlot.innerHTML = `<input type="text" />`;
    fnameSlot.children[0].value = firstname;
    lnameSlot.innerHTML = `<input type="text" />`;
    lnameSlot.children[0].value = lastname;

    notesSlot.innerHTML = `Notes: <input "type="text"/>`;
    notesSlot.children[0].value = notes;

    emailSlot.innerHTML = `Gmail: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input style="type="text" />`;
    emailSlot.children[0].value = emailAddr;
    console.log(emailSlot.outerHTML);

    phoneSlot.innerHTML =  `Phone: &nbsp&nbsp&nbsp&nbsp&nbsp<input "type="text" />`;
    phoneSlot.children[0].value = phoneNum;


    addrSlot.innerHTML = `Address: &nbsp&nbsp<input type="text" />`;
    addrSlot.children[0].value = address;

    // Add save button (should probably just show/hide instead of creating each time)
    const sabeButton = document.createElement("button");
    sabeButton.classList.add("btn");
    sabeButton.style.backgroundColor = "white";
    sabeButton.innerHTML = "SAVE";
    sabeButton.style.marginLeft = "175px";
    sabeButton.style.marginTop = "-30px";
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

const template = document.createElement("template");
template.innerHTML = `
    <div class="contactDiv grid-item">
    <img
        class="contact-image"
        src="https://www.publicdomainpictures.net/pictures/120000/nahled/abstract-composition-14287573024pP.jpg"
        alt=""
    />
    <h3 class="fname">NAME MISSING</h3>
    <h3 class="lname">NAME MISSING</h3>
    <div class="contactLowerBackground">
        <h4 class="notes">Information Notes Information Notes</h4>
        <div class="drop-info">
            <h4 class="phone">Phone: (808)-808-8888</h4>
            <h4 class="email">Email: joe@gmail.com</h4>
            <h4 class="address">Address: sheeesh</h4>
        </div>
    </div>

    <!-- Default dropright button -->
    <div class="dropdown dropmenu dropend">
        <button
            class="btn btn-secondary"
            type="button"
            id="dropdownMenu2"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-three-dots-vertical triple-dots"
                viewBox="0 0 16 16"
            >
                <path
                    d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                />
            </svg>
        </button>
        <div
            class="dropdown-menu dropdown-menu-dark"
            aria-labelledby="dropdownMenu2"
        >
            <button class="dropdown-item" type="button">Edit</button>
            <button class="dropdown-item" type="button">Delete</button>
        </div>
    </div>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-bookmark-star fav"
        viewBox="0 0 16 16"
    >
        <path
            d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.178.178 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.178.178 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.178.178 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.178.178 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.178.178 0 0 0 .134-.098L7.84 4.1z"
        />
        <path
            d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
        />
    </svg>
    <!-- Show info button -->
    <button class="dropButton" type="button">
        <svg
            color="white"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrows-expand"
            viewBox="0 0 16 16"
        >
            <path
                fill-rule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"
            />
        </svg>
    </button>
    </div>`;
