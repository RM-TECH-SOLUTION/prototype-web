import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeTabs from "../component/HomeTabs";
import HomeScreen from "../component/HomeScreen";
import Account from "../pages/Account";
import CategoryContainer from "./CategoryContainer";
import useCmsStore from "../store/useCmsStore";

// Helper to extract values from potential field objects
const extractValue = (value) => {
  // If it's a string or number, return as-is
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  
  // If it's an object with fieldValue property, extract it
  if (value && typeof value === 'object' && value.fieldValue !== undefined) {
    return extractValue(value.fieldValue); // Recursive in case fieldValue is also nested
  }
  
  // If it's an object (but not a field object), return null to prevent React errors
  if (value && typeof value === 'object') {
    return null;
  }
  
  // Return null, undefined, or any other primitive
  return value;
};

// Helper to parse the custom CMS field format like "@{fieldName=... fieldKey=... fieldValue=...}"
const parseCmsValue = (value) => {
  if (!value || typeof value !== 'string') return value;
  
  // Check if it's in the @{...} format
  if (value.startsWith('@{') && value.endsWith('}')) {
    const inner = value.slice(2, -1);
    const fieldValueMatch = inner.match(/fieldValue=([^}]+)/);
    if (fieldValueMatch) {
      return fieldValueMatch[1];
    }
  }
  return value;
};

// Normalize CMS fields - handles both array and object formats
const normalizeCmsFields = (cms) => {
  if (!cms) return null;

  // If it's an array, normalize each item
  if (Array.isArray(cms)) {
    return cms.map((item) => {
      const normalized = {};
      Object.entries(item).forEach(([key, value]) => {
        const extracted = extractValue(value);
        normalized[key] = parseCmsValue(extracted);
      });
      return normalized;
    });
  }

  // If it's an object with nested structure
  if (typeof cms === 'object') {
    const normalized = {};
    Object.entries(cms).forEach(([key, value]) => {
      const extracted = extractValue(value);
      normalized[key] = parseCmsValue(extracted);
    });
    return normalized;
  }

  return cms;
};

const HomeContainer = () => {
  const { cmsData, getCmsData } = useCmsStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [uiConfig, setUiConfig] = useState({});
  const [homeBanner, setHomeBanner] = useState([]);
  const [homeSlider, setHomeSlider] = useState([]);
  const [greetingConfig, setGreetingConfig] = useState({});

  useEffect(() => {
    getCmsData();
  }, []);

  useEffect(() => {
    console.log("📊 CMS Data received:", cmsData);
    
    if (!cmsData || !Array.isArray(cmsData)) {
      console.log("⚠️ CMS Data is not an array or is null");
      return;
    }

    cmsData.forEach((item) => {
      if (!item.modelSlug) return;
      
      switch (item.modelSlug) {
        case "homeUiConfiguration":
          setUiConfig(normalizeCmsFields(item.cms));
          console.log("✅ UI Config:", item.cms);
          break;

        case "homeOrderingBanner":
          setHomeBanner(normalizeCmsFields(item.cms));
          console.log("✅ Home Banner:", item.cms);
          break;

        case "homeCtaCards":
          setHomeSlider(normalizeCmsFields(item.cms));
          console.log("✅ Home Slider:", item.cms);
          break;

        case "appWelcomeMessage":
          setGreetingConfig(normalizeCmsFields(item.cms));
          console.log("✅ Greeting Config:", item.cms);
          break;
      }
    });
  }, [cmsData]);

  // Render the appropriate component based on current route
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === "/" || path === "") {
      return (
        <HomeScreen
          uiConfig={uiConfig}
          homeBanner={homeBanner}
          homeSlider={homeSlider}
          greetingConfig={greetingConfig}
        />
      );
    }
    
    if (path === "/categories" || path === "/category") {
      return <CategoryContainer />;
    }
    
    if (path === "/account") {
      return <Account />;
    }
    
    return (
      <HomeScreen
        uiConfig={uiConfig}
        homeBanner={homeBanner}
        homeSlider={homeSlider}
        greetingConfig={greetingConfig}
      />
    );
  };

  return (
    <HomeTabs uiConfig={uiConfig}>
      {renderContent()}
    </HomeTabs>
  );
};

export default HomeContainer;

