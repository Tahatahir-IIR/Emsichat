export const validateLoginForm=({mail})=>{
    const isMailValid = validateMail(mail);

    return isMailValid ;
}

export const validateRegisterForm=({username,mail,password})=>{
    const isUsernameValide = validateUsername(username);
    const isMailValid = validateMail(mail);
    const isPasswordValid = validatePassword(password); 

    return isUsernameValide && isMailValid && isPasswordValid ;
}

const validateUsername=(password)=>{
    return password.length>2 && password.length<17;

}

export const validateMail=(mail)=>{
    const emailPattern=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(mail);
}

const validatePassword=(password)=>{
    return password.length>7 && password.length<33;

}