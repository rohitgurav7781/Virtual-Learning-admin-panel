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
import { BatchPredictionSharp } from "@mui/icons-material";

import { fetchBatches } from "../API's/BatchOneApi";
import { fetchBatchCourses } from "../API's/BatchTwoApi";
import { fetchBatchModuleCount } from "../API's/BatchModuleApi";
import { fetchBatchtopicCount } from "../API's/BatchTopicApi";

const BatchHome = () => {
  const [batchCount, setBatchCount] = useState(0);
  const [batchcourseCount, setBatchCourseCount] = useState(0);
  const [batchmoduleCount, setBatchModuleCount] = useState(0);
  const [batchtopicCount, setBatchTopicCount] = useState(0);

  const navi = useNavigate();

  const handleBat = () => {
    navi("/batch");
  };

  const handleBatch = () => {
    navi("/batchCourse");
  };

  const handleBatchModule = () => {
    navi("/batchModule");
  };

  const handleBatchTopic = () => {
    navi("/batchTopic");
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const batchData = await fetchBatches(user.accessToken);
        setBatchCount(batchData.length);
      } catch (error) {
        console.error("Error fetching batch data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const batchCourseData = await fetchBatchCourses(user.accessToken);
        setBatchCourseCount(batchCourseData.length);
      } catch (error) {
        console.error("Error fetching batchCourse data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const batchModuleData = await fetchBatchModuleCount(user.accessToken);
        setBatchModuleCount(batchModuleData.length);
      } catch (error) {
        console.error("Error fetching batchModule data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch batches data and get the length
        const batchtTopicData = await fetchBatchtopicCount(user.accessToken);
        setBatchTopicCount(batchtTopicData.length);
      } catch (error) {
        console.error("Error fetching batchTopic data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Box sx={{ height: { md: "69vh", xs: "110vh", sm: "160vh" } }}>
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Batch
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">Batch</Typography>
        </Breadcrumbs>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                width: "auto",
                height: "120px",
                border: "0.5px solid lightGray",
                mt: 3,
              }}
              onClick={handleBat}
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
                  Batch
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
                    {batchCount}
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
              onClick={handleBatch}
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
                  Batch Course
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
                    {batchcourseCount}
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
              onClick={handleBatchModule}
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
                  Batch-Module
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
                    {batchmoduleCount}
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
              onClick={handleBatchTopic}
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
                  Batch-Topic
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
                    {batchtopicCount}
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

export default BatchHome;
