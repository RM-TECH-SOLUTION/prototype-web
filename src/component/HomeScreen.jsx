import React, { useRef, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GreetingComponent from "./GreetingComponent";
import { config } from "../config";
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

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};

const pickField = (obj, keys, fallback = "") => {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return fallback;
};

const parseScreenshotList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const getReadableTextColor = (background, dark = "#111827", light = "#ffffff") => {
  if (!background) return light;

  const value = String(background).trim();
  const hex = value.startsWith("#") ? value.slice(1) : value;

  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) {
    return light;
  }

  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance < 0.56 ? light : dark;
};

const fallbackImage = "/src/assets/image.png";

const fallbackQuickActions = [
  {
    title: "Browse Categories",
    subTitle: "Find products quickly",
    buttonText: "Open",
    inAppPathRedirect: "/categories",
    image: fallbackImage,
    backgroundColor: "#5b3fa6",
  },
  {
    title: "Track Your Orders",
    subTitle: "Recent and previous orders",
    buttonText: "View",
    inAppPathRedirect: "/order-history",
    image: fallbackImage,
    backgroundColor: "#2d4a3e",
  },
  {
    title: "Manage Account",
    subTitle: "Address and profile settings",
    buttonText: "Go",
    inAppPathRedirect: "/account",
    image: fallbackImage,
    backgroundColor: "#8a4c32",
  },
];

const fallbackOffers = [
  {
    title: "Flat Discounts",
    subTitle: "Save more on selected products",
    buttonText: "Claim",
    inAppPathRedirect: "/categories",
    backgroundColor: "#2f4f7a",
  },
  {
    title: "Weekend Deals",
    subTitle: "Limited period curated offers",
    buttonText: "Explore",
    inAppPathRedirect: "/categories",
    backgroundColor: "#5b3a2f",
  },
];

const fallbackCategories = [
  { title: "Smartphones", subTitle: "Trending devices", image: fallbackImage, inAppPathRedirect: "/categories" },
  { title: "Accessories", subTitle: "Daily essentials", image: fallbackImage, inAppPathRedirect: "/categories" },
  { title: "Wearables", subTitle: "Smart lifestyle", image: fallbackImage, inAppPathRedirect: "/categories" },
];

const fallbackSocials = [
  { title: "Facebook", subTitle: "Community updates", link: "https://facebook.com" },
  { title: "Instagram", subTitle: "Latest highlights", link: "https://instagram.com" },
  { title: "YouTube", subTitle: "Videos and reviews", link: "https://youtube.com" },
];

const resolveImage = (value, fallback = fallbackImage) => {
  if (!value) return fallback;
  const url = String(value).trim();
  if (!url) return fallback;

  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }

  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  // Handle relative URLs from CMS like "uploads/file.jpg".
  const baseUrl = String(config?.baseUrl || "").trim();
  if (baseUrl) {
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    return `${normalizedBase}${url.replace(/^\//, "")}`;
  }

  return fallback;
};

