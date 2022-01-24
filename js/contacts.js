let editing = false;
let sav;
const largeNum = 1000000000;

class Contact extends HTMLElement {
    constructor() {
        // call super first ALWAYS
        super();

        // Make template (trying to get template from HTML is too quick for browser)
        const template = document.createElement("template");
        template.innerHTML = `<link href="css/main.css" rel="stylesheet" />
        <div class="contactDiv">
            <button class="btn btn-secondary mb-1" style="width: 100px">
                Edit
            </button>
            <button class="btn btn-secondary mb-1" style="width: 100px">
                Save
            </button>
            <button class="btn btn-secondary mb-1" style="width: 100px">
                Delete
            </button>
            <br />
            <slot name="c-fname" id="mycontact">NAME MISSING</slot>
            <slot name="c-lname" id="mycontact">NAME MISSING</slot>
            <ul>
                <li><slot name="c-phone">PHONE MISSING</slot></li>
                <li><slot name="c-email"></slot>EMAIL MISSING</li>
            </ul>
            <button class="btn btn-secondary mb-1" style="width: 100px">
                Favorite
            </button>
        </div>`;

        // Get template
        //console.log(document.getElementById("contact-template"));
        //const template = document.getElementById("contact-template");
        const templateContent = template.content;

        // Get shadow root
        const shadowRoot = this.attachShadow({ mode: "open" });

        // Append to shadow
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
}
customElements.define("contact-div", Contact);

function spawnContact(id, firstname, lastname, phone, email, first = false, isFavorite = 0) {
    const contac = new Contact();
    contac.id = "contact-" + id;
    contac.isFavorite = isFavorite;
    console.log(contac.id);
    const content = contac.shadowRoot.children[1];

    content.children[4].innerHTML = firstname;
    content.children[5].innerHTML = lastname;
    content.children[6].children[0].innerHTML = "Phone: " + phone;
    content.children[6].children[1].innerHTML = "Email: " + email;

    content.children[0].addEventListener("click", () => {
        if (!editing) {
            edit(contac);
        }
    });
    content.children[2].addEventListener("click", () => {
        deleteContact(contac);
    });
    content.children[7].addEventListener("click", () => {
        setFavorite(contac);
    })

    if (first) document.getElementById("addButton").after(contac);
    else document.getElementById("contactPane").appendChild(contac);

    return contac;
}

function save(contac) {
    content = contac.shadowRoot.children[1];

    const fnameSlot = content.children[4];
    const lnameSlot = content.children[5];
    const phoneSlot = content.children[6].children[0];
    const emailSlot = content.children[6].children[1];

    const firstname = fnameSlot.children[0].value;
    const lastname = lnameSlot.children[0].value;
    const phoneNum = phoneSlot.children[0].value;
    const emailAddr = emailSlot.children[0].value;
    const id = contac.id.substring(8);

    console.log(id, firstname, lastname, phoneNum, emailAddr);

    fnameSlot.innerHTML = firstname;
    lnameSlot.innerHTML = lastname;
    phoneSlot.innerHTML = "Phone: " + phoneNum;
    emailSlot.innerHTML = "Email: " + emailAddr;

    data = {
        userId: userId,
        firstName: firstname,
        lastName: lastname,
        email: emailAddr,
        phone: phoneNum,
        isFavorite: 0,
    };

    if (id == largeNum) {
        makeRequest("create", data).then((res) => {
            if (res.error === "") {
                console.log("Contact has been added.");
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

    content.children[1].removeEventListener("click", sav);
    editing = false;
}

function edit(contac) {
    // HIDE EDITING OPTION

    editing = true;
    content = contac.shadowRoot.children[1];

    const fnameSlot = content.children[4];
    const lnameSlot = content.children[5];
    const phoneSlot = content.children[6].children[0];
    const emailSlot = content.children[6].children[1];

    const firstname = fnameSlot.innerText;
    const lastname = lnameSlot.innerText;
    const phoneNum = phoneSlot.innerText.substring(7);
    const emailAddr = emailSlot.innerText.substring(7);

    fnameSlot.innerHTML = `<input type="text" />`;
    fnameSlot.children[0].value = firstname;
    lnameSlot.innerHTML = `<input type="text" />`;
    lnameSlot.children[0].value = lastname;

    phoneSlot.innerHTML = `Phone: <input type="text" />`;
    phoneSlot.children[0].value = phoneNum;

    emailSlot.innerHTML = `Email: <input type="text" />`;
    emailSlot.children[0].value = emailAddr;

    //console.log(content);
    content.children[1].addEventListener(
        "click",
        (sav = () => {
            save(contac);
        })
    );
}

function deleteContact(contac) {
    if (confirm("Are you sure you want to delete this contact?") == false)
        return;

    const id = contac.id.substring(8);

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

function setFavorite(contac){
    const id = contac.id.substring(8);

    contac.isFavorite = (contac.isFavorite == 0) ? 1 : 0;

    makeRequest("setFavorite", { id: id, userId: userId, isFavorite: contac.isFavorite}).then((res) => {
        if (res.error === "") {
            console.log("Favorite (0 = no, 1 = yes): " + contac.isFavorite);
        } else {
            console.log(res.error);
        }
    });
}

window.onload = function () {
    for (let i = 0; i < 2; i++) {
        spawnContact(
            i,
            "Benedict",
            "Cucumberpatch",
            "808080808" + i,
            "jojo@gmail.com"
        );
    }
};
