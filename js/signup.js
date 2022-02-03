const urlBase = "https://contacts.ninja/LAMPAPI/user";
const extension = "php";

// Default login fields
let userId = 0;
let firstName = "";
let lastName = "";
let username = "";
let password = "";
let hash = "";

setTimeout(function(){
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

    let ret = false;

    if(password.length < 5)
        ret = true;


    // // To ensure no fields can be empty
    // const formErrors = ["fnError", "lnError", "userError", "passError"];
    // const formParams = [firstName, lastName, username, password];
    // let retFlag = false;

    // // Cycle through parameters
    // for (let i = 0; i < 4; i++) {
    //     if (formParams[i] === "") {
    //         console.log(formErrors[i]);
    //         document.getElementById(formErrors[i]).innerHTML =
    //             "This field should not be empty";
    //         retFlag = true;
    //     } else {
    //         document.getElementById(formErrors[i]).innerHTML = "";
    //     }
    // }

    // Create payload
    let payload = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash,
    };

    console.log(payload);

    // Make request
    makeLoginRequest(payload).then((res) => {
        if(ret) document.getElementById('pass').style.borderBottom = "2px solid red"; //Do it here to prevent delay between setting fields to red
        const err = res.error;
        if (err.length > 15 && document.getElementById('username').value.length > 0) fieldWarning(1);
        else if (document.getElementById('username').value.length == 0) fieldWarning(2);
        else if (err.length > 0) console.log("Server Error");
        else if (ret) return;
        else window.location.href = "index.html";
        // make sure name and last name are not empty
        if (document.getElementById('firstName').value.length == 0) fieldWarning(3);
        if (document.getElementById('lastName').value.length == 0) fieldWarning(4);
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

function fieldWarning(flag){
    if (flag == 1){
        document.getElementById('usernameSpot').setAttribute('data-tip', 'Duplicate Username');
        document.getElementById('user').style.borderBottom = "2px solid red";
    }
    if (flag == 2){
        document.getElementById('usernameSpot').setAttribute('data-tip', 'Please Enter a Username');
        document.getElementById('user').style.borderBottom = "2px solid red";
    }
    if (flag == 3){
        document.getElementById('firstNameSpot').setAttribute('data-tip', 'Please Enter a First Name');
        document.getElementById('FN').style.borderBottom = "2px solid red";
    }
    if (flag == 4){
        document.getElementById('lastNameSpot').setAttribute('data-tip', 'Please Enter a Last Name');
        document.getElementById('LN').style.borderBottom = "2px solid red";
    }
}
