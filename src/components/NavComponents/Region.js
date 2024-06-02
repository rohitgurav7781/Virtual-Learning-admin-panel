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
  deleteRegion,
  fetchRegion,
  getRegionById,
  PostRegion,
  updatedRegion,
} from "../API's/RegionApi";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Footer from "./Footer";

export default function Region() {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState([]);

  const [regionId, setRegionId] = useState();

  const [initialValues, setInitialValues] = useState({
    regionName: "",
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
      regionName: "",
      description: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    regionName: "",
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

    if (!userdata.regionName || userdata.regionName.trim() === "") {
      newErrors.regionName = "Enter the Full Name";
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

  //todo ==> GET Region DATA
  const FetchData = async () => {
    let res = await fetchRegion(headers, userdata);
    // console.log(res.data.content);

    var fetcheddata = res.data.content;
    // console.log(res.data.content);

    const tabledata = [];

    fetcheddata.map((u) => {
      tabledata.push({
        regionId: u.regionId,
        regionName: u.regionName === null ? "no name" : u.regionName,
        description: u.description,

        createdBy: u.createdBy ? u.createdBy.userName : "No User",
        updatedBy: u.updatedBy ? u.updatedBy.userName : "No User",
        insertedDate: moment(u.insertedDate).format("L"),
        updatedDate: moment(u.updatedDate).format("L"),
      });
    });
    //console.log(tabledata);
    setRegion(tabledata);
  };

  //todo ==> GET DATA BY Region ID
  const handleEdit = async (id) => {
    //  console.log(id);
    setEditMode(true); // Set editMode to true
    setOpen(true);
    var res = await getRegionById(id, headers);
    console.log(res);

    let det = res.data;
    setRegionId(det.regionId);
    setUserData({
      regionName: det.regionName,
      description: det.description,
    });
  };

  // todo==> UPDATE Region
  const updatedata = async (e) => {
    // console.log("hi")
    e.preventDefault();

    var updateddata = {
      ...userdata,
      regionId,
      updatedBy: { userId: user.userId },
    };
    console.log(updateddata);

    const respp = await updatedRegion(updateddata, headers);

    //setbatchId("");
    FetchData();
  };

  //todo ==> DELETE  Region DATA
  const handleDelete = async (id) => {
    console.log(id);
    await deleteRegion(id, headers);
    await FetchData();
  };

  const postdata = async (e) => {
    e.preventDefault();

    const formErrors = validateform();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log(userdata);

      await PostRegion(userdata, headers);
      setUserData({
        regionName: "",
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
          height: { md: "68vh", xs: "70vh", sm: "85vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Region
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/master">
            Masters
          </Link>
          <Typography color="#51678f">Region</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Region
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
              {region.map((r) => (
                <TableRow key={r.regionId}>
                  <TableCell>{r.regionId}</TableCell>
                  <TableCell>{r.regionName}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>{r.createdBy}</TableCell>
                  <TableCell>{r.updatedBy}</TableCell>
                  <TableCell>{r.insertedDate}</TableCell>
                  <TableCell>{r.updatedDate}</TableCell>

                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(r.regionId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(r.regionId);
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
            {editMode ? "Edit Region" : "Add Region"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Region Name"
                    name="regionName"
                    value={userdata.regionName}
                    onChange={changehandler}
                    error={!!errors.regionName}
                    helperText={errors.regionName}
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
