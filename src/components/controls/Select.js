import React from 'react'
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@material-ui/core';

export default function Select(props) {

    const { name, label, value,error=null, onChange, options, size = "normal" } = props;

    return (
        <FormControl variant="outlined" size="small" style={{ minWidth: "100%" }}
        {...(error && {error:true})}>
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                style={{ height: (size=="small" ? 30 : 40), fontSize: (size=="small" ? 12: 16) }}
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                size="small"
                >
                {
                    options.map(
                        (item) => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                    )
                }
            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}