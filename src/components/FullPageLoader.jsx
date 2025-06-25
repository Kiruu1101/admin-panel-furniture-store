import React from 'react';
import '../styles/FullPageLoader.css';

const FullPageLoader = ({message = 'Loading...'}) => {
  return (
    <div className="fullpage-loader">
      <div className="loader-content">
        <div className="spinner" />
        <h4>{message}</h4>
      </div>
    </div>
  );
};

export default FullPageLoader;
