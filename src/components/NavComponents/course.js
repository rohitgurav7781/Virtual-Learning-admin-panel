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
  PercentOutlined,
  Person3Rounded,
  TranslateOutlined,
} from "@mui/icons-material";

import { batchCourse, fetchCourses } from "../API's/CourseApi";
import { fetchModule, fetchModuleCount } from "../API's/CourseModuleApi";
import { fetchTopic, fetchTopicCount } from "../API's/CourseTopicApi";
import Footer from "./Footer";

const CourseHome = () => {
  const [courseCount, setCourseCount] = useState(0);
  const [moduleCount, setModuleCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);

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
        const moduleData = await fetchModuleCount(user.accessToken);
        setModuleCount(moduleData.length);
      } catch (error) {
        console.error("Error fetching Course Module:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const topicData = await fetchTopicCount(user.accessToken);
        setTopicCount(topicData.length);
      } catch (error) {
        console.error("Error fetching Course Topic:", error);
      }
    };
    fetchData();
  }, []);

  const navi = useNavigate();

  const handleCourse = () => {
    navi("/course");
  };

  const handleCourseModule = () => {
    navi("/courseModule");
  };
  const handleCourseTopic = () => {
    navi("/courseTopic");
  };

  return (
    <>
      <Box sx={{ height: { md: "69vh", xs: "90vh", sm: "160vh" } }}>
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Course Menu
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">Course Menu</Typography>
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
                    {courseCount}
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                width: "auto",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 3,
              }}
              onClick={handleCourseModule}
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
                  Module
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    {moduleCount}
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
              onClick={handleCourseTopic}
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
                  Topic
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
                    {topicCount}
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

export default CourseHome;
