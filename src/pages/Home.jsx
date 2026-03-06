import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCmsStore from '../store/useCmsStore';
import useSessionStore from '../store/useSessionStore';

const Home = () => {
  const { cmsData, getCmsData, loading } = useCmsStore();
  const { user, isLoggedIn } = useSessionStore();
  const [uiConfig, setUiConfig] = useState({});
  const [homeBanner, setHomeBanner] = useState([]);
  const [homeSlider, setHomeSlider] = useState([]);
  const [greetingConfig, setGreetingConfig] = useState({});

  useEffect(() => {
    getCmsData();
  }, []);

  useEffect(() => {
    if (!Array.isArray(cmsData)) return;

    cmsData.forEach((item) => {
      switch (item.modelSlug) {
        case "homeUiConfiguration":
          setUiConfig(normalizeCmsFields(item.cms));
          break;
        case "homeOrderingBanner":
          setHomeBanner(normalizeCmsFields(item.cms));
          break;
        case "homeCtaCards":
          setHomeSlider(normalizeCmsFields(item.cms));
          break;
        case "appWelcomeMessage":
          setGreetingConfig(normalizeCmsFields(item.cms));
          break;
      }
    });
  }, [cmsData]);

  const normalizeCmsFields = (cms) => {
    if (!cms) return [];
    
    // Helper to extract values from potential field objects
    const extractValue = (value) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return value;
      }
      if (value && typeof value === 'object' && value.fieldValue !== undefined) {
        return extractValue(value.fieldValue); // Recursive
      }
      if (value && typeof value === 'object') {
        return null; // Prevent objects from being rendered
      }
      return value;
    };
    
    if (Array.isArray(cms)) {
      return cms.map((item) => {
        const normalized = {};
        Object.entries(item).forEach(([key, field]) => {
          normalized[key] = extractValue(field);
        });
        return normalized;
      });
    }
    
    const normalized = {};
    Object.entries(cms).forEach(([key, field]) => {
      normalized[key] = extractValue(field);
    });
    return normalized;
  };

  const styles = {
    container: {
      backgroundColor: uiConfig?.homeBgColor || '#0B0B0F',
      minHeight: '100vh',
      color: '#fff',
    },
    header: {
      backgroundColor: uiConfig?.headerBgColor || '#000',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    nav: {
      display: 'flex',
      gap: '15px',
    },
    navLink: {
      color: '#fff',
      textDecoration: 'none',
    },
    hero: {
      height: '300px',
      position: 'relative',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.55)',
    },
    heroContent: {
      position: 'absolute',
      bottom: '40px',
      left: '24px',
      right: '24px',
    },
    heroTitle: {
      fontSize: '26px',
      fontWeight: 'bold',
    },
    heroButton: {
      marginTop: '16px',
      backgroundColor: '#E50914',
      paddingVertical: '12px',
      paddingHorizontal: '24px',
      borderRadius: '30px',
      display: 'inline-block',
    },
    section: {
      padding: '20px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    card: {
      width: '160px',
      height: '160px',
      borderRadius: '20px',
      overflow: 'hidden',
      marginRight: '16px',
      position: 'relative',
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    cardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    cardTitle: {
      position: 'absolute',
      bottom: '16px',
      left: '16px',
      right: '16px',
      fontWeight: 'bold',
      fontSize: '14px',
    },
    slider: {
      display: 'flex',
      overflowX: 'auto',
      paddingBottom: '10px',
    },
    greeting: {
      padding: '20px',
      fontSize: '24px',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>{uiConfig?.appName || 'PP App'}</h1>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/login" style={styles.navLink}>Login</Link>
          <Link to="/account" style={styles.navLink}>Account</Link>
        </nav>
      </header>

      {greetingConfig?.title && (
        <div style={styles.greeting}>
          {greetingConfig.title}
        </div>
      )}

      {homeBanner.length > 0 && (
        <div style={styles.hero}>
          <img 
            src={homeBanner[0]?.image} 
            alt={homeBanner[0]?.title}
            style={styles.heroImage}
          />
          <div style={styles.heroOverlay} />
          <div style={styles.heroContent}>
            <h2 style={styles.heroTitle}>{homeBanner[0]?.title}</h2>
            {homeBanner[0]?.subTitle && (
              <p>{homeBanner[0]?.subTitle}</p>
            )}
            {homeBanner[0]?.linkText && (
              <Link to="/login" style={styles.heroButton}>
                {homeBanner[0]?.linkText}
              </Link>
            )}
          </div>
        </div>
      )}

      {homeSlider.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.slider}>
            {homeSlider.map((item, index) => (
              <Link to={item.inAppPathRedirect || '/login'} key={index} style={styles.card}>
                <img src={item.image} alt={item.title} style={styles.cardImage} />
                <div style={styles.cardOverlay} />
                <span style={styles.cardTitle}>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Please login to start ordering</p>
          <Link to="/login" style={{ 
            ...styles.heroButton, 
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '10px'
          }}>
            Login Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

