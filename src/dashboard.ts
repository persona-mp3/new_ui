const dataPlaceholders: HTMLParagraphElement | any = document.querySelectorAll('.uiData')

interface UserInfo {
    name: string,
    email: string,
    address: string,
    postcode: string,
    type: string,
    date: string
}

interface ServerData {
    msg: UserInfo
}


async function getUserData(): Promise<UserInfo | void> {
    let endpoint: URL = new URL(`http://localhost:8080/api/userData`);

    try {
        const response: Response = await fetch(endpoint, {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            },
            
        })
        

        const serverData: ServerData = await response.json()
        const data: UserInfo = serverData.msg

        if (response.status !== 200) {
            console.log('Internal Server Error')
            return
        }
        
        console.log('[data gotten succesfully]')
        // call renderUI function inside here to contiue the async procwess
        // as there will be no need for???? forgotten
        console.log(data)
        renderUI(data)
        return data
    } catch (err) {
        throw err
    }
}


function renderUI(userData: UserInfo): void{

    let userName = userData.name
    const address = userData.address;
    const postcode = userData.postcode;
    const type = userData.type;
    const date = userData.date;
    const email = userData.email;
    
    const dataArray: string[] = [userName, address, postcode, type, date, email]
    
    dataPlaceholders.forEach((placeholder: HTMLParagraphElement, i: number) => {
        placeholder.innerText = dataArray[i]
    })
    return
}




await getUserData()
export {}