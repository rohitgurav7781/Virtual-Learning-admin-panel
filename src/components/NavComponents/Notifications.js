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
  deleteNotofication,
  fetchNofication,
  getNotoficationById,
  postBulkNotification,
} from "../API's/NotificationApi";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Footer from "./Footer";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    message: "",
    topic: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [bulkNotificationId, setBulkNotificationId] = useState("");
  const [bulkNotification, setBulkNotification] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setInitialValues({
      title: "",
      message: "",
      topic: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    title: "",
    message: "",
    topic: "",
  });

  const [errors, setErrors] = useState({});

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const validateform = () => {
    const newErrors = {};

    if (!userdata.title || userdata.title.trim() === "") {
      newErrors.title = "Enter the Notification Title";
    }

    if (!userdata.message || userdata.message.trim() === "") {
      newErrors.message = "Enter the  message";
    }

    if (!userdata.topic || userdata.topic.trim() === "") {
      newErrors.topic = "Enter the topic ";
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
  };

  //todo ==> POST BULK NOTIFICATION DATA
  const postdata = async (e) => {
    e.preventDefault();

    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log(userdata);
      await postBulkNotification(userdata, headers);
      setUserData({ message: "", title: "", topic: "" });
      setRefreshTrigger((prev) => !prev); // Trigger a refresh
    }
    FetchData();
  };

  //todo ==> GET  NOTIFICATION DATA
  const FetchData = async () => {
    let res = await fetchNofication(headers);
    console.log(res.data);

    var fetchedData = res.data.content;
    console.log(fetchedData);

    var tabledata = [];
    fetchedData.map((b) => {
      tabledata.push({
        bulkNotificationId: b.bulkNotificationId,
        title: b.title,
        message: b.message,
        topic: b.topic,
        updatedBy: b.updatedBy === null ? "No User" : b.updatedBy.userName,
        createdBy: b.createdBy ? b.createdBy.userName : "No User",
        insertedDate: moment(b.insertedDate).format("L"),
        updatedDate: moment(b.updatedDate).format("L"),
      });
    });
    setBulkNotification(tabledata);
  };

  //todo ==> GET DATA BY NOTIFICATION  ID

  const handleEdit = async (id) => {
    setEditMode(true); // Set editMode to true
    setOpen(true);
    var res = await getNotoficationById(headers, id);
    console.log(res);
    let det = res.data;
    console.log(det);
    setBulkNotificationId(det.bulkNotificationId);
    setUserData({ message: det.message, title: det.title, topic: det.topic });
  };

  // todo==> Delete NOTIFICATION
  const handleDelete = async (id) => {
    await deleteNotofication(headers, id);
    FetchData();
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          "@media (max-width: 600px)": {
            width: "300px", // Styles for mobile view
          },
          "@media (min-width: 601px) and (max-width: 1200px)": {
            width: "680px", // Styles for tablet view (adjust the range and width as needed)
          },
          height: { md: "75vh", xs: "60vh", sm: "87vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Notifications
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">Notifications</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Notifications
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
                  <b>Title</b>
                </TableCell>
                <TableCell>
                  <b>Message</b>
                </TableCell>
                <TableCell>
                  <b>Topic</b>
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
              {bulkNotification.map((p) => (
                <TableRow key={p.bulkNotificationId}>
                  <TableCell>{p.bulkNotificationId}</TableCell>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.message}</TableCell>
                  <TableCell>{p.topic}</TableCell>
                  <TableCell>{p.createdBy}</TableCell>
                  <TableCell>{p.updatedBy}</TableCell>
                  <TableCell>{p.insertedDate}</TableCell>
                  <TableCell>{p.updatedDate}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(p.bulkNotificationId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(p.bulkNotificationId);
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
            {editMode ? "Edit Notification" : "Add Notification"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Notification Title"
                    name="title"
                    value={userdata.title}
                    onChange={changehandler}
                    error={!!errors.title}
                    helperText={errors.title}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={userdata.message}
                    onChange={changehandler}
                    error={!!errors.message}
                    helperText={errors.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="topic"
                    name="topic"
                    value={userdata.topic}
                    onChange={changehandler}
                    error={!!errors.topic}
                    helperText={errors.topic}
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <Button
                  onClick={(e) => {
                    postdata(e);
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
