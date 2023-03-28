export const getTokenFromHeader = (req) => {
    //  grab token from header
    // TODO: Debug uncomment //    console.log(`[getTokenFromHeader func],req value is:\n`,req);
    const token  = req?.headers?.authorization?.split(' ')[1]
    if(token === undefined) {
         // TODO: Debug uncomment // console.log(`[getTokenFromHeader func],token value is: ${token}`);
        return 'No token found in header'
    } else {
        return token
    }
}

export default getTokenFromHeader