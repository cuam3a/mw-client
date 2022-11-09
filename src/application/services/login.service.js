import axios from "axios";
import authHeader from "./authHeader";
import global from "./global.service"

const API_URL = global.getURLServer();

const register = async(data) => {
    let res = {};
    await axios({
            url: API_URL + '/login/register',
            method: 'POST',
            data: data
        })
        .then(function(response) {
            res = response.data;
        })
        .catch(function(error) {
            res.error = error;
        })
    return res;
};

const login = async(data) => {
    let res = {};
    await axios({
            url: API_URL + '/login/signin',
            method: 'POST',
            data: data
        })
        .then(function(response) {
            if (response.data.token) {
                localStorage.setItem("email", JSON.stringify(response.data.email));
                localStorage.setItem("token", JSON.stringify(response.data.token));
            }
            res = response.data;
        })
        .catch(function(error) {
            res.error = error;
        })
    return res;
};

const verifyMail = async(email, id) => {
    let res = {};
    await axios({
            url: API_URL + '/login/verify',
            method: 'GET',
            params: {
                email: email,
                id: id
            }
        })
        .then(function(response) {
            res = response.data;
        })
        .catch(function(error) {
            res.error = error;
        })
    return res;
};

const getChangePassword = async(email) => {
    let res = {};
    await axios({
            url: API_URL + '/login/getChangePassword',
            method: 'GET',
            params: {
                email: email
            }
        })
        .then(function(response) {
            res = response.data;
        })
        .catch(function(error) {
            res.error = error;
        })
    return res;
};

const setChangePassword = async(password, email, id) => {
    let res = {};
    await axios({
            url: API_URL + '/login/setChangePassword',
            method: 'POST',
            params: {
                email: email,
                id: id
            },
            data: { password: password }
        })
        .then(function(response) {
            res = response.data;
        })
        .catch(function(error) {
            res.error = error;
        })
    return res;
};

const checkToken = async(email) => {
    let res = {};
    await axios({
            url: API_URL + '/check/token',
            method: 'POST',
            data: {
                email: email
            },
            headers: authHeader()
        })
        .then(function(response) {
            if (response.data.token) {
                localStorage.setItem("email", JSON.stringify(response.data.email));
                localStorage.setItem("token", JSON.stringify(response.data.token));
            }
            res = response.data;
        })
        .catch(function(error) {
            if(res.tokenError){
                global.TokenError()
            }else{
                res.error = error;
            }
        })
    return res;
};

const getMiwhats = async(url, domain = "") =>{
    let res = {};
    await axios({
            url: API_URL + '/login/getMiwhats',
            method: 'POST',
            data: { url: url, domain: domain}
        })
        .then(function(response) {
            res = response.data;
        })
        .catch(function(error) {
            res.error = error;
        })
    return res;
}

const setMiwhatsLog = async(idMywhats, name, type, idTypeButton = 0, origin = "", country = "") =>{
    let res = {};
    await axios({
            url: API_URL + '/login/setMiwhatsLog/',
            method: 'POST',
            data: { idMywhats: idMywhats, name: name, type: type, idTypeButton: idTypeButton, origin: origin, country: country}
        })
        .then(function(response) {
            res = response.data;
        })
        .catch(function(error) {
            res.error = error;
        })
    return res;
}

const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    register,
    login,
    logout,
    verifyMail,
    checkToken,
    getChangePassword,
    setChangePassword,
    getMiwhats,
    setMiwhatsLog
};