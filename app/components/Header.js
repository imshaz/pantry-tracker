"use client";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@fontsource/quicksand/700.css"; // Ensure you install this package using `npm install @fontsource/quicksand`
import Image from "next/image";
const theme = createTheme({
  typography: {
    fontFamily: "Quicksand, Arial",
    fontWeightBold: 700,
  },
});

const Header = () => {
  const router = useRouter();

  const handleNavigate = (path) => () => {
    router.push(path);
  };

  const handleTitleClick = () => {
    router.push("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#1b263b",
          width: "100%",
          top: 0,
          left: 0,
          zIndex: 1201,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/Pantry-Pro-logo.png"
              alt="Logo"
              style={{ width: "40px", height: "40px", marginRight: "8px" }}
              width={40}
              height={40}
            />
            <Typography
              variant="h5"
              color="white"
              fontWeight="bold"
              sx={{ cursor: "pointer" }}
              onClick={handleTitleClick}
            >
              Pantry Tracker
            </Typography>
          </Box>

          <List
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Divider orientation="vertical" flexItem />
            <ListItem button onClick={handleNavigate("/")}>
              <ListItemText
                primary="Home"
                primaryTypographyProps={{ variant: "body1", color: "white" }}
              />
            </ListItem>
            <Divider orientation="vertical" flexItem />
            <ListItem button onClick={handleNavigate("/inventory")}>
              <ListItemText
                primary="Add Items"
                primaryTypographyProps={{
                  variant: "body1",
                  color: "white",
                  sx: { whiteSpace: "nowrap" },
                }}
              />
            </ListItem>
            <Divider orientation="vertical" flexItem />
          </List>
        </Toolbar>
      </AppBar>

      <Box sx={{ minHeight: "64px" }} />
    </ThemeProvider>
  );
};

export default Header;
