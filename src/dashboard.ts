const dataPlaceholders: HTMLParagraphElement | any = document.querySelectorAll('.uiData')

interface UserInfo {
    firstName: string,
    lastName: string,
    email: string,
    address: string,
    postcode: string,
    type: string,
    date: string | Date
}

interface ServerData {
    msg: UserInfo
}


async function getUserData(): Promise<UserInfo | void> {
    let endpoint: URL = new URL(`http://localhost:8080/api/data`);

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

    const userName = `${userData.firstName} ${userData.lastName}`
    const address = `Location: ${userData.address} | Postcode: ${userData.postcode}`;
    const type = userData.type;
    const date = userData.date;
    const email = userData.email;

    const dateConfig: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    } 
    const transformedDate = new Date(date).toLocaleDateString('en-GB', dateConfig)
    const dataArray: string[] = [userName, email,  address, type, transformedDate]
    
    dataPlaceholders.forEach((placeholder: HTMLParagraphElement, i: number) => {
        placeholder.innerText = dataArray[i]
    })
    return
}




await getUserData()
export {}