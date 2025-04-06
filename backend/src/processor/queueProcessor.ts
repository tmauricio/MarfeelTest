import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
const axios = require('axios');

const URL = 'http://localhost:3030/sensors/ingestByQueue';

@Processor('myQueue')
export class QueueProcessor {

  @Process()
  async handleJob(job: Job) {
    
    try {
        console.log('Processing job:', job.data);
        var body = job.data;
        
        const anomalies = this.detectAnomaly(body.temperature);
        const dewPoint = this.calculateDewPoint(body.temperature, body.humidity);
        const airDensity = this.calculateAirDensity(body.pressure, body.temperature);
        const windChill = this.calculateWindChill(body.temperature, body.wind_speed);
        
        const dataToPersist = {
          ...body,
          recorded_at: body.timestamp * 1000,
          dew_point: dewPoint,
          anomaly_prob: anomalies,
          air_density: airDensity,
          wind_chill: windChill
        }
        
        const response = await axios.post(URL, dataToPersist);
        console.log('Response:', response.data);

        return true;

    } catch (e) {
        console.log(e);
        return null;
    }

  }


  private detectAnomaly(temperature: number): number {
    const threshold = 3;
    let anomalies = 0;
    for (let i = 0; i < 1000000; i++) {
        const simulatedTemp = temperature + ((Math.random() * 10) - 5);
        if (Math.abs(simulatedTemp - temperature) > threshold) {
            anomalies += 1;
        }
    }
    return anomalies / 1000000;
  }

  private calculateDewPoint(temperature: number, humidity: number): number {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
  }

  private calculateAirDensity(pressure: number, temperature: number): number {
    return pressure / (287.05 * (temperature + 273.15))
  }

  private calculateWindChill(temperature: number, windSpeed: number): number {
    if (windSpeed > 4.8)
      return 13.12 + 0.6215 * temperature - 11.37 * windSpeed^0.16 + 0.3965 * temperature * windSpeed^0.16;
    else
      return temperature;
  }
}
