import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        bottom: 0,
        width: "100%",
        padding: "20px",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2024 Copyright <b>BitStreamIO.</b> All Rights Reserved
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Designed by <i>Walkin Software Technologies</i>
      </Typography>
    </Box>
  );
};

export default Footer;
