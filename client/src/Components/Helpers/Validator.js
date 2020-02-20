const validateName = ( value ) => {
    const result = /^[A-z]{3,15}$/.test(value);
    if ( result === false )
        return "this field can only contain between 3 and 15 alphabetical chars.";
    else 
        return "";
}

const validateUsername = ( value ) => {
    const result = /^[A-z0-9-_]{5,20}$/.test(value);
    if ( result === false )
        return "this field can only contain between 5 and 20 alphanumeric chars.";
    else 
        return "";
}

const validateEmail = ( value ) => {
    const result = /[a-z0-9-_.]{1,50}@[a-z0-9-_.]{1,50}\.[a-z0-9]{2,10}$/.test(value);
    if ( result === false )
        return "Invalid email address"
    else
        return "";
}

const validatePassword = ( value ) => {
    const result = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,36})/.test(value);
    if ( result === false )
        return "Your password should contain at least one capital latter and one number and should be between {8-36} char.";
    else
        return "";
}

const validateConfirmation = ( value, ref ) => {
    if ( value === ref )
        return "";
    else
        return "Your password doesn't match passowrd confirmation.";
}

const validateBio = ( value ) => {
    const result = /^[A-z0-9-_ ]{5,300}$/.test(value);
    if ( result === false )
        return "Your bio should contain between 5 and 300 chars, digits and ( space | - | _ )";
    else if ( value.trim() === '' )
        return "Invalid bio";
    else
        return "";
}

const validateResetPassword = ( target, value, ref ) => {
    if ( target === "password" )
        return ( validatePassword( value ) );
    else if ( target === "passwordConfirmation" )
        return ( validateConfirmation( value, ref ) );
}

const validateRegisterData = ( target, value, ref ) => {
    if ( target === 'fname' || target === 'lname' )
        return validateName( value );
    else if ( target === 'username' )
        return validateUsername( value );
    else if ( target === 'email' )
        return validateEmail( value );
    else if ( target === 'password' )
        return validatePassword( value );
    else if ( target === 'passwordConfirmation')
        return validateConfirmation( value, ref );
}

const validateEditData = ( target, value, ref ) => {
    if ( target === 'fname' || target === 'lname' )
        return validateName( value );
    else if ( target === 'username' )
        return validateUsername( value );
    else if ( target === 'email' )
        return validateEmail( value );
    else if ( target === 'bio' )
        return validateBio( value );
}

const validateLoginData = ( target, value ) => {
    if ( target === 'username' )
        return validateUsername( value );
    else if ( target === 'password' )
        return validatePassword( value );
}

const validateChangePassword = ( target, value, ref ) => {
    if ( target === "password" || target === "oldPassword" )
        return ( validatePassword( value ) );
    else if ( target === "passwordConfirmation" )
        return ( validateConfirmation( value, ref ) );
}

const validateSearchData = ( value ) => {
    try {
        if ( value.length < 1 || value.length > 50)
            return "invalid search sentence";
        else return '';
    } catch ( e ) {
        return '';
    }
}

const validateComment = ( value ) => {
    try {
        if ( value.length < 1 || value.length > 500 )
            return "invalid comment";
        else return '';
    } catch ( e ) {
        return '';
    }
}

exports.validateRegisterData = validateRegisterData;
exports.validateLoginData = validateLoginData;
exports.validateEmail = validateEmail;
exports.validateResetPassword = validateResetPassword;
exports.validateEditData = validateEditData;
exports.validateChangePassword = validateChangePassword;
exports.validateSearchData = validateSearchData;
exports.validateComment = validateComment;