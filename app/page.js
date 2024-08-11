"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Modal,
  Card,
  CardContent,
  Stack,
  TextField,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Fade,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { firestore } from "@/firebase";
import {
  collection,
  query,
  getDocs,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState("");
  const [openRemove, setOpenRemove] = useState(false);

  const theme = useTheme();
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, "inventory"));
        const items = snapshot.docs.map((doc) => ({
          name: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched items:", items);
        setInventory(items);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    updateInventory();
  }, []);
  const handleOpenRemove = (item) => {
    setSelectedItem(item);
    setOpenRemove(!openRemove);
  };
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9",
      },
      secondary: {
        main: "#FFA500",
      },
      background: {
        default: "#121212",
        paper: "#1d1d1d",
      },
      text: {
        primary: "#ffffff",
        secondary: "#b0b0b0",
      },
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      h5: {
        fontWeight: 600,
      },
      body2: {
        fontSize: "0.9rem",
      },
    },
  });
  const confirmDelete = async () => {
    await deleteDoc(doc(collection(firestore, "inventory"), selectedItem));
    setOpenRemove(false);
    await updateInventory();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        bgcolor={darkTheme.palette.background.default}
        color={darkTheme.palette.text.primary}
        minHeight="100vh"
      >
        <Box p={4} display="flex" justifyContent="center">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: "100%",
              maxWidth: "500px",
              mb: 4,
              borderRadius: "50px",
              backgroundColor: darkTheme.palette.background.paper,
              ".MuiOutlinedInput-root": {
                borderRadius: "50px",
                "& fieldset": {
                  borderColor: darkTheme.palette.primary.main,
                },
                "&:hover fieldset": {
                  borderColor: darkTheme.palette.primary.light,
                },
                "&.Mui-focused fieldset": {
                  borderColor: darkTheme.palette.primary.dark,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {filteredInventory.map(({ name, quantity }) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
              <Fade in={true} timeout={500}>
                <Card
                  sx={{
                    minWidth: 275,
                    maxWidth: 300,
                    boxShadow: 6,
                    borderRadius: 2,
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                    backgroundColor: darkTheme.palette.background.paper,
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Quantity: {quantity}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <IconButton
                      color="secondary"
                      onClick={() => handleOpenRemove(name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => router.push("/inventory")}
                    >
                      <AddIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={openRemove}
          onClose={() => setOpenRemove(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Item"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRemove(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
