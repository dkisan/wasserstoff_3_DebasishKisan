import { useEffect } from 'react'
import './App.css'
import Home from './components/Home'
import { useDispatch, useSelector } from 'react-redux'
import { setError, setWeatherData } from './store/weatherSlice'

function App() {
  const city = useSelector(state => state.weather.location)
  const unit = useSelector(state => state.weather.unit)

  const dispatch = useDispatch()


  const getWeatherData = async () => {
    if (city) {
      try {
        const response = await fetch(`${import.meta.env.VITE_WEATHER_URL}/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_API}&units=${unit}`)
        const weather_data = await response.json()
        if (weather_data.cod === '404') throw new Error('City Not Found/Exist')
        dispatch(setWeatherData(weather_data))
      } catch (err) {
        dispatch(setError())
      }
    }
  }


  useEffect(() => {
    getWeatherData()
  }, [city, unit])

  return (
    <>
      <Home />
    </>
  )
}

export default App
