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
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { Colors } from "../../styles/theme";

import moment from "moment/moment";

import { BaseUrl } from "../../BaseUrl";
import {
  deleteBatchData,
  fetchBatchData,
  getBatchById,
  PostBatchData,
  updateBatchData,
} from "../API's/BatchOneApi";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Footer from "./Footer";

export default function BatchCourse() {
  const [open, setOpen] = useState(false);
  const [usser, setUsser] = useState([]);

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

  const [batchId, setbatchId] = useState();

  const [initialValues, setInitialValues] = useState({
    batchName: "",
    description: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [userId, setrUserId] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

  const handleAddBatchData = () => {
    setUserData({
      batchName: "",
      description: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    batchName: "",
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

    if (!userdata.batchName || userdata.batchName.trim() === "") {
      newErrors.batchName = "Enter the batch Name";
    }

    if (!userdata.description || userdata.description.trim() === "") {
      newErrors.description = "Enter the  description ";
    }

    return newErrors;
  };

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  // const setField = (field) => {
  //   if (errors[field]) {
  //     setErrors({ ...errors, [field]: null });
  //   }
  // };

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

  //todo ==> GET USER DATA
  const FetchData = async () => {
    let res = await fetchBatchData(headers, userdata);
    // console.log(res.data.content);

    var fetcheddata = res.data.content;
    // console.log(res.data.content);

    const tabledata = [];

    fetcheddata.map((u) => {
      tabledata.push({
        batchId: u.batchId,
        batchName: u.batchName === null ? "no name" : u.batchName,
        description: u.description,
        mobileNumber: u.mobileNumber,
        mailId: u.mailId === null ? "Email not found" : u.mailId,
        password: u.password === null ? "No Password" : u.password,
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
    console.log(tabledata);
    setUsser(tabledata);
  };

  //todo ==> GET DATA BY BATCH ID
  const handleEdit = async (id) => {
    //  console.log(id);
    setEditMode(true); // Set editMode to true
    setOpen(true);
    var res = await getBatchById(headers, id);
    console.log(res);

    let det = res.data;
    setbatchId(det.batchId);
    setUserData({
      batchName: det.batchName,
      description: det.description,
    });
  };

  // todo==> UPDATE BATCH
  const updatedata = async (e) => {
    // console.log("hi")
    e.preventDefault();
    console.log(userdata);
    console.log(batchId);

    var updateddata = {
      ...userdata,
      batchId,
      updatedBy: { userId: user.userId },
    };
    console.log(updateddata);

    const respp = await updateBatchData(headers, updateddata);

    //setbatchId("");
    FetchData();
  };

  //todo ==> DELETE  BATCH DATA
  const handleDelete = async (id) => {
    console.log(id);
    await deleteBatchData(headers, id);
    await FetchData();
  };

  const postdata = (e) => {
    e.preventDefault();

    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log(userdata);

      PostBatchData(userdata, headers).then(() => {
        setUserData({
          batchName: "",
          description: "",
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
            width: "270px", // Styles for mobile view
          },
          "@media (min-width: 601px) and (max-width: 1200px)": {
            width: "900px", // Styles for tablet view (adjust the range and width as needed)
          },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Batch
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">Batch</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddBatchData}
        >
          {" "}
          Add Batch
        </Button>

        <TableContainer
          sx={{
            overflowX: "auto", // Enable horizontal scrolling on smaller screens
            marginTop: "20px",
            border: "1px solid lightGray",
            borderRadius: "20px",
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
              {(rowsPerPage > 0
                ? usser.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : usser
              ).map((p) => (
                <TableRow key={p.batchId}>
                  <TableCell>{p.batchId}</TableCell>
                  <TableCell>{p.batchName}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.createdBy}</TableCell>
                  <TableCell>{p.updatedBy}</TableCell>
                  <TableCell>{p.insertedDate}</TableCell>
                  <TableCell>{p.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(p.batchId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(p.batchId);
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
            {editMode ? "Edit Batch" : "Add Batch"}
          </DialogTitle>

          <DialogContent sx={{ mt: "15px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    sx={{ mt: "5px" }}
                    fullWidth
                    label="Batch Name"
                    name="batchName"
                    value={userdata.batchName}
                    onChange={changehandler}
                    error={!!errors.batchName}
                    helperText={errors.batchName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    sx={{ mt: "5px" }}
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
          </DialogContent>
        </Dialog>
      </Box>
      {/* <Footer /> */}
    </>
  );
}
