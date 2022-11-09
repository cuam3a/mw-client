import { useContext } from 'react';
import { AppContext } from '../../application/provider';

const getURLServer = () => {
    //return 'http://localhost:8000/api';
    //return 'http://enviaunmsg.com/api';
    return 'https://miwhats.app/api';
}

const getTokenIPInfo = () =>{
    return '4d87ffd9049eba';
}

const TokenError = () => {
    const [ state, setState ] = useContext(AppContext);
    setState({...state, message : null, miWhats: null, user: { miWhats: [] }, isLogin: false, update: true, loader:true })
}

const getColor = (index) => {
    let arrColor = [
        '#23C1FE',
        '#23FE4D',
        '#DAFE23',
        '#FE5823',
        '#9123FE',
        '#FE2323',
        '#B2FE23',
        '#23FE99',
        '#CA23FE',
        '#FE23A7'
    ]

    return arrColor[index];
}

const getURLRandom = () => {
    var url           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;;
    for ( var i = 0; i < 15; i++ ) {
        url += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return url;
}

const getFormatCurrency = (amount = 0) => {
    const options = { style: 'currency', currency: 'USD' };
    const numberFormat = new Intl.NumberFormat('en-US', options);
    return numberFormat.format(amount);
}

const getArrayChartDoughnut = (array, attrLabel, attrValue) => {
    let result = [];
    for(var i=0; i < array.length; i++){
        result.push({ label: array[i][attrLabel], value: array[i][attrValue] })
    }
    return result;
}

const Global = {
    TokenError,
    getURLServer,
    getTokenIPInfo,
    getColor,
    getURLRandom,
    getFormatCurrency,
    getArrayChartDoughnut
}

export default Global;