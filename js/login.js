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
            body: payload
        })


        const data = await response.json();
        const msg = data.msg

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
        console.log(msg)
        return msg
    } catch(err) {
        throw err
    }

}

loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    document.querySelectorAll('input').innerHTML = ""
    await sendData(loginForm)

})