
import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from 'nestjs-http-promise';
import { SensorsController } from 'src/controllers/sensors/sensors.controller';
import { SensorsService } from 'src/services/sensors.service';
import { getEnvPath } from 'src/utils/env.util';
import { BullModule } from '@nestjs/bull';
import { QueueProcessor } from 'src/processor/queueProcessor';

const projectRoot = process.cwd();
const envFilePath: string = getEnvPath(`${projectRoot}/src/environment`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    ClickHouseModule.register([
      {
        name: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
      },
    ]),
    BullModule.forRoot({
      redis: {
        host: process.env.KEYDB_HOST,
        port: parseInt(process.env.KEYDB_PORT, 10),
        password: process.env.KEYDB_PASSWORD
      },
    }),
    BullModule.registerQueue({
      name: 'myQueue',
    }),


    HttpModule,
  ],
  providers: [
    SensorsService,
    QueueProcessor
  ],
  controllers: [SensorsController],
})
export class SensorsModule {}
