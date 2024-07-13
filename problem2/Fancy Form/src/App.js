import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  FormHelperText,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
//import currencyImage
import currencyImages from "./currency_images";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [prices, setPrices] = useState({});
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://interview.switcheo.com/prices.json")
      .then((response) => {
        const data = response.data;
        const uniqueCurrencies = [
          ...new Set(data.map((item) => item.currency)),
        ];
        const priceMap = {};
        data.forEach((item) => {
          priceMap[item.currency] = item.price;
        });
        setCurrencies(uniqueCurrencies);
        setPrices(priceMap);
      })
      .catch((error) => {
        console.error("Error fetching prices:", error);
      });
  }, []);

  const handleSwap = () => {
    if (!fromCurrency || !toCurrency || !amount) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (fromCurrency === toCurrency) {
      setError("Vui lòng chọn hai loại tiền tệ khác nhau");
      return;
    }

    const fromPrice = prices[fromCurrency];
    const toPrice = prices[toCurrency];

    if (!fromPrice || !toPrice) {
      setError("Không có thông tin giá cho các loại tiền tệ đã chọn");
      return;
    }

    const result = (amount * fromPrice) / toPrice;
    setResult(result);
    setError("");
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Currency Swap Form
        </Typography>
        <TextField
          select
          label="Từ"
          fullWidth
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          margin="normal"
          variant="outlined"
        >
          {currencies.map((currency) => (
            <MenuItem key={currency} value={currency}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={currencyImages[currency]} alt={currency} />
                </ListItemAvatar>
                <ListItemText primary={currency} />
              </ListItem>
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sang"
          fullWidth
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          margin="normal"
          variant="outlined"
        >
          {currencies.map((currency) => (
            <MenuItem key={currency} value={currency}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={currencyImages[currency]} alt={currency} />
                </ListItemAvatar>
                <ListItemText primary={currency} />
              </ListItem>
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Số lượng"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          variant="outlined"
          type="number"
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <Box my={2}>
          <Button variant="contained" color="primary" onClick={handleSwap}>
            Swap
          </Button>
        </Box>
        {result && (
          <Typography variant="h6">
            {amount} {fromCurrency} is equivalent to {result.toFixed(4)}{" "}
            {toCurrency}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default App;
