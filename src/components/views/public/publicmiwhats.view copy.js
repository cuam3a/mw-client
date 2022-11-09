import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box, Link, CircularProgress, IconButton } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebookMessenger, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faLink } from '@fortawesome/free-solid-svg-icons';
import { useHistory, useParams } from "react-router-dom";
import LoginService from '../../../application/services/login.service';
import _ from "lodash";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import global from "../../../application/services/global.service";
import AdSense from 'react-adsense';
import ReactPixel from 'react-facebook-pixel';
//var Html = require('../../../landingPage.html')
var Html = 'funcInit()'

const useStyles = makeStyles((theme) => createStyles({
    app: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: "120vh",
        [theme.breakpoints.down('md')]: {
            height: "140vh",
        },

    },
    container: {
        [theme.breakpoints.down('sm')]: {
            alignItems: 'center',
            textAlign: 'center'
        },
        [theme.breakpoints.up('md')]: {
            alignItems: 'center',
            justifyContent: 'flex-start',
            display: 'flex',
            flexWrap: 'wrap'
        }
    },
    rowLogo: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '28px',
            alignItems: "center",
            justifyContent: 'center',
            paddingTop: '20px'
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '28px',
            alignItems: "center",
            justifyContent: 'center',
            marginTop: '50px',
            display: 'flex'
        }
    },
    row: {
        fontSize: '28px',
        alignItems: "center",
        justifyContent: 'center',
        marginTop: '50px',
    },
    logo: {
        height: '200px',
        width: 'auto'
    },
    fontTitle: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '20px',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '25px',
        },
        fontWeight: 'bolder'
    },
    fontText: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '13px',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '18px',
        },
        fontWeight: 'normal'
    },
    buttonAccion: {
        [theme.breakpoints.down('sm')]: {
            width: '280px',
            justifyContent: 'center',
            marginTop: '10px !important',
            fontSize: '13px !important',
        },
        [theme.breakpoints.up('md')]: {
            width: '40%',
            marginRight: '10px !important',
            marginTop: '10px !important',
            fontSize: '13px !important',
        }
    },
    buttonLink: {
        [theme.breakpoints.down('sm')]: {
            width: '140px',
            justifyContent: 'center',
            marginTop: '10px !important',
            fontSize: '13px !important',
        },
        [theme.breakpoints.up('md')]: {
            width: '35%',
            marginRight: '10px !important',
            marginTop: '10px !important',
            fontSize: '13px !important',
        }
    },
    video: {
        border: 'none',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: '250px',
            flexWrap: 'wrap',
            display: 'flex'
        },
        [theme.breakpoints.only('md')]: {
            width: '50%',
            height: '200px',
            flexWrap: 'wrap',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        [theme.breakpoints.up('md')]: {
            width: '50%',
            height: '350px',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap'
        }
    },
    webmadewell: {
        backgroundColor: 'white'
    },
    sampleHeader: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        backgroundImage: 'url("http://webmadewell.com/wp-content/uploads/2018/01/img-bg-sample-parallax-header.jpg")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
    sampleHeaderSection: {
        position: 'relative',
        padding: '15% 0 10%',
        maxWidth: '640px',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: 'white',
        textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)',
        fontFamily: '"Montserrat", sans-serif'
    },
    sampleSectionWrap: {
        position: 'relative',
        backgroundColor: 'white',
    },
    sampleSection: {
        position: 'relative',
        maxWidth: '640px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '40px'
    },
    header: {
        overflow: 'hidden',
        backgroundColor: '#f1f1f1',
        padding: '20px 10px'
    }
}));

let buttonsArray = [];
let linksArray = [];
let scriptsArray = [];
let buttonsVideo = null;
const TOKEN_IPINFO = global.getTokenIPInfo();

