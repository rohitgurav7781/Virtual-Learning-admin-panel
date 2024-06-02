import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import { Colors } from "../styles/theme";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import LaptopIcon from "@mui/icons-material/Laptop";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import CategoryIcon from "@mui/icons-material/Category";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import AdUnitsIcon from "@mui/icons-material/AdUnits";
import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  MyListItemButton,
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "./AppBar1";
import { Button, Divider, Drawer } from "@mui/material";
import Swal from "sweetalert2";
import { Route, Routes, useNavigate } from "react-router-dom";

//pages

import { useState } from "react";

import { useEffect } from "react";
import Dashboard from "./NavComponents/Dashboard";
import {
  BatchPrediction,
  CloudCircleSharp,
  ReceiptLong,
  TimelapseRounded,
} from "@mui/icons-material";
import BatchHome from "./NavComponents/BatchHome";
import CourseHome from "./NavComponents/course";
import StoreMain from "./NavComponents/StoreComponent";
import Masters from "./NavComponents/Masters";
import AdHome from "./NavComponents/Advertisement";
import SuccessStory from "./NavComponents/SuccessStory";
import News from "./NavComponents/News";
import Category from "./NavComponents/Category";
import Promo from "./NavComponents/Promo";
import Notifications from "./NavComponents/Notifications";
import Payment from "./NavComponents/Payment";
import Banner from "./NavComponents/Banner";
import TimeTable from "./NavComponents/TimeTable";
import UserHome from "./NavComponents/UserHome";
import Settings from "./NavComponents/Settings";
import BatchCourse from "./NavComponents/BatchComponent";
import Footer from "./NavComponents/Footer";
import BatchCandidate from "./NavComponents/BatchCourse";
import BatchModule from "./NavComponents/BatchModule";
import BatchTopic from "./NavComponents/BatchTopic";
import CourseModule from "./NavComponents/courseModule";
import CourseTopic from "./NavComponents/courseTopic";
import NotificationHome from "./NavComponents/NotificationMain";
import {
  fetchNavNews,
  fetchNotifications,
  fetchSuccessStories,
} from "./API's/NavDrawerApi";
import UserCandidate from "./NavComponents/Candidates";
import UserList from "./NavComponents/UserList";
import CourseMain from "./NavComponents/CourseMain";
import Discount from "./NavComponents/Discount";
import Language from "./NavComponents/Language";
import Region from "./NavComponents/Region";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Logo = styled("div")({
  display: "flex",
  alignItems: "center",
  // marginLeft: "-10px",
  marginRight: (theme) => theme.spacing(2),

  "& img": {
    width: "60px",
    height: "45px",
    marginRight: (theme) => theme.spacing(1),
  },
});

