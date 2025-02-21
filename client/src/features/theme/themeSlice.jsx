import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: JSON.parse(localStorage.getItem("darkmode") ) || false,
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers:{
        toggleTheme : (state)=>{
            const newDarkTheme = !state.darkMode;
            localStorage.setItem("darkmode" , JSON.stringify(newDarkTheme))
         return {...state, darkMode : newDarkTheme};
        },
    },
});

export const { toggleTheme } = themeSlice.actions;


export default themeSlice.reducer