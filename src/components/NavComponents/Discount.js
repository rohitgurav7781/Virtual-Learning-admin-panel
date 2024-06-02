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

import { BaseUrl } from "../../BaseUrl";
import {
  deleteDiscount,
  fetchDiscount,
  getDiscountById,
  PostDiscount,
  updatedDiscount,
} from "../API's/DiscountApi";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Footer from "./Footer";

export default function Discount() {
  const [open, setOpen] = useState(false);
  const [discount, setDiscount] = useState([]);
  const [discountId, setDiscountId] = useState();

  const [initialValues, setInitialValues] = useState({
    //id: "",
    discountName: "",
    description: "",
    discountPercent: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setUserData({
      // id: "",
      discountName: "",
      description: "",
      discountPercent: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    discountName: "",
    description: "",
    discountPercent: "",
  });

  const [errors, setErrors] = useState({});

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const validateform = () => {
    const newErrors = {};

    if (!userdata.discountName || userdata.discountName.trim() === "") {
      newErrors.discountName = "Enter the Full Name";
    }

    if (!userdata.description || userdata.description.trim() === "") {
      newErrors.description = "Enter the  description ";
    }
    if (!userdata.discountPercent || userdata.discountPercent.trim() === "") {
      newErrors.discountPercent = "Enter the  discountPercent ";
    }

    return newErrors;
  };

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

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

  //todo ==> GET Discount DATA
  const FetchData = async () => {
    let res = await fetchDiscount(headers, userdata);
    // console.log(res.data.content);

    var fetcheddata = res.data.content;
    // console.log(res.data.content);

    const tabledata = [];

    fetcheddata.map((u) => {
      tabledata.push({
        discountId: u.discountId,
        discountName: u.discountName === null ? "no name" : u.discountName,
        description: u.description,
        discountPercent: u.discountPercent,
        createdBy: u.createdBy ? u.createdBy.userName : "No User",
        updatedBy: u.updatedBy ? u.updatedBy.userName : "No User",
        insertedDate: moment(u.insertedDate).format("L"),
        updatedDate: moment(u.updatedDate).format("L"),
        file:
          u.profilePicPath === null ? (
            "NO IMAGE FOUND"
          ) : (
            <img
              src={ImageUrl + u.profilePicPath}
              alt={u.profilePicPath}
              style={{ width: 100, height: 50 }}
            />
          ),
      });
    });
    //console.log(tabledata);
    setDiscount(tabledata);
  };

  //todo ==> GET DATA BY BATCH ID
  const handleEdit = async (id) => {
    //  console.log(id);
    setEditMode(true); // Set editMode to true
    setOpen(true);
    var res = await getDiscountById(id, headers);
    console.log(res);

    let det = res.data;
    setDiscountId(det.discountId);
    setUserData({
      discountName: det.discountName,
      discountPercent: det.discountPercent,
      description: det.description,
    });
  };

  // todo==> UPDATE BATCH
  const updatedata = async (e) => {
    // console.log("hi")
    e.preventDefault();

    console.log(discountId);

    var updateddata = {
      ...userdata,
      discountId,
      updatedBy: { userId: user.userId },
    };
    console.log(updateddata);

    const respp = await updatedDiscount(updateddata, headers);

    //setbatchId("");
    FetchData();
  };

  //todo ==> DELETE  BATCH DATA
  const handleDelete = async (id) => {
    console.log(id);
    await deleteDiscount(id, headers);
    await FetchData();
  };

  const postdata = async (e) => {
    e.preventDefault();

    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log(userdata);

      await PostDiscount(userdata, headers);
      setUserData({
        discountName: "",
        description: "",
        discountPercent: "",
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
            width: "700px", // Styles for tablet view (adjust the range and width as needed)
          },
          height: { md: "85vh", xs: "85vh", sm: "90vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Discount
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/master">
            Masters
          </Link>
          <Typography color="#51678f">Discount</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Discount
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
                  <b>Id</b>
                </TableCell>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Description</b>
                </TableCell>
                <TableCell>
                  <b>Discount</b>
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
                  <b>Upadated Date</b>
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
              {discount.map((d) => (
                <TableRow key={d.discountId}>
                  <TableCell>{d.discountId}</TableCell>
                  <TableCell>{d.discountName}</TableCell>
                  <TableCell>{d.description}</TableCell>
                  <TableCell>{d.discountPercent}</TableCell>
                  <TableCell>{d.createdBy}</TableCell>
                  <TableCell>{d.updatedBy}</TableCell>
                  <TableCell>{d.insertedDate}</TableCell>
                  <TableCell>{d.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(d.discountId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(d.discountId);
                      }}
                    >
                      <DeleteForever sx={{ color: Colors.danger }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle sx={{ background: "whiteSmoke" }}>
            {editMode ? "Edit Discount" : "Add Discount"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Discount Name"
                    name="discountName"
                    value={userdata.discountName}
                    onChange={changehandler}
                    error={!!errors.discountName}
                    helperText={errors.discountName}
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
                    label="Discount Percent"
                    name="discountPercent"
                    value={userdata.discountPercent}
                    onChange={changehandler}
                    error={!!errors.discountPercent}
                    helperText={errors.discountPercent}
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
                      // setOpen(false);
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
