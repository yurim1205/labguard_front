import React from 'react';

const StatusBar = ({ message, type }) => (
  <div className={`status ${type}`}>{message}</div>
);

export default StatusBar;