const urlBase = "http://contacts.ninja/LAMPAPI/user";
const extension = "php";

// Default login fields
let userId = 0;
let firstName = "";
let lastName = "";
let username = "";
let password = "";
let hash = "";

function doSignUp() {
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    hash = md5(password);

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


    /*let loginCheck = {
        login: username,
    };

    let jsonPayload = JSON.stringify(loginCheck);

    let url = urlBase + "/ExistingUser." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(xhr.responseText);
                let err = xhr.responseText;
                if (err.length > 15) 
                    console.log("Duplicate Username Found");
                else
                    doActualSignUp();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        return;
    }*/

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash,
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/signup." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(xhr.responseText);
                let err = xhr.responseText;
                if (err.length > 15) 
                    console.log("Duplicate Username Found");
                else
                    window.location.href = "index.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function doActualSignUp(){
    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash,
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/Signup." + extension;

    xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                window.location.href = "index.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}
