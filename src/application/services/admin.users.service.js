import axios from "axios";
import authHeader from "./authHeader";
import global from "./global.service"

const API_URL = global.getURLServer();
const isFile = input => 'File' in window && input instanceof File;

const getAllUsers = async() => {
    let res = {};
    await axios({
            url: API_URL + '/users/getAll',
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

const setStateUser = async(id, type) => {
    let res = {};
    await axios({
            url: API_URL + '/users/setState',
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

const deleteUser = async(id) => {
    let res = {};
    await axios({
            url: API_URL + '/users/deleteUser',
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

const reactiveUser = async(id) => {
    let res = {};
    await axios({
            url: API_URL + '/users/reactiveUser',
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

const setUserById = async(data) => {
    let res = {};
    await axios({
            url: API_URL + '/users/setUserById',
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

const getExportUsers = async() => {
    let res = {};
    await axios({
            url: API_URL + '/users/exportUsers',
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
                res = error;
            }
        })
    return res;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAllUsers,
    setStateUser,
    deleteUser,
    reactiveUser,
    setUserById,
    getUserById,
    getExportUsers
};