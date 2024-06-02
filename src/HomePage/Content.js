import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Modal,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";
import LanguageIcon from "@mui/icons-material/Language";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import MenuIcon from "@mui/icons-material/Menu";

import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Login from "./Login";
import Register from "./Register";

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  margin: "0px 40px",
  alignItems: "center",
  height: "90vh",
  "@media (min-width: 600px)": {
    flexDirection: "row",
  },
  "@media (min-width: 768px)": {
    flexDirection: "column",
  },
  "@media (min-width: 800px)": {
    flexDirection: "row",
  },
});

const TextContainer = styled(Box)({
  flex: 1,
  margin: "20px",
  "@media (min-width: 600px)": {
    maxWidth: "100%",
    margin: "20px 20px",
  },
});

const Image = styled("img")({
  maxWidth: "100%",
  height: "auto",
  marginLeft: "16px",
  marginRight: "40px",
  marginTop: "20px",
  "@media (max-width: 960px)": {
    float: "none",
    margin: "20px 0",
  },
  "@media (min-width: 768px)": {
    order: 1,
    marginTop: "20px",
  },
});

const ButtonContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginTop: "16px",
});

const CustomButton = styled(Button)({
  backgroundColor: "#2196F3",
  color: "#fff",
  marginRight: "8px",
  display: "flex",
  alignItems: "center",
});

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#fff",
  boxShadow: "none",
  position: "sticky",
  height: "70px",
  "@media (max-width: 600px)": {
    height: "60px",
    position: "sticky",
  },
});

const Logo = styled("div")({
  display: "flex",
  alignItems: "center",
  marginLeft: "30px",
  marginRight: (theme) => theme.spacing(2),
  "@media (max-width: 600px)": {
    marginLeft: "-10px",
  },
  "& img": {
    width: "60px",
    height: "auto",
    marginRight: (theme) => theme.spacing(1),
  },
});

const Title = styled(Typography)({
  display: "flex",
  alignItems: "center",
  color: "darkblue",
  fontSize: "35px",
  marginRight: (theme) => theme.spacing(2),
  "@media (max-width: 600px)": {
    fontSize: "30px",
  },
});

const ToggleButton = styled(Button)({
  display: "none",
  "@media (max-width: 600px)": {
    display: "block",
    marginLeft: "60px",
    fontSize: "50px",
  },
});

const LoginButton = styled(Button)({
  display: "block",
  "@media (max-width: 960px)": {
    display: "none",
  },
  marginLeft: "auto",
  marginRight: "30px",
});

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#333",
  textAlign: "center",
  position: "relative",
  height: "auto",
  borderBottom: "1px solid #ccc",
  borderTop: "1px solid #ccc",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
}));

const FooterContent = styled(Box)({
  flex: 1,
  textAlign: "left",
  margin: "10px",
  padding: "10px",
});

const FooterLogo = styled("img")({
  width: "50px",
  marginRight: "8px",
});

const ContactContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
  fontSize: "20px",
  margin: "10px",
});

const ContactInfo = styled(Box)({
  textAlign: "left",
});

const CopyRightText = styled(Typography)({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  marginTop: "25px",
  fontSize: { xs: "12px", sm: "14px" },
  textAlign: "center",
  display: "block",
  whiteSpace: "nowrap",
});

const Desc = styled(Typography)({
  margin: "10px",
  "@media (max-width: 600px)": {
    textAlign: "center",
  },
});

const Icons = styled(Box)({
  margin: "10px",
  display: "flex",
  alignItems: "start",
  justifyContent: "start",
  cursor: "pointer",
  "& .MuiSvgIcon-root": {
    filter: "blur(0.5px)",
    transition: "filter 0.3s ease",
  },
  "& .MuiSvgIcon-root:hover": {
    filter: "blur(0)",
    fontWeight: "bold",
  },
  "& .MuiSvgIcon-root + .MuiSvgIcon-root": {
    marginLeft: "10px",
  },
  "@media (max-width: 600px)": {
    marginTop: 25,
  },
});

