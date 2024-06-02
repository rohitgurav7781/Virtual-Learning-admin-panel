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
  Link,
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
import Paper from "@mui/material/Paper";
import { Colors } from "../../styles/theme";

import moment from "moment/moment";

import { object } from "yup";
import {
  PostBatchCourse,
  batchCourse,
  deleteBatchCourseData,
  getBatchCourseById,
  getBatches,
  getCategories,
  getLanguages,
  updateBatchCourseData,
} from "../API's/BatchTwoApi";

export default function BatchCandidate() {
  const [open, setOpen] = useState(false);
  const [usser, setUsser] = useState([]);

  const [initialValues, setInitialValues] = useState({
    courseName: "",
    description: "",
    videoUrl: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [batch, setBatch] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [language, setLanguage] = useState([]);

  const [errors, setErrors] = useState({});

  const [selectedBatch, setSelectedBatch] = useState({
    value: "0",
    label: "Select.....",
  });
  const [batchError, setBatchError] = useState(false);

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

  const [batchCourseId, setBatchCourseId] = useState();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // You can adjust the number of rows per page

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, usser.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    FetchData();
    FetchBatch();
    FetchCategory();
    FetchLangauage();
  }, [refreshTrigger]);

  const handleAddBatchCourse = () => {
    setInitialValues({
      courseName: "",
      description: "",
      videoUrl: "",
    });
    setOpen(true);
  };

  const [userdata, setUserData] = useState({
    courseName: "",
    description: "",
    videoUrl: "",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  //!form validation
  const validateform = () => {
    const newErrors = {};

    if (!userdata.courseName || userdata.courseName === "") {
      newErrors.courseName = "Enter the course name";
    }

    if (
      !userdata.courseLanguageDto ||
      userdata.courseLanguageDto.languageId === "0"
    ) {
      newErrors.courseLanguageDto = "Select a Language";
      setLangaugeError(true); // Set the error for the select input
    }

    if (!userdata.batchDtoList || userdata.batchDtoList.batchId === "0") {
      newErrors.batchDtoList = "Select a batch";
      setBatchError(true); // Set the error for the select input
    }

    if (!userdata.description || userdata.description === "") {
      newErrors.description = "Enter the description";
    }

    if (!userdata.videoUrl || userdata.videoUrl === "") {
      newErrors.videoUrl = "Enter the videoUrl";
    }

    if (!userdata.categoryId || userdata.categoryId.categoryId === "0") {
      newErrors.categoryId = "Select a Category";
      setCategoryError(true); // Set the error for the select input
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

  // to get batches
  const FetchBatch = async () => {
    let res = await getBatches(headers);

    var down = res.data;
    var mdata = down.map((a) => {
      return { value: a.batchId, label: a.batchName };
    });
    console.log(mdata);
    setBatch(mdata);
  };

  //! OnChange for BATCH(DROPDOWN)
  const handleBatchChange = (value) => {
    const selectedBatchObj = batch.find((b) => b.value === value);
    setSelectedBatch(selectedBatchObj);
    setBatchError(false);
    console.log(value);
    setUserData({
      ...userdata,
      batchDtoList: {
        batchId: value,
      },
    });
    setCategoryId(value.value);
  };

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
    const selectedCategoryObj = category.find((c) => c.value === value);
    setSelectedCategory(selectedCategoryObj);
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
    const selectedLanguageObj = language.find((l) => l.value === value);
    setSelectedLang(selectedLanguageObj);
    setLangaugeError(false);
    console.log(value);
    setUserData({
      ...userdata,
      courseLanguageDto: {
        languageId: value,
      },
    });
  };

  //todo ==> GET USER DATA
  const FetchData = async () => {
    let res = await batchCourse(headers, userdata);
    console.log(res.data.content);

    var fetcheddata = res.data.content;
    //console.log(res.data.content);

    const tabledata = [];

    fetcheddata.map((u) => {
      const batchName = u.batchDtoList ? u.batchDtoList.batchName : "no batch";

      const categoryName = u.courseCategoryDto
        ? u.courseCategoryDto.categoryName
        : "No Category";

      const languageName = u.courseLanguageDto
        ? u.courseLanguageDto.languageName
        : "No Langauge";

      tabledata.push({
        batchCourseId: u.batchCourseId,
        courseName: u.courseName,
        description: u.description,
        categoryName: categoryName,
        languageName: languageName,
        batchName: batchName,
        videoUrl: u.videoUrl,
        createdBy: u.createdBy ? u.createdBy.userName : "No User",
        updatedBy: u.updatedBy ? u.updatedBy.userName : "No User",
        insertedDate: moment(u.insertedDate).format("L"),
        updatedDate: moment(u.updatedDate).format("L"),
      });
    });
    console.log(tabledata);
    setUsser(tabledata);
  };

  //todo ==> GET DATA BY BATCH COURSE ID
  const handleEdit = async (id) => {
    setEditMode(true); // Set editMode to true
    setOpen(true);
    var res = await getBatchCourseById(headers, id);
    console.log(res);
    let det = res.data;

    // Handle null or undefined values
    const selectedBatchObj = det.batchDtoList
      ? batch.find((b) => b.value === det.batchDtoList.batchId)
      : null;
    const selectedCategoryObj = det.courseCategoryDto
      ? category.find((c) => c.value === det.courseCategoryDto.categoryId)
      : null;
    const selectedLanguageObj = det.courseLanguageDto
      ? language.find((l) => l.value === det.courseLanguageDto.languageId)
      : null;

    setBatchCourseId(det.batchCourseId);
    setUserData({
      courseName: det.courseName,
      description: det.description,
      videoUrl: det.videoUrl,

      batchDtoList: {
        batchId: det.batchDtoList ? det.batchDtoList.batchId : "",
      },
      courseCategoryDto: {
        categoryId: det.courseCategoryDto
          ? det.courseCategoryDto.categoryId
          : "",
      },
      courseLanguageDto: {
        languageId: det.courseLanguageDto
          ? det.courseLanguageDto.languageId
          : "",
      },
    });
    setSelectedBatch(selectedBatchObj || { value: "0", label: "Select....." });
    setSelectedCategory(
      selectedCategoryObj || { value: "0", label: "Select....." }
    );
    setSelectedLang(
      selectedLanguageObj || { value: "0", label: "Select......" }
    );
  };

  // todo==> UPDATE BATCH Course
  const updatedata = async (e) => {
    // console.log("hi")
    e.preventDefault();
    console.log(userdata);
    console.log(batchCourseId);

    var updateddata = {
      ...userdata,
      batchCourseId,
      updatedBy: { userId: user.userId },
    };
    console.log(updateddata);

    const respp = await updateBatchCourseData(headers, updateddata);

    //setbatchId("");
    FetchData();
  };

  //todo ==> DELETE  BATCH DATA
  const handleDelete = async (id) => {
    console.log(id);
    await deleteBatchCourseData(headers, id);
    await FetchData();
  };

  const postdataa = async (e) => {
    e.preventDefault();

    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      await PostBatchCourse(userdata, headers);
      setUserData({
        // courseName: "",
        // description: "",
        // videoUrl: "",
        // categoryName: selectedCategory.value,
      });

      setSelectedBatch({ value: "0" });
      setSelectedCategory({ value: "0" });
      setSelectedLang({ value: "0" });

      setCategoryId(true);
      setRefreshTrigger((prev) => !prev);
      setOpen(false);
    }
    console.log(userdata);
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
            width: "700px", // Styles for tablet view (adjust the range and width as needed)
          },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Batch-Course
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/batch-menu">
            Batch-Course Menu
          </Link>
          <Typography color="#51678f">Batch-Course</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddBatchCourse}
        >
          {" "}
          Add Batch-Course
        </Button>
        <TableContainer
          sx={{
            overflowX: "auto", // Enable horizontal scrolling on smaller screens
            marginTop: "20px",
            borderRadius: "20px",
            border: "1px solid lightGray",
            "@media(max-width:600px)": {
              width: "100%", // Make the table container full width on smaller screens
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
                  <b>Batch</b>
                </TableCell>
                <TableCell>
                  <b>Category</b>
                </TableCell>
                <TableCell>
                  <b>Language</b>
                </TableCell>
                <TableCell>
                  <b>Video</b>
                </TableCell>
                <TableCell>
                  <b>Created By</b>
                </TableCell>
                <TableCell>
                  <b>Upadated By</b>
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
                ? usser.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : usser
              ).map((p) => (
                <TableRow key={p.batchCourseId}>
                  <TableCell>{p.batchCourseId}</TableCell>
                  <TableCell>{p.courseName}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.batchName}</TableCell>
                  <TableCell>{p.categoryName}</TableCell>
                  <TableCell>{p.languageName}</TableCell>
                  <TableCell>
                    {p.videoUrl && (
                      <iframe
                        title="YouTube Video"
                        src={`https://www.youtube.com/embed/${p.videoUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        width="140px"
                        height="100px"
                      >
                        Watch Video
                      </iframe>
                    )}
                  </TableCell>
                  <TableCell>{p.createdBy}</TableCell>
                  <TableCell>{p.updatedBy}</TableCell>
                  <TableCell>{p.insertedDate}</TableCell>
                  <TableCell>{p.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(p.batchCourseId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    -
                    <IconButton
                      onClick={() => {
                        handleDelete(p.batchCourseId);
                      }}
                    >
                      <DeleteForever sx={{ color: Colors.danger }} />
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
          count={usser.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle sx={{ background: "whiteSmoke" }}>
            {editMode ? "Edit Batch-Course" : "Add Batch-Course"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="course Name"
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
                  <FormControl fullWidth error={batchError}>
                    <InputLabel>Batch</InputLabel>
                    <Select
                      value={selectedBatch.value || ""}
                      onChange={(e) => handleBatchChange(e.target.value)}
                    >
                      {batch.map((bat) => (
                        <MenuItem key={bat.value} value={bat.value}>
                          {bat.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {batchError ? "select a batch" : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="description"
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
                    label="Video URL"
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
                  <FormControl fullWidth error={categoryError}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory.value || ""}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      {category.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {categoryError ? "select a category" : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={langaugeError}>
                    <InputLabel>Langauge</InputLabel>
                    <Select
                      value={selectedLang.value || ""}
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
                      postdataa(e);
                    }
                  }}
                >
                  {editMode ? "Save Edit" : "save"}
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