const HomeScreen = ({
  uiConfig = {},
  homeBanner = [],
  homeSlider = [],
  homeSliderConfig = {},
  offersConfig = [],
  merchantInfo = {},
  exploreCategories = [],
  socialPages = [],
  themeColors = {},
  newArrivals = [],
  greetingConfig = {},
}) => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [appPreviewShift, setAppPreviewShift] = useState(0);

  const getSliderWidth = () => {
    if (sliderRef.current) {
      return sliderRef.current.clientWidth;
    }
    return window.innerWidth;
  };

  const heroSlides = homeBanner.length > 0
    ? homeBanner
    : [
        {
          title: "Welcome to ZZZ Mobiles",
          subTitle: "Mobile-first ordering experience",
          linkText: "Start Ordering",
          inAppPathRedirect: "/categories",
          image: fallbackImage,
        },
      ];

  /* AUTO HERO SLIDER */
  useEffect(() => {
    if (!heroSlides?.length || heroSlides.length <= 1) return;

    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= heroSlides.length) nextIndex = 0;

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
  }, [currentIndex, heroSlides.length]);

  const handleScroll = (e) => {
    const width = getSliderWidth();
    const index = Math.round(e.target.scrollLeft / width);
    setCurrentIndex(index);
  };

  const quickActions = toArray(homeSlider).length > 0 ? toArray(homeSlider) : fallbackQuickActions;
  const offers = toArray(offersConfig).length > 0 ? toArray(offersConfig) : fallbackOffers;
  const categories = toArray(exploreCategories).length > 0 ? toArray(exploreCategories) : fallbackCategories;
  const socials = toArray(socialPages).length > 0 ? toArray(socialPages) : fallbackSocials;
  const appPreviewImages = useMemo(() => {
    const parsed = parseScreenshotList(merchantInfo?.appScreenshots);
    if (parsed.length > 0) return parsed.map((img) => resolveImage(img));
    if (homeBanner.length > 0) {
      return homeBanner.map((item) => resolveImage(item?.image)).slice(0, 3);
    }
    const quickActionImages = quickActions
      .map((item) => resolveImage(item?.image, ""))
      .filter(Boolean)
      .slice(0, 3);

    if (quickActionImages.length > 1) {
      return quickActionImages;
    }

    return [fallbackImage, fallbackImage, fallbackImage];
  }, [merchantInfo?.appScreenshots, homeBanner, quickActions]);

  useEffect(() => {
    if (appPreviewImages.length <= 1) return undefined;

    const interval = setInterval(() => {
      setAppPreviewShift((prev) => (prev + 1) % appPreviewImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [appPreviewImages]);

  const arrivalCards = toArray(newArrivals).length > 0
    ? toArray(newArrivals)
    : quickActions.slice(0, 8).map((item, index) => ({
        id: item?.id || index,
        name: pickField(item, ["title", "name"], "New Item"),
        image: pickField(item, ["image"], fallbackImage),
        price: pickField(item, ["price", "mrp", "amount"], "99"),
        inAppPathRedirect: pickField(item, ["inAppPathRedirect", "path"], "/categories"),
      }));

  const playStoreLink = merchantInfo?.playstoreAppLink || "";
  const appStoreLink = merchantInfo?.appstoreAppLink || "";

  const downloadBackground =
    themeColors?.downloadAppSectionBackgroundColor ||
    uiConfig?.homeBgColor ||
    "#111111";
  const accentColor =
    themeColors?.accentColor ||
    uiConfig?.buttonBgColor ||
    uiConfig?.tabActiveColor ||
    "#E50914";
  const downloadTextColor = getReadableTextColor(downloadBackground);
  const downloadMutedColor =
    downloadTextColor === "#ffffff" ? "rgba(255,255,255,0.76)" : "rgba(17,24,39,0.7)";
  const secondaryBorderColor =
    downloadTextColor === "#ffffff" ? "rgba(255,255,255,0.32)" : "rgba(17,24,39,0.28)";

  const sectionBg = uiConfig?.cardBgColor || "#111111";
  const quickActionsBg = themeColors?.homeCtaCardsBackgroundColor || sectionBg;
  const exploreBg = themeColors?.homeExploreCategoriesBackgroundColor || sectionBg;
  const offersBg = themeColors?.homeSectionOffersBackgroundColor || sectionBg;
  const socialBg = themeColors?.socialPageBackgroundColor || sectionBg;

  return (
    <div
      className="home-screen"
      style={{
        backgroundColor: uiConfig?.homeBgColor || "#0B0B0F",
      }}
    >
      <GreetingComponent greetingConfig={greetingConfig} />

      {/* ================= HERO ================= */}
      {heroSlides.length > 0 && (
        <div className="hero-container">
          <div
            className="hero-slider"
            ref={sliderRef}
            onScroll={handleScroll}
            style={{ scrollSnapType: "x mandatory" }}
          >
            {heroSlides.map((item, index) => (
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
            {heroSlides.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentIndex ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= CTA SECTION ================= */}
      {/* {quickActions.length > 0 && (
        <section className="cta-wrapper" style={{ background: quickActionsBg }}>
          <h3 className="section-title">{homeSliderConfig?.title || "Quick Actions"}</h3>
          {homeSliderConfig?.subTitle && (
            <p className="section-subtitle">{homeSliderConfig.subTitle}</p>
          )}
          <div className="cta-slider promo-mobile-list">
            {quickActions.map((item, index) => (
              <Link
                key={index}
                to={resolveWebPath(pickField(item, ["inAppPathRedirect", "path", "buttonLink"], "/categories"))}
                className="promo-card"
                style={{
                  backgroundColor:
                    item?.backgroundColor ||
                    item?.cardBgColor ||
                    item?.homeCtaBackgroundColor ||
                    item?.bgColor ||
                    "#2a2a2a",
                  color: item?.cardTextColor || item?.textColor || "#ffffff",
                }}
              >
                <div className="promo-card__body">
                  <h4 className="promo-card__title">{pickField(item, ["title", "name"], "Quick Action")}</h4>
                  <p className="promo-card__desc">{pickField(item, ["subTitle", "description", "discription"], "Explore this section")}</p>
                  <span
                    className="promo-card__cta"
                    style={{
                      background: item?.buttonColor || item?.buttonBackgroundColor || "rgba(255,255,255,0.82)",
                      color: item?.buttonTextColor || "#111827",
                      borderColor: item?.borderColor || "transparent",
                    }}
                  >
                    {pickField(item, ["buttonText", "linkText", "buttonTitle"], "Explore")}
                  </span>
                </div>
                <div className="promo-card__visual">
                  <img
                    src={resolveImage(
                      pickField(
                        item,
                        ["image", "imageUrl", "bannerImage", "homeImage", "icon", "thumbnail"],
                        fallbackImage
                      )
                    )}
                    alt={pickField(item, ["title", "name"], "Card image")}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )} */}

      {/* ================= NEW ARRIVALS ================= */}
      {arrivalCards.length > 0 && (
        <section className="home-section home-section-new-arrivals">
          <h3 className="section-title">New Arrivals</h3>
          <div className="new-arrivals-marquee">
            <div className="new-arrivals-grid">
              {arrivalCards.map((item, index) => (
                <Link
                  key={item?.id || index}
                  to={resolveWebPath(pickField(item, ["inAppPathRedirect", "path"], "/categories"))}
                  className="cat-item-card"
                >
                  <div className="cat-item-card__image-wrap">
                    <img
                      src={pickField(item, ["image", "itemImage", "thumbnail"], "https://via.placeholder.com/200")}
                      alt={pickField(item, ["name", "title"], "Product")}
                      className="cat-item-card__image"
                    />
                  </div>
                  <div className="cat-item-card__body">
                    <h4 className="cat-item-card__name">{pickField(item, ["name", "title"], "New Product")}</h4>
                    <div className="cat-item-card__price">
                      <span className="cat-item-card__price-current">₹{pickField(item, ["price", "mrp", "amount"], "99")}</span>
                    </div>
                    <span className="cat-item-card__button">Add to Cart</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= EXPLORE CATEGORIES ================= */}
      {categories.length > 0 && (
        <section className="home-section explore-wrapper" style={{ background: exploreBg }}>
          <h3 className="section-title">Explore Categories</h3>
          <div className="category-showcase-track">
            {categories.map((item, index) => (
              <Link
                key={item?.id || index}
                to={resolveWebPath(pickField(item, ["buttonLink", "inAppPathRedirect", "path"], "/categories"))}
                className="showcase-category-card"
              >
                <img
                  src={resolveImage(
                    pickField(
                      item,
                      ["backgroundImage", "image", "imageUrl", "categoryImage", "bannerImage", "thumbnail", "icon"],
                      fallbackImage
                    )
                  )}
                  alt={pickField(item, ["title", "name"], "Category")}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
                <div className="showcase-category-card__overlay">
                  <h4>{pickField(item, ["title", "name"], "Category")}</h4>
                  <p>{pickField(item, ["subTitle", "description", "discription"], "Discover more in this category")}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= OFFERS SECTION ================= */}
      {offers.length > 0 && (
        <section className="home-section offers-wrapper" style={{ background: offersBg }}>
          <h3 className="section-title">Offers</h3>
          <div className="offers-grid">
            {offers.map((item, index) => (
              <Link
                key={item?.id || index}
                to={resolveWebPath(item?.inAppPathRedirect || item?.path || "/categories")}
                className="offer-card"
                style={{ backgroundColor: item?.backgroundColor || "#232323" }}
              >
                <div className="offer-content">
                  <h4>{item?.title || item?.name || "Special Offer"}</h4>
                  <p>{item?.subTitle || item?.description || "Exclusive price and curated picks."}</p>
                </div>
                <div className="offer-button" style={{ color: item?.buttonTextColor || "#111" }}>
                  {item?.buttonText || item?.linkText || "Explore"}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= DOWNLOAD APP ================= */}
      <section
        className="home-section download-wrapper"
        style={{
          "--download-bg": downloadBackground,
          "--download-accent": accentColor,
          "--download-text": downloadTextColor,
          "--download-muted": downloadMutedColor,
          "--download-secondary-border": secondaryBorderColor,
        }}
      >
        <div className="download-content">
          <p className="download-eyebrow">Download App</p>
          <h3>{merchantInfo?.homeDownloadAppTagline || "Order Faster On Mobile"}</h3>
          <p>
            {merchantInfo?.homeDownloadAppDescription ||
              "Get a smoother ordering experience, live updates, and app-only deals."}
          </p>
          <div className="download-actions">
            {playStoreLink && (
              <a href={playStoreLink} target="_blank" rel="noreferrer" className="download-btn primary">
                Get it on Play Store
              </a>
            )}
            {appStoreLink && (
              <a href={appStoreLink} target="_blank" rel="noreferrer" className="download-btn secondary">
                Download on App Store
              </a>
            )}
            {!playStoreLink && !appStoreLink && (
              <Link to="/register" className="download-btn primary">
                Open App Experience
              </Link>
            )}
          </div>
        </div>
        <div className="app-download-visual" aria-hidden="true">
          <div className="app-download-stack">
            {appPreviewImages.map((image, index) => {
              const position = (index - appPreviewShift + appPreviewImages.length) % appPreviewImages.length;
              const variant = position === 0 ? "left" : position === 1 ? "center" : "right";
              return (
                <div key={`preview-${index}`} className={`app-preview-card app-preview-card-${variant}`}>
                  <img src={image} alt={`App preview ${index + 1}`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SOCIAL ================= */}
      {socials.length > 0 && (
        <section className="home-section social-wrapper" style={{ background: socialBg }}>
          <h3 className="section-title">Social Pages</h3>
          <div className="home-social-grid">
            {socials.map((item, index) => (
              <a
                key={item?.id || index}
                href={pickField(item, ["link", "redirectPath", "path"], "#")}
                target="_blank"
                rel="noreferrer"
                className="social-card"
              >
                <div className="social-card-head">
                  <span className="social-card-logo">{pickField(item, ["title"], "S").slice(0, 1)}</span>
                  <h4>{pickField(item, ["title", "name"], "Social")}</h4>
                </div>
                <p>{pickField(item, ["subTitle", "description"], "Stay connected with our updates")}</p>
                <span className="social-card-cta">Open</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <div style={{ height: "40px" }} />
    </div>
  );
};

export default HomeScreen;

