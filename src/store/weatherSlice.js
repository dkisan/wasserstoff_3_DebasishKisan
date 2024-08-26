import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    location: '',
    data: null,
    unit: 'metric',
    error: false,
    dailyForecast: null,
    forecast: null
}


const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setWeatherData: (state, action) => {
            state.error = false
            state.data = action.payload;
        },
        setDailyForecast: (state, action) => {
            state.dailyForecast = action.payload
        },
        setForecast: (state, action) => {
            state.forecast = action.payload
        },
        setLocation: (state, action) => {
            state.location = action.payload
        },
        setError: (state) => {
            state.data = null
            state.dailyForecast = null
            state.forecast = null
            state.error = true
        },
        setUnitToggler: (state) => {
            if (state.unit === 'standard') {
                state.unit = 'metric'
            } else {
                state.unit = 'standard'
            }
        }
    }

})

export const {
    setWeatherData,
    setLocation,
    setError,
    setDailyForecast,
    setForecast,
    setUnitToggler
} = weatherSlice.actions;

export default weatherSlice.reducer;