const PublicMiWhats = () => {
    let history = useHistory();
    const classes = useStyles();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [landing, setLanding] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search)
        if (window.location.pathname.replace('/', '') !== '' && window.location.pathname.replace('/', '') !== 'inicio') {

            console.log("ENTRO")
            const origin = queryParams.get("origin") ?? 'DIRECTO'
            let host = window.location.host;
            if (host.startsWith("www.")) {
                host = host.replace("www.", "");
            }
            const check = async () => {
                let res = await LoginService.getMiwhats(window.location.pathname.replace('/', ''), ("https://" + host + "/"));
                console.log(res)
                if (res.success) {
                    const getInfo = await fetch("https://ipinfo.io/json?token=" + TOKEN_IPINFO)
                    const info = await getInfo.json()
                    let log = await LoginService.setMiwhatsLog(res.miwhats.id, "VISITA", "VISITA", 0, origin, (info?.country ?? ""));
                    console.log(res.miwhats);
                    buttonsArray = _.orderBy(_.filter(res.miwhats.buttons, (item) => { return (item.idState.toString() === "1" && (item.type === "button" || item.type === "extra")) }), ['idButtonType'], ['asc']);
                    linksArray = _.orderBy(_.filter(res.miwhats.buttons, (item) => { return (item.idState.toString() === "1" && item.type === "link") }), ['idButtonType'], ['asc']);
                    console.log(linksArray)
                    scriptsArray = _.filter(res.miwhats.scripts, (item) => { return item.idState.toString() === "1" });
                    buttonsVideo = _.findLast(res.miwhats.buttons, (item) => { return (item.idState.toString() === "1" && item.type === "video") });
                    //Exist Pixel
                    var pixel = _.find(scriptsArray, (item) => { return item.idScriptType == 2 });
                    console.log(pixel)
                    if (pixel) {
                        const advancedMatching = { }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
                        const options = {
                            autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
                            debug: false, // enable logs
                        };
                        ReactPixel.init(pixel.contact, advancedMatching, options);

                        ReactPixel.pageView(); // For tracking page view
                    }
                    setData(res.miwhats);
                    setLoading(false);
                    setLanding(false)
                }
                else {
                    window.location.pathname = "";
                    setLanding(true)
                    setLoading(false);
                }
            }
            check();
        }
        else {
            setLanding(true)
        }
    }, []);

    const handleClick = async (type, idTypeButton) => {
        let log = await LoginService.setMiwhatsLog(data.id, type, "CLICK", idTypeButton);
        console.log(log);
    }

    const showLandingPage = () => {
        window.location.href = "/inicio.html";
    }

    return (
        <div>
            {
                (landing === true)
                    ?
                    <>{showLandingPage()}</>
                    :
                    <div style={{ backgroundColor: (data.backgroundColor ? data.backgroundColor : ""), backgroundImage: `url(${data.previewBackgroundImage})` }} className={classes.app}>
                        {
                            (loading === true)
                                ?
                                <Grid container lg={12}>
                                    <Grid item lg={12} style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center', marginTop: '40px', flexDirection: 'column' }}>
                                        <CircularProgress color="primary" style={{ justifyContent: 'center' }} />
                                    </Grid>
                                    <Grid item lg={12} style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center', marginTop: '20px', flexDirection: 'column' }}>
                                        <Typography>MiWhats Cargando...</Typography>
                                    </Grid>
                                </Grid>
                                :
                                <div className={classes.container}>
                                    <Grid item lg={12}></Grid>
                                    <Grid item lg={6} sm={12} className={classes.rowLogo}>
                                        <Typography component="div">
                                            <Box textAlign="center">
                                                <img src={data.previewLogo} alt="Imagen Logo" className={classes.logo} />
                                            </Box>
                                            <Box textAlign="center" className={classes.fontTitle} style={{ color: (data.fontColor ? data.fontColor : "") }}>
                                                {data.title}
                                            </Box>
                                            <Box textAlign="center" className={classes.fontText} style={{ color: (data.fontColor ? data.fontColor : "") }}>
                                                {data.text}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={6} sm={12} className={classes.row}>
                                        <Typography component="div">
                                            <Box textAlign="center">
                                                {
                                                    (linksArray.map((item, index) => {
                                                        return (
                                                            <Link target="blank" key={item.idButtonType} onClick={() => handleClick(item.name, item.idButtonType)} style={{ textDecorationLine: 'none' }} href={item.contact}>
                                                                <IconButton className={classes.buttonLink} style={{ color: (item.fontColor ? item.fontColor : "#000000"), background: 'transparent' }} key={item.idButtonType}>
                                                                    {
                                                                        item.idButtonType === 6
                                                                            ? <FontAwesomeIcon icon={faFacebook} size="2x" style={{ marginRight: "5px" }} />
                                                                            : item.idButtonType === 7
                                                                                ? <FontAwesomeIcon icon={faInstagram} size="2x" style={{ marginRight: "5px" }} />
                                                                                : <span></span>
                                                                    }
                                                                </IconButton>
                                                            </Link>
                                                        )
                                                    }))
                                                }
                                            </Box>
                                            <Box textAlign="center" className={classes.fontTitle} style={{ color: (data.fontColor ? data.fontColor : "") }}>
                                                Comunícate con nosotros vía
                                            </Box>
                                            <Box textAlign="center">
                                                {
                                                    (buttonsArray.slice(0, 2).map((item, index) => {
                                                        return (
                                                            <Link target="blank" key={item.idButtonType} onClick={() => handleClick(item.name, item.idButtonType)} style={{ textDecorationLine: 'none' }} href={
                                                                item.idButtonType === 1
                                                                    ? ("tel:" + item.contact)
                                                                    : item.idButtonType === 2
                                                                        ? ("https://wa.me/" + item.lada + item.contact)
                                                                        : item.idButtonType === 3
                                                                            ? ("https://m.me/" + item.contact)
                                                                            : item.idButtonType === 4
                                                                                ? item.contact
                                                                                : ""
                                                            } >
                                                                <Button variant="contained" color="secondary" className={classes.buttonAccion} style={{ color: (item.fontColor ? item.fontColor : "#000000"), backgroundColor: (item.buttonColor ? item.buttonColor : "#FFFFFF") }}>
                                                                    {
                                                                        item.idButtonType === 1
                                                                            ? <FontAwesomeIcon icon={faPhone} size="2x" style={{ marginRight: "5px" }} />
                                                                            : item.idButtonType === 2
                                                                                ? <FontAwesomeIcon icon={faWhatsapp} size="2x" style={{ marginRight: "5px" }} />
                                                                                : item.idButtonType === 3
                                                                                    ? <FontAwesomeIcon icon={faFacebookMessenger} size="2x" style={{ marginRight: "5px" }} />
                                                                                    : item.idButtonType === 4
                                                                                        ? <FontAwesomeIcon icon={faLink} size="2x" style={{ marginRight: "5px" }} />
                                                                                        : <span></span>
                                                                    }
                                                                    {item.name}
                                                                </Button>
                                                            </Link>
                                                        )
                                                    }))
                                                }
                                            </Box>
                                            <Box textAlign="center">
                                                {
                                                    (buttonsArray.slice(2, 4).map((item, index) => {
                                                        return (
                                                            <Link target="blank" key={item.idButtonType} onClick={() => handleClick(item.name, item.idButtonType)} style={{ textDecorationLine: 'none' }} href={
                                                                item.idButtonType === 1
                                                                    ? ("tel:" + item.contact)
                                                                    : item.idButtonType === 2
                                                                        ? ("https://wa.me/" + item.contact)
                                                                        : item.idButtonType === 3
                                                                            ? ("https://m.me/" + item.contact)
                                                                            : item.idButtonType === 4
                                                                                ? item.contact
                                                                                : ""
                                                            } >
                                                                <Button variant="contained" color="secondary" className={classes.buttonAccion} style={{ color: (item.fontColor ? item.fontColor : "#000000"), backgroundColor: (item.buttonColor ? item.buttonColor : "#FFFFFF") }}>
                                                                    {
                                                                        item.idButtonType === 1
                                                                            ? <FontAwesomeIcon icon={faPhone} size="2x" style={{ marginRight: "5px" }} />
                                                                            : item.idButtonType === 2
                                                                                ? <FontAwesomeIcon icon={faWhatsapp} size="2x" style={{ marginRight: "5px" }} />
                                                                                : item.idButtonType === 3
                                                                                    ? <FontAwesomeIcon icon={faFacebookMessenger} size="2x" style={{ marginRight: "5px" }} />
                                                                                    : item.idButtonType === 4
                                                                                        ? <FontAwesomeIcon icon={faLink} size="2x" style={{ marginRight: "5px" }} />
                                                                                        : <span></span>
                                                                    }
                                                                    {item.name}
                                                                </Button>
                                                            </Link>
                                                        )
                                                    }))
                                                }
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={12} style={{ marginTop: "20px", marginInline: '10px', textAlign: 'center', display: 'flex', alignContent: 'flex-end', justifyContent: 'space-around' }}>
                                        {
                                            (buttonsVideo)
                                                ? <iframe title="video" className={classes.video} src={buttonsVideo.contact}></iframe>
                                                : <div></div>
                                        }
                                    </Grid>
                                    {
                                        (data.isTrial === 1)
                                            ?
                                            <>
                                                <div id="Adscode" style={{ width: "100%" }}>
                                                    <AdSense.Google
                                                        // client='ca-pub-8729656756073583'
                                                        // slot='9505858751'
                                                        style={{ display: 'block', justifyContent: 'center' }}
                                                        layout='in-article'
                                                        format='fluid'
                                                    />
                                                </div>
                                            </>
                                            : <></>
                                    }

                                </div>
                        }
                    </div>
                // )
            }
            {
                (scriptsArray.map((item, index) => {
                    if (item.idScriptType == 1) {
                        return (
                            <script
                                type="text/javascript"
                                dangerouslySetInnerHTML={{
                                    __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject'] = r;i[r]=i[r]||function(){
                                        (i[r].q = i[r].q || []).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                                        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                                        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                                        ga('create', '${item.contact}', 'auto');
                                        ga('send', 'pageview');`
                                }}
                            />
                        )
                    }
                    // if (item.idScriptType == 2) {
                    //     return (
                    //         <script
                    //             type="text/javascript"
                    //             dangerouslySetInnerHTML={{
                    //                 __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    //                     n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                    //                     n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                    //                     t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                    //                     document,'script','https://connect.facebook.net/en_US/fbevents.js');
                    //                     fbq('init', '${item.contact}');
                    //                     fbq('track', 'PageView');`
                    //             }}
                    //         />
                    //     )
                    // }
                }))
            }
        </div>
    )
}

export default PublicMiWhats;