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

    // To ensure no fields can be empty
    const forms = [firstName, lastName, username, password];

    // Cycle through
    Array.prototype.forEach(forms)
    {
        signupForm.addEventListener('submit', doSignUp())
        if (forms[i] === "") 
        {
            event.preventDefault()
            // event.stopPropagation()
        }
        signupForm.classList.add('was-validated') // <--- validation message => .css

    }

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
