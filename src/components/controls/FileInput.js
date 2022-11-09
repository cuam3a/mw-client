import React from "react";

const noop = () => {};

const FileInput = ({ value="", onChange = noop, name="", label ="", ...rest }) => (
  <div>
    {Boolean(value) && (
      <div>Imagen seleccionada: {value.name}</div>
    )}
    <label style={{ cursor:"pointer" }}>
      Click para seleccionar imagen {label}...
      <input
        {...rest}
        style={{ display: "none" }}
        type="file"
        name={name}
        onChange={e => {
          onChange({ target:{ name: e.target.name, value:e.target.files[0] } });
        }}
      />
    </label>
  </div>
);

export default FileInput;