const urlBase = "https://contacts.ninja/LAMPAPI/contact";
const extension = ".php";

function callAPI() {
    const a = new Promise((resolve, reject) => {
        setTimeout(() => {
            let response = create();
        }, 5000);
    })
        .then()
        .then()
        .catch();
    // (resolve: (value: any) => void, reject: (reason?: any) => void): void

    return a;
}

// Contacts
async function makeRequest(endpoint, data = {}) {
    const res = await fetch(urlBase + "/" + endpoint + extension, {
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
