import React, { useEffect, useState } from "react";
import { AddCircle, DeleteForever, Edit } from "@mui/icons-material";
import "../CSS/Promo.css";
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
import {
  deletePromo,
  fetchPromo,
  getPromoById,
  postPromoData,
  updatedPromo,
} from "../API's/PromoApi";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";

export default function Promo() {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    promoName: "",
    description: "",
    youTube: "",
  });
  const [promo, setPromo] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [promoId, setrPromoId] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    FetchData();
  }, [refreshTrigger]);

  const handleAddProduct = () => {
    setInitialValues({
      promoName: "",
      description: "",
      youTube: "",
    });
    setOpen(true);
    setEditMode(false);
  };

  const [userdata, setUserData] = useState({
    promoName: "",
    description: "",
    youTube: "",
  });

  const [errors, setErrors] = useState({});

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const validateform = () => {
    const newErrors = {};

    if (!userdata.promoName || userdata.promoName.trim() === "") {
      newErrors.promoName = "Enter the Promo name";
    }

    if (!userdata.description || userdata.description.trim() === "") {
      newErrors.description = "Enter the product description";
    }

    if (!userdata.youTube || userdata.youTube.trim() === "") {
      newErrors.youTube = "Enter the YouTube link";
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
    setErrors({
      ...errors,
      [e.target.name]: null,
    });
  };

  //Get Promo Data
  const FetchData = async () => {
    let res = await fetchPromo(headers);

    // Assuming res.content is where your data is stored
    var fetchedData = res.content;

    // console.log(fetchedData);

    if (fetchedData) {
      var tabledata = fetchedData.map((p) => ({
        promoId: p.promoId,
        promoName: p.promoName,
        description: p.description,
        youTube: p.youTube,
        insertedDate: moment(p.insertedDate).format("L"),
        createdBy: p.createdBy ? p.createdBy.userName : "No User",
        updatedBy: p.updatedBy ? p.updatedBy.userName : "No User",
      }));

      setPromo(tabledata);
    } else {
      setPromo([]);
    }
  };

  //todo ==> DELETE  PROMO DATA
  const handleDelete = async (id) => {
    await deletePromo(headers, id);
    FetchData();
  };

  //todo ==> GET DATA BY PROMO ID
  const handleEdit = async (id) => {
    //  console.log(id);
    setEditMode(true); // Set editMode to true
    setOpen(true);
    var res = await getPromoById(headers, id);
    console.log(res);

    let det = res.data;
    setrPromoId(det.promoId);
    setUserData({
      promoName: det.promoName,
      description: det.description,
      youTube: det.youTube,
    });
  };

  // todo==> UPDATE PROMO
  const updatedata = async (e) => {
    e.preventDefault();
    //  console.log(userdata);
    console.log(promoId);
    var updateddata = {
      ...userdata,
      promoId,
      updatedBy: { userId: user.userId },
    };
    //  console.log(updateddata)
    const resp = await updatedPromo(headers, updateddata);
    console.log(resp);
    FetchData();
  };

  //todo ==> POST PROMO DATA
  const postdata = (e) => {
    e.preventDefault();
    const formErrros = validateform();
    if (Object.keys(formErrros).length > 0) {
      setErrors(formErrros);
    } else {
      console.log(userdata);
      // console.log(headers);

      postPromoData(userdata, headers).then(() => {
        setUserData({ promoName: "", description: "", youTube: "" });
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
            width: "700px", // Styles for tablet view (adjust the range and width as needed)
          },
          height: { md: "80vh", xs: "80vh", sm: "83.7vh" },
        }}
      >
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Advertisements
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" href="/dashboard">
            AdsMenu
          </Link>
          <Typography color="#51678f">Promo</Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={handleAddProduct}
        >
          {" "}
          Add Promo
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
                  <b>Promo ID</b>
                </TableCell>
                <TableCell>
                  <b>Promo Name</b>
                </TableCell>
                <TableCell>
                  <b>Description</b>
                </TableCell>
                <TableCell>
                  <b>YouTube</b>
                </TableCell>
                <TableCell>
                  <b>Inserted Date</b>
                </TableCell>
                <TableCell>
                  <b>Updated By</b>
                </TableCell>
                <TableCell>
                  <b>Created By</b>
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
              {promo.map((p) => (
                <TableRow key={p.promoId}>
                  <TableCell>{p.promoId}</TableCell>
                  <TableCell>{p.promoName}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>
                    {p.youTube && (
                      <iframe
                        title="YouTube Video"
                        src={`https://www.youtube.com/embed/${p.youTube}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        width="170px"
                        height="100px"
                      >
                        Watch Video
                      </iframe>
                    )}
                  </TableCell>
                  <TableCell>{p.insertedDate}</TableCell>
                  <TableCell>{p.updatedBy}</TableCell>
                  <TableCell>{p.createdBy}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        handleEdit(p.promoId);
                      }}
                    >
                      <Edit sx={{ color: Colors.success }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(p.promoId);
                      }}
                    >
                      <DeleteForever sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle sx={{ background: "whiteSmoke" }}>
            {editMode ? "Edit Promo" : "Add Promo"}
          </DialogTitle>

          <Container sx={{ mt: "10px" }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Promo Name"
                    name="promoName"
                    value={userdata.promoName}
                    onChange={changehandler}
                    error={!!errors.promoName}
                    helperText={errors.promoName}
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
                    label="YouTube"
                    name="youTube"
                    value={userdata.youTube}
                    onChange={changehandler}
                    error={!!errors.youTube}
                    helperText={errors.youTube}
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
