import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
    </div>
  );
};

export default Loader;