const Content = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  const handleLogin = () => {
    setOpenLoginModal(true);
  };

  const handleRegister = () => {
    setOpenRegisterModal(true);
  };

  const handleToggle = () => {
    setOpenLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  const handleCloseRegisterModal = () => {
    setOpenRegisterModal(false);
  };

  return (
    <>
      {/* Header */}
      <StyledAppBar>
        <Toolbar>
          <Logo>
            <img
              src="https://www.bitstreamio.com/User/static/media/logo.bfe1e18cb41a0e4f805e.png"
              alt="BitstreamIO Logo"
            />
          </Logo>
          <Title>BitstreamIO</Title>

          {/* Toggle button for smaller screens */}
          <ToggleButton onClick={handleToggle}>
            <MenuIcon
              sx={{ color: "darkblue", width: "30px", height: "30px" }}
            />
          </ToggleButton>

          {/* Login button for larger screens */}
          <LoginButton
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </LoginButton>
        </Toolbar>
      </StyledAppBar>

      {/* Modals for Login and Register Forms */}
      <Modal
        open={openLoginModal}
        onClose={handleCloseLoginModal}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "5px",
            "@media (max-width: 600px)": { width: 275, padding: 4 },
          }}
        >
          <Login onClose={handleCloseLoginModal} />
        </Box>
      </Modal>

      {/* Modal for Register Form */}
      <Modal
        open={openRegisterModal}
        onClose={handleCloseRegisterModal}
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Register onClose={handleCloseRegisterModal} />
        </Box>
      </Modal>

      {/* Content */}
      <Box
        sx={{
          background:
            "url('https://www.bitstreamio.com/User/assets/img/hero-bg.png')",
        }}
      >
        <StyledBox>
          <TextContainer>
            <Typography
              variant="h3"
              sx={{
                color: "darkblue",
                marginBottom: 2,
                fontSize: "53px",
                textAlign: "center",
                "@media (max-width: 600px)": {
                  fontSize: "35px",
                  textAlign: "center",
                },
                "@media (min-width: 600px)": {
                  fontSize: "55px",
                },
              }}
            >
              Welcome to Programmers Hub
            </Typography>
            <Typography
              variant="h5"
              sx={{
                marginBottom: 2,
                textAlign: "center",
                color: "gray",
                "@media (max-width: 600px)": {
                  fontSize: "20px",
                  color: "gray",
                  textAlign: "center",
                },
              }}
            >
              Experience coding with Real-Time Projects, Corporate training
              programs based on essential training employees need to operate
              certain equipment.
            </Typography>
            <ButtonContainer>
              <CustomButton variant="contained">
                Web
                <LanguageIcon sx={{ marginRight: 2 }} />
              </CustomButton>
              <CustomButton variant="contained">
                Android
                <AndroidIcon sx={{ marginRight: 2 }} />
              </CustomButton>
              <CustomButton variant="contained">
                iOS
                <AppleIcon sx={{ marginRight: 2 }} />
              </CustomButton>
            </ButtonContainer>
          </TextContainer>
          <Image
            src="https://www.bitstreamio.com/User/assets/img/hero-img.png"
            alt="img"
          />
        </StyledBox>
      </Box>

      {/* Footer */}
      <Box sx={{ height: "60px" }}>
        <FooterContainer>
          <FooterContent>
            <Box
              display="flex"
              alignItems="center"
              mb={2}
              sx={{
                "@media (max-width: 600px)": {
                  display: "center",
                  justifyContent: "center",
                },
              }}
            >
              <FooterLogo
                src="https://www.bitstreamio.com/User/static/media/logo.bfe1e18cb41a0e4f805e.png"
                alt="BitstreamIO Logo"
              />
              <Typography variant="h6" sx={{ color: "darkblue" }}>
                BitstreamIO
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "15px",
                "@media (max-width: 600px)": {
                  display: "center",
                  textAlign: "center",
                  m: -1,
                },
              }}
            >
              BitStreamIO gives you the best career growth platforms that help
              to build the goal-oriented for a better future. Since 2019, we are
              giving better software training and technical solutions worldwide
              for effectively dealing with dynamic websites such as web
              applications, AL/ML/DL, SEO, Mobile Apps (Android, IoS, Hybrid),
              and many more.
            </Typography>
            <Icons>
              <TwitterIcon />
              <FacebookIcon />
              <InstagramIcon />
              <LinkedInIcon />
            </Icons>
          </FooterContent>
          <ContactContainer>
            <ContactInfo>
              <Desc sx={{ color: "darkblue", fontSize: "15px" }}>
                CONTACT US
              </Desc>
              <Desc sx={{ fontSize: "15px" }}>
                385/38 2nd Floor, 12th Main Rd, 6th Block, Rajajinagar,
                Bengaluru, Karnataka 560010
              </Desc>
              <Desc sx={{ fontSize: "15px" }}>Phone: +91 7975455855</Desc>
              <Desc sx={{ fontSize: "15px" }}>
                Email:
                <Link href="mailto:info@bitstreamio.com">
                  info@bitstreamio.com
                </Link>
              </Desc>
            </ContactInfo>
          </ContactContainer>
        </FooterContainer>
        <CopyRightText
          sx={{ fontSize: { xs: "12px", sm: "14px" }, margin: "10px" }}
        >
          © 2024 Copyright BitStreamIO. All Rights Reserved.
          <Typography
            sx={{ fontSize: { xs: "12px", sm: "14px" }, margin: "5px" }}
          >
            Designed by
            <Link
              href="https://www.walkinsoftwares.com/index.html"
              sx={{
                color: "blue",
                cursor: "pointer",
                ml: "5px",
                textDecoration: "none",
                display: "inline",
                textAlign: "center",
              }}
              target="_blank"
            >
              Walkin Software Technologies
            </Link>
          </Typography>
        </CopyRightText>
      </Box>
    </>
  );
};

export default Content;
