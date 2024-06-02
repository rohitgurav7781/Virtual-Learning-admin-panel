import React, { useEffect, useRef, useState } from "react";
import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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

import moment from "moment/moment";

import axios from "axios";

import {
  addNews,
  deleteNews,
  fetchNews,
  getNewsById,
  updatedNews,
} from "../API's/NewsApi";
import { BaseUrl } from "../../BaseUrl";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Footer from "./Footer";

export default function News() {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    newsName: "",
    description: "",
  });
  const [news, setNews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newsId, setNewsId] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setInitialValues({
      newsName: "",
      description: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    newsName: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const [fileName, setFileName] = useState("");
  const [selectedFile, setselectedFile] = useState("");
  const inputRef = useRef(null);

  const [fileError, setFileError] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const validateform = () => {
    const newErrors = {};

    if (!userdata.newsName || userdata.newsName.trim() === "") {
      newErrors.newsName = "Enter the News";
    }

    if (!userdata.description || userdata.description.trim() === "") {
      newErrors.description = "Enter the Description ";
    }

    return newErrors;
  };

  const changehandler = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value,
      createdBy: { userId: user.userId },
    });

    setErrors({
      ...errors,
      [e.target.name]: null,
    });
  };

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  //Delete Banner
  const handleDelete = async (newsId) => {
    await deleteNews(newsId, headers);
    FetchData();
  };

  //Edit Banner
  const handleEdit = async (newsId) => {
    setEditMode(true);
    setOpen(true);
    let res = await getNewsById(newsId, headers);
    console.log(res.data);
    let det = res.data;

    setNewsId(det.newsId);
    setUserData({
      newsName: det.newsName,
      description: det.description,
      fileName: det.fileName,
    });

    FetchData();
  };

  //Update Banner
  const updatedata = async (e) => {
    e.preventDefault();
    var updatedData = {
      ...userdata,
      newsId,
      updatedBy: { userId: user.userId },
    };
    console.log(updatedData);

    const res = await updatedNews(updatedData, headers);
    console.log(res);

    if (res) {
      // Update the state with the updated data
      const updatedBannerList = news.map((item) =>
        item.newsId === updatedData.newsId ? updatedData : item
      );
      setNews(updatedBannerList);
      setUserData({ newsName: "", description: "", fileName: "" });
      FetchData();
      setOpen(false); // Close the dialog
      setRefreshTrigger((prev) => !prev); // Trigger a refresh
    }
  };

  //File Upload
  const onFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setFileError("Please select a file");
      return;
    }

    const data = new FormData();
    data.append("file", selectedFile);
    setUserData({ ...userdata, fileName: fileName });

    await axios({
      origin: "*",
      method: "post",
      url: `${BaseUrl}/file/uploadFile`,
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + user.accessToken,
      },
      data,
    })
      .then(function (res) {
        console.log(res);
        setFileName(res.data.fileName);
        alert(res.data.message);
        setUserData({ ...userdata, fileName: fileName });
        setFileError("");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onFileChange = (e) => {
    setFileName(e.target.files[0].name);
    setselectedFile(e.target.files[0]);
    if (!selectedFile) {
      // alert("image is selected");
      return false;
    }
  };

  //Get ALl Data
  const FetchData = async () => {
    let res = await fetchNews(headers);
    console.log(res.data.content);
    var fetchedData = res.data.content;

    if (fetchedData) {
      var tabledata = fetchedData.map((p) => ({
        newsId: p.newsId,
        newsName: p.newsName,
        description: p.description,
        file:
          p.filePath === null ? (
            "NO IMAGE FOUND"
          ) : (
            <img
              src={ImageUrl + p.filePath}
              alt={p.fileName}
              style={{ width: 100, height: 50 }}
            />
          ),
        insertedDate: moment(p.insertedDate).format("L"),
        updatedDate: moment(p.insertedDate).format("L"),
        createdBy: p.createdBy ? p.createdBy.userName : "No User",
        updatedBy: p.updatedBy ? p.updatedBy.userName : "No User",
      }));
      setNews(tabledata);
    } else {
      setNews([]);
    }
  };

  //Post Data
  const postdata = (e) => {
    e.preventDefault();

    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log(userdata);
      addNews(userdata, headers);
      setUserData({ newsName: "", description: "" });
      inputRef.current.value = null;
      setRefreshTrigger((prev) => !prev); // Trigger a refresh
      setOpen(false);
      FetchData();
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          "@media (max-width: 600px)": {
            width: "270px", // Styles for mobile view
          },
          "@media (min-width: 601px) and (max-width: 1200px)": {
            width: "680px", // Styles for tablet view (adjust the range and width as needed)
          },
          height: { md: "75vh", xs: "85vh", sm: "83.7vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          News
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">News</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add News
        </Button>
        <TableContainer
          sx={{
            overflowX: "auto",
            marginTop: "20px",
            border: "1px solid lightGray",
            borderRadius: "20px",
            "@media(max-width:600px)": {
              width: "100%",
            },
          }}
          component={Paper}
        >
          <Table>
            <TableHead
              sx={{
                "& th, & td": {
                  textAlign: "center",
                  fontSize: "16px",
                },
              }}
            >
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Description</b>
                </TableCell>
                <TableCell>
                  <b>File</b>
                </TableCell>
                <TableCell>
                  <b>Created By</b>
                </TableCell>
                <TableCell>
                  <b>Updated By</b>
                </TableCell>
                <TableCell>
                  <b>Inserted Date</b>
                </TableCell>
                <TableCell>
                  <b>Updated Date</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& th, & td": {
                  textAlign: "center",
                },
              }}
            >
              {news.map((p) => (
                <TableRow key={p.newsId}>
                  <TableCell>{p.newsId}</TableCell>
                  <TableCell>{p.newsName}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.file}</TableCell>
                  <TableCell>{p.createdBy}</TableCell>
                  <TableCell>{p.updatedBy}</TableCell>
                  <TableCell>{p.insertedDate}</TableCell>
                  <TableCell>{p.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(p.newsId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton>
                      <DeleteForever
                        sx={{ color: Colors.danger }}
                        onClick={() => {
                          handleDelete(p.newsId);
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle sx={{ background: "whiteSmoke" }}>
            {" "}
            {editMode ? "Edit News" : "Add News"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="News Name"
                    name="newsName"
                    value={userdata.newsName}
                    onChange={changehandler}
                    error={!!errors.newsName}
                    helperText={errors.newsName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={userdata.description}
                    onChange={changehandler}
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="file"
                    label="Select Photo"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => onFileChange(e)}
                    accept=".pdf, .jpg, .png"
                    ref={inputRef}
                  />
                  {fileError && (
                    <Typography variant="caption" color="error">
                      {fileError}
                    </Typography>
                  )}
                </Grid>
                <Button variant="primary" onClick={onFileUpload} type="submit">
                  Upload
                </Button>
              </Grid>

              <DialogActions>
                <Button
                  onClick={(e) => {
                    if (editMode) {
                      updatedata(e);
                      setOpen(false);
                    } else {
                      postdata(e);
                    }
                  }}
                >
                  {editMode ? "Save Edit" : "Save"}
                </Button>
                <Button onClick={() => setOpen(false)} autoFocus>
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </Container>
        </Dialog>
      </Box>
    </>
  );
}
