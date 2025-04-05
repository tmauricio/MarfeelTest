import { InjectQueue } from '@nestjs/bull';
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
import { Queue } from 'bull';

import { Response, Request } from 'express';
import { SensorsService } from 'src/services/sensors.service';


/**
 * login y perfil de usuario
 */
@Controller('sensors')
export class SensorsController {

  constructor(
    private sensorsService: SensorsService,
    @InjectQueue('myQueue')
    private readonly queue: Queue
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
    try {
      console.log('Ingest data');
      console.log('body: ', body);
      
      await this.queue.add(body);
      console.log('Job added:', body);

      return res.status(HttpStatus.OK).json();
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Invalid user request' });
    }
  }


  /**
   * Ingests new sensor data by queue.
   */
  @Post('ingestByQueue')
  async ingestByQueue(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body,
  ) {
    try {
      if (body) {
        await this.sensorsService.insert(body);
        return res.status(HttpStatus.OK).json();
      } else {
        return res.status(HttpStatus.NOT_FOUND).json();
      }
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Invalid user request' });
    }
  }
}
