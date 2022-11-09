import axios from "axios";
import authHeader from "./authHeader";
import global from "./global.service"

const API_URL = global.getURLServer();
const isFile = input => 'File' in window && input instanceof File;

const getListPlans = async() => {
    let res = {};
    await axios({
            url: API_URL + '/plans/',
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

const getPlan = async(id) => {
    let res = {};
    await axios({
            url: API_URL + '/plans/getPlan/' + id,
            method: 'GET',
            headers: authHeader()
        })
        .then(function(response) {
            if (response.data.token) {
                localStorage.setItem("token", JSON.stringify(response.data.token));
            }
            res = response.data;
            //console.log(res)
        })
        .catch(function(error) {
            if(res.tokenError){
                global.TokenError()
            }else{
                res = error;
            }
        })
    return res;
};

const setPayload = async(data) => {
    let res = {};
    await axios({
            url: API_URL + '/plans/payloadPlan',
            method: 'POST',
            data: data,
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
                res = error;
            }
        })
    return res;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getListPlans,
    getPlan,
    setPayload
};