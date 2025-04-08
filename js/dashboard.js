const dataPlaceholders = document.querySelectorAll('.uiData');
async function getUserData() {
    let endpoint = new URL(`http://localhost:8080/api/userData`);
    try {
        const response = await fetch(endpoint, {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        });
        const serverData = await response.json();
        const data = serverData.msg;
        if (response.status !== 200) {
            console.log('Internal Server Error');
            return;
        }
        console.log('[data gotten succesfully]');
        // call renderUI function inside here to contiue the async procwess
        // as there will be no need for???? forgotten
        console.log(data);
        renderUI(data);
        return data;
    }
    catch (err) {
        throw err;
    }
}
function renderUI(userData) {
    let userName = userData.name;
    const address = userData.address;
    const postcode = userData.postcode;
    const type = userData.type;
    const date = userData.date;
    const email = userData.email;
    const dataArray = [userName, address, postcode, type, date, email];
    dataPlaceholders.forEach((placeholder, i) => {
        placeholder.innerText = dataArray[i];
    });
    return;
}
await getUserData();
export {};
