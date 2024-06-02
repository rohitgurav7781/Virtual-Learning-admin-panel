import React, { useEffect, useState } from "react";
import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import "../CSS/Promo.css";
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
} from "@mui/material";

import { Colors } from "../../styles/theme";
import moment from "moment/moment";
import { batchCourse } from "../API's/CourseApi";
import {
  PostCourseModule,
  deleteModule,
  fetchModule,
  getModuleById,
  updatedModule,
} from "../API's/CourseModuleApi";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Footer from "./Footer";

export default function CourseModule() {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    id: "",
    moduleName: "",
    description: "",
    youTube: "",
    createdBy: "",
    insertedDate: "",
  });
  const [module, setModule] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [moduleId, setModuleId] = useState();

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [courses, setCourses] = useState([]);

  const [selectedCourses, setSelectedCourses] = useState({
    value: "0",
    label: "Select.....",
  });
  const [courseError, setCourseError] = useState(false);

  useEffect(() => {
    FetchCourses();
    FetchData();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setInitialValues({
      id: "",
      moduleName: "",
      description: "",
      youTube: "",
      createdBy: "",
      insertedDate: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    moduleName: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const validateform = () => {
    const newErrors = {};

    if (!userdata.moduleName || userdata.moduleName.trim() === "") {
      newErrors.moduleName = "Enter the moduleName";
    }

    if (!userdata.description || userdata.description.trim() === "") {
      newErrors.description = "Enter the  description";
    }

    if (!userdata.courseDtoList || userdata.courseDtoList.courseId === "0") {
      newErrors.courseDtoList = "Select a Course";
      setCourseError(true); // Set the error for the select input
    }

    return newErrors;
  };

  const setField = (field) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  //!onchange for submit data
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

  // to get Courses
  const FetchCourses = async () => {
    let resp = await batchCourse(headers);
    console.log(resp.data.content);
    if (resp.data && Array.isArray(resp.data.content)) {
      var down = resp.data.content;
      var mdataa = down.map((c) => {
        return { value: c.courseId, label: c.courseName };
      });
      console.log(mdataa);
      setCourses(mdataa);
    } else {
      console.error(
        "Invalid data structure returned by batchCourse:",
        resp.data
      );
      // Handle the error or set an appropriate default value for setCourses
    }
  };

  //! OnChange for Module(DROPDOWN)
  const handleCourseChange = (value) => {
    setSelectedCourses(value);
    setCourseError(false);
    console.log(value);
    setUserData({
      ...userdata,
      courseDtoList: [
        {
          courseId: value,
        },
      ],
    });
  };

  //Get Module Data
  const FetchData = async () => {
    let res = await fetchModule(headers);

    // Assuming res.content is where your data is stored
    var fetchedData = res.data.content;

    // console.log(fetchedData);

    var tabledata = fetchedData.map((p) => ({
      moduleId: p.moduleId,
      moduleName: p.moduleName,
      description: p.description,

      courseName: p.courseDtoList?.[0]?.courseName || "No courseName",
      insertedDate: moment(p.insertedDate).format("L"),
      createdBy: p.createdBy ? p.createdBy.userName : "No User",
      updatedBy: p.updatedBy ? p.updatedBy.userName : "No User",
      updatedDate: moment(p.updatedDate).format("L"),
    }));

    setModule(tabledata);
  };

  //todo ==> GET DATA BY Module ID
  const handleEdit = async (moduleId) => {
    //  console.log(id);
    setEditMode(true); // Set editMode to true
    setOpen(true);
    var res = await getModuleById(moduleId, headers);
    console.log(res);

    let det = res.data;
    setModuleId(det.moduleId);
    setUserData({
      moduleName: det.moduleName,
      description: det.description,
    });
  };

  // todo==> UPDATE Module
  const updatedata = async (e) => {
    e.preventDefault();
    //  console.log(userdata);
    console.log(moduleId);
    var updateddata = {
      ...userdata,
      moduleId,
      updatedBy: { userId: user.userId },
    };
    //  console.log(updateddata)
    const resp = await updatedModule(updateddata, headers);
    console.log(resp);
    FetchData();
  };

  //todo ==> DELETE  Course-Module DATA
  const handleDelete = async (moduleId) => {
    await deleteModule(moduleId, headers);
    FetchData();
  };

  //todo ==> POST Module DATA
  const postdata = async (e) => {
    e.preventDefault();
    const formErrros = validateform();
    if (Object.keys(formErrros).length > 0) {
      setErrors(formErrros);
    } else {
      await PostCourseModule(userdata, headers);
      setUserData({
        moduleName: "",
        description: "",
        courseName: selectedCourses.value,
      });
      console.log(userdata);
      setRefreshTrigger((prev) => !prev); // Trigger a refresh
      setOpen(false);
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
          height: { md: "80vh", xs: "75vh", sm: "83.7vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Module
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/course-menu">
            Course-Menu
          </Link>
          <Typography color="#51678f">Module</Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Course-Module
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
                  <b>Courses</b>
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
              {module.map((m) => (
                <TableRow key={m.moduleId}>
                  <TableCell>{m.moduleId}</TableCell>
                  <TableCell>{m.moduleName}</TableCell>
                  <TableCell>{m.description}</TableCell>
                  <TableCell>{m.courseName}</TableCell>
                  <TableCell>{m.createdBy}</TableCell>
                  <TableCell>{m.updatedBy}</TableCell>
                  <TableCell>{m.insertedDate}</TableCell>
                  <TableCell>{m.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(m.moduleId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(m.moduleId);
                      }}
                    >
                      <DeleteForever sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle sx={{ background: "whiteSmoke" }}>
            {editMode ? "Edit Promo" : "Add Course-Module"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Module Name"
                    name="moduleName"
                    value={userdata.moduleName}
                    onChange={changehandler}
                    error={!!errors.moduleName}
                    helperText={errors.moduleName}
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
                  <FormControl fullWidth error={courseError}>
                    <InputLabel>Select Courses</InputLabel>
                    <Select
                      value={selectedCourses}
                      onChange={(e) => handleCourseChange(e.target.value)}
                    >
                      {courses.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {courseError ? "Please select Course" : ""}
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
