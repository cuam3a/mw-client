import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    paperStyle: { 
        margin: "40px auto",
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        [theme.breakpoints.down('sm')]: {
            padding: 10,
            height: '95vh',
            margin: "30px auto",
            width: "80%",
        },
        [theme.breakpoints.down('lg')]: {
            padding: 35,
            height: '75vh',
            margin: "30px 20%",
            width: "60%",
        },
        [theme.breakpoints.up('lg')]: {
            padding: 40,
            height: '80vh',
            margin: "20px 40%",
            width: "20%",
        },
    },
    logo: {
        textAlign: "center",
        [theme.breakpoints.down('sm')]: {
            maxWidth: "10vh"
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: "12vh"
        },
        
    },
    avatarStyle: {
        backgroundColor: '#1bbd7e'
    },
    btnstyle: {
        margin: '8px 0'
    },
    marginForm:{
        [theme.breakpoints.down('sm')]: {
            marginTop: "40px"
        },
        [theme.breakpoints.up('md')]: {
            marginTop: "10px"
        }
    },
    paperView:{
        fontSize: "12px",
        maxHeight: "85vh",
        overflow: 'auto'
    },
    paperViewDash:{
        fontSize: "12px",
        height: "140vh"
    },
    textCenter:{
        textAlign: 'center'
    },
    textLeft:{
        textAlign: 'left'
    },
    textRight:{
        textAlign: 'right',
        display: 'flex'
    },
    textBold:{
        fontWeight: 'bold'
    },
    buttonAction: {
        marginTop: '10px'
    },
    title:{
        margin: '15px'
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
    },
    input:{
        marginBlock:"10px", 
        marginInline:"5px", 
        fontSize:'8px'
    },
    inputFile:{
        marginBlock:"10px", 
        marginInline:"5px", 
        fontSize:'15px',
        border:"0.5px solid  #CECECE", 
        textAlign:"center"
    },
    textProfile:{
        fontSize: '10px',
        marginLeft: '5px',
        paddingBlock: '6px',
        textOverflow: 'ellipsis'
    },
    logoOpenPay: {
        textAlign: "center",
        [theme.breakpoints.down('sm')]: {
            maxWidth: "30vh"
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: "32vh"
        },
        
    },
    openPay:{
        textAlign: "right"
    },
    logoTipoOpenPay: {
        textAlign: "center",
        marginRight: '40px',
        marginBottom: '20px',
        [theme.breakpoints.down('sm')]: {
            maxWidth: "45vh"
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: "42vh"
        },
        
    },
    paperModal: {
        position: 'absolute',
        width: 830,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));