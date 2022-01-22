const urlBase = "http://contacts.ninja/LAMPAPI/contact";
const extension = ".php";

function callAPI(){
    const a =  new Promise ((resolve, reject) => {
        setTimeout(() => {
            let response = create();
        }, 5000);
    })
    .then()
    .then()
    .catch()
    // (resolve: (value: any) => void, reject: (reason?: any) => void): void

    return a;
}

// Contacts
async function create(){
    const response = await fetch(urlBase + "create" + extension);

    return response.json;
}


// Users
