import React from 'react';
import Dropzone from 'react-dropzone';

const fileUpload = ({children}) => (
    <Dropzone className="ignore" onDrop={(files) => console.log(files)}>
        {children}
    </Dropzone>
);

export default fileUpload;