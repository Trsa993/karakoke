import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import homeIcon from "../../assets/home-icon.png";

const Navigation = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (isLoggedIn) {
      navigate("/home");
    } else {
      navigate("/home/guest");
    }
  };
  return (
    <nav className="navigation">
      <img
        src={homeIcon}
        alt="Home"
        className="home-icon"
        onClick={handleHomeClick}
      />

      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            // Call your search function here
          }}
        />
      </div>
    </nav>
  );
};

export default Navigation;
