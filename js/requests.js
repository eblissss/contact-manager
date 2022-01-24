const urlBase = "https://contacts.ninja/LAMPAPI/contact";
const extension = ".php";

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