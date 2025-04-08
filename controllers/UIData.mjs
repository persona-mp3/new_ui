// this function will take a req, and response objec
export async function UIData(req, res) {
    // upon succesful authentication or login procedure
    // the user has been redirect to this page and this page is rendered and displayed in the ejs template
    
    const userData = req.session.user
    const userName =  `${userData.firstName} ${userData.lastName}`
    const address = `${userData.address}`
    const postcode = userData.postcode
    return
}