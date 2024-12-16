import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data DONE
router.post('/', async (req, res) => {
  const cityName = req.body.city; 
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    
    const weatherData = await WeatherService.getWeatherForCity(cityName); 
    await HistoryService.addCity(cityName); 
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data or saving city:', error);
    return res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
  // TODO: GET weather data from city name DONE
  // TODO: save city to search history DONE
});

// TODO: GET search history DONE
router.get('/history', async (_, res) => {
  try {
    const cities = await HistoryService.getCities();
    return res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'An error occurred while fetching search history.' });
  }
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {});

export default router;
