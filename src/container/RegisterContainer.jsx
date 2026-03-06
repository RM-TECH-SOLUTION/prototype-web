import React from 'react';
import RegistrationScreen from '../component/RegistrationScreen';
import useCmsStore from '../store/useCmsStore';

// Robust normalization helper
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

const RegisterContainer = () => {
  const { cmsData } = useCmsStore();
  
  // Extract registration config from CMS data
  let cmsConfig = {};
  if (cmsData && Array.isArray(cmsData)) {
    cmsData.forEach((item) => {
      if (item.modelSlug === 'registrationUiConfiguration') {
        const cms = item.cms || {};
        if (Array.isArray(cms)) {
          // If cms is an array, combine all items
          cmsConfig = cms.reduce((acc, obj) => Object.assign(acc, obj), {});
        } else if (typeof cms === 'object') {
          cmsConfig = Object.assign({}, cms);
        }
      }
    });
  }
  
  // Clean up the config to extract all values properly
  const cleanedConfig = Object.entries(cmsConfig).reduce((acc, [key, value]) => {
    acc[key] = extractValue(value);
    return acc;
  }, {});
  
  return <RegistrationScreen cmsConfig={cleanedConfig} />;
};

export default RegisterContainer;

