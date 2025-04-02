
import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from 'nestjs-http-promise';
import { SensorsController } from 'src/controllers/sensors/sensors.controller';
import { SensorsService } from 'src/services/sensors.service';
import { getEnvPath } from 'src/utils/env.util';

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
    HttpModule,
  ],
  providers: [
    SensorsService
  ],
  controllers: [SensorsController],
})
export class SensorsModule {}
