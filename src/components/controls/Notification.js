import React from 'react'
import { Card, Typography, CardActions, CardHeader, IconButton } from '@material-ui/core';

export default function Notification(props) {

    const { data = [], title= "" } = props;
    return (
        <>
            <Card style={{ borderBoton: "1px solid", textAlign: "center", minWidth: 275, paddingBlock: 10}}>
                <Typography>{title}</Typography>
            </Card>
            {
                (data.length > 0)
                ?data.map((item, index) => {
                    return(
                        <Card style={{ borderBoton: "1px solid", minWidth: 275, fontSize: '3px'}} variant="outlined" key={index}>
                            <CardHeader title={item.title} subheader={item.message} style={{ textOverflow: 'ellipsis'}}/>
                        </Card>
                    )
                })
                :<Card style={{ borderBoton: "1px solid", minWidth: 275, fontSize: '3px'}} variant="outlined">
                    <CardHeader subheader="No hay mensajes nuevos" />
                </Card>
            }
            
        </>
    )
}