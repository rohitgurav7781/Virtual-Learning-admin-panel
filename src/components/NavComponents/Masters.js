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
  MapOutlined,
  PercentOutlined,
  Person3Rounded,
  TranslateOutlined,
} from "@mui/icons-material";
import { fetchCategoryCount, fetchCatergoryData } from "../API's/CategoryApi";
import { fetchDiscount, fetchDiscountCount } from "../API's/DiscountApi";
import { fetchLangaugeCount, fetchLanguage } from "../API's/LanguageApi";
import { fetchRegion, fetchRegionCount } from "../API's/RegionApi";
import Footer from "./Footer";

const Masters = () => {
  const [categoryCount, setCategoryCount] = useState(0);
  const [discountCount, setDiscountCount] = useState(0);
  const [languageCount, setLangaugeCount] = useState(0);
  const [regionCount, setRegionCount] = useState(0);

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
        const discountData = await fetchDiscountCount(user.accessToken);
        setDiscountCount(discountData.length);
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
        const regionData = await fetchRegionCount(user.accessToken);
        setRegionCount(regionData.length);
      } catch (error) {
        console.error("Error fetching Region:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategory = () => {
    navi("/category");
  };

  const handleDiscount = () => {
    navi("/discount");
  };
  const handleBatchLang = () => {
    navi("/language");
  };
  const handleBatchRegion = () => {
    navi("/region");
  };

  return (
    <>
      <Box
        sx={{
          height: { md: "69vh", xs: "110vh", sm: "85vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Master
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">Masters</Typography>
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
              onClick={handleCategory}
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
                      backgroundColor: "#aed5f8",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <BatchPredictionSharp />
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

          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                width: "100%",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 3,
              }}
              onClick={handleDiscount}
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
                  Discount
                </Button>
                <Box Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#e0f8e9",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <PercentOutlined style={{ color: "#2eca6a" }} />
                  </IconButton>

                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: "100",
                      color: "#012970",
                      marginLeft: "10px",
                    }}
                  >
                    {discountCount}
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
              onClick={handleBatchLang}
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
                  Language
                </Button>
                <Box Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#ffecdf",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <TranslateOutlined style={{ color: "#ff771d" }} />
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

          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                width: "100%",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 3,
              }}
              onClick={handleBatchRegion}
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
                  Region
                </Button>
                <Box Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{
                      backgroundColor: "#fff7e0",
                      color: "blue",
                      marginLeft: "10px",
                    }}
                  >
                    <MapOutlined style={{ color: "#f0ba1c" }} />
                  </IconButton>

                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: "100",
                      color: "#012970",
                      marginLeft: "10px",
                    }}
                  >
                    {regionCount}
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

export default Masters;
