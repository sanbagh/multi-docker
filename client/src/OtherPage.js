import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div>
      I am another page
      <Link to="/">Go Back Home</Link>
    </div>
  );
};
