import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => createStyles({
    container: {
        backgroundImage: 'url("/images/background-log.png")',
        height: "100vh",
    }
  }));
export default function LogLayout({children}){
    const classes = useStyles();
    return(
        <div className={classes.container}>
            {children}
        </div>
    )
}