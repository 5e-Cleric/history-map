import { useState, useEffect } from 'react';

const ErrorWarning = ({ error }) => {
    
    if (!error) return null;

    return (
        <div className="error-warning">
            <h4 className="errorTitle">Error code: {error.errorCode}</h4>
            <p>{error.errorText}</p>
        </div>
    );
};

export default ErrorWarning;
