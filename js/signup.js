const urlBase = "https://contacts.ninja/LAMPAPI/user";
const extension = "php";

// Default login fields
let userId = 0;
let firstName = "";
let lastName = "";
let username = "";
let password = "";
let hash = "";

let uFlag = false;
let fnFlag = false;
let lnFlag = false;

setTimeout(function(){

    document.getElementById('firstNameSpot').addEventListener('mouseover', () => {
        if(fnFlag){
            if(document.getElementById('firstName').value.length > 0){
                document.getElementById('firstNameSpot').removeAttribute('data-tip');
                document.getElementById('FN').style.borderBottom = "2px solid #ffffff66";
            }else{
                document.getElementById('firstNameSpot').setAttribute('data-tip', 'Please Enter a First Name');
            }
        }
    })
    document.getElementById('lastNameSpot').addEventListener('mouseover', () => {
        if(lnFlag){
            if(document.getElementById('lastName').value.length > 0){
                document.getElementById('lastNameSpot').removeAttribute('data-tip');
                document.getElementById('LN').style.borderBottom = "2px solid #ffffff66";
            }else{
                document.getElementById('lastNameSpot').setAttribute('data-tip', 'Please Enter a Last Name');
            }
        }
    })
    document.getElementById('usernameSpot').addEventListener('mouseover', () => {
        if(lnFlag){
            if(document.getElementById('username').value.length > 0){
                document.getElementById('usernameSpot').removeAttribute('data-tip');
                document.getElementById('user').style.borderBottom = "2px solid #ffffff66";
            }else{
                document.getElementById('usernameSpot').setAttribute('data-tip', 'Please Enter a Username');
            }
        }
    })
    document.getElementById('passwordSpot').addEventListener('mouseover', () => {
        if(document.getElementById('password').value.length >= 5){
            document.getElementById('passwordSpot').removeAttribute('data-tip');
            document.getElementById('pass').style.borderBottom = "2px solid #ffffff66";
        }else{
            document.getElementById('passwordSpot').setAttribute('data-tip', 'Must be at least 5 characters');
        }
    })
}, 1000);//Timeout so the script reads everything before creating the event listener



function doSignUp() {
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    hash = md5(password);

    // Create payload
    let payload = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash,
    };

    let errors = [];

    if(firstName.length == 0)
        errors.push(1);

    if(lastName.length == 0)
        errors.push(2);

    if(username.length == 0)
        errors.push(3);

    if(password.length < 5)
        errors.push(4);

    console.log(payload);

    if(errors.length > 0){
        fieldWarning(errors);
        return;
    } 

    // Make request
    makeLoginRequest(payload).then((res) => {
        const err = res.error;
        if (err.length > 15) usernameWarning(errors);
        else window.location.href = "index.html";
    });

    // Create connection functino
    async function makeLoginRequest(data = {}) {
        const res = await fetch(urlBase + "/signup." + extension, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            return { error: "Server Error" };
        }
        return res.json();
    }
}

function fieldWarning(errors){
    if (errors.includes(1)){
        document.getElementById('firstNameSpot').setAttribute('data-tip', 'Please Enter a First Name');
        document.getElementById('FN').style.borderBottom = "2px solid red";
        fnFlag = true;
    }
    if (errors.includes(2)){
        document.getElementById('lastNameSpot').setAttribute('data-tip', 'Please Enter a Last Name');
        document.getElementById('LN').style.borderBottom = "2px solid red";
        lnFlag = true;
    }
    if (errors.includes(3)){
        document.getElementById('usernameSpot').setAttribute('data-tip', 'Please Enter a Username');
        document.getElementById('user').style.borderBottom = "2px solid red";
    }
    if (errors.includes(4)){
        document.getElementById('passwordSpot').setAttribute('data-tip', 'Must be at least 5 characters');
        document.getElementById('pass').style.borderBottom = "2px solid red";
    }
}

function usernameWarning(){
    document.getElementById('usernameSpot').setAttribute('data-tip', 'Duplicate Username');
    document.getElementById('user').style.borderBottom = "2px solid red";
}
