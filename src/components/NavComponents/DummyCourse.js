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
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "../../styles/theme";

import Grid from "@mui/material/Unstable_Grid2/Grid2";

import axios from "axios";
import { BaseUrl } from "../../BaseUrl";
import TablePagination from "@mui/material/TablePagination";

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
  const [refreshTrigger, setRefreshTrigger] = useState(false);

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
  // const [roleValid, setRoleValid] = useState(true);
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
  // console.log(user)
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  //! OnChange for ROLE(DROPDOWN)
  const handleRoleChange = (value) => {
    setSelectedRole(value);
    console.log(value);
    setUserData({
      ...userdata,
      productCategoryDto: {
        categoryId: value,
        categoryName: value.label,
      },
    });
    setCategoryId(value.value);
  };

  // todo==> GET ROLES(dropdown)
  const FetchRole = async () => {
    //let response = await getRoles(headers);
    // console.log(response);

    //var down = response.data;
    // console.log(down);
    var mdata = down.map((a) => {
      return { value: a.categoryId, label: a.categoryName };
    });
    console.log(mdata);
    setRoles(mdata);
  };

  //!onchange for upload file
  // const onFileChange = (e) => {
  //   setFileName(e.target.files[0].name);
  //   setselectedFile(e.target.files[0]);
  //   if (!selectedFile) {
  //     alert("image is selected");
  //     return false;
  //   }
  // };

  //!FILE UPLOAD
  // const onFileUpload = async (e) => {
  //   e.preventDefault();

  //   console.log(fileName);
  //   const data = new FormData();
  //   data.append("file", selectedFile);
  //   setUserData({ ...userdata, fileName: fileName });

  //   await axios({
  //     origin: "*",
  //     method: "post",
  //     url: `${BaseUrl}/file/uploadFile`,
  //     headers: {
  //       "content-type": "multipart/form-data",
  //       Authorization: "Bearer " + user.accessToken,
  //     },
  //     data,
  //   })
  //     .then(function (res) {
  //       setFileName(res.data.fileName);
  //       alert(res.data.message);
  //       setUserData({ ...userdata, productPic: fileName });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  const handleAddProduct = () => {
    setInitialValues({
      id: 1,
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
      newErrors.courseName = "Enter the product name";
    }

    if (!userdata.courseMrp || userdata.courseMrp === "") {
      newErrors.courseMrp = "Enter the product mrp";
    }

    if (!userdata.sellingPrice || userdata.sellingPrice === "") {
      newErrors.sellingPrice = "Enter the selling cost";
    }

    if (!userdata.description || userdata.description === "") {
      newErrors.description = "Enter the description";
    }

    if (!userdata.discount || userdata.discount === "") {
      newErrors.discount = "Enter the discount";
    }

    if (!userdata.handlingFee || userdata.handlingFee === "") {
      newErrors.handlingFee = "Enter the handlingFee";
    }

    if (!userdata.position || userdata.position === "") {
      newErrors.position = "Enter the position";
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

  //!useEffect
  useEffect(() => {
    // FetchRole();
    //FetchData();
  }, [refreshTrigger]);

  //todo ==> DELETE  PRODUCT DATA
  // const handleDelete = async (id) => {
  //   console.log(id);
  //   await deleteProduct(headers, id);
  //   FetchData();
  // };

  //todo ==> GET DATA BY PRODUCT ID
  // const handleEdit = async (productId) => {
  //   setEditMode(true); // Set editMode to true
  //   setOpen(true);
  //   console.log(productId);
  //   //let res = await getProductById(productId, headers);
  //   //console.log(res);

  //   //let det = res.data;
  //   setProductId(det.productId);
  //   setUserData({
  //     handlingFee: det.handlingFee,
  //     discount: det.discount,
  //     gst: det.gst,
  //     courseName: det.courseName,
  //     courseMrp: det.courseMrp,
  //     sellingPrice: det.sellingPrice,
  //     videoUrl: det.videoUrl,
  //     description: det.description,
  //   });
  // };

  // todo==> UPDATE PRODUCT
  // const updatedata = async (e) => {
  //   console.log("hi");
  //   e.preventDefault();
  //   console.log(userdata);
  //   console.log(productId);

  //   var updateddata = {
  //     ...userdata,
  //     productId,
  //     updatedBy: { userId: user.userId },
  //     productCategoryDto: { role: categoryId },
  //   };
  //   console.log(updateddata);

  //   // const respp = await updatedProduct(headers, updateddata);
  //   // console.log(respp)
  //   setSelectedRole({ value: "0", label: "Select..." });
  //   setProductId("");
  //   FetchData();
  // };

  // todo ==> GET PRODUCT DATA
  // const FetchData = async () => {
  //   // let response = await fetchProduct(headers);
  //   // console.log(response.data.content);
  //   // var bdata = response.data.content;
  //   var tableArry = [];
  //   bdata.map((p) => {
  //     // console.log(p);
  //     tableArry.push({
  //       productId: p.productId,
  //       courseName: p.courseName,
  //       productCategoryDto:
  //         p.productCategoryDto === null
  //           ? "No Category"
  //           : p.productCategoryDto.categoryName,
  //       productPic:
  //         p.productPic === null ? (
  //           "NO IMAGE FOUND"
  //         ) : (
  //           <Avatar
  //             src={ImageUrl + p.productPicPath}
  //             alt={p.fileName}
  //             style={{ width: 100, height: 100 }}
  //           />
  //         ),
  //       handlingFee: p.handlingFee,
  //       position: p.position,
  //       videoUrl: p.videoUrl,
  //       discount: p.discount,
  //       courseMrp: p.courseMrp,
  //       sellingPrice: p.sellingPrice,
  //       description: p.description,
  //     });
  //   });

  //   // console.log(tableArry);
  //   setProducts(tableArry);
  // };

  //todo ==> POST Course DATA
  const postdata = async (e) => {
    e.preventDefault();
    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      // Create a new product object
      console.log(userdata);

      // await PostCourse(userdata, headers);

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
        createdBy: { userId: user.userId },
      });
    }
    setSelectedRole({ value: "0", label: "select....." });
    setCategoryId("");
    setCategoryId(true);
    setRefreshTrigger((prev) => !prev); // Trigger a refresh
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
            width: "710px", // Styles for tablet view
          },
        }}
      >
        <Typography sx={{ mb: 1 }} variant="h4">
          Course
        </Typography>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Course
        </Button>
        <TableContainer
          sx={{
            border: "1px solid lightGray",
            marginTop: "20px",
            borderRadius: "8px",
          }}
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
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>MRP</TableCell>
                <TableCell>Discount%</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Handling Fee</TableCell>
                <TableCell>Video</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell>Trail Period</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Updated By</TableCell>
                <TableCell>Inserted Date</TableCell>
                <TableCell>Updated Date</TableCell>
                <TableCell>Actions</TableCell>
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
                <TableCell>
                  <IconButton
                    onClick={() => {
                      // handleEdit(p.productId);
                    }}
                  >
                    <Edit />
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
            {editMode ? "Edit Product" : "Add Course"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item md={6}>
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
                <Grid item md={6}>
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
                <Grid item md={6}>
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

                <Grid item md={6}>
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
                <Grid item md={6}>
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
                <Grid item md={6}>
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
                <Grid item md={6}>
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

                <Grid item md={6}>
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

                <Grid item md={6}>
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

                <Grid item md={6}>
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

                <Grid item md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                    //  value={selectedRole}
                    //  onChange={(e) => handleRoleChange(e.target.value)}
                    >
                      <MenuItem></MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Langauge</InputLabel>
                    <Select
                    //value={selectedRole}
                    // onChange={(e) => handleRoleChange(e.target.value)}
                    >
                      <MenuItem></MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <DialogActions>
                <Button
                  onClick={(e) => {
                    if (editMode) {
                      // updatedata(e);
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
