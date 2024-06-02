import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
  FormControlLabel,
  MenuItem,
  Avatar,
  Breadcrumbs,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "../../styles/theme";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import TablePagination from "@mui/material/TablePagination";
import {
  PostCourse,
  batchCourse,
  deleteCourse,
  getCourseById,
  updatedCourse,
} from "../API's/CourseApi";

import { getCategories, getLanguages } from "../API's/BatchTwoApi";
import moment from "moment";
import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function CourseMain() {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    courseName: "",
    description: "",
    courseMrp: "",
    sellingPrice: "",
    discount: "",
    handlingFee: "",
    position: "",
    videoUrl: "",
    subscriptionDays: "",
    trailPeriod: "",
  });
  const [userdata, setUserData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [productId, setProductId] = useState();

  const [editMode, setEditMode] = useState(false); // Add this state variable
  const [products, setProducts] = useState([]);
  const [course, setCourse] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(5); // You can adjust the number of rows per page

  // const emptyRows =
  //   rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  //! initiazing state for roles

  const [category, setCategory] = useState([]);
  const [language, setLanguage] = useState([]);

  const [courseId, setCourseId] = useState();

  const [categoryId, setCategoryId] = useState();

  const [selectedCategory, setSelectedCategory] = useState({
    value: "0",
    label: "Select.....",
  });
  const [categoryError, setCategoryError] = useState(false);

  const [selectedLang, setSelectedLang] = useState({
    value: "0",
    label: "Select......",
  });
  const [langaugeError, setLangaugeError] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const handleAddCourse = () => {
    setInitialValues({
      courseName: "",
      description: "",
      courseMrp: "",
      sellingPrice: "",
      discount: "",
      handlingFee: "",
      position: "",
      videoUrl: "",
      subscriptionDays: "",
      trailPeriod: "",
    });
    setOpen(true);
  };

  //!onchange for submit data
  const changehandler = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value,
      createdBy: { userId: user.userId },
    });

    // Set errors for the field being changed
    setErrors({
      ...errors,
      [e.target.name]: null, // Clear any previous error for this field
    });
  };

  //!form validation
  const validateform = () => {
    const newErrors = {};

    if (!userdata.courseName || userdata.courseName === "") {
      newErrors.courseName = "Enter product name";
    }

    if (!userdata.courseMrp || userdata.courseMrp === "") {
      newErrors.courseMrp = "Enter product mrp";
    }

    if (!userdata.sellingPrice || userdata.sellingPrice === "") {
      newErrors.sellingPrice = "Enter selling cost";
    }

    if (!userdata.description || userdata.description === "") {
      newErrors.description = "Enter description";
    }

    if (!userdata.discount || userdata.discount === "") {
      newErrors.discount = "Enter discount";
    }

    if (!userdata.handlingFee || userdata.handlingFee === "") {
      newErrors.handlingFee = "Enter handlingFee";
    }

    if (!userdata.position || userdata.position === "") {
      newErrors.position = "Enter position";
    }

    if (!userdata.videoUrl || userdata.videoUrl === "") {
      newErrors.videoUrl = "Enter videoUrl";
    }

    if (!userdata.subscriptionDays || userdata.subscriptionDays === "") {
      newErrors.subscriptionDays = "Enter subscription Days";
    }

    if (!userdata.trailPeriod || userdata.trailPeriod === "") {
      newErrors.trailPeriod = "Enter trail Period";
    }

    if (!userdata.categoryId || userdata.categoryId.categoryId === "0") {
      newErrors.categoryId = "Select a Category";
      setCategoryError(true); // Set the error for the select input
    }
    if (
      !userdata.courseLanguageDto ||
      userdata.courseLanguageDto.languageId === "0"
    ) {
      newErrors.courseLanguageDto = "Select a Language";
      setLangaugeError(true); // Set the error for the select input
    }
    return newErrors;
  };

  //!setFiled
  const setField = (field) => {
    if (!!errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  //!Download image file
  const ImageUrl =
    "https://virtullearning.cloudjiffy.net/ecommerce/file/downloadFile/?filePath=";

  //!useEffect
  useEffect(() => {
    FetchCategory();
    FetchLangauage();
    FetchData();
  }, [refreshTrigger]);

  // to get CATEGORIES
  const FetchCategory = async () => {
    let resp = await getCategories(headers);
    var down = resp.data;
    var mdataa = down.map((c) => {
      return { value: c.categoryId, label: c.categoryName };
    });
    console.log(mdataa);
    setCategory(mdataa);
  };

  //! OnChange for CATEGORY(DROPDOWN)
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCategoryError(false);
    console.log(value);
    setUserData({
      ...userdata,
      categoryId: value,
      courseCategoryDto: {
        categoryId: value,
      },
    });
  };

  // to get Languages
  const FetchLangauage = async () => {
    let response = await getLanguages(headers);

    var downnn = response.data;
    var mdatta = downnn.map((l) => {
      return { value: l.languageId, label: l.languageName };
    });
    console.log(mdatta);
    setLanguage(mdatta);
  };

  //! OnChange for LANGUAGES
  const handleLanguageChange = (value) => {
    setSelectedLang(value);
    setLangaugeError(false);
    console.log(value);
    setUserData({
      ...userdata,
      courseLanguageDto: {
        languageId: value,
      },
    });
  };

  //todo Fetch Course Data
  const FetchData = async () => {
    let response = await batchCourse(headers);

    var bdata = response.data.content;
    var tableArry = [];
    bdata.map((p) => {
      // console.log(p);
      tableArry.push({
        courseId: p.courseId,
        courseName: p.courseName,
        categoryName: p.courseCategoryDto?.categoryName || "No Category",
        languageName: p.courseLanguageDto?.languageName || "NO Language",
        courseMrp: p.courseMrp,
        handlingFee: p.handlingFee,
        position: p.position,
        videoUrl: p.videoUrl,
        position: p.position,
        discount: p.discount,
        courseMrp: p.courseMrp,
        sellingPrice: p.sellingPrice,
        description: p.description,
        subscriptionDays: p.subscriptionDays,
        trailPeriod: p.trailPeriod,
        createdBy: p.createdBy ? p.createdBy.userName : "No User",
        updatedBy: p.updatedBy ? p.updatedBy.userName : "No User",
        insertedDate: moment(p.insertedDate).format("L"),
        updatedDate: moment(p.updatedDate).format("L"),
      });
    });

    console.log(tableArry);
    setCourse(tableArry);
  };

  //Edit Course
  const handleEdit = async (courseId) => {
    setEditMode(true);
    setOpen(true);
    let res = await getCourseById(courseId, headers);
    console.log(res.data);
    let det = res.data;

    setCourseId(det.courseId);
    setUserData({
      courseName: det.courseName,
      description: det.description,
      position: det.position,
      courseMrp: det.courseMrp,
      discount: det.discount,
      sellingPrice: det.sellingPrice,
      handlingFee: det.handlingFee,
      trailPeriod: det.trailPeriod,
      subscriptionDays: det.subscriptionDays,
      videoUrl: det.videoUrl,
    });

    FetchData();
  };

  //Update Course
  const updatedata = async (e) => {
    e.preventDefault();
    var updatedData = {
      ...userdata,
      courseId,
      updatedBy: { userId: user.userId },
    };
    console.log(updatedData);

    const res = await updatedCourse(updatedData, headers);
    console.log(res);

    if (res) {
      // Update the state with the updated data
      const updatedBannerList = course.map((item) =>
        item.courseId === updatedData.courseId ? updatedData : item
      );
      setCourse(updatedBannerList);
      setUserData({
        courseName: "",
        description: "",
        courseMrp: "",
        sellingPrice: "",
        discount: "",
        handlingFee: "",
        position: "",
        videoUrl: "",
        subscriptionDays: "",
      });
      setOpen(false); // Close the dialog
      FetchData();
      setRefreshTrigger((prev) => !prev); // Trigger a refresh
    }
  };

  //Delete Course
  const handleDelete = async (courseId) => {
    await deleteCourse(courseId, headers);
    FetchData();
  };

  //todo ==> POST Course DATA
  const postdata = async (e) => {
    e.preventDefault();
    const formErrors = validateform();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log(userdata);
      await PostCourse(userdata, headers);
      setUserData({
        ...userdata,
        courseName: "",
        description: "",
        courseMrp: "",
        sellingPrice: "",
        discount: "",
        handlingFee: "",
        position: "",
        videoUrl: "",
        subscriptionDays: "",
        trailPeriod: "",
        //categoryName: selectedCategory.value,
      });
      setSelectedCategory({ value: "0" });
      setSelectedLang({ value: "0" });
      setCategoryId(true);
      setRefreshTrigger((prev) => !prev); // Trigger a refresh
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          overflow: "auto",
          "@media (max-width: 600px)": {
            width: "270px", // Styles for mobile view
          },
          "@media (min-width: 600px) and (max-width: 1200px)": {
            width: "900px", // Styles for tablet view
          },
          //height: { md: "200vh", xs: "240vh", sm: "83.7vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Course
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/course-menu">
            Course Menu
          </Link>
          <Typography color="#51678f">Course</Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddCourse}
        >
          {" "}
          Add Course
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
          <Table striped border hover responsive>
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
                  <b>Category</b>
                </TableCell>
                <TableCell>
                  <b>Language</b>
                </TableCell>
                <TableCell>
                  <b>MRP</b>
                </TableCell>
                <TableCell>
                  <b>Discount%</b>
                </TableCell>
                <TableCell>
                  <b>Selling Price</b>
                </TableCell>
                <TableCell>
                  <b>Handling Fee</b>
                </TableCell>
                <TableCell>
                  <b>Video</b>
                </TableCell>
                <TableCell>
                  <b>Position</b>
                </TableCell>
                <TableCell>
                  <b>Subscription</b>
                </TableCell>
                <TableCell>
                  <b>Trail Period</b>
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
              {/* {(rowsPerPage > 0
                ? course.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : course
              ).map((c) => ( */}
              {course.map((c) => (
                <TableRow key={c.courseId}>
                  <TableCell>{c.courseId}</TableCell>
                  <TableCell>{c.courseName}</TableCell>
                  <TableCell>{c.description}</TableCell>
                  <TableCell>{c.categoryName}</TableCell>
                  <TableCell>{c.languageName}</TableCell>
                  <TableCell>{c.courseMrp}</TableCell>
                  <TableCell>{c.discount}</TableCell>
                  <TableCell>{c.sellingPrice}</TableCell>
                  <TableCell>{c.handlingFee}</TableCell>
                  <TableCell>
                    {c.videoUrl && (
                      <iframe
                        title="YouTube Video"
                        src={`https://www.youtube.com/embed/${c.videoUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        width="170px"
                        height="100px"
                      >
                        Watch Video
                      </iframe>
                    )}
                  </TableCell>
                  <TableCell>{c.position}</TableCell>
                  <TableCell>{c.subscriptionDays}</TableCell>
                  <TableCell>{c.trailPeriod}</TableCell>
                  <TableCell>{c.createdBy}</TableCell>
                  <TableCell>{c.updatedBy}</TableCell>
                  <TableCell>{c.insertedDate}</TableCell>
                  <TableCell>{c.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(c.courseId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton>
                      <DeleteForever
                        sx={{ color: Colors.danger }}
                        onClick={() => {
                          handleDelete(c.courseId);
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={12} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={course.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}

        {/* //Form // */}
        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle sx={{ background: "whiteSmoke" }}>
            {editMode ? "Edit Course" : "Add Course"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Course Name"
                    name="courseName"
                    value={userdata.courseName}
                    onChange={(e) => {
                      changehandler(e);
                      setField("courseName");
                    }}
                    error={!!errors.courseName}
                    helperText={errors.courseName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={userdata.description}
                    onChange={(e) => {
                      changehandler(e);
                      setField("description");
                    }}
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="MRP"
                    name="courseMrp"
                    value={userdata.courseMrp}
                    onChange={(e) => {
                      changehandler(e);
                      setField("courseMrp");
                    }}
                    error={!!errors.courseMrp}
                    helperText={errors.courseMrp}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Discount"
                    name="discount"
                    value={userdata.discount}
                    onChange={(e) => {
                      changehandler(e);
                      setField("discount");
                    }}
                    error={!!errors.discount}
                    helperText={errors.discount}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Selling Price"
                    name="sellingPrice"
                    value={userdata.sellingPrice}
                    onChange={(e) => {
                      changehandler(e);
                      setField("sellingPrice");
                    }}
                    error={!!errors.sellingPrice}
                    helperText={errors.sellingPrice}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="handlingFee"
                    name="handlingFee"
                    value={userdata.handlingFee}
                    onChange={(e) => {
                      changehandler(e);
                      setField("handlingFee");
                    }}
                    error={!!errors.handlingFee}
                    helperText={errors.handlingFee}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    name="position"
                    value={userdata.position}
                    onChange={(e) => {
                      changehandler(e);
                      setField("position");
                    }}
                    error={!!errors.position}
                    helperText={errors.position}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Video Url"
                    name="videoUrl"
                    value={userdata.videoUrl}
                    onChange={(e) => {
                      changehandler(e);
                      setField("videoUrl");
                    }}
                    error={!!errors.videoUrl}
                    helperText={errors.videoUrl}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Subscription Days"
                    name="subscriptionDays"
                    value={userdata.subscriptionDays}
                    onChange={(e) => {
                      changehandler(e);
                      setField("subscriptionDays");
                    }}
                    error={!!errors.subscriptionDays}
                    helperText={errors.subscriptionDays}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Trail Period"
                    name="trailPeriod"
                    value={userdata.trailPeriod}
                    onChange={(e) => {
                      changehandler(e);
                      setField("trailPeriod");
                    }}
                    error={!!errors.trailPeriod}
                    helperText={errors.trailPeriod}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={categoryError}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      {category.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {categoryError ? "Please select category" : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={langaugeError}>
                    <InputLabel>Langauge</InputLabel>
                    <Select
                      value={selectedLang}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                    >
                      {language.map((lan) => (
                        <MenuItem key={lan.value} value={lan.value}>
                          {lan.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {langaugeError ? "Please select a language" : ""}
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
                      setOpen(false);
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