export default function NavDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [isNotificationsMenuOpen, setNotificationsMenuOpen] = useState(false);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [newsCount, setNewsCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const handleNotificationsClick = (event) => {
    setNotificationsMenuOpen(true);
    setAnchorElNotifications(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsMenuOpen(false);
    setAnchorElNotifications(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const handleNews = () => {
    navigate("/news");
  };

  const handleSuccess = () => {
    navigate("/success");
  };

  const handleCart = () => {
    navigate("/cart");
  };

  const handleNavbarItemClicked = (item) => {
    setSelectedItem(item);
    if (item === "logout") {
      handleLogout();
    } else {
      navigate(item);
      handleDrawerClose();
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    Swal.fire("Logout Successful");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/account");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{ mt: 6, ml: 1.4 }}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleProfile();
        }}
      >
        <AccountBoxIcon sx={{ mr: 1 }} />
        My Profile
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleSettings();
        }}
      >
        <SettingsSuggestRoundedIcon sx={{ mr: 1 }} />
        Account Settings
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleMenuClose();
          window.open("https://bitstreamio.com", "_blank");
        }}
      >
        <QuestionMarkIcon sx={{ mr: 1 }} />
        Need Help?
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleLogout();
        }}
      >
        <ExitToAppIcon sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  // Fetch news count from the API on component mount
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch news data and get the length to determine the badge content
        const newsData = await fetchNavNews(user.accessToken);
        setNewsCount(newsData.length);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch success count from the API on component mount
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      try {
        // Fetch success stories data and get the length to determine the badge content
        const successData = await fetchSuccessStories(user.accessToken);
        setSuccessCount(successData.length);
      } catch (error) {
        console.error("Error fetching success stories data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const notifiData = await fetchNotifications(user.accessToken);
        setNotifications(notifiData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gridTemplateRows: "auto",
          gridTemplateAreas: `
        "menu appbar mobileMenu"
      `,
          height: "100%",
        }}
      >
        <CssBaseline />
        <AppBar
          position="fixed"
          open={open}
          sx={{
            gridArea: "appbar",
            background: "white  ",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon sx={{ color: Colors.black }} />
            </IconButton>
            {!open && (
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ color: "darkblue", marginLeft: "-35px" }}
                fontWeight="bold"
              >
                <Logo>
                  <img src="https://www.bitstreamio.com/User/static/media/logo.bfe1e18cb41a0e4f805e.png" />
                  <Typography
                    sx={{ fontSize: "20px", fontWeight: "bold", mr: "20px" }}
                  >
                    BitstreamIO
                  </Typography>
                </Logo>
              </Typography>
            )}
            <Search open={open} sx={{ background: Colors.background }}>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: Colors.light }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            {/* //Icons// */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton size="large" sx={{ color: Colors.black }}>
                <Badge badgeContent={newsCount} color="error">
                  <NewspaperIcon onClick={handleNews} />
                </Badge>
              </IconButton>

              <IconButton size="large" sx={{ color: Colors.black }}>
                <Badge badgeContent={successCount} color="error">
                  <EventAvailableIcon onClick={handleSuccess} />
                </Badge>
              </IconButton>

              {/* //Notifications // */}
              <IconButton
                size="large"
                sx={{ color: Colors.black, cursor: "pointer" }}
                onMouseEnter={handleNotificationsClick}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={anchorElNotifications}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                id="notifications-menu"
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={isNotificationsMenuOpen}
                onClose={handleNotificationsClose}
                sx={{ mt: 6, width: 300 }}
              >
                <MenuItem>
                  <Typography
                    sx={{ fontWeight: "bold", ml: -1, cursor: "auto" }}
                  >
                    You have {notifications.length} notification
                    {notifications.length !== 1 ? "s" : ""}
                  </Typography>

                  <Button
                    sx={{
                      color: "white",
                      background: "blue",
                      "&:hover": {
                        background: "blue",
                      },
                      ml: 1,
                      fontSize: "10px",
                      borderRadius: "15px",
                      textTransform: "none",
                    }}
                    href="/notifications"
                  >
                    View all
                  </Button>
                </MenuItem>
                <hr />
                {notifications.map((notify) => (
                  <MenuItem>{notify.title}</MenuItem>
                ))}
                <hr />
                <MenuItem href="/notifications" sx={{ textAlign: "center" }}>
                  Show All Notifications
                </MenuItem>
              </Menu>

              <IconButton size="large" sx={{ color: Colors.black }}>
                <Badge color="error">
                  <ShoppingCartIcon onClick={handleCart} />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onMouseEnter={handleProfileMenuOpen}
                sx={{ color: Colors.black, cursor: "pointer" }}
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Typography style={{ color: "black" }}></Typography>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon
                  sx={{ color: Colors.black }}
                  onClick={handleProfileMenuOpen}
                />
              </IconButton>
            </Box>
          </Toolbar>
          {renderMenu}
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader sx={{ background: "white" }}>
            {open && (
              <Typography
                variant="h6"
                noWrap
                component="div"
                fontWeight="bold"
                sx={{ color: "darkblue", cursor: "pointer" }}
                onClick={handleDashboard}
              >
                <Logo>
                  <img src="https://www.bitstreamio.com/User/static/media/logo.bfe1e18cb41a0e4f805e.png" />
                  <Typography sx={{ fontSize: "19px", fontWeight: "bold" }}>
                    BitstreamIO
                  </Typography>
                </Logo>
              </Typography>
            )}
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />

          <List sx={{ background: "white", height: "100%" }}>
            <ListItem disablePadding>
              <MyListItemButton
                text={"Dashboard"}
                icons={<DashboardIcon />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("dashboard")
                }
                selected={selectedItem.includes("dashboard")}
              />
            </ListItem>

            <ListItem disablePadding>
              <MyListItemButton
                text={"Batch"}
                icons={<BatchPrediction />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("batch-menu")
                }
                selected={selectedItem.includes("batch-menu")}
              />
            </ListItem>

            {/* Course */}
            <ListItem disablePadding>
              <MyListItemButton
                text={"Course"}
                icons={<CloudCircleSharp />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("course-menu")
                }
                selected={selectedItem.includes("course-menu")}
              />
            </ListItem>

            {/* store */}
            <ListItem disablePadding>
              <MyListItemButton
                text={"Store"}
                icons={<ReceiptLong />}
                handleNavbarItemClicked={() => handleNavbarItemClicked("store")}
                selected={selectedItem.includes("store")}
              />
            </ListItem>

            {/* Masters */}
            <ListItem disablePadding>
              <MyListItemButton
                text={"Masters"}
                icons={<CategoryIcon />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("master")
                }
              />{" "}
            </ListItem>

            <ListItem disablePadding>
              <MyListItemButton
                text={"Advertisement"}
                icons={<AdUnitsIcon />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("advertisement")
                }
              />
            </ListItem>

            <ListItem disablePadding>
              <MyListItemButton
                text={"Success Story"}
                icons={<EventAvailableIcon />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("success")
                }
                selected={selectedItem.includes("success")}
              />
            </ListItem>

            <ListItem disablePadding>
              <MyListItemButton
                text={"News"}
                icons={<NewspaperIcon />}
                handleNavbarItemClicked={() => handleNavbarItemClicked("news")}
                selected={selectedItem.includes("news")}
              />
            </ListItem>

            <ListItem disablePadding>
              <MyListItemButton
                text={"Notifications"}
                icons={<NotificationsNoneIcon />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("noti-menu")
                }
                selected={selectedItem.includes("noti-menu")}
              />
            </ListItem>

            <ListItem disablePadding>
              <MyListItemButton
                text={"Payments"}
                icons={<PaymentIcon />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("payments")
                }
                selected={selectedItem.includes("payments")}
              />
            </ListItem>

            {/* timeTable */}
            <ListItem disablePadding>
              <MyListItemButton
                text={"Time Table"}
                icons={<TimelapseRounded />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("timetable")
                }
                selected={selectedItem.includes("timetable")}
              />
            </ListItem>

            {/* user-man */}
            <ListItem disablePadding>
              <MyListItemButton
                text={"User Management"}
                icons={<PersonIcon />}
                handleNavbarItemClicked={() => handleNavbarItemClicked("user")}
              />{" "}
            </ListItem>

            <ListItem disablePadding>
              <MyListItemButton
                text={"Settings"}
                icons={<SettingsSuggestRoundedIcon />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("settings")
                }
                selected={selectedItem.includes("settings")}
              />
            </ListItem>

            <ListItem disablePadding>
              <MyListItemButton
                text={"Logout"}
                icons={<ExitToAppIcon />}
                handleNavbarItemClicked={() =>
                  handleNavbarItemClicked("logout")
                }
                selected={selectedItem.includes("logout")}
              />
            </ListItem>
          </List>
        </Drawer>

        <Box
          sx={{
            display: "flex",
            // background: Colors.background,
            height: "100%",
            width: "100%",
          }}
        >
          <Main open={open}>
            <DrawerHeader />
            <Routes>
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="/batch-menu" element={<BatchHome />} />
              <Route exact path="/batch" element={<BatchCourse />} />
              <Route exact path="/batchCourse" element={<BatchCandidate />} />
              <Route exact path="/batchModule" element={<BatchModule />} />
              <Route exact path="/batchTopic" element={<BatchTopic />} />
              <Route exact path="/course-menu" element={<CourseHome />} />
              <Route exact path="/course" element={<CourseMain />} />
              <Route exact path="/courseModule" element={<CourseModule />} />
              <Route exact path="/courseTopic" element={<CourseTopic />} />
              <Route exact path="/store" element={<StoreMain />} />
              <Route exact path="/master" element={<Masters />} />
              <Route exact path="/discount" element={<Discount />} />
              <Route exact path="/language" element={<Language />} />
              <Route exact path="/region" element={<Region />} />
              <Route exact path="/advertisement" element={<AdHome />} />
              <Route exact path="/success" element={<SuccessStory />} />
              <Route exact path="/news" element={<News />} />
              <Route exact path="/category" element={<Category />} />
              <Route exact path="/promo" element={<Promo />} />
              <Route exact path="/banner" element={<Banner />} />
              <Route exact path="/noti-menu" element={<NotificationHome />} />
              <Route exact path="/notifications" element={<Notifications />} />
              <Route exact path="/payments" element={<Payment />} />
              <Route exact path="/timetable" element={<TimeTable />} />
              <Route exact path="/user" element={<UserHome />} />
              <Route exact path="/userList" element={<UserList />} />
              <Route exact path="/candidates" element={<UserCandidate />} />
              <Route exact path="/settings" element={<Settings />} />
            </Routes>
            {/* <Divider /> */}
          </Main>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
