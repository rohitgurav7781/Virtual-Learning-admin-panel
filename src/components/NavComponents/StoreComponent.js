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
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "../../styles/theme";

import Grid from "@mui/material/Unstable_Grid2/Grid2";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import TablePagination from "@mui/material/TablePagination";

import { object } from "yup";
import { PostStoreComp, fetchStore } from "../API's/StoreApi";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Footer from "./Footer";

export default function StoreMain() {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    storeBookName: "",
    bookAuthor: "",
    courseMrp: "",
    sellingPrice: "",
    discount: "",
    handlingFee: "",
    description: "",
    videoUrl: "",
    subscriptionDays: "",
    trailPeriod: "",
  });
  const [userdata, setUserData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [productId, setProductId] = useState();

  const [editMode, setEditMode] = useState(false); // Add this state variable
  const [products, setProducts] = useState([]);
  const [store, setStores] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [fileError, setFileError] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // You can adjust the number of rows per page

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //! initiazing state for roles
  const [roles, setRoles] = useState([]);
  const [categoryId, setCategoryId] = useState();

  const [selectedRole, setSelectedRole] = useState({
    value: "0",
    label: "Select.....",
  });

  //!State Initialzation For FILE UPLOAD
  const [fileName, setFileName] = useState("");
  const [selectedFile, setselectedFile] = useState("");
  const inputRef = useRef(null);

  //!Tokens and Headers
  const user = JSON.parse(sessionStorage.getItem("user"));

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  //!onchange for upload file
  const onFileChange = (e) => {
    setFileName(e.target.files[0].name);
    setselectedFile(e.target.files[0]);
    if (!selectedFile) {
      alert("image is selected");
      return false;
    }
  };

  //!FILE UPLOAD
  const onFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setFileError("Please select a file");
      return;
    }

    console.log(fileName);
    const data = new FormData();
    data.append("file", selectedFile);
    setUserData({ ...userdata, fileName: fileName });

    await axios({
      origin: "*",
      method: "post",
      url: "https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb/file/uploadFile",
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + user.accessToken,
      },
      data,
    })
      .then(function (res) {
        setFileName(res.data.fileName);
        alert(res.data.message);
        setUserData({ ...userdata, productPic: fileName });
        setFileError("");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleAddProduct = () => {
    setInitialValues({
      id: 1,
      storeBookName: "",
      bookAuthor: "",
      courseMrp: "",
      sellingPrice: "",
      discount: "",
      handlingFee: "",
      description: "",
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

    if (!userdata.storeBookName || userdata.storeBookName === "") {
      newErrors.storeBookName = "Enter the product name";
    }

    if (!userdata.courseMrp || userdata.courseMrp === "") {
      newErrors.courseMrp = "Enter the product mrp";
    }

    if (!userdata.sellingPrice || userdata.sellingPrice === "") {
      newErrors.sellingPrice = "Enter the selling cost";
    }

    if (!userdata.bookAuthor || userdata.bookAuthor === "") {
      newErrors.bookAuthor = "Enter the bookAuthor";
    }

    if (!userdata.discount || userdata.discount === "") {
      newErrors.discount = "Enter the discount";
    }

    if (!userdata.handlingFee || userdata.handlingFee === "") {
      newErrors.handlingFee = "Enter the handlingFee";
    }

    if (!userdata.description || userdata.description === "") {
      newErrors.description = "Enter the description";
    }

    if (!userdata.videoUrl || userdata.videoUrl === "") {
      newErrors.videoUrl = "Enter the videoUrl";
    }

    if (!userdata.subscriptionDays || userdata.subscriptionDays === "") {
      newErrors.subscriptionDays = "Enter the subscriptionDays";
    }

    if (!userdata.trailPeriod || userdata.trailPeriod === "") {
      newErrors.trailPeriod = "Enter the trailPeriod";
    }

    if (selectedRole.label === "Select.....") {
      newErrors.selectedRole = "Please select a role";
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

  useEffect(() => {}, [refreshTrigger]);

  const postdata = async (e) => {
    e.preventDefault();
    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        // Call the API to post the userdata
        await PostStoreComp(userdata, headers);

        // Reset the form fields and close the dialog
        setUserData({
          storeBookName: "",
          bookAuthor: "",
          courseMrp: "",
          sellingPrice: "",
          discount: "",
          handlingFee: "",
          description: "",
          videoUrl: "",
          subscriptionDays: "",
          trailPeriod: "",
          createdBy: { userId: user.userId },
        });
        setSelectedRole({ value: "0", label: "select....." });
        setCategoryId("");
        setCategoryId(true);
        setRefreshTrigger((prev) => !prev); // Trigger a refresh
        setOpen(false);
      } catch (error) {
        console.error("Error posting data:", error);
        // Handle the error as needed (show an alert, etc.)
      }
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
          "@media (min-width: 601px) and (max-width: 1200px)": {
            width: "680px", // Styles for tablet view
          },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          StoreBook
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">StoreBook</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Store
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
                  "@media (max-width: 600px)": {
                    fontSize: "14px", // Adjust font size for screens <= 600px
                  },
                },
              }}
            >
              <TableRow>
                <TableCell>
                  <b>#</b>
                </TableCell>
                <TableCell>
                  <b>StoreBook Name</b>
                </TableCell>
                <TableCell>
                  <b>Book Author</b>
                </TableCell>
                <TableCell>
                  <b>Book Banner</b>
                </TableCell>
                <TableCell>
                  <b>Subscription Days</b>
                </TableCell>
                <TableCell>
                  <b>Trail Period</b>
                </TableCell>
                <TableCell>
                  <b>MRP</b>
                </TableCell>
                <TableCell>
                  <b>Selling Cost</b>
                </TableCell>
                <TableCell>
                  <b>Discount</b>
                </TableCell>
                <TableCell>
                  <b>Handling Fee</b>
                </TableCell>
                <TableCell>
                  <b>File Name</b>
                </TableCell>
                <TableCell>
                  <b>Subscription</b>
                </TableCell>
                <TableCell>
                  <b>Description</b>
                </TableCell>
                <TableCell>
                  <b>Photo</b>
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
              {/* {(rowsPerPage > 0
                ? products.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : products
              ).map((p) => ( */}
              {store.map((s) => (
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        // handleEdit(p.productId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton>
                      <DeleteForever
                        sx={{ color: Colors.danger }}
                        onClick={() => {
                          //handleDelete(p.productId);
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {/* ))} */}
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
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* //Form // */}
        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle sx={{ background: "whiteSmoke" }}>
            {editMode ? "Edit Store" : "Add Store"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Storebook Name"
                    name="storeBookName"
                    value={userdata.storeBookName}
                    onChange={(e) => {
                      changehandler(e);
                      setField("storeBookName");
                    }}
                    error={!!errors.storeBookName}
                    helperText={errors.storeBookName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="StoreBook Author"
                    name="bookAuthor"
                    value={userdata.bookAuthor}
                    onChange={(e) => {
                      changehandler(e);
                      setField("bookAuthor");
                    }}
                    error={!!errors.bookAuthor}
                    helperText={errors.bookAuthor}
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
                      // updatedata(e);
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
