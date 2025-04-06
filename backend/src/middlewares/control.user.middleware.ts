import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ControlUserMiddleware implements NestMiddleware {
  @Inject(ConfigService)
  public config: ConfigService;

  use(req: Request, res: Response, next: NextFunction) {
    console.log("---------------------------------------");
    console.log("URL: ", req.originalUrl);
    console.log("HEADER TOKEN: ", req.headers.authtoken);
    req.body ?? console.log("BODY: ", req.body);
    console.log("---------------------------------------");
    try {
      next();
      // if (req.headers.authtoken == '123123123') {
      //   // TODO: add token validation
      //   next();
      // } else {
      //   return res
      //     .status(HttpStatus.METHOD_NOT_ALLOWED)
      //     .send({ error: 'You are not authorized to make this request' });
      // }
    } catch (e) {
      console.error('error con token', e);
      return res
        .status(HttpStatus.METHOD_NOT_ALLOWED)
        .send({ error: 'You are not authorized to make this request' });
    }
  }
}
