import React from 'react';
import LoginComponent from '../component/LoginComponent';
import useCmsStore from '../store/useCmsStore';

const LoginContainer = () => {
  const { cmsData } = useCmsStore();
  
  // Extract login config from CMS data
  let cmsConfig = {};
  if (cmsData && Array.isArray(cmsData)) {
    cmsData.forEach((item) => {
      if (item.modelSlug === 'loginUiConfiguration') {
        cmsConfig = Object.values(item.cms || {}).reduce((acc, field) => {
          acc[field.fieldKey] = field.fieldValue;
          return acc;
        }, {});
      }
    });
  }
  
  return <LoginComponent cmsConfig={cmsConfig} />;
};

export default LoginContainer;

