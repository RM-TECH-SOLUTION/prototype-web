import React from 'react';
import RegistrationScreen from '../component/RegistrationScreen';
import useCmsStore from '../store/useCmsStore';

const RegisterContainer = () => {
  const { cmsData } = useCmsStore();
  
  // Extract registration config from CMS data
  let cmsConfig = {};
  if (cmsData && Array.isArray(cmsData)) {
    cmsData.forEach((item) => {
      if (item.modelSlug === 'registrationUiConfiguration') {
        cmsConfig = Object.values(item.cms || {}).reduce((acc, field) => {
          acc[field.fieldKey] = field.fieldValue;
          return acc;
        }, {});
      }
    });
  }
  
  return <RegistrationScreen cmsConfig={cmsConfig} />;
};

export default RegisterContainer;

