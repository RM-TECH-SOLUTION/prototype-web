import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GreetingComponent from "./GreetingComponent";
import "./HomeScreen.css";

const HomeScreen = ({
  uiConfig = {},
  homeBanner = [],
  homeSlider = [],
  greetingConfig = {},
}) => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = window.innerWidth;

  /* AUTO HERO SLIDER */
  useEffect(() => {
    if (!homeBanner?.length) return;

    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= homeBanner.length) nextIndex = 0;

      if (sliderRef.current) {
        sliderRef.current.scrollTo({
          left: nextIndex * width,
          behavior: "smooth",
        });
      }

      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, homeBanner?.length, width]);

  const handleScroll = (e) => {
    const index = Math.round(e.target.scrollLeft / width);
    setCurrentIndex(index);
  };

  return (
    <div
      className="home-screen"
      style={{
        backgroundColor: uiConfig?.homeBgColor || "#0B0B0F",
      }}
    >
      <GreetingComponent greetingConfig={greetingConfig} />

      {/* ================= HERO ================= */}
      {homeBanner?.length > 0 && (
        <div className="hero-container">
          <div
            className="hero-slider"
            ref={sliderRef}
            onScroll={handleScroll}
            style={{ scrollSnapType: "x mandatory" }}
          >
            {homeBanner.map((item, index) => (
              <div key={index} className="hero-slide" style={{ scrollSnapAlign: "start" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="hero-image"
                />
                <div className="hero-overlay" />
                <div className="hero-content">
                  <h2 className="hero-title">{item.title}</h2>
                  {item.subTitle && (
                    <p className="hero-sub">{item.subTitle}</p>
                  )}
                  {item.linkText && (
                    <Link
                      to={item.inAppPathRedirect || "/"}
                      className="hero-button"
                    >
                      {item.linkText}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Indicator */}
          <div className="indicator-container">
            {homeBanner.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentIndex ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= CTA SECTION ================= */}
      {homeSlider?.length > 0 && (
        <div className="cta-wrapper">
          <h3 className="section-title">Quick Actions</h3>
          <div className="cta-slider">
            {homeSlider.map((item, index) => (
              <Link
                key={index}
                to={item.inAppPathRedirect || "/"}
                className="cta-card"
              >
                <img src={item.image} alt={item.title} className="cta-image" />
                <div className="cta-overlay" />
                <span className="cta-title">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: "40px" }} />
    </div>
  );
};

export default HomeScreen;

