import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: "light",
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            const theme = action.payload;
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(theme);
            localStorage.setItem("vite-ui-theme", theme);
            state.theme = theme; 
        },
        loadThemeFromStorage: (state, action) => {
            const { storageKey, defaultTheme } = action.payload;
            const storedTheme = localStorage.getItem(storageKey) || defaultTheme;
            state.theme = storedTheme; 
        },
        initializeTheme: (state) => {
            if (typeof window !== "undefined") {
                const storedTheme = localStorage.getItem("vite-ui-theme");
                const themeToApply = storedTheme || "light";

                // Apply the theme to the HTML root element
                const root = window.document.documentElement;
                root.classList.remove("light", "dark");
                root.classList.add(themeToApply);

                state.theme = themeToApply; 
            }
        },
    },
});

export const { setTheme, loadThemeFromStorage, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
