import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileComponent from "../component/ProfileComponent";
import useSessionStore from "../store/useSessionStore";
import useAuthStore from "../store/useAuthStore";
import useCmsStore from "../store/useCmsStore";
import "./Account.css";

const Account = () => {

  const { user, isLoggedIn, profileData } = useSessionStore();
  const { logoutUser, getProfile } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      getProfile();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="account-container">
        <header className="account-header">
          <h1>Account</h1>
          <Link to="/">Home</Link>
        </header>

        <ProfileComponent user={null} />
      </div>
    );
  }

  return (
    <div className="account-container">

      <header className="account-header">
        <h1>Account</h1>
        <Link to="/">Home</Link>
      </header>

      <ProfileComponent user={user} />

     {/* POINTS CARD */}

<div className="points-card">

  <div className="points-header">
    <span>⭐</span>
    <h3>Loyalty Points</h3>
  </div>

  <div className="points-value">
    {profileData?.total_points || 0} Points
  </div>

</div>


{/* REFERRAL CARD */}

<div className="referral-card">

  <div className="referral-header">
    <span>🎁</span>
    <h3>Your Referral Code</h3>
  </div>

  <div className="referral-row">

    <div className="referral-code">
      {profileData?.referral_code || "N/A"}
    </div>

    <button
      className="copy-btn"
      onClick={() => {
        navigator.clipboard.writeText(profileData?.referral_code);
        alert("Referral code copied");
      }}
    >
      Copy
    </button>

  </div>

  <button
    className="share-btn"
    onClick={() => {

      const text = `Use my referral code ${profileData?.referral_code} and earn rewards!`;

      if (navigator.share) {
        navigator.share({ text });
      } else {
        navigator.clipboard.writeText(text);
        alert("Referral message copied");
      }

    }}
  >
    Share Referral
  </button>

</div>

      {/* Account Settings */}

      <div className="account-section">

        <h2>Account Settings</h2>

        <Link to="/order-history" className="account-menu">
          <span>📦</span>
          Order History
        </Link>

        <Link to="/account/saved-address" className="account-menu">
          <span>📍</span>
          My Address
        </Link>

        <Link to="/help" className="account-menu">
          <span>❓</span>
          Help & Support
        </Link>

      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
};

export default Account;