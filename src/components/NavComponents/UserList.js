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
  fetchUserList,
  getUserListId,
  getUserRoles,
  postUserList,
  updateUserList,
} from "../API's/UserListApi";

import { Link } from "react-router-dom";

export default function UserList() {
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
    mobileNumber: "",
    userName: "",
    createdBy: "",
    insertedDate: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [userId, setrUserId] = useState();

  const [userlistid, setUserListId] = useState();

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    FetchData();
    FetchRole();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setInitialValues({
      fullName: "",
      mobileNumber: "",
      email: "",
      password: "",
      userName: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    userName: "",
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [roleId, setRoleId] = useState();

  const [selectedRole, setSelectedRole] = useState({
    value: "0",
    label: "Select.....",
  });
  const [roleError, setRoleError] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.fullName || userdata.fullName.trim() === "") {
      newErrors.fullName = "Enter the Full Name";
    }

    if (!userdata.mobileNumber || userdata.mobileNumber.trim() === "") {
      newErrors.mobileNumber = "Enter the  mobileNumber Number";
    }

    if (!userdata.userName || userdata.userName.trim() === "") {
      newErrors.userName = "Enter the userName link";
    }

    if (!userdata.email || userdata.email.trim() === "") {
      newErrors.email = "Enter the Email ID";
    }
    // Add validation for the selected role
    if (!userdata.roleDto || userdata.roleDto.roleId === "0") {
      newErrors.roleDto = "Select a role";
      setRoleError(true); // Set the error for the select input
    }
    if (!userdata.password || userdata.password.trim() === "") {
      newErrors.password = "Enter the Password ";
    }

    return newErrors;
  };

  const setField = (field) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  //! OnChange for ROLE(DROPDOWN)
  const handleRoleChange = (value) => {
    setSelectedRole(value);
    setRoleError(false);
    console.log(value);
    setUserData({
      ...userdata,
      roleDto: {
        roleId: value,
      },
    });
    setCategoryId(value.value);
  };

  // todo==> GET ROLES(dropdown)
  const FetchRole = async () => {
    let response = await getUserRoles(headers);
    // console.log(response);

    var down = response.data;
    // console.log(down);
    var mdata = down.map((a) => {
      return { value: a.roleId, label: a.roleName };
    });
    console.log(mdata);
    setRoles(mdata);
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

  //todo ==> GET USER DATA
  const FetchData = async () => {
    let res = await fetchUserList(headers, userdata);
    var fetcheddata = res.data.content;

    const tabledata = [];

    fetcheddata.map((u) => {
      tabledata.push({
        userId: u.userId,
        fullName: u.fullName === null ? "no name" : u.fullName,
        userName: u.userName === null ? "No Username" : u.userName,
        mobileNumber: u.mobileNumber,
        email: u.email === null ? "Email not found" : u.email,
        roleDto: u.roleDto === null ? "no role" : u.roleDto.roleName,
        password: u.password,
        insertedDate: moment(u.insertedDate).format("L"),
        updatedDate: moment(u.updatedDate).format("L"),
        createdBy: u.createdBy ? u.createdBy.userName : "No User",
        updatedBy: u.updatedBy ? u.updatedBy.userName : "No User",
      });
    });
    console.log(tabledata);
    setUsser(tabledata);
  };

  //todo ==> GET USER-LIST ID
  const handleEdit = async (userListID) => {
    setEditMode(true);
    setOpen(true);
    console.log(userListID);

    let res = await getUserListId(userListID, headers);
    console.log(res);

    let det = res.data;
    console.log(det);
    setUserListId(det.userId);
    setUserData({
      fullName: det.fullName,
      mobileNumber: det.mobileNumber,
      email: det.email,
      roleName: det.roleName,
      userName: det.userName,
      password: det.password,
    });
  };

  //todo ==> UPDATE USER DATA
  const UpdateData = async (e) => {
    e.preventDefault();
    console.log(userdata);
    console.log(userId);

    const { createdBy, ...updatedUserData } = userdata;

    var updateddata = {
      ...updatedUserData,
      userId,
      updatedBy: { userId: user.userId },
      roleDto: { role: roleId },
    };
    //console.log(updateddata);

    const resp = await updateUserList(headers, updateddata);
    console.log(resp);
    setUserData({
      fullName: "",
      mobileNumber: "",
      email: "",
      password: "",
      userName: "",
    });
    // setUserListId("");
    FetchData();
    setOpen(false); // Close the dialog
    setRefreshTrigger((prev) => !prev); // Trigger a refresh
  };

  // todo ==> POST USER DATA
  const postData = (e) => {
    e.preventDefault();
    const formErrros = validateForm();

    if (Object.keys(formErrros).length > 0) {
      setErrors(formErrros);
    } else {
      console.log(userdata);
      postUserList(userdata, headers);
      setUserData({
        fullName: "",
        mobileNumber: "",
        email: "",
        password: "",
        userName: "",
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
            width: "680px", // Styles for tablet view (adjust the range and width as needed)
          },
          // height: { md: "100vh", xs: "220vh", sm: "120vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Users
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/course-menu">
            User Menu
          </Link>
          <Typography color="#51678f">User-Profiles</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add User-List
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
                  <b>Phone</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Role</b>
                </TableCell>
                <TableCell>
                  <b>Username</b>
                </TableCell>
                <TableCell>
                  <b>Created By</b>
                </TableCell>
                <TableCell>
                  <b>Updated By</b>
                </TableCell>
                <TableCell>
                  <b>Created Date</b>
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
                <TableRow key={p.userId}>
                  <TableCell>{p.userId}</TableCell>
                  <TableCell>{p.fullName}</TableCell>
                  <TableCell>{p.mobileNumber}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.roleDto}</TableCell>
                  <TableCell>{p.userName}</TableCell>
                  <TableCell>{p.createdBy}</TableCell>
                  <TableCell>{p.updatedBy}</TableCell>
                  <TableCell>{p.insertedDate}</TableCell>
                  <TableCell>{p.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(p.userId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton>
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
            {editMode ? "Edit User-list" : "Add User-list"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
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
                    label="Mobile Number "
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
                    name="email"
                    value={userdata.email}
                    onChange={changehandler}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={roleError}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={selectedRole}
                      onChange={(e) => handleRoleChange(e.target.value)}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {roleError ? "Please select a role" : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="User Name"
                    name="userName"
                    value={userdata.userName}
                    onChange={changehandler}
                    error={!!errors.userName}
                    helperText={errors.userName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={userdata.password}
                    onChange={changehandler}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <Button
                  onClick={(e) => {
                    if (editMode) {
                      UpdateData(e);
                      setOpen(false);
                    } else {
                      postData(e);
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
