// TODO: Define a City class with name and id properties DONE
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class DONE
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file DONE
  // private async read() {} DONE
  private filePath: string;

  constructor() {
      this.filePath = path.join(__dirname, 'searchHistory.json');
  }

  private async read(): Promise<City[]> {
      try {
          const data = await fs.readFile(this.filePath, 'utf8');
          const cities: City[] = JSON.parse(data);
          return cities;
      } catch (error) {
          throw new Error(`Error reading search history: ${(error as any).message}`);
      }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file DONE
  // private async write(cities: City[]) {} DONE
  private async write(cities: City[]): Promise<void> {
    try {
        const data = JSON.stringify(cities, null, 2); 
        await fs.writeFile(this.filePath, data, 'utf8');
    } catch (error) {
        throw new Error(`Error writing search history: ${(error as any).message}`);
    }
}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects DONE
  // async getCities() {} DONE
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file DONE
  // async addCity(city: string) {} DONE
  async addCity(city: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(city, uuidv4()); //update id to incorporate npm uuid DONE
    cities.push(newCity);
    await this.write(cities);
}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file DONE
  // async removeCity(id: string) {} DONE
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const index = cities.findIndex(city => city.id === id);
    if (index === -1) {
        throw new Error(`City with id ${id} not found`);
    }
    cities.splice(index, 1);
    await this.write(cities);
}
}
export default new HistoryService();
