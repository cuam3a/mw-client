import axios from "axios";
import authHeader from "./authHeader";
import global from "./global.service"

const API_URL = global.getURLServer();
const isFile = input => 'File' in window && input instanceof File;

const getListMiWhats = async() => {
    let res = {};
    await axios({
            url: API_URL + '/miwhats/',
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

const getValidateURL = async(url, domain, id=0) => {
    let res = {};
    await axios({
            url: API_URL + '/miwhats/checkURL',
            method: 'POST',
            data: { url: url, domain: domain, id: id },
            headers: authHeader()
        })
        .then(function(response) {
            if (response.data.token) {
                localStorage.setItem("token", JSON.stringify(response.data.token));
            }
            res = response.data;
            console.log(res)
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

const setStateMiWhats = async(id, type) => {
    let res = {};
    await axios({
            url: API_URL + '/miwhats/setState',
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

const addMiWhats = async(data) => {
    let res = {};
    const formData = new FormData();
    formData.append("images", data.logo);
    formData.append("images", data.backgroundImage)
    formData.append("data", JSON.stringify(data));
    let headers = authHeader();
    headers['Content-Type'] = 'multipart/form-data'

    console.log(data)
    await axios({
            url: API_URL + '/miwhats/addMiwhats',
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

const getMiWhats = async(id) => {
    let res = {};
    await axios({
            url: API_URL + '/miwhats/getMiwhats/' + id,
            method: 'GET',
            headers: authHeader()
        })
        .then(function(response) {
            if (response.data.token) {
                localStorage.setItem("token", JSON.stringify(response.data.token));
            }
            res = response.data;
            console.log(res)
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

const editMiWhats = async(data) => {
    let res = {};
    const formData = new FormData();
    if (isFile(data.logo)) {
        formData.append("images", data.logo);
        data.logo = "";
    }
    if (isFile(data.backgroundImage)) {
        formData.append("images", data.backgroundImage);
        data.backgroundImage = "";
    }

    formData.append("data", JSON.stringify(data));
    let headers = authHeader();
    headers['Content-Type'] = 'multipart/form-data'

    await axios({
            url: API_URL + '/miwhats/editMiwhats/' + data.id,
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

const deleteMiWhats = async(id) => {
    let res = {};
    await axios({
            url: API_URL + '/miwhats/deleteMiwhats/' + id,
            method: 'DELETE',
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
    getListMiWhats,
    setStateMiWhats,
    addMiWhats,
    getMiWhats,
    editMiWhats,
    deleteMiWhats,
    getValidateURL
};