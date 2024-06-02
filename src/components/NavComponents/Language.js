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
import Paper from "@mui/material/Paper";
import moment from "moment/moment";

import { BaseUrl } from "../../BaseUrl";
import {
  deleteLang,
  fetchLanguage,
  getLanguageById,
  PostLangauge,
  updatedLang,
} from "../API's/LanguageApi";
import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function Language() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState([]);

  const [languageId, setLanguageId] = useState();

  const [initialValues, setInitialValues] = useState({
    languageName: "",
    description: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [userId, setrUserId] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setUserData({
      languageName: "",
      description: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    languageName: "",
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

    if (!userdata.languageName || userdata.languageName.trim() === "") {
      newErrors.languageName = "Enter the Full Name";
    }

    if (!userdata.description || userdata.description.trim() === "") {
      newErrors.description = "Enter the  description ";
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
    let res = await fetchLanguage(headers, userdata);
    // console.log(res.data.content);

    var fetcheddata = res.data.content;
    // console.log(res.data.content);

    const tabledata = [];

    fetcheddata.map((u) => {
      tabledata.push({
        languageId: u.languageId,
        languageName: u.languageName === null ? "no name" : u.languageName,
        description: u.description,
        discountPercent: u.discountPercent,
        createdBy: u.createdBy ? u.createdBy.userName : "No User",
        updatedBy: u.updatedBy ? u.updatedBy.userName : "No User",
        insertedDate: moment(u.insertedDate).format("L"),
        updatedDate: moment(u.updatedDate).format("L"),
      });
    });
    //console.log(tabledata);
    setLanguage(tabledata);
  };

  //todo ==> GET DATA BY BATCH ID
  const handleEdit = async (id) => {
    //  console.log(id);
    setEditMode(true); // Set editMode to true
    setOpen(true);
    var res = await getLanguageById(id, headers);
    console.log(res);

    let det = res.data;
    setLanguageId(det.languageId);
    setUserData({
      languageName: det.languageName,
      description: det.description,
    });
  };

  // todo==> UPDATE BATCH
  const updatedata = async (e) => {
    // console.log("hi")
    e.preventDefault();

    var updateddata = {
      ...userdata,
      languageId,
      updatedBy: { userId: user.userId },
    };
    console.log(updateddata);

    const respp = await updatedLang(updateddata, headers);

    //setbatchId("");
    FetchData();
  };

  //todo ==> DELETE  BATCH DATA
  const handleDelete = async (id) => {
    console.log(id);
    await deleteLang(id, headers);
    await FetchData();
  };

  const postdata = async (e) => {
    e.preventDefault();

    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log(userdata);

      await PostLangauge(userdata, headers);
      setUserData({
        languageName: "",
        description: "",
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
            width: "710px", // Styles for tablet view (adjust the range and width as needed)
          },
          height: { md: "70vh", xs: "80vh", sm: "85vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Language
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/master">
            Masters
          </Link>
          <Typography color="#51678f">Language</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Langauge
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
              {language.map((l) => (
                <TableRow key={l.languageId}>
                  <TableCell>{l.languageId}</TableCell>
                  <TableCell>{l.languageName}</TableCell>
                  <TableCell>{l.description}</TableCell>
                  <TableCell>{l.createdBy}</TableCell>
                  <TableCell>{l.updatedBy}</TableCell>
                  <TableCell>{l.insertedDate}</TableCell>
                  <TableCell>{l.updatedDate}</TableCell>

                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(l.languageId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(l.languageId);
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
            {editMode ? "Edit Langauge" : "Add Langauge"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Langauge Name"
                    name="languageName"
                    value={userdata.languageName}
                    onChange={changehandler}
                    error={!!errors.languageName}
                    helperText={errors.languageName}
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
