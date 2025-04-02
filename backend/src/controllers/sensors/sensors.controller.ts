import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';

import { Response, Request } from 'express';
import { SensorsService } from 'src/services/sensors.service';


/**
 * login y perfil de usuario
 */
@Controller('sensors')
export class SensorsController {

  constructor(
    private sensorsService: SensorsService,
  ) {}
  
  /**
   * Retrieves distinct sensor names.
   */
  @Get('sensornames')
  async getSensorNames(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params,
    @Query('token') _token,
  ) {
    try {
      var result = await this.sensorsService.getDistinctDeviceIds();
      return res.status(HttpStatus.OK).json(
        result
      );
  
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Invalid user request' });
    }
  }
  


  /**
   * Retrieves sensor data by sensor ID.
   */
  @Get('id/:sensorid')
  async getDataById(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params:  {sensorid: string},
    @Query('token') _token,
  ) {
    try {
      if (params.sensorid) {
        var result = await this.sensorsService.findByDeviceId(params.sensorid);
        return res.status(HttpStatus.OK).json(
          result
        );
      } else {
        return res.status(HttpStatus.NOT_FOUND).json(
          result
        );
      }
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Invalid user request' });
    }
  }

 

  /**
   * Ingests new sensor data.
   */
  @Post('ingest')
  async ingest(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body,
  ) {
    console.log('Ingest data');
    console.log('body: ', body);
      try {
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
        
        await this.sensorsService.insert(dataToPersist);

        return res.status(HttpStatus.OK).json();
      } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: 'Invalid user request' });
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
