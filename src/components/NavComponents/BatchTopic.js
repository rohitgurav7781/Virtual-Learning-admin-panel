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
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { Colors } from "../../styles/theme";
import Paper from "@mui/material/Paper";
import moment from "moment/moment";

import { BaseUrl } from "../../BaseUrl";
import axios from "axios";
import {
  PostBatchTopic,
  deleteBatchTopic,
  fetchBatchTopic,
  getModule,
  getTopicById,
  updateTopicData,
} from "../API's/BatchTopicApi";
import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function BatchTopic() {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    topicName: "",
    description: "",
    url: "",
    videoUrl: "",
  });
  const [topic, setTopic] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [batchTopicId, setBatchTopicId] = useState();
  const [module, setModule] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [selectedModule, setSelectedModule] = useState({
    value: "0",
    label: "Select.....",
  });
  const [moduleError, setModuleError] = useState(false);

  useEffect(() => {
    FetchModule();
    FetchData();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setInitialValues({
      topicName: "",
      description: "",
      url: "",
      videoUrl: "",
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
  const [fileError, setFileError] = useState("");
  const [selectedFile, setselectedFile] = useState("");
  const inputRef = useRef(null);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // You can adjust the number of rows per page

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, module.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

    // Add validation for the selected module
    if (
      !userdata.batchModuleDto ||
      userdata.batchModuleDto.batchModuleId === "0"
    ) {
      newErrors.batchModuleDto = "Select a Module";
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

  //todo==> Fetch Module
  const FetchModule = async () => {
    let res = await getModule(headers);
    var down = res.data.content;

    var mdata = down.map((m) => {
      return { value: m.batchModuleId, label: m.moduleName };
    });
    console.log(mdata);
    setModule(mdata);
  };

  const handleModulechange = async (value) => {
    const selectedModuleObj = module.find((l) => l.value === value);
    setSelectedModule(selectedModuleObj);
    console.log(value);
    setModuleError(false);
    setUserData({
      ...userdata,
      batchModuleDto: {
        batchModuleId: value,
      },
    });
  };

  //Delete Topic
  const handleDelete = async (batchTopicId) => {
    await deleteBatchTopic(headers, batchTopicId);
    FetchData();
  };

  //Edit Topic
  const handleEdit = async (batchTopicId) => {
    setEditMode(true);
    setOpen(true);
    let res = await getTopicById(headers, batchTopicId);
    console.log(res.data);
    let det = res.data;

    // Handle null or undefined values for select input
    const selectedModuleObj = det.batchModuleDto
      ? module.find((b) => b.value === det.batchModuleDto.batchModuleId)
      : null;

    setBatchTopicId(det.batchTopicId);
    setUserData({
      topicName: det.topicName,
      description: det.description,
      url: det.url,
      videoUrl: det.videoUrl,

      batchModuleDto: {
        batchModuleId: det.batchModuleDto
          ? det.batchModuleDto.batchModuleId
          : "",
      },
    });
    setSelectedModule(
      selectedModuleObj || { value: "0", label: "Select....." }
    );
    FetchData();
  };

  //Update Topic
  const updatedata = async (e) => {
    e.preventDefault();
    var updatedData = {
      ...userdata,
      batchTopicId,
      updatedBy: { userId: user.userId },
    };
    console.log(updatedData);

    const res = await updateTopicData(headers, updatedData);
    // console.log(res);

    if (res) {
      // Update the state with the updated data
      const updatedTopicList = batchTopicId.map((item) =>
        item.batchTopicId === updatedData.batchTopicId ? updatedData : item
      );
      setBatchTopicId(updatedTopicList);
      setUserData({ topicName: "", description: "" });
      setOpen(false); // Close the dialog
      // setRefreshTrigger((prev) => !prev); // Trigger a refresh
      FetchData();
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
    let res = await fetchBatchTopic(headers);
    console.log(res.data.content);
    var fetchedData = res.data.content;

    if (fetchedData) {
      var tabledata = fetchedData.map((p) => ({
        batchTopicId: p.batchTopicId,
        topicName: p.topicName,
        description: p.description,
        url: p.url,
        videoUrl: p.videoUrl,
        file:
          p.fileName === null ? (
            "NO IMAGE"
          ) : (
            <img
              src={ImageUrl + p.fileName}
              alt={p.fileName}
              style={{ width: 100, height: 50 }}
            />
          ),
        moduleName: p.batchModuleDto?.moduleName || "No Module ",
        insertedDate: moment(p.insertedDate).format("L"),
        updatedDate: moment(p.insertedDate).format("L"),
        createdBy: p.createdBy ? p.createdBy.userName : "No User",
        updatedBy: p.updatedBy ? p.updatedBy.userName : "No User",
      }));
      setTopic(tabledata);
    } else {
      //setTopic([]);
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
      PostBatchTopic(userdata, headers);
      setUserData({ topicName: "", description: "", url: "", videoUrl: "" });
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
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Batch-Topic
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/batch-menu">
            Batch Menu
          </Link>
          <Typography color="#51678f">Batch-Topic</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Batch-Topic
        </Button>
        <TableContainer
          sx={{
            overflowX: "auto",
            marginTop: "20px",
            borderRadius: "20px",
            border: "1px solid lightGray",
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
              {(rowsPerPage > 0
                ? topic.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : module
              ).map((t) => (
                <TableRow key={t.batchTopicId}>
                  <TableCell>{t.batchTopicId}</TableCell>
                  <TableCell>{t.topicName}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.moduleName}</TableCell>
                  <TableCell>{t.file}</TableCell>
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
                        handleEdit(t.batchTopicId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton>
                      <DeleteForever
                        sx={{ color: Colors.danger }}
                        onClick={() => {
                          handleDelete(t.batchTopicId);
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={12} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={module.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog open={open} maxWidth="md">
          <DialogTitle sx={{ background: "whiteSmoke" }}>
            {" "}
            {editMode ? "Edit Batch-Topic" : "Add Batch-Topic"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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

                <Grid item xs={12}>
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

                <Grid item xs={12}>
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

                <Grid item xs={12}>
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

                <Grid item xs={12}>
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
                </Grid>
                <Button onClick={onFileUpload} type="submit">
                  Upload
                </Button>

                <Grid item xs={12}>
                  <FormControl fullWidth error={moduleError}>
                    <InputLabel>Module</InputLabel>
                    <Select
                      value={selectedModule.value || ""}
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
