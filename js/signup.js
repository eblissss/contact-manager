const urlBase = "http://contacts.ninja/LAMPAPI";
const extension = "php";

// Default login fields
let userId = 0;
let firstName = "";
let lastName = "";

function doSignUp() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let hash = md5(password);

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

    if (retFlag) return;

    let loginCheck = {
        login: username,
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/ExistingUser." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (!(jsonObject.error == "")) {
                    console.log("Duplicate Username Found");
                    return;
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        return;
    }

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash,
    };

    jsonPayload = JSON.stringify(tmp);

    url = urlBase + "/Signup." + extension;

    xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("loginResult").innerHTML =
                    "Account Created";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}
