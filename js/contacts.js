let editing = false;
let sav;

class Contact extends HTMLElement {
    constructor() {
        // call super first ALWAYS
        super();

        // Make template (trying to get template from HTML is too quick for browser)
        const template = document.createElement("template");
        template.innerHTML = `<link href="css/main.css" rel="stylesheet" />
        <div class="contactDiv">
            <button id="main_bt" style="width: 100px">Edit</button>
            <button class="btn btn-secondary mb-1" style="width: 100px">
                Save
            </button>
            <br />
            <slot name="c-fname" id="mycontact">NAME MISSING</slot>
            <slot name="c-lname" id="mycontact">NAME MISSING</slot>
            <ul>
                <li><slot name="c-phone">PHONE MISSING</slot></li>
                <li><slot name="c-email"></slot>EMAIL MISSING</li>
            </ul>
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

function spawnContact(id, firstname, lastname, phone, email) {
    const contac = new Contact();
    contac.id = "contact-" + id;
    const content = contac.shadowRoot.children[1];

    content.children[3].innerHTML = firstname;
    content.children[4].innerHTML = lastname;
    content.children[5].children[0].innerHTML = "Phone: " + phone;
    content.children[5].children[1].innerHTML = "Email: " + email;

    content.children[0].addEventListener("click", () => {
        if (!editing) {
            editing = true;
            edit(contac);
        }
    });

    document.getElementById("contactPane").appendChild(contac);
}

function save(contac) {
    content = contac.shadowRoot.children[1];

    const fnameSlot = content.children[3];
    const lnameSlot = content.children[4];
    const phoneSlot = content.children[5].children[0];
    const emailSlot = content.children[5].children[1];

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

    // send to update API
    // send (id, firstname, lastname, phone, email) + userId (from logged in cache)

    content.children[1].removeEventListener("click", sav);
    editing = false;
}

function edit(contac) {
    content = contac.shadowRoot.children[1];

    const fnameSlot = content.children[3];
    const lnameSlot = content.children[4];
    const phoneSlot = content.children[5].children[0];
    const emailSlot = content.children[5].children[1];

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
