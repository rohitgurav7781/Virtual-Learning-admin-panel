import React, { useEffect, useState } from "react";
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
import {
  deleteCategory,
  fetchCatergoryData,
  getcategoryById,
  postCategoryData,
  updatedCategory,
} from "../API's/CategoryApi";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Footer from "./Footer";

export default function Category() {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    id: "",
    categoryName: "",
    description: "",
    youTube: "",
    createdBy: "",
    insertedDate: "",
  });
  const [category, setCategory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [categoryId, setCategoryId] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setInitialValues({
      id: "",
      categoryName: "",
      description: "",
      youTube: "",
      createdBy: "",
      insertedDate: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    categoryName: "",
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

    if (!userdata.categoryName || userdata.categoryName.trim() === "") {
      newErrors.categoryName = "Enter the category Name";
    }

    if (!userdata.description || userdata.description.trim() === "") {
      newErrors.description = "Enter the product description";
    }

    return newErrors;
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

  //Get Promo Data
  const FetchData = async () => {
    let res = await fetchCatergoryData(headers);

    console.log(res.data.content);
    // Assuming res.content is where your data is stored
    var fetchedData = res.data.content;

    if (fetchedData) {
      var tabledata = fetchedData.map((p) => ({
        categoryId: p.categoryId,
        categoryName: p.categoryName,
        description: p.description,
        createdBy: p.createdBy ? p.createdBy.userName : "No User",
        updatedBy: p.updatedBy ? p.updatedBy.userName : "No Updator",
        insertedDate: moment(p.insertedDate).format("L"),
        updatedDate: moment(p.updatedDate).format("L"),
      }));
      console.log(tabledata);
      setCategory(tabledata);
    } else {
      setCategory([]);
    }
  };

  //todo ==> GET DATA BY PROMO ID
  const handleEdit = async (id) => {
    //  console.log(id);
    setEditMode(true); // Set editMode to true
    setOpen(true);
    var res = await getcategoryById(headers, id);
    console.log(res);

    let det = res.data;
    setCategoryId(det.categoryId);
    setUserData({
      categoryName: det.categoryName,
      description: det.description,
    });
  };

  // todo==> UPDATE PROMO
  const updatedata = async (e) => {
    e.preventDefault();
    //  console.log(userdata);
    console.log(categoryId);
    var updateddata = {
      ...userdata,
      categoryId,
      updatedBy: { userId: user.userId },
    };
    //  console.log(updateddata)
    const resp = await updatedCategory(headers, updateddata);
    console.log(resp);
    FetchData();
  };

  //todo ==> DELETE CATEGORY DATA
  const handleDelete = async (id) => {
    await deleteCategory(headers, id);
    console.log(id);
    FetchData();
  };

  const postdata = (e) => {
    e.preventDefault();

    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log(userdata);

      postCategoryData(userdata, headers).then(() => {
        setUserData({
          fullName: "",
          mobileNumber: "",
          email: "",
          password: "",
          userName: "",
        });
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
            width: "270px", // Styles for mobile view +
          },
          "@media (min-width: 601px) and (max-width: 1200px)": {
            width: "700px", // Styles for tablet view (adjust the range and width as needed)
          },
          height: { md: "85vh", xs: "105vh", sm: "83.7vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Category
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/master">
            Master
          </Link>
          <Typography color="#51678f">Category</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Category
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
              {category.map((p) => (
                <TableRow key={p.categoryId}>
                  <TableCell>{p.categoryId}</TableCell>
                  <TableCell>{p.categoryName}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.createdBy}</TableCell>
                  <TableCell>{p.updatedBy}</TableCell>
                  <TableCell>{p.insertedDate}</TableCell>
                  <TableCell>{p.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(p.categoryId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton>
                      <DeleteForever
                        sx={{ color: Colors.danger }}
                        onClick={() => {
                          handleDelete(p.categoryId);
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
            {editMode ? "Edit Category" : "Add Category"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form onSubmit={postdata}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Category Name"
                    name="categoryName"
                    value={userdata.categoryName}
                    onChange={changehandler}
                    error={!!errors.categoryName}
                    helperText={errors.categoryName}
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
