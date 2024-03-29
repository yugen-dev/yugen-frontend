/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PriceApiResponse, PriceState } from "state/types";

const initialState: PriceState = {
  isLoading: false,
  lastUpdated: null,
  data: null,
};

// Thunks
export const fetchPrices = createAsyncThunk<PriceApiResponse>(
  "prices/fetch",
  async () => {
    const response = await fetch(
      "https://api.polydex.org/api/tokens"
    );
    const data = (await response.json()) as PriceApiResponse;
    // @ts-ignore

    // Return normalized token names
    return {
      update_at: data.update_at,
      // @ts-ignore
      prices: Object.keys(data.data).reduce((accum, token) => {
        return {
          ...accum,
          // @ts-ignore
          [token.toLowerCase()]: data.data[token].price,
        };
      }, {}),
    };
  }
);

export const pricesSlice = createSlice({
  name: "prices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPrices.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchPrices.fulfilled,
      (state, action: PayloadAction<PriceApiResponse>) => {
        state.isLoading = false;
        state.lastUpdated = action.payload.update_at;
        state.data = action.payload.prices;
      }
    );
  },
});

export default pricesSlice.reducer;
