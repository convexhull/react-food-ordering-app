import React from 'react';

const toggleButton = (props) => {
    return (
        <div onClick={props.clicked}>
            {props.children}
        </div>
    )
}

export default toggleButton;