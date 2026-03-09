import React from 'react';
import { useNavigate } from 'react-router-dom';
import WalkthroughComponent from '../component/WalkthroughComponent';

const WalkthroughContainer = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/');
  };

  return <WalkthroughComponent onComplete={handleComplete} />;
};

export default WalkthroughContainer;
