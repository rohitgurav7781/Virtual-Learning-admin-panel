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
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  fabClasses,
} from "@mui/material";

import { Colors } from "../../styles/theme";

import moment from "moment/moment";
import { BaseUrl } from "../../BaseUrl";
import axios from "axios";
import {
  PostCourseTopic,
  deleteTopic,
  fetchTopic,
  getTopicById,
  updatedTopic,
} from "../API's/CourseTopicApi";
import { fetchModule } from "../API's/CourseModuleApi";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";

export default function CourseTopic() {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    topicName: "",
    description: "",
    url: "",
    videoUrl: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [topicId, setTopicId] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [fileError, setFileError] = useState("");

  const [selectedModule, setSelectedModule] = useState({
    value: "0",
    label: "Select.....",
  });
  const [moduleError, setModuleError] = useState(false);
  const [module, setModule] = useState([]);
  const [topic, setTopic] = useState([]);

  useEffect(() => {
    FetchModule();
    FetchData();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setInitialValues({
      id: "",
      topicName: "",
      description: "",
      url: "",
      videoUrl: "",
      fileName: "",
      createdBy: "",
      insertedDate: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    topicName: "",
    description: "",
    url: "",
    videoUrl: "",
  });

  const [errors, setErrors] = useState({});

  const [fileName, setFileName] = useState("");
  const [selectedFile, setselectedFile] = useState("");
  const inputRef = useRef(null);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const validateform = () => {
    const newErrors = {};

    if (!userdata.topicName || userdata.topicName.trim() === "") {
      newErrors.topicName = "Enter the topic Name";
    }

    if (!userdata.description || userdata.description.trim() === "") {
      newErrors.description = "Enter the description";
    }

    if (!userdata.url || userdata.url.trim() === "") {
      newErrors.url = "Enter the url";
    }

    if (!userdata.videoUrl || userdata.videoUrl.trim() === "") {
      newErrors.videoUrl = "Enter the videoUrl";
    }

    if (!userdata.fileName || userdata.fileName.trim() === "") {
      newErrors.fileName = "Select the fileName ";
    }

    if (!userdata.moduleDtoList || userdata.moduleDtoList.moduleId === "0") {
      newErrors.moduleDtoList = "Select a Module";
      setModuleError(true); // Set the error for the select input
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

  //File Upload
  const onFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setFileError("Please select a file");
      return;
    }

    const data = new FormData();
    data.append("file", selectedFile);
    setUserData({ ...userdata, fileDownloadUri: fileName });

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

  //todo==> Fetch Module
  const FetchModule = async () => {
    let res = await fetchModule(headers);
    var down = res.data.content;

    var mdata = down.map((m) => {
      return { value: m.moduleId, label: m.moduleName };
    });
    console.log(mdata);
    setModule(mdata);
  };

  const handleModulechange = async (value) => {
    setSelectedModule(value);
    setModuleError(false);
    console.log(value);
    setUserData({
      ...userdata,
      moduleDtoList: {
        moduleId: value,
      },
    });
  };

  //Get ALl Data
  const FetchData = async () => {
    let res = await fetchTopic(headers);
    console.log(res.data.content);
    var fetchedData = res.data.content;

    if (fetchedData) {
      var tabledata = fetchedData.map((p) => ({
        topicId: p.topicId,
        topicName: p.topicName,
        description: p.description,
        moduleName: p.moduleDtoList?.moduleName || "No Module ",
        url: p.url,
        videoUrl: p.videoUrl,
        fileName:
          p.fileName === null ? (
            "NO IMAGE FOUND"
          ) : (
            <img
              src={ImageUrl + p.fileName}
              alt={p.fileName}
              style={{ width: 100, height: 50 }}
            />
          ),
        insertedDate: moment(p.insertedDate).format("L"),
        updatedDate: moment(p.insertedDate).format("L"),
        createdBy: p.createdBy ? p.createdBy.userName : "No User",
        updatedBy: p.updatedBy ? p.updatedBy.userName : "No User",
      }));
      setTopic(tabledata);
      console.log(tabledata);
    } else {
      //  setAdvertisement([]);
    }
  };

  //Edit Banner
  const handleEdit = async (topicId) => {
    setEditMode(true);
    setOpen(true);
    let res = await getTopicById(topicId, headers);
    console.log(res.data);
    let det = res.data;

    setTopicId(det.topicId);
    setUserData({
      topicName: det.topicName,
      description: det.description,
      fileName: det.fileName,
      videoUrl: det.videoUrl,
      url: det.url,
    });

    FetchData();
  };

  //Update topic
  const updatedata = async (e) => {
    e.preventDefault();
    var updatedData = {
      ...userdata,
      topicId,
      updatedBy: { userId: user.userId },
    };
    console.log(updatedData);

    const res = await updatedTopic(updatedData, headers);
    console.log(res);

    // Update the state with the updated data
    const updatedBannerList = topic.map((item) =>
      item.topicId === updatedData.topicId ? updatedData : item
    );
    setTopicId(updatedBannerList);
    setUserData({ topicName: "", description: "", fileName: "" });
    setOpen(false); // Close the dialog
    FetchData();
  };

  //Delete Topic
  const handleDelete = async (topicId) => {
    await deleteTopic(topicId, headers);
    FetchData();
  };

  //Post Data
  const postdata = (e) => {
    e.preventDefault();

    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log(userdata);
      PostCourseTopic(userdata, headers);
      //setUserData({ topicName: "", description: "", });
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
          height: { md: "90vh", xs: "68vh", sm: "83.6vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Topic
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/course-menu">
            Course-Menu
          </Link>
          <Typography color="#51678f">Topic</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Course-Topic
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
                  <b>Module</b>
                </TableCell>
                <TableCell>
                  <b>File</b>
                </TableCell>
                <TableCell>
                  <b>Url</b>
                </TableCell>
                <TableCell>
                  <b>Video</b>
                </TableCell>
                <TableCell>
                  <b>Created By</b>
                </TableCell>
                <TableCell>
                  <b>Updated By</b>
                </TableCell>
                <TableCell>
                  <b>Created Date</b>
                </TableCell>
                <TableCell>
                  <b>Updated Date</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
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
              {topic.map((t) => (
                <TableRow key={t.topicId}>
                  <TableCell>{t.topicId}</TableCell>
                  <TableCell>{t.topicName}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.moduleName}</TableCell>
                  <TableCell>{t.fileName}</TableCell>
                  <TableCell>{t.url}</TableCell>
                  <TableCell>
                    {t.videoUrl && (
                      <iframe
                        title="YouTube Video"
                        src={`https://www.youtube.com/embed/${t.videoUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        width="170px"
                        height="100px"
                      >
                        Watch Video
                      </iframe>
                    )}
                  </TableCell>
                  <TableCell>{t.createdBy}</TableCell>
                  <TableCell>{t.updatedBy}</TableCell>
                  <TableCell>{t.insertedDate}</TableCell>
                  <TableCell>{t.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(t.topicId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton>
                      <DeleteForever
                        sx={{ color: Colors.danger }}
                        onClick={() => {
                          handleDelete(t.topicId);
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} maxWidth="md">
          <DialogTitle sx={{ background: "whiteSmoke" }}>
            {" "}
            {editMode ? "Edit Course-Topic" : "Add Course-Topic"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Topic Name"
                    name="topicName"
                    value={userdata.topicName}
                    onChange={changehandler}
                    error={!!errors.topicName}
                    helperText={errors.topicName}
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
                    label="Url"
                    name="url"
                    value={userdata.url}
                    onChange={changehandler}
                    error={!!errors.url}
                    helperText={errors.url}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Video Url"
                    name="videoUrl"
                    value={userdata.videoUrl}
                    onChange={changehandler}
                    error={!!errors.videoUrl}
                    helperText={errors.videoUrl}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="file"
                    label="Select File"
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

                  <Button onClick={onFileUpload} type="submit">
                    Upload
                  </Button>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={moduleError}>
                    <InputLabel>Module</InputLabel>
                    <Select
                      value={selectedModule}
                      onChange={(e) => {
                        handleModulechange(e.target.value);
                      }}
                    >
                      {module.map((mod) => (
                        <MenuItem key={mod.value} value={mod.value}>
                          {mod.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {moduleError ? "Please select Module" : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
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
