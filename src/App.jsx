import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomeContainer from './container/HomeContainer';
import LoginContainer from './container/LoginContainer';
import RegisterContainer from './container/RegisterContainer';
import CheckoutContainer from './container/CheckoutContainer';
import OrderHistoryContainer from './container/OrderHistoryContainer';
import MerchantInfoContainer from './container/MerchantInfoContainer';
import SplashContainer from './container/SplashContainer';
import WalkthroughContainer from './container/WalkthroughContainer';
import CategoryContainer from './container/CategoryContainer';
import SavedAddressComponent from './component/SavedAddressComponent';
import ProductDetailComponent from './component/ProductDetailComponent';
import Account from './pages/Account';
import useCmsStore from './store/useCmsStore';
import './App.css';

function App() {
  // Initialize CMS data at app level so all pages have access
  const { getCmsData } = useCmsStore();
  
  useEffect(() => {
    getCmsData();
  }, [getCmsData]);
  
  return (
    <Router>
      <Routes>
        {/* Splash & Walkthrough */}
        <Route path="/splash" element={<SplashContainer />} />
        <Route path="/walkthrough" element={<WalkthroughContainer />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/register" element={<RegisterContainer />} />
        
        {/* Main App with Tabs */}
        <Route path="/*" element={<HomeContainer />} />
        
        {/* Checkout - Outside of tabs */}
        <Route path="/checkout" element={<CheckoutContainer />} />
        
        {/* Category - Direct route */}
        <Route path="/category" element={<CategoryContainer />} />
        
        {/* Product Detail Page */}
        <Route path="/product/:productId" element={<ProductDetailComponent />} />
        
        {/* Account/Profile - Direct route */}
        <Route path="/account" element={<Account />} />
        <Route path="/account/saved-address" element={<SavedAddressComponent />} />
        
        {/* Order History */}
        <Route path="/order-history" element={<OrderHistoryContainer />} />
        
        {/* Merchant Info (Help) */}
        <Route path="/help" element={<MerchantInfoContainer />} />
        <Route path="/merchant-info" element={<MerchantInfoContainer />} />
      </Routes>
    </Router>
  );
}

export default App;

