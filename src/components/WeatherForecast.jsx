import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDailyForecast, setForecast } from '../store/weatherSlice';

function WeatherForecast() {

    const city = useSelector(state => state.weather.location)
    const unit = useSelector(state => state.weather.unit)
    const daily = useSelector(state => state.weather.dailyForecast)

    const dispatch = useDispatch()

    const returnDateTime = (txt) => {
        const dateObject = new Date(txt)
        const fulldate = dateObject.toLocaleDateString();
        const time = dateObject.toLocaleTimeString();
        const hr = dateObject.getHours()
        const month = dateObject.getMonth()
        const date = dateObject.getDate()
        const year = dateObject.getFullYear()
        return { fulldate, time, hr, month, date, year }
    }


    const dayWiseData = (forecasts) => {
        return new Promise((resolve, reject) => {

            const dailyData = {}
            const todayForecast = []
            const today = returnDateTime(forecasts?.list[0].dt_txt).fulldate

            forecasts?.list.forEach((forecast) => {
                const fullDate = returnDateTime(forecast.dt_txt).fulldate
                if (fullDate === today) {
                    const time = returnDateTime(forecast.dt_txt).hr
                    const temp = forecast.main.temp + `${unit === 'standard' ? ' K' : ' C'}`
                    const imgSrc = forecast.weather[0].icon

                    todayForecast.push({ time, temp, imgSrc })
                }

                if (!dailyData[fullDate]) {
                    dailyData[fullDate] = {
                        avgTemp: forecast.main.temp,
                        weather: forecast.weather[0].main,
                        weatherImg: forecast.weather[0].icon,
                        count: 1,
                    };
                } else {
                    dailyData[fullDate].avgTemp = (dailyData[fullDate].avgTemp * dailyData[fullDate].count + forecast.main.temp) / (dailyData[fullDate].count + 1);
                    dailyData[fullDate].count++;
                }
            });

            const resultData = Object.keys(dailyData).map((date) => {
                const { avgTemp, weather, weatherImg } = dailyData[date];
                return {
                    date,
                    avgTemp: avgTemp.toFixed(2),
                    weather,
                    weatherImg
                };
            });

            resolve({ resultData, todayForecast });
        })
    }


    const getForecast = async () => {
        if (city) {
            try {
                const response = await fetch(`${import.meta.env.VITE_WEATHER_URL}/data/2.5/forecast?q=${city}&appid=${import.meta.env.VITE_WEATHER_API}&units=${unit}`);
                const forecasts = await response.json()
                const { resultData, todayForecast } = await dayWiseData(forecasts)
                dispatch(setDailyForecast(resultData))
                dispatch(setForecast(todayForecast))
            } catch (err) {
                console.log(err.message)
            }
        }
    }

    useEffect(() => {
        getForecast()
    }, [city, unit])


    return (
        <>
            <h2>Weekly Forecast</h2>
            {
                daily?.map(d => {
                    return <div key={d.date} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <p>
                            {d.date}
                        </p>
                        <p>
                            {d.avgTemp} {unit === 'metric' ? 'C' : 'K'}
                        </p>

                        <p style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <img src={`http://openweathermap.org/img/w/${d.weatherImg}.png`} />
                            <span>
                                {d.weather}
                            </span>
                        </p>
                    </div >
                })
            }
        </>
    );
}


export default WeatherForecast;