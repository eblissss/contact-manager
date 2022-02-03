const urlBase = "https://contacts.ninja/LAMPAPI/user";
const extension = "php";

// Default login fields
let userId = 0;
let firstName = "";
let lastName = "";

// Attempt login
function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    // Get login from page
    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let hash = md5(password);

    // Create payload
    let payload = { login: login, password: hash };
    console.log(payload);

    // Make request
    makeLoginRequest(payload).then((res) => {
        userId = res.id;
        // Check if login failed
        if (userId < 1) {
            console.log("User/Password combination incorrect");
            return;
        }

        firstName = res.firstName;
        lastName = res.lastName;

        saveCookie();

        // Change window href
        window.location.href = "contacts.html";
    });

    // Create connection functino
    async function makeLoginRequest(data = {}) {
        const res = await fetch(urlBase + "/login." + extension, {
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

// Set browser cookie
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie =
        "firstName=" +
        firstName +
        ",lastName=" +
        lastName +
        ",userId=" +
        userId +
        ";expires=" +
        date.toGMTString();
}
