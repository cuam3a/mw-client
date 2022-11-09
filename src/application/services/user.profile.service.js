import axios from "axios";
import authHeader from "./authHeader";
import global from "./global.service"

const API_URL = global.getURLServer();

const getUser = async() => {
    let res = {};
    await axios({
            url: API_URL + '/users/getUser',
            method: 'GET',
            headers: authHeader()
        })
        .then(function(response) {
            if (response.data.token) {
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

const getUserById = async(id) => {
    let res = {};
    await axios({
            url: API_URL + '/users/getUserById/' + id,
            method: 'GET',
            headers: authHeader()
        })
        .then(function(response) {
            if (response.data.token) {
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

const setPassword = async(data) => {
    let res = {};
    await axios({
            url: API_URL + '/users/setPassword',
            method: 'POST',
            headers: authHeader(),
            data: data
        })
        .then(function(response) {
            if (response.data.token) {
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

const setPersonal = async(data) => {
    let res = {};
    let oPersonal = {};
    oPersonal.name = data.name;
    oPersonal.lastName = data.lastName;
    oPersonal.cellNumber = data.cellNumber;
    oPersonal.phoneNumber = data.phoneNumber;
    await axios({
            url: API_URL + '/users/setPersonal',
            method: 'POST',
            headers: authHeader(),
            data: oPersonal
        })
        .then(function(response) {
            if (response.data.token) {
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

const setPersonalById = async(id, data) => {
    let res = {};
    let oPersonal = {};
    oPersonal.id = id;
    oPersonal.name = data.name;
    oPersonal.lastName = data.lastName;
    oPersonal.cellNumber = data.cellNumber;
    oPersonal.phoneNumber = data.phoneNumber;
    await axios({
            url: API_URL + '/users/setPersonalById',
            method: 'POST',
            headers: authHeader(),
            data: oPersonal
        })
        .then(function(response) {
            if (response.data.token) {
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

const setCreditCard = async(data) => {
    let res = {};
    let oCreditCard = {};
    oCreditCard.name = data.creditCardName;
    oCreditCard.creditCard = data.creditCard;
    oCreditCard.month = data.creditCardExpirationMonth;
    oCreditCard.year = data.creditCardExpirationYear;
    oCreditCard.ccv = data.ccv;
    oCreditCard.deviceSessionId = data.deviceSessionId;
    await axios({
            url: API_URL + '/users/setCreditCard',
            method: 'POST',
            headers: authHeader(),
            data: oCreditCard
        })
        .then(function(response) {
            if (response.data.token) {
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

const setCancelPlan = async(data) => {
    let res = {};
    await axios({
            url: API_URL + '/users/cancelPlan',
            method: 'POST',
            headers: authHeader(),
            data: { miwhats: data }
        })
        .then(function(response) {
            if (response.data.token) {
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

const setRevokeCancelPlan = async(data) => {
    let res = {};
    await axios({
            url: API_URL + '/users/revokeCancelPlan',
            method: 'POST',
            headers: authHeader()
        })
        .then(function(response) {
            if (response.data.token) {
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getUser,
    setPassword,
    setPersonal,
    setCreditCard,
    getUserById,
    setPersonalById,
    setCancelPlan,
    setRevokeCancelPlan
};