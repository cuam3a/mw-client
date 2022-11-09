import React from 'react'
import { TextField, InputAdornment } from '@material-ui/core';
import InputMask from "react-input-mask";

export default function Input(props) {

    const { name, label, value, type, error=null, onChange, multiline = false, start ="", readOnly=false, size = "normal", ...rest } = props;
    return (
        <TextField
            
            variant="outlined"
            label={label}
            name={name}
            value={value}
            type={type}
            onChange={onChange}
            multiline={multiline}
            size="small"
            {...(error && {error:true,helperText:error})}
            InputProps={{
                startAdornment: <InputAdornment position="start">{start}</InputAdornment>,
                readOnly: readOnly,
                style:{ height: (size=="small" ? 30 : 40), fontSize: (size=="small" ? 12: 16) }
            }}
            InputLabelProps={{
                style:{ fontSize: (size=="small" ? 12: 16) }
            }}      
            fullWidth
            {...rest}
        >
        </TextField>
    )
}