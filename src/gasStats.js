import React, { useEffect, useState } from 'react';
import axios from 'axios';

const fetchGasFees = async () => {
  try {
    const apiKey = '7ac01929-43c6-4e95-94f2-4ea125619b2b'; // Replace with your actual API key
    const endpoint = 'https://www.oklink.com/api/v5/explorer/polygon/api?module=gastracker&action=gasoracle'; // Replace with the actual endpoint

    const response = await axios.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'OK-ACCESS-KEY': apiKey, // Include the OK-ACCESS-KEY header with your API key
      },
    });

    if (response.status === 200) {
      // Assuming the response includes a 'gasFees' field
      const gasFeesData = response.data.result.SafeGasPrice;
      const formattedGas = Number(gasFeesData).toFixed(0);
      return formattedGas;
    } else {
      console.error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching gas fees:', error);
  }
};

fetchGasFees();

export default fetchGasFees;
