import React from "react";

function FormInput({type, value, onChange, required=false}){
    return(
      <div className="form-input">
        <input type={type} value={value} onChange={onChange} required={required}/>
      </div>  
    );
}

export default FormInput;