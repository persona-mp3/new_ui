const loginForm = document.getElementById('loginForm');

export async function sendData(loginFrom){
    let formData = new FormData(loginForm)
    const userCred = {}

    for (let [key, val] of formData.entries()) {
        if (val.trim() === '') {
            console.log('empty value passed down')
            return
        }

        userCred[key] = val;
    }

    // send data to apiEndpoint
    let endpoint =  new URL(`http://localhost:8080/login`);
    try { 
        let payload = JSON.stringify(userCred)

        const response = await fetch(endpoint, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: payload
        })


/*         const data = await response.json();
        const msg = data.msg
 */
/*         if (msg !== undefined) {
            console.log(msg)
        } else {
            console.log('msg is undefined')
        }
 */
        
        if (response.status !== 200) {
            alert('Invalid Credentials')
            return
        }
        
        alert('Valid login, redirect user to dashboard')
        // redirect user to the dashboard page, using ressponse.url
        // as the response object contains the url property
        location.href = response.url
        console.log(response)
        // return msg
    } catch(err) {
        throw err
    }

}

loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    document.querySelectorAll('input').innerHTML = ""
    await sendData(loginForm)

})