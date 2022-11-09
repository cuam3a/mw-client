import axios from "axios";
import authHeader from "./authHeader";
import global from "./global.service"

const API_URL = global.getURLServer();

const getReportPayments = async() => {
    let res = {};
    await axios({
            url: API_URL + '/users/reportPayments',
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getReportPayments
};