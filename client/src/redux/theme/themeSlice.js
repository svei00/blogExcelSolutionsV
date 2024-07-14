import { createSlice } from "@reduxjs/toolkit";

const getSystemThemePreference = () => {
  if (
    window.matchMedia &&
    Window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const initialState = {
  theme: "system",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      if (state.theme === "system") {
        state.theme = "light";
      } else if (state.theme === "light") {
        state.theme = "dark";
      } else {
        state.theme = "system";
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
