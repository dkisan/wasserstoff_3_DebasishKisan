import { useEffect, useRef, useState } from 'react'
import styles from './home.module.css'
import ts from './today.module.css'
import WeatherForecast from './WeatherForecast'
import { useDispatch, useSelector } from 'react-redux'
import { setLocation, setUnitToggler } from '../store/weatherSlice'

const Home = () => {
    const dispatch = useDispatch()

    const locationRef = useRef('')

    const data = useSelector(state => state.weather.data)
    const unit = useSelector(state => state.weather.unit)
    const error = useSelector(state => state.weather.error)
    const forecast = useSelector(state => state.weather.forecast)

    const locationHandler = (event) => {
        event.preventDefault()
        const location = locationRef.current.value
        dispatch(setLocation(location))
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>

                <div className={styles.formcontainer}>
                    <form className={styles.formhorizontal} onSubmit={locationHandler}>
                        <input ref={locationRef} type="text" placeholder="Enter your city" />
                        <button type="submit">Get Weather</button>
                    </form>
                </div>

                {/* </div> */}

                {data &&
                    <div>
                        <div className={styles.title}>
                            <h2>{data.name} <span>{data.sys.country}</span></h2>
                            <p>
                                Longitude : <span>{data.coord.lon}</span>-
                                Latitude : <span>{data.coord.lat}</span>
                            </p>


                        </div>
                        <div className={styles.toggler}>
                            <button onClick={() => {
                                dispatch(setUnitToggler())
                            }}>
                                {unit === 'standard' ?
                                    'Change to Celsius'
                                    :
                                    'Change to Kelvin'
                                }
                            </button>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.today}>
                                {/* <div className={ts.today}> */}
                                <h2>Current Weather</h2>
                                <div className={styles.weather}>
                                    <div>{data.main.temp}{unit === 'metric' ? ' C' : ' K'}</div>
                                    <div>{data.weather[0].main}</div>
                                    <img src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} />
                                </div>
                                <h2>Temperature</h2>
                                <div className={styles.temperature}>
                                    <div className={styles.temperatureContent}>
                                        {data.main.temp_min}
                                        <span>  (Min Temp)</span>
                                    </div>
                                    <div className={styles.temperatureContent}>
                                        <h2>{data.main.temp}</h2>
                                    </div>
                                    <div className={styles.temperatureContent}>
                                        {data.main.temp_max}
                                        <span>( Max Temp)</span>
                                    </div>
                                </div>

                                <h2>Today's Forecast</h2>
                                <div className={ts.todayforecast}>
                                    {forecast?.map((f, idx) => {
                                        return (
                                            <div key={idx}>
                                                <p>{f.time} {+f.time > 11 ? 'PM' : 'AM'}</p>
                                                <img src={`http://openweathermap.org/img/w/${f.imgSrc}.png`} />
                                                <p>{f.temp}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className={styles.weekly}>
                                <WeatherForecast />
                            </div>
                        </div>
                    </div>

                }

                {error && <h2>Location Not Found... Entered Correct Location</h2>}
            </div>
        </div >
    )
}

export default Home;