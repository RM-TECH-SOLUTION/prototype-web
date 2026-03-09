import React, { useState } from 'react';

const WalkthroughComponent = ({ onComplete = () => {} }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome',
      description: 'Discover amazing products and services at your fingertips',
      icon: '👋',
      color: '#E50914',
    },
    {
      title: 'Easy Shopping',
      description: 'Browse our catalog, add items to cart, and checkout in minutes',
      icon: '🛒',
      color: '#FF6B6B',
    },
    {
      title: 'Fast Delivery',
      description: 'Track your orders in real-time and get updates instantly',
      icon: '🚚',
      color: '#FF6B6B',
    },
    {
      title: 'Loyalty Rewards',
      description: 'Earn points on every purchase and get exclusive offers',
      icon: '⭐',
      color: '#E50914',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1C1C1C',
      color: '#fff',
      padding: '20px',
      textAlign: 'center',
    },
    iconContainer: {
      fontSize: '80px',
      marginBottom: '30px',
      animation: 'bounce 1s infinite',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '12px',
      color: step.color,
    },
    description: {
      fontSize: '16px',
      color: '#ccc',
      maxWidth: '300px',
      marginBottom: '40px',
      lineHeight: '1.5',
    },
    dotsContainer: {
      display: 'flex',
      gap: '8px',
      marginBottom: '40px',
    },
    dot: (isActive) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: isActive ? '#E50914' : '#3A3A3A',
      transition: 'all 0.3s',
    }),
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px',
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    prevButton: {
      backgroundColor: '#2A2A2A',
      color: '#fff',
    },
    nextButton: {
      backgroundColor: '#E50914',
      color: '#fff',
      minWidth: '120px',
    },
    skipLink: {
      marginTop: '20px',
      fontSize: '13px',
      color: '#888',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'color 0.3s',
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.iconContainer}>{step.icon}</div>

        <h1 style={styles.title}>{step.title}</h1>
        <p style={styles.description}>{step.description}</p>

        <div style={styles.dotsContainer}>
          {steps.map((_, idx) => (
            <div key={idx} style={styles.dot(idx === currentStep)} />
          ))}
        </div>

        <div style={styles.buttonContainer}>
          {currentStep > 0 && (
            <button
              style={{ ...styles.button, ...styles.prevButton }}
              onClick={handlePrev}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#3A3A3A')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#2A2A2A')}
            >
              ← Previous
            </button>
          )}
          <button
            style={{ ...styles.button, ...styles.nextButton }}
            onClick={handleNext}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#d40710')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#E50914')}
          >
            {currentStep === steps.length - 1 ? 'Get Started →' : 'Next →'}
          </button>
        </div>

        <div
          style={styles.skipLink}
          onClick={onComplete}
          onMouseEnter={(e) => (e.target.style.color = '#ccc')}
          onMouseLeave={(e) => (e.target.style.color = '#888')}
        >
          Skip Walkthrough
        </div>
      </div>
    </>
  );
};

export default WalkthroughComponent;
