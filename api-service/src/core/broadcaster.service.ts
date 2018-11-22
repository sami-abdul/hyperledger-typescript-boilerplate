import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { EnvConfig } from '../config/env';

@Injectable()
export class BroadCasterService {
  // handle all the logic for sending messages to other services.
  // this class should be generic over all microservices to keep consistancy

  constructor() {
    this.init();
  }

  client: ClientProxy;

  init() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: EnvConfig.REDIS_URL,
      },
    });
  }

  broadcast<T, R>(command: string, data: T): Observable<R> {
    // maybe we can log on debug only

    Logger.log(
      `${data ? JSON.stringify(data) : 'null'}`,
      `BROADCASTING:${command}`,
    );
    return this.client.send({ cmd: `${command}` }, data);
  }
}