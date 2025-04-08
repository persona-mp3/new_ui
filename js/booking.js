const form = document.querySelector('form')
const datePicker = document.getElementById('datePicker')

// this function makes use of the third party API flatpickr and sets a dynamic calender
function validateDate() {
    flatpickr(datePicker, {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        maxDate: "2025-8-23",
        disable: ["2025-04-03"]
        // maxD
    })
}

validateDate()


const tempPassGen = function (userData) {
    let lengthOfPass = 10;
    let tempPass = '';
    let characters = `A$#@~BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk;mnoprqstuvwxyz1234567890`;

    for (let i=0; i < lengthOfPass; i++) {
        tempPass += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    userData.password = tempPass;
    console.log('mutated userCred')
    console.log(userData)

    return userData;
}

async function getFormData(form) {
    let formData = new FormData(form);
    const userData = { }

    // iterate through form data and save to hashMap
    for (let [key, value] of formData.entries()){
        console.log(value)

        if (value.trim() === '') {
            alert('Empty feild at -->', key)
            return
        }
        userData[key] = value
    }

    // attach temporary password here
    const userPass = tempPassGen(userData)


    // let formattedDate = new Date(`${userData.date}`)
    // let newDate = formattedDate.toLocaleDateString('en-US', {
    //     // weekday: "long",
    //     month: "long",
    //     day: "2-digit",
    //     year: "numeric"
    // })

    // newDate returns August 07, 2025



    try { 
        let localhost = new URL(`http://localhost:8080/booking`)
        let payload = JSON.stringify(userPass);

        const response = await fetch(localhost, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: payload
        });

        const data = await response.json()

        if (response.status !== 200) {
            alert(data.message)
            return;
        }

        if (response.status === 200) {
            console.log('SERVER RESPONSE STATUS OF 200');
            alert('sucess')
        }

    
    } catch (err){
        throw err
    }
}


form.addEventListener('submit',async( evt) => {
    evt.preventDefault()
    await getFormData(form)
})