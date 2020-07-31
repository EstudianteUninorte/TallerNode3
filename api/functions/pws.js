const pws = (pswd) => {

    if(pswd.length < 8){
        return false;
    }

    if(!pswd.match(/[A-z]/)){
        return false;
    }

    if(!pswd.match(/[A-Z]/)){
        return false;
    }

    if (!pswd.match(/\d/)) {
        return false;
    }

    //validate caracter
    if (!pswd.match(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/)) {
        return false;
    }

    return true;
}
module.exports = pws;