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
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { Colors } from "../../styles/theme";
import Paper from "@mui/material/Paper";
import moment from "moment/moment";
import {
  PostBatchModule,
  deleteBatchModule,
  fetchBatchModule,
  getCourses,
  getModuleById,
  updateModuleData,
} from "../API's/BatchModuleApi";
import { Link } from "react-router-dom";

export default function BatchModule() {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    moduleName: "",
    description: "",
  });

  const [course, setCourse] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [module, setModule] = useState([]);
  const [batchModuleId, setBatchModuleId] = useState();

  const [selectedCourses, setSelectedCourses] = useState({
    value: "0",
    label: "Select.....",
  });
  const [courseError, setCoursesError] = useState(false);

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

  useEffect(() => {
    FetchData();
    FetchCourse();
  }, [refreshTrigger]);

  const handleAddBatchModule = () => {
    setInitialValues({
      moduleName: "",
      description: "",
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
      newErrors.moduleName = "Enter the Promo name";
    }

    if (!userdata.description || userdata.description.trim() === "") {
      newErrors.description = "Enter the product description";
    }

    // Add validation for the selected Course
    if (
      !userdata.batchCourseDtoList ||
      userdata.batchCourseDtoList.batchCourseId === "0"
    ) {
      newErrors.batchCourseDtoList = "Select a course";
      setCoursesError(true); // Set the error for the select input
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

  //! OnChange for COURSE(DROPDOWN)
  const handleCourseChange = (event) => {
    const value = event.target.value;
    const selectedCourse = course.find((c) => c.value === value);
    setSelectedCourses({ value, label: selectedCourse.label });
    setCoursesError(false);
    console.log(value);
    setUserData({
      ...userdata,
      batchCourseDtoList: [
        {
          batchCourseId: value,
          courseName: selectedCourse ? selectedCourse.label : "",
        },
      ],
    });
  };

  const FetchCourse = async () => {
    let res = await getCourses(headers);

    var downn = res.data.content;

    var mdata = downn.map((c) => {
      return { value: c.batchCourseId, label: c.courseName };
    });
    console.log(mdata);
    setCourse(mdata);
  };

  const handleEdit = async (batchModuleId) => {
    setEditMode(true);
    setOpen(true);
    let res = await getModuleById(headers, batchModuleId);
    console.log(res);

    console.log(batchModuleId);

    let det = res.data;

    setBatchModuleId(det.batchModuleId);
    const selectedCourse =
      det.batchCourseDtoList && det.batchCourseDtoList.length > 0
        ? det.batchCourseDtoList[0]
        : { batchCourseId: "0", courseName: "Select....." };

    setUserData({
      moduleName: det.moduleName,
      description: det.description,
      batchCourseDtoList: [selectedCourse],
    });
    setSelectedCourses({
      value: selectedCourse.batchCourseId,
      label: selectedCourse.courseName,
    });
    FetchData();
  };

  // todo==> UPDATE Module
  const updatedata = async (e) => {
    e.preventDefault();
    //  console.log(userdata);
    console.log(batchModuleId);

    const { createdBy, ...updatedUserData } = userdata;

    var updateddata = {
      ...updatedUserData,
      batchModuleId,
      updatedBy: { userId: user.userId },
    };
    // console.log(updateddata);
    const resp = await updateModuleData(headers, updateddata);
    //console.log(resp);
    FetchData();
  };

  const handleDelete = async (id) => {
    await deleteBatchModule(headers, id);
    FetchData();
  };

  const FetchData = async () => {
    let res = await fetchBatchModule(headers);
    console.log(res.data.content);

    var fetcheddata = res.data.content;

    const tableData = [];

    if (fetcheddata) {
      fetcheddata.map((m) => {
        const courseName =
          m.batchCourseDtoList && m.batchCourseDtoList.length > 0
            ? m.batchCourseDtoList[0].courseName
            : "No Courses";

        tableData.push({
          batchModuleId: m.batchModuleId,
          moduleName: m.moduleName,
          description: m.description,
          courseName: courseName,
          createdBy: m.createdBy ? m.createdBy.userName : "No User",
          updatedBy: m.updatedBy ? m.updatedBy.userName : "No User",
          insertedDate: moment(m.insertedDate).format("L"),
          updatedDate: moment(m.updatedDate).format("L"),
        });
      });
      console.log(tableData);
      setModule(tableData);
    } else {
    }
  };

  //todo ==> POST Batch-Module DATA
  const postdata = async (e) => {
    e.preventDefault();
    const formErrros = validateform();
    if (Object.keys(formErrros).length > 0) {
      setErrors(formErrros);
    } else {
      // console.log(headers);
      await PostBatchModule(userdata, headers).then(() => {
        setUserData({ moduleName: "", description: "" });

        console.log(userdata);
        setRefreshTrigger((prev) => !prev); // Trigger a refresh
        setOpen(false);
      });
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
          Batch-Module
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/batch-menu">
            Batch Menu
          </Link>
          <Typography color="#51678f">Batch-Module</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddBatchModule}
        >
          {" "}
          Add Batch-Module
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
              {(rowsPerPage > 0
                ? module.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : module
              ).map((m) => (
                <TableRow key={m.batchModuleId}>
                  <TableCell>{m.batchModuleId}</TableCell>
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
                        handleEdit(m.batchModuleId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(m.batchModuleId);
                      }}
                    >
                      <DeleteForever sx={{ color: "red" }} />
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
            {editMode ? "Edit Batch-Module" : "Add Batch-Module"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="description"
                    name="description"
                    value={userdata.description}
                    onChange={changehandler}
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth error={courseError}>
                    <InputLabel>Courses</InputLabel>
                    <Select
                      value={selectedCourses.value}
                      onChange={handleCourseChange}
                    >
                      {course.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {courseError ? "Please select a Course" : ""}
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
