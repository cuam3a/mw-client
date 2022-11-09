import React from 'react';
import { Grid, Typography, Button, Box, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebookMessenger, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faLink } from '@fortawesome/free-solid-svg-icons';
import desktopImage from '../../application/images/WEB.png';
import mobileImage from '../../application/images/MOBIL.png';
import _ from 'lodash';
import '../../App.css';

export default function TemplateMiwhats(props) {
    const { data, view } = props;
    const imageUrl = (view === "WEB" ? desktopImage : mobileImage);


    const buttonsArray = _.orderBy(_.filter(data.buttons, (item) => { return (item.idState.toString() === "1" && (item.type === "button" || item.type === "extra")) }), ['idButtonType'], ['asc']);
    const linksArray = _.orderBy(_.filter(data.buttons, (item) => { return (item.idState.toString() === "1" && item.type === "link") }), ['idButtonType'], ['asc']);
    const buttonsVideo = _.findLast(data.buttons, (item) => { return (item.idState.toString() === "1" && item.type === "video") });
    return (
        <div>
            {
                view === "WEB"
                    ? (
                        <div className="App" style={{ backgroundImage: `url(${imageUrl})`, position: "relative" }}>
                            <div style={{ backgroundColor: (data.backgroundColor ? data.backgroundColor : ""), backgroundImage: `url(${data.previewBackgroundImage})` }} className="App-background">
                                <div className="App-content">
                                    <Grid container style={{ marginTop: 20 }}>
                                        <Grid item lg={12}></Grid>
                                        <Grid item lg={6} className="row-content">
                                            <Typography component="div">
                                                <Box textAlign="center">
                                                    <img src={data.previewLogo} alt="Imagen Logo" className="row-logo" />
                                                </Box>
                                                <Box textAlign="center" className="font-title" style={{ color: (data.fontColor ? data.fontColor : "") }}>
                                                    {data.title}
                                                </Box>
                                                <Box textAlign="center" className="font-text" style={{ color: (data.fontColor ? data.fontColor : "") }}>
                                                    {data.text}
                                                </Box>
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={6} className="row-content">
                                            <Typography component="div">
                                                <Box textAlign="center">
                                                    {
                                                        (linksArray.map((item, index) => {
                                                            return (
                                                                <IconButton variant="contained" color="secondary" className="button-link" style={{ color: (item.fontColor ? item.fontColor : "#000000") }} key={item.idButtonType}>
                                                                    {
                                                                        item.idButtonType === 6
                                                                            ? <FontAwesomeIcon icon={faFacebook} size="2x" style={{ marginRight: "5px" }} />
                                                                            : item.idButtonType === 7
                                                                                ? <FontAwesomeIcon icon={faInstagram} size="2x" style={{ marginRight: "5px" }} />
                                                                                : <span></span>
                                                                    }
                                                                </IconButton>
                                                            )
                                                        }))
                                                    }
                                                </Box>
                                                <Box textAlign="center" className="row-content">
                                                    Comunícate con nosotros vía
                                                </Box>
                                                <Box textAlign="center">
                                                    {
                                                        (buttonsArray.slice(0, 2).map((item, index) => {
                                                            return (
                                                                <Button variant="contained" color="secondary" className="button-accion" style={{ color: (item.fontColor ? item.fontColor : "#000000"), backgroundColor: (item.buttonColor ? item.buttonColor : "#FFFFFF") }} key={item.idButtonType}>
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
                                                            )
                                                        }))
                                                    }
                                                </Box>
                                                <Box textAlign="center">
                                                    {
                                                        (buttonsArray.slice(2, 4).map((item, index) => {
                                                            return (
                                                                <Button variant="contained" color="secondary" className="button-accion" style={{ color: (item.fontColor ? item.fontColor : "#000000"), backgroundColor: (item.buttonColor ? item.buttonColor : "#FFFFFF") }} key={item.idButtonType}>
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
                                                            )
                                                        }))
                                                    }
                                                </Box>
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={12} style={{ marginTop: "20px", textAlign: 'center', display: 'flex', alignContent: 'flex-end', justifyContent: 'space-around' }}>
                                            {
                                                (buttonsVideo)
                                                    ? <iframe title="video"
                                                        style={{
                                                            border: 'none',
                                                            width: '60%',
                                                            height: '150px',
                                                            flexWrap: 'wrap',
                                                            display: 'flex'
                                                        }} src={buttonsVideo.contact}></iframe>
                                                    : <div></div>
                                            }
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <div className="App-m" style={{ backgroundImage: `url(${imageUrl})`, position: "relative" }}>
                            <div style={{ backgroundColor: (data.backgroundColor ? data.backgroundColor : ""), backgroundImage: `url(${data.previewBackgroundImage})` }} className="App-background-m">
                                <div className="App-content-m">
                                    <Grid container style={{ marginTop: 20 }}>
                                        <Grid item lg={12}></Grid>
                                        <Grid item lg={12} className="row-content-m">
                                            <Typography component="div">
                                                <Box textAlign="center">
                                                    <img src={data.previewLogo} alt="Imagen Logo" className="row-logo" />
                                                </Box>
                                                <Box textAlign="center" className="font-title-m" style={{ color: (data.fontColor ? data.fontColor : "") }}>
                                                    {data.title}
                                                </Box>
                                                <Box textAlign="center" className="font-text-m" style={{ color: (data.fontColor ? data.fontColor : "") }}>
                                                    {data.text}
                                                </Box>
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={12} className="row-content">
                                            <Typography component="div">
                                                <Box textAlign="center" className="row-content-m">
                                                    Comunícate con nosotros vía
                                                </Box>
                                                <Box textAlign="center">
                                                    {
                                                        (buttonsArray.slice(0, 2).map((item, index) => {
                                                            return (
                                                                <Button variant="contained" color="secondary" className="button-accion-m" style={{ color: (item.fontColor ? item.fontColor : "#000000"), backgroundColor: (item.buttonColor ? item.buttonColor : "#FFFFFF") }} key={item.idButtonType}>
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
                                                            )
                                                        }))
                                                    }
                                                </Box>
                                                <Box textAlign="center">
                                                    {
                                                        (buttonsArray.slice(2, 4).map((item, index) => {
                                                            return (
                                                                <Button variant="contained" color="secondary" className="button-accion-m" style={{ color: (item.fontColor ? item.fontColor : "#000000"), backgroundColor: (item.buttonColor ? item.buttonColor : "#FFFFFF") }} key={item.idButtonType}>
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
                                                            )
                                                        }))
                                                    }
                                                </Box>
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={12} style={{ marginTop: "20px", textAlign: 'center', display: 'flex', alignContent: 'flex-end', justifyContent: 'space-around' }}>
                                            {
                                                (buttonsVideo)
                                                    ? <iframe title="video"
                                                        style={{
                                                            border: 'none',
                                                            width: '100%',
                                                            height: '180px',
                                                            flexWrap: 'wrap',
                                                            display: 'flex'
                                                        }} src={buttonsVideo.contact}></iframe>
                                                    : <div></div>
                                            }
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    )

            }
        </div>
    )
}