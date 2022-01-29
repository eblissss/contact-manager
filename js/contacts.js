let editing = false;
let sav, msnry;
const largeNum = 1000000000;

const buttonColors = ['red', 'green', 'orange', 'blue'];
let colorIndex = 0;


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
    contac.children[2].innerHTML = firstname;
    contac.children[3].innerHTML = lastname;
    contac.children[4].children[0].innerHTML = notes;

    const infoSection = contac.children[4].children[1];

    infoSection.children[1].innerHTML = `${phone}`;
    infoSection.children[3].innerHTML = `${email}`;
    infoSection.children[5].innerHTML = `${address}`;

    const dotMenu = contac.children[5].children[1];
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
    contac.children[1].addEventListener("click", () => {
        setColors(contac, contac.id);
        if(colorIndex == 3)
            colorIndex = 0;
        else
            colorIndex++;
    });
    contac.children[7].addEventListener("click", () => {
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
    const fnameSlot = contac.children[2];
    const lnameSlot = contac.children[3];
    const notesSlot = contac.children[4].children[0];

    const infoSection = contac.children[4].children[1];

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

    contac.children[4].children[0].innerHTML = notes;

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

    editing = false;

    document.getElementById("dropdownMenu").style.visibility = "visible";
    infoSection.children[6].remove();
}

// Put contact in edit mode
function edit(contac) {
    console.log("hello");
    extend(contac, (stay = true));
    // HIDE EDITING OPTION

    editing = true;
    document.getElementById("dropdownMenu").style.visibility = "hidden";

    // Get slots
    const fnameSlot = contac.children[2];
    const lnameSlot = contac.children[3];
    const notesSlot = contac.children[4].children[0];

    const infoSection = contac.children[4].children[1];

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
    fnameSlot.innerHTML = `<input style="width:285px" type="text" />`;
    fnameSlot.children[0].value = firstname;
    lnameSlot.innerHTML = `<input style="width:285px" type="text" />`;
    lnameSlot.children[0].value = lastname;

    notesSlot.innerHTML = `<input "type="text"/>`;
    notesSlot.children[0].value = notes;

    emailSlot.innerHTML = `<input type="text" />`;
    emailSlot.children[0].value = emailAddr;

    phoneSlot.innerHTML = `<input "type="text" />`;
    phoneSlot.children[0].value = phoneNum;

    addrSlot.innerHTML = `<input type="text" />`;
    addrSlot.children[0].value = address;

    console.log(document.getElementById('address'));

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
                sabeButton.style.visibility = 'hidden';
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
        contac.children[4].style.height = "100px";
        contac.children[4].children[1].style.display = "none";
        contac.classList.remove("extended");
    } else {
        contac.style.height = "300px";
        contac.children[4].style.height = "200px";
        contac.children[4].children[1].style.display = "grid";
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

    for (let i = 0; i < 5; i++) {
        spawnContact(
            1000 + i,
            "Benedict",
            "Cucumberpatch",
            "not much bruv",
            "808080808" + i,
            "jojo@gmail.com",
            "1000 Ionic Drive"
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

function setColors(contac, id){
    if(colorIndex == 3){
        document.getElementById(id).classList.remove('contactDiv4');
        document.getElementById(id).classList.add('contactDiv1');
        contac.children[1].style.backgroundColor = buttonColors[0];
        
    }else{
        document.getElementById(id).classList.remove('contactDiv' + (colorIndex + 1));
        document.getElementById(id).classList.add('contactDiv' + (colorIndex + 2));
        contac.children[1].style.backgroundColor = buttonColors[colorIndex + 1];
    }
}


