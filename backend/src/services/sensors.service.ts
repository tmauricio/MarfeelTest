import { ClickHouseClient, Observable } from '@depyronick/nestjs-clickhouse';
import { Inject, Injectable } from '@nestjs/common';
import { ReadingEntity } from 'src/entities/reading.entity';

@Injectable()
export class SensorsService {
  constructor(
    @Inject('CLICKHOUSE_SERVER')
	  private clickHouseClient: ClickHouseClient
    ) {}

  // Method to get all sensor readings
  async findAll(): Promise<ReadingEntity[]> {
    const data = await this.clickHouseClient
      .queryPromise<ReadingEntity>(
        `
          SELECT *
          FROM sensor_data.readings
          ORDER BY recorded_at DESC
        `
      );
    
    return data as ReadingEntity[];
  }

  // Method to find a reading by device ID
  async findByDeviceId(deviceId: string): Promise<ReadingEntity> {
    const result = await this.clickHouseClient
      .queryPromise<ReadingEntity>(
        `
          SELECT *
          FROM sensor_data.readings
          WHERE device_id = {deviceId:String}
          ORDER BY recorded_at DESC
          LIMIT 1
        `, { deviceId: deviceId });
    
    return result.length === 1 ? result[0] as ReadingEntity : null;
  }

  // Method to get distinct device IDs
  async getDistinctDeviceIds(): Promise<any[]> {
    const result = await this.clickHouseClient
      .queryPromise<ReadingEntity>(
        `
          SELECT DISTINCT device_id
          FROM sensor_data.readings
          ORDER BY device_id ASC
        `
      );
    
    return (result as ReadingEntity[]).map(row => row.device_id);
  }

  // Method to insert a new sensor reading
  async insert(data: ReadingEntity): Promise<void> {
    await this.clickHouseClient
      .insertPromise<ReadingEntity>('sensor_data.readings', [data]);
    ;
  }
}
