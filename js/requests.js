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

// Check the database to see if the user already exists
// Unsure what the if condition should be here, need to figure that out later.

// async function checkForUser(endpoint, data={}) {
//     const res = await $.ajax({
//         url: ("https://contacts.ninja/LAMPAPI/" + "users/" + endpoint + extension),
//         type: 'GET',
//         datatype: 'json',
//         sucess: () => {
//             if (res.data) return true;
//             else return false;
//         }
//     });

//     if (!res.ok) {
//         return { error: "Server Error" };
//     }
//     return false;
// }