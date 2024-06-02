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
import Paper from "@mui/material/Paper";
import moment from "moment/moment";
import {
  PostCandidate,
  deleteCandidate,
  fetchCandidate,
  getCandidateById,
  updateCandidate,
} from "../API's/CandidateApi";
import { BaseUrl } from "../../BaseUrl";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function UserCandidate() {
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

  const [open, setOpen] = useState(false);
  const [usser, setUsser] = useState([]);

  const [initialValues, setInitialValues] = useState({
    fullName: "",
    gender: "",
    mailId: "",
    otp: "",
    password: "",
    mobileNumber: "",
  });

  // const [candidate, setAdvertisement] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [userId, setrUserId] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setselectedFile] = useState("");
  const [mobileUserId, setMobileUserId] = useState();

  const [profilePicName, setProfilePicName] = useState("");

  const [fileError, setFileError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setInitialValues({
      fullName: "",
      gender: "",
      mobileNumber: "",
      mailId: "",
      otp: "",
      password: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    fullName: "",
    gender: "",
    mobileNumber: "",
    mailId: "",
    otp: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const validateform = () => {
    const newErrors = {};

    if (!userdata.fullName || userdata.fullName.trim() === "") {
      newErrors.fullName = "Enter the Full Name";
    }

    if (!userdata.gender || userdata.gender.trim() === "") {
      newErrors.gender = "Enter the gender";
    }

    if (!userdata.mobileNumber || userdata.mobileNumber.trim() === "") {
      newErrors.mobileNumber = "Enter the  mobileNumber Number";
    }

    if (!userdata.mailId || userdata.mailId.trim() === "") {
      newErrors.mailId = "Enter the mailId";
    }

    if (!userdata.otp || userdata.otp.trim() === "") {
      newErrors.otp = "Enter the userName link";
    }

    if (!userdata.password || userdata.password.trim() === "") {
      newErrors.password = "Enter the Password ";
    }

    return newErrors;
  };

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  const setField = (field) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
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
    // setUserData({ ...userdata, fileName: fileName });

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
        if (res.status === 200) {
          const fileName = res.data.fileName;
          setUserData({
            ...userdata,
            profilePicName: profilePicName,
          });
        }
        alert(res.data.message);
        // setUserData({ ...userdata, fileName: fileName });
        setFileError("");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onFileChange = (e) => {
    setProfilePicName(e.target.files[0].name);
    setselectedFile(e.target.files[0]);
    if (!selectedFile) {
      // alert("image is selected");
      return false;
    }
  };

  //!onchange for submit data
  const changehandler = (e) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [e.target.name]: e.target.value,
      createdBy: { userId: user.userId },
    }));
    setErrors({
      ...errors,
      [e.target.name]: null,
    });
  };

  const handleEdit = async (mobileUserId) => {
    setEditMode(true);
    setOpen(true);
    let res = await getCandidateById(mobileUserId, headers);
    console.log(res.data);
    let det = res.data;

    setMobileUserId(det.mobileUserId);
    console.log(mobileUserId);
    setUserData({
      fullName: det.fullName,
      gender: det.gender,
      mobileNumber: det.mobileNumber,
      mailId: det.mailId,
    });

    FetchData();
  };

  const updatedata = async (e) => {
    e.preventDefault();

    var updatedData = {
      ...userdata,
      mobileUserId,
      updatedBy: { mobileUserId: user.mobileUserId },
    };
    console.log(updatedData);

    const res = await updateCandidate(updatedData, headers);
    console.log(res);
    FetchData();
  };

  //Delete candidate
  const handleDelete = async (mobileUserId) => {
    await deleteCandidate(mobileUserId, headers);
    FetchData();
  };

  //todo ==> GET USER DATA
  const FetchData = async () => {
    let res = await fetchCandidate(headers, userdata);
    // console.log(res.data.content);

    var fetcheddata = res.data.content;
    // console.log(res.data.content);

    const tabledata = [];
    if (fetcheddata) {
      fetcheddata.map((u) => {
        tabledata.push({
          mobileUserId: u.mobileUserId,
          fullName: u.fullName === null ? "no name" : u.fullName,
          userName: u.userName,
          mobileNumber: u.mobileNumber,
          mailId: u.mailId === null ? "Email not found" : u.mailId,
          createdBy: u.createdBy ? u.createdBy.userName : "No User",
          updatedBy: u.updatedBy ? u.updatedBy.userName : "No User",
          insertedDate: moment(u.insertedDate).format("L"),
          updatedDate: moment(u.updatedDate).format("L"),
          profilePicName:
            u.profilePicName === null ? (
              "NO IMAGE FOUND"
            ) : (
              <img
                src={ImageUrl + u.profilePicName}
                alt={u.profilePicName}
                style={{ width: 100, height: 50 }}
              />
            ),
        });
      });
      setUsser(tabledata);
    } else {
      setUsser([]);
    }
  };

  //Post Candidates
  const postdata = async (e) => {
    e.preventDefault();
    const formErrors = validateform();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log(userdata);
      await PostCandidate(userdata, headers);
      setUserData({
        fullName: "",
        gender: "",
        mobileNumber: "",
        mailId: "",
        otp: "",
        password: "",
      });
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
            width: "710px", // Styles for tablet view (adjust the range and width as needed)
          },
          height: { md: "140vh", xs: "210vh ", sm: "120vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Candidates
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/course-menu">
            Candidates Menu
          </Link>
          <Typography color="#51678f">Profile</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Candidate
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
                  <b>User Id</b>
                </TableCell>
                <TableCell>
                  <b>Profile Pic</b>
                </TableCell>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Mobile</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Created By</b>
                </TableCell>
                <TableCell>
                  <b>Upadated By</b>
                </TableCell>
                <TableCell>
                  <b>Created Date</b>
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
                <TableRow key={p.mobileUserId}>
                  <TableCell>{p.mobileUserId}</TableCell>
                  <TableCell>{p.profilePicName}</TableCell>
                  <TableCell>{p.fullName}</TableCell>
                  <TableCell>{p.mobileNumber}</TableCell>
                  <TableCell>{p.mailId}</TableCell>
                  <TableCell>{p.createdBy}</TableCell>
                  <TableCell>{p.updatedBy}</TableCell>
                  <TableCell>{p.insertedDate}</TableCell>
                  <TableCell>{p.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(p.mobileUserId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton>
                      <DeleteForever
                        sx={{ color: Colors.danger }}
                        onClick={() => {
                          handleDelete(p.mobileUserId);
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
          count={usser.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle sx={{ background: "whiteSmoke" }}>
            {" "}
            {editMode ? "Edit Candidate" : "Add Candidate"}
          </DialogTitle>

          <Container sx={{ mt: "8px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="FullName"
                    name="fullName"
                    value={userdata.fullName}
                    onChange={changehandler}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={userdata.gender}
                    onChange={changehandler}
                    error={!!errors.gender}
                    helperText={errors.gender}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={userdata.mobileNumber}
                    onChange={changehandler}
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="mailId"
                    value={userdata.mailId}
                    onChange={changehandler}
                    error={!!errors.mailId}
                    helperText={errors.mailId}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="OTP"
                    name="otp"
                    value={userdata.otp}
                    onChange={changehandler}
                    error={!!errors.otp}
                    helperText={errors.otp}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    value={userdata.password}
                    onChange={changehandler}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="file"
                    label="Select File"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => onFileChange(e)}
                    accept=".pdf,.jpg,.png"
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
