const characters = '!%$ABCD999EFGHIJKLMNOPRQSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890#£';

function generateString(resultLen) {
    let generatedStr = ' ';
    let generatedLen = characters.length;

    for (let i=0; i < resultLen; i++) {
        generatedStr += characters.charAt(Math.floor(Math.random() * generatedLen))
    };

    return generatedStr
}



console.log(generateString(12))