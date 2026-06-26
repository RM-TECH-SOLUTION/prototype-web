import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GreetingComponent from "./GreetingComponent";
import "./HomeScreen.css";

/* Mirrors the app's REDIRECT_ROUTE_MAP — maps CMS inAppPathRedirect values
   (which can be app screen names OR web-style paths) to valid web routes. */
const WEB_ROUTE_MAP = {
  // Web paths passed through as-is
  "/": "/",
  "/home": "/",
  "/categories": "/categories",
  "/category": "/categories",
  "/checkout": "/checkout",
  "/account": "/account",
  "/saved-address": "/account/saved-address",
  "/order-history": "/order-history",
  "/merchant-info": "/help",
  "/help": "/help",
  // App screen-name variants (exact case used in CMS)
  Home: "/",
  home: "/",
  Order: "/categories",
  order: "/categories",
  Categories: "/categories",
  categories: "/categories",
  Account: "/account",
  account: "/account",
  Checkout: "/checkout",
  checkout: "/checkout",
  Register: "/register",
  register: "/register",
  Auth: "/login",
  auth: "/login",
  Login: "/login",
  login: "/login",
  SavedAddressComponent: "/account/saved-address",
  OrderHistoryContainer: "/order-history",
  MerchantInfoContainer: "/help",
  Help: "/help",
  help: "/help",
};

const resolveWebPath = (target) => {
  if (!target || typeof target !== "string") return "/";
  const t = target.trim();
  return WEB_ROUTE_MAP[t] || WEB_ROUTE_MAP[t.toLowerCase()] || t;
};

const HomeScreen = ({
  uiConfig = {},
  homeBanner = [],
  homeSlider = [],
  greetingConfig = {},
}) => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const getSliderWidth = () => {
    if (sliderRef.current) {
      return sliderRef.current.clientWidth;
    }
    return window.innerWidth;
  };

  /* AUTO HERO SLIDER */
  useEffect(() => {
    if (!homeBanner?.length) return;

    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= homeBanner.length) nextIndex = 0;

      if (sliderRef.current) {
        const width = getSliderWidth();
        sliderRef.current.scrollTo({
          left: nextIndex * width,
          behavior: "smooth",
        });
      }

      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, homeBanner?.length]);

  const handleScroll = (e) => {
    const width = getSliderWidth();
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
                      to={resolveWebPath(item.inAppPathRedirect)}
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
                to={resolveWebPath(item.inAppPathRedirect)}
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

