import React, { useState, useEffect } from "react";
import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useUIContext } from "../../context/ui";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppbarContainer, AppbarHeader, MyList } from "../../styles/appbar";
import Actions from "./actions";
import { BaseUrl } from "../../BaseUrl";

export default function AppbarDesktop({ matches }) {
  const navigate = useNavigate();
  const { setShowSearchBox } = useUIContext();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [showLogoutMenu, setShowLogoutMenu] = useState(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (user && user.accessToken) {
      setIsLoggedIn(true);
      setFullName(user.fullName);
      fetchUserInfo();
    }
  }, [isLoggedOut]);

  const fetchUserInfo = () => {
    axios
      .get(
        `${BaseUrl}/login/v1/queryMobileUserByUserName/8904000887/${fullName}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.accessToken,
          },
        }
      )
      .then((response) => {
        setUserInfo(response.data.fullName);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleUserNameClick = (event) => {
    setShowLogoutMenu(showLogoutMenu ? null : event.currentTarget);
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  const handleAboutClick = () => {
    navigate("/about");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <>
      <Box
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <AppbarContainer>
          <AppbarHeader variant="h4" sx={{ fontSize: "40px" }}>
            Walkin Software
          </AppbarHeader>
          <MyList type="row">
            <ListItemText primary="Home" onClick={handleHomeClick} />
            <ListItemText primary="About Us" onClick={handleAboutClick} />
            <ListItemText primary="Contact Us" onClick={handleContactClick} />
            {isLoggedIn ? (
              <div onClick={handleUserNameClick} style={{ fontSize: "18px" }}>
                {userInfo ? <p>{userInfo}</p> : null}
              </div>
            ) : (
              <ListItemText primary="Login" onClick={handleLoginClick} />
            )}

            <ListItemButton
              onClick={() => setShowSearchBox(true)}
              sx={{ ml: "10px" }}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
            </ListItemButton>
          </MyList>
          <Actions matches={matches} />
        </AppbarContainer>
      </Box>
    </>
  );
}
