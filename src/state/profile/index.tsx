/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileState } from "state/types";
import getProfile, { GetProfileResponse } from "./getProfile";

const initialState: ProfileState = {
  isInitialized: false,
  isLoading: true,
  hasRegistered: false,
  data: null,
  metaTranscation: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    profileFetchStart: (state) => {
      state.isLoading = true;
    },
    profileFetchSucceeded: (
      state,
      action: PayloadAction<GetProfileResponse>
    ) => {
      const { profile, hasRegistered } = action.payload;

      return {
        metaTranscation: state.metaTranscation,
        isInitialized: true,
        isLoading: false,
        hasRegistered,
        data: profile,
      };
    },
    profileFetchFailed: (state) => {
      state.isLoading = false;
      state.isInitialized = true;
    },
    addPoints: (state, action: PayloadAction<number>) => {
      state.data.points += action.payload;
    },
    toggleMetaTranscationState: (
      state,
      action
    ) => {
      return {
        ...state,
        metaTranscation: action.payload,
      };
    },
  },
});

// Actions
export const {
  profileFetchStart,
  profileFetchSucceeded,
  profileFetchFailed,
  addPoints,
  toggleMetaTranscationState,
} = profileSlice.actions;

// Thunks
export const fetchProfile = (address: string) => async (dispatch) => {
  try {
    dispatch(profileFetchStart());
    const response = await getProfile(address);
    dispatch(profileFetchSucceeded(response));
  } catch (error) {
    dispatch(profileFetchFailed());
  }
};

export default profileSlice.reducer;
