import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeContainer from './container/HomeContainer';
import LoginContainer from './container/LoginContainer';
import RegisterContainer from './container/RegisterContainer';
import CheckoutContainer from './container/CheckoutContainer';
import Account from './pages/Account';
import CategoryContainer from './container/CategoryContainer';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/register" element={<RegisterContainer />} />
        
        {/* Main App with Tabs */}
        <Route path="/*" element={<HomeContainer />} />
        
        {/* Checkout - Outside of tabs */}
        <Route path="/checkout" element={<CheckoutContainer />} />
        
        {/* Category - Direct route */}
        <Route path="/category" element={<CategoryContainer />} />
        
        {/* Account - Direct route */}
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;

