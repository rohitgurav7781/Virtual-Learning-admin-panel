import React, { useEffect, useState } from "react";
import {
  AddCard,
  AddCardOutlined,
  AddCircle,
  BookOnline,
  DeleteForever,
  Edit,
  GroupAdd,
  GroupAddOutlined,
  ImportContacts,
  PeopleAltOutlined,
  TranslateOutlined,
  TvOffRounded,
  TvRounded,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { Colors } from "../../styles/theme";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { BaseUrl } from "../../BaseUrl";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AdUnitsIcon from "@mui/icons-material/AdUnits";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ReceiptLong, Settings } from "@mui/icons-material";

import {
  fetchPromo,
  fetchPromoCount,
  fetchPromotions,
} from "../API's/PromoApi";
import styled from "@emotion/styled";
import Footer from "./Footer";
import { fetchCourses } from "../API's/CourseApi";
import { fetchCategoryCount } from "../API's/CategoryApi";
import { fetchLangaugeCount } from "../API's/LanguageApi";
import { fetchUserCount } from "../API's/UserListApi";
import { fetchBannerCount } from "../API's/BannerApi";

const StyledPromo = styled.div`
  width: 80%;
  margin-left: 50px;
  display: flex;
  justify-content: center;

  @media (max-width: 600px) {
    width: 120%;
    margin-left: 0;
    height: 150px;
  }
`;

export default function Dashboard() {
  const [advertisements, setAdvertisements] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState([]);

  const [promoCount, setPromoCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [languageCount, setLangaugeCount] = useState(0);
  const [usercount, setUserCount] = useState(0);
  const [adCount, setAdCount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const promoData = await fetchPromoCount(user.accessToken);
        setPromoCount(promoData.length);
      } catch (error) {
        console.error("Error fetching promo:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch course data and get the length
        const courseData = await fetchCourses(user.accessToken);
        setCourseCount(courseData.length);
      } catch (error) {
        console.error("Error fetching Course data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const categoryData = await fetchCategoryCount(user.accessToken);
        setCategoryCount(categoryData.length);
      } catch (error) {
        console.error("Error fetching Category:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const languageData = await fetchLangaugeCount(user.accessToken);
        setLangaugeCount(languageData.length);
      } catch (error) {
        console.error("Error fetching Discount:", error);
      }
    };

    fetchData();
  }, []);

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
        const adData = await fetchBannerCount(user.accessToken);
        setAdCount(adData.length);
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.accessToken}`,
    };

    // Define your API URL
    const apiUrl = `${BaseUrl}/advertisement/v1/queryAllAdvertisement`;

    // Make the API request
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        // Assuming the API response is an array of advertisements
        // console.log(response);
        setAdvertisements(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const navi = useNavigate();

  const handlePromo = () => {
    navi("/promo");
  };

  const handleCourse = () => {
    navi("/course-menu");
  };

  const handleBanner = () => {
    navi("/banner");
  };

  const handleCat = () => {
    navi("/category");
  };

  const handleUser = () => {
    navi("/user");
  };

  const handleLang = () => {
    navi("/language");
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        setLoading(true);

        const promotionsData = await fetchPromotions(user.accessToken);
        setPromotions(promotionsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Box>
        <Typography sx={{ mb: 0, fontSize: "24px" }} variant="h4">
          Dashboard
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">Dashboard</Typography>
        </Breadcrumbs>

        <style>
          {`
          .responsive-image {
            height: 20vh;
            width: 100%;
            max-width: 100%;
          }

          @media (min-width: 768px) {
            .responsive-image {
              height: 40vh;
            }
          }
        `}
        </style>

        <Carousel
          autoPlay
          interval={3000}
          infiniteLoop
          showStatus={false}
          showThumbs={false}
          swipeable={true}
          emulateTouch={true}
          dynamicHeight={true}
          useKeyboardArrows={true}
        >
          {advertisements.map((advertisement) => (
            <div key={advertisement.id}>
              <img
                src={`${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(
                  advertisement.filePath
                )}`}
                alt="Advertisement"
                className="responsive-image"
              />
            </div>
          ))}
        </Carousel>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                width: "100%",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 5,
              }}
              onClick={handlePromo}
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
                  Promo
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#aed5f8",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <TvRounded />
                  </IconButton>
                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: "100",
                      color: "#012970",
                      marginLeft: "10px",
                    }}
                  >
                    {promoCount}
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                width: "100%",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 5,
              }}
              onClick={handleCourse}
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
                  Course
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#e0f8e9",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <ImportContacts style={{ color: "#2eca6a" }} />
                  </IconButton>
                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: "100",
                      color: "#012970",
                      marginLeft: "10px",
                    }}
                  >
                    {courseCount}
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                width: "100%",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 5,
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
                  Category
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#ffecdf",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <AddCardOutlined style={{ color: "#ff771d" }} />
                  </IconButton>
                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: "100",
                      color: "#012970",
                      marginLeft: "10px",
                    }}
                  >
                    {categoryCount}
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                width: "100%",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 5,
              }}
              onClick={handleLang}
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
                  Langauage
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#ffecdf",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <TranslateOutlined style={{ color: "#f0ba1c" }} />
                  </IconButton>
                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: "100",
                      color: "#012970",
                      marginLeft: "10px",
                    }}
                  >
                    {languageCount}
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                width: "100%",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 5,
              }}
              onClick={handleUser}
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
                  Users
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#ffd6ea",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <PeopleAltOutlined style={{ color: "#741b47" }} />
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

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                width: "100%",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 5,
              }}
              onClick={handleBanner}
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
                  Banner
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#ffecdf",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <NewspaperIcon />
                  </IconButton>
                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: "100",
                      color: "#012970",
                      marginLeft: "10px",
                    }}
                  >
                    {adCount}
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Carousel>
          {videos.map((video) => (
            <div key={video.id.videoId}>
              <iframe
                title={video.snippet.title}
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </Carousel>
      </Box>

      {/* Promotions Carousel */}
      <Typography variant="h5" sx={{ color: "darkblue", mb: 1, mt: 2 }}>
        Promotions
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          marginRight: "-10px",
          marginLeft: "-10px",
          mt: 2,
        }}
      >
        <Carousel
          autoPlay
          interval={3000}
          infiniteLoop
          showStatus={false}
          showThumbs={false}
          swipeable={true}
          emulateTouch={true}
          dynamicHeight={true}
          useKeyboardArrows={true}
          showIndicators={false}
          showArrows={true}
          renderThumbs={() => {}}
          centerMode={true}
          centerSlidePercentage={33.33}
        >
          {promotions.map((p) => (
            <StyledPromo key={p.promoId}>
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  marginLeft: "-50px",
                  marginRight: "-10px",
                }}
              >
                <CardContent sx={{ ml: -5, mr: -5 }}>
                  {p.youTube && (
                    <iframe
                      title="YouTube Video"
                      src={`https://www.youtube.com/embed/${p.youTube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch Video
                    </iframe>
                  )}
                  <Typography
                    sx={{ fontSize: 17, mt: -5, mb: -2 }}
                    gutterBottom
                  >
                    {p.promoName}
                  </Typography>
                </CardContent>
              </Card>
            </StyledPromo>
          ))}
        </Carousel>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handlePromo}
          sx={{ margin: "25px", marginRight: "-10px" }}
        >
          Show More
        </Button>
      </Box>
    </>
  );
}
