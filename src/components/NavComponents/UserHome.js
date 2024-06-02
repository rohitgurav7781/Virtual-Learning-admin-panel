import React, { useEffect, useState } from "react";
import {
  Card,
  CardActions,
  IconButton,
  Button,
  Grid,
  Breadcrumbs,
  Typography,
  Link,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import { Person3Rounded } from "@mui/icons-material";
import { fetchUserCount, fetchUserList } from "../API's/UserListApi";
import { fetchCandiadteCount, fetchCandidate } from "../API's/CandidateApi";
import Footer from "./Footer";

const UserHome = () => {
  const [usercount, setUserCount] = useState(0);
  const [candidatecount, setCandidateCount] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const userData = await fetchUserCount(user.accessToken);
        setUserCount(userData.length);
      } catch (error) {
        console.error("Error fetching userList :", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const candidateData = await fetchCandiadteCount(user.accessToken);
        setCandidateCount(candidateData.length);
      } catch (error) {
        console.error("Error fetching candidate :", error);
      }
    };

    fetchData();
  }, []);

  const navi = useNavigate();

  const handleCat = () => {
    navi("/userList");
  };

  const handleCan = () => {
    navi("/candidates");
  };

  return (
    <>
      <Box sx={{ height: { md: "69vh", xs: "80vh", sm: "180vh" } }}>
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          User-Dashboard
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">User-Management</Typography>
        </Breadcrumbs>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                width: "100%",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 3,
              }}
              onClick={handleCat}
            >
              <CardActions
                sx={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <Button
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#012970",
                  }}
                >
                  USERS-LIST
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#aed5f8",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <CategoryIcon />
                  </IconButton>

                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: "100",
                      color: "#012970",
                      marginLeft: "10px",
                    }}
                  >
                    {usercount}
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                width: "100%",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 3,
              }}
              onClick={handleCan}
            >
              <CardActions
                sx={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <Button
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#012970",
                  }}
                >
                  candidates
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#aed5f8",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <PeopleIcon />
                  </IconButton>

                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: "100",
                      color: "#012970",
                      marginLeft: "10px",
                    }}
                  >
                    {candidatecount}
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default UserHome;
