import axios from "axios";
import authHeader from "./authHeader";
import global from "./global.service"

const API_URL = global.getURLServer();
const isFile = input => 'File' in window && input instanceof File;

const getAllPlans = async() => {
    let res = {};
    await axios({
            url: API_URL + '/plans/getAll',
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

const setStatePlan = async(id, type) => {
    let res = {};
    await axios({
            url: API_URL + '/plans/setState',
            method: 'POST',
            data: { id: id, type: type },
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

const deletePlan = async(id) => {
    let res = {};
    await axios({
            url: API_URL + '/plans/deletePlan',
            method: 'POST',
            data: { id: id },
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

const addPlan = async(data) => {
    let res = {};
    const formData = new FormData();
    formData.append("images", data.image);
    formData.append("data", JSON.stringify(data));
    let headers = authHeader();
    headers['Content-Type'] = 'multipart/form-data'

    console.log(data.logo)
    await axios({
            url: API_URL + '/plans/addPlan',
            method: 'POST',
            data: formData,
            headers: headers
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

const editPlan = async(data) => {
    let res = {};
    const formData = new FormData();
    if (isFile(data.image)) {
        formData.append("images", data.image);
        data.logo = "";
    }
    formData.append("data", JSON.stringify(data));
    let headers = authHeader();
    headers['Content-Type'] = 'multipart/form-data'

    await axios({
            url: API_URL + '/plans/editPlan/' + data.id,
            method: 'POST',
            data: formData,
            headers: headers
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
    getAllPlans,
    getPlan,
    setStatePlan,
    deletePlan,
    addPlan,
    editPlan
};