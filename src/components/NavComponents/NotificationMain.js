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
import {
  BatchPrediction,
  BatchPredictionRounded,
  BatchPredictionSharp,
  NotificationAdd,
  Person3Rounded,
} from "@mui/icons-material";
import {
  fetchNofication,
  fetchNotificationCount,
} from "../API's/NotificationApi";
import Footer from "./Footer";

const NotificationHome = () => {
  const [notificationcount, setNotificationCount] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const navi = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const notificationData = await fetchNotificationCount(user.accessToken);
        setNotificationCount(notificationData.length);
      } catch (error) {
        console.error("Error fetching Notification:", error);
      }
    };

    fetchData();
  }, []);

  const handleNoti = () => {
    navi("/notifications");
  };

  return (
    <>
      <Box
        sx={{
          height: { md: "69vh", xs: "80vh", sm: "83.7vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Notifications
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">Notifications</Typography>
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
              onClick={handleNoti}
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
                  Bulk Notifications
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#aed5f8",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <NotificationAdd />
                  </IconButton>

                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: "100",
                      color: "#012970",
                      marginLeft: "10px",
                    }}
                  >
                    {notificationcount}
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

export default NotificationHome;
