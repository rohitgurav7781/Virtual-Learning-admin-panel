import React, { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Typography,
  Link,
  Grid,
  CardActions,
  Card,
  Box,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import img from "../images/profile.jpeg";
import { BaseUrl } from "../../BaseUrl";
import axios from "axios";

const Account = () => {
  const [user, setUser] = React.useState("");
  const [userInfo, setUserInfo] = useState(""); // Define userInfo state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState(""); // Assuming fullName should be used

  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    if (loggedInUser && loggedInUser.accessToken) {
      setUser(loggedInUser);
      setIsLoggedIn(true);
      setUserName(loggedInUser.userName);

      // Fetch user info here
      fetchUserInfo(loggedInUser.userName, loggedInUser.accessToken);
    }
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    if (loggedInUser && loggedInUser.accessToken) {
      setUser(loggedInUser);
      setIsLoggedIn(true);
      setMobileNumber(loggedInUser.mobileNumber);

      // Fetch user info here
      fetchContactInfo(loggedInUser.mobileNumber, loggedInUser.accessToken);
    }
  }, []);

  const fetchUserInfo = (userName, accessToken) => {
    axios
      .get(`${BaseUrl}/login/v1/queryUserProfileByUserName/${userName}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setUserInfo(response.data); // Set userInfo with fetched data directly
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  const fetchContactInfo = (mobileNumber, accessToken) => {
    axios
      .get(`${BaseUrl}/login/v1/queryUserProfileByUserName/${mobileNumber}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setUserInfo(response.data); // Set userInfo with fetched data directly
      })
      .catch((error) => {
        console.error("Error fetching user Mobile Number:", error);
      });
  };

  return (
    <>
      <Box height={{ md: "69vh", xs: "75vh" }}>
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          My Account
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">My Account</Typography>
        </Breadcrumbs>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                width: "100%",
                height: "270px",
                border: "0.5px solid lightGray",
                mt: 3,
                "&:hover": {
                  background: "whiteSmoke",
                },
              }}
            >
              <CardActions>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center", // Align items to the center horizontally
                    flexDirection: "column", // Stack items vertically
                    height: "100%", // Fill the height of the card
                    paddingTop: 2, // Add padding from the top
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center", // Center the image horizontally
                      width: "100%", // Take the full width of the parent
                    }}
                  >
                    <img
                      src={img}
                      style={{
                        maxWidth: "50%",
                        maxHeight: "50%",
                        borderRadius: "80%",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
                      variant="h4"
                    >
                      {userName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="#012970"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {mobileNumber}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                    }}
                  >
                    <Link
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener"
                    >
                      <TwitterIcon sx={{ color: "#1DA1F2", mx: 0.5 }} />
                    </Link>
                    <Link
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener"
                    >
                      <FacebookIcon sx={{ color: "#4267B2", mx: 0.5 }} />
                    </Link>
                    <Link
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener"
                    >
                      <InstagramIcon sx={{ color: "#E1306C", mx: 0.5 }} />
                    </Link>
                    <Link
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener"
                    >
                      <LinkedInIcon sx={{ color: "#2867B2", mx: 0.5 }} />
                    </Link>
                  </Box>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Account;
