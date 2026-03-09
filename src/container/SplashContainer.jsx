import React, { useEffect, useState } from 'react';
import SplashScreen from '../component/SplashScreen';

const SplashContainer = ({ onReady = () => {} }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash for 2 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onReady, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onReady]);

  return <SplashScreen fadeOut={fadeOut} />;
};

export default SplashContainer;
