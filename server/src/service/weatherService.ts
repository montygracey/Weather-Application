import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define an interface for the Coordinates object DONE
class Weather {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  
  constructor(
    temperature: number,
    humidity: number,
    description: string,
    windSpeed: number
  ) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
    this.windSpeed = windSpeed;
  }
  getWeatherSummary(): string {
    return `It is currently ${this.temperature} degrees with ${this.description}. The humidity is ${this.humidity} and the wind speed is ${this.windSpeed}.`;
  }
}
// TODO: Define a class for the Weather object DONE

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties DONE 
  baseURL: string;
  apiKey: string;
  cityName: string;

  constructor(cityName: string) {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = process.env.API_BASE_URL || '';
    this.cityName = cityName;
  }

  // TODO: Create fetchLocationData method DONE
  private async fetchLocationData(): Promise<any> {
    const url = this.buildGeocodeQuery();
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch location data: ${response.statusText}`);
      }
      const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  
  



  // private async fetchLocationData(query: string) {} DONE
  // TODO: Create destructureLocationData method DONE
private destructureLocationData(data: any): { temperature: number; humidity: number; description: string; windSpeed: number } {
  const { main, weather, wind } = data;
  const temperature = main.temp;
  const humidity = main.humidity;
  const description = weather[0].description;
  const windSpeed = wind.speed;
  return { temperature, humidity, description, windSpeed };
}

  // private destructureLocationData(locationData: Coordinates): Coordinates {} DONE
  // TODO: Create buildGeocodeQuery method DONE
  private buildGeocodeQuery(): string {
    const city = encodeURIComponent(this.cityName);
    const url = `${this.baseURL}weather?q=${city}&appid=${this.apiKey}`;
    return url;
  }


  // private buildGeocodeQuery(): string {} DONE
  
  // TODO: Create buildWeatherQuery method DONE
  // private buildWeatherQuery(coordinates: Coordinates): string {} DONE
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    const query = `${this.baseURL}forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    return query;
  }

  // TODO: Create fetchAndDestructureLocationData method DONE
  // private async fetchAndDestructureLocationData() {} DONE
  private async fetchAndDestructureLocationData(): Promise<{ temperature: number; humidity: number; description: string; windSpeed: number; coordinates: Coordinates }> {
    const locationData = await this.fetchLocationData();
    const weatherData = this.destructureLocationData(locationData);
    const coordinates: Coordinates = { lat: locationData.coord.lat, lon: locationData.coord.lon }; 
    return { ...weatherData, coordinates };
}

  // TODO: Create fetchWeatherData method DONE
  // private async fetchWeatherData(coordinates: Coordinates) {} DONE
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data: ${response.statusText}');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // TODO: Build parseCurrentWeather method DONE
  // private parseCurrentWeather(response: any) {} DONE
  private parseCurrentWeather(response: any): Weather {
    const { main, weather, wind } = response;
    const temperature = main.temp;
    const humidity = main.humidity;
    const description = weather[0].description;
    const windSpeed = wind.speed;
    return new Weather(temperature, humidity, description, windSpeed);
  }
  
  // TODO: Complete buildForecastArray method DONE
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {} DONE
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = []; 
    forecastArray.push(currentWeather);

   
    weatherData.forEach((data) => {
        const { main, weather, wind } = data; 
        const temperature = main.temp; 
        const humidity = main.humidity; 
        const description = weather[0].description; 
        const windSpeed = wind.speed; 

        
        const forecastWeather = new Weather(temperature, humidity, description, windSpeed);
        forecastArray.push(forecastWeather);
    });

    return forecastArray; 
}
  // TODO: Complete getWeatherForCity method  DONE
  // async getWeatherForCity(city: string) {} DONE
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const weatherService = new WeatherService(city);

    
    const { coordinates } = await weatherService.fetchAndDestructureLocationData();

    const forecastData = await weatherService.fetchWeatherData(coordinates);
    const currentWeather = weatherService.parseCurrentWeather(forecastData);
    const forecastArray = weatherService.buildForecastArray(currentWeather, forecastData.list);

    return forecastArray;
    
   
}
}

export default new WeatherService('Your City Name');
