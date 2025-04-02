import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { getEnvPath } from './utils/env.util';
import { ControlUserMiddleware } from './middlewares/control.user.middleware';
import { SensorsModule } from './modules/sensors.module';

// const envFilePath: string = getEnvPath(`${__dirname}/environment`);

@Module({
  imports: [
    SensorsModule,
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ControlUserMiddleware).forRoutes('sensors');
  }
}
