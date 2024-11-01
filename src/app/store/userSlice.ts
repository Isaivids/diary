import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  data: any | null;
}

const initialState: UserState = {
  data: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<any>) {
        console.log(action)
      state.data = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
