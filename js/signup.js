const urlBase = "https://contacts.ninja/LAMPAPI/user";
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

    // Create payload
    let payload = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash,
    };

    // let xhr = new XMLHttpRequest();
    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    // try {
    //     xhr.onreadystatechange = function () {
    //         if (this.readyState == 4 && this.status == 200) {
    //             console.log(xhr.responseText);
    //             let err = xhr.responseText;
    //             if (err.length > 15) console.log("Duplicate Username Found");
    //             else window.location.href = "index.html";
    //         }
    //     };
    //     xhr.send(jsonPayload);
    // } catch (err) {
    //     document.getElementById("loginResult").innerHTML = err.message;
    // }

    console.log(payload);

    // Make request
    makeLoginRequest(payload).then((res) => {
        const err = res.error;
        if (err.length > 15) console.log("Duplicate Username Found");
        else if (err.length > 0) console.log("Server Error");
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
