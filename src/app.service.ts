import { Injectable } from '@nestjs/common';
import * as geolib from 'geolib';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to C23-PR513 server!';
  }

  writeErrorMessage(msg: string): {
    error: boolean;
    message: string;
  } {
    console.log(msg);
    return {
      error: true,
      message: msg,
    };
  }

  getDistance(
    userPosition: {
      latitude: number;
      longitude: number;
    },
    placePosition: {
      latitude: number;
      longitude: number;
    },
  ) {
    const distance = geolib.getDistance(
      {
        latitude: userPosition.latitude,
        longitude: userPosition.longitude,
      },
      {
        latitude: placePosition.latitude,
        longitude: placePosition.longitude,
      },
    );
    return distance;
  }

  // estimation time in minutes
  getDistanceTime(distance: number): number {
    // 1.9 km = 6 min
    // 1 km = 3.1578947368421053 min
    const time = (distance / 1000) * 3;
    return time;
  }

  meterToKm(meter: number) {
    return meter / 1000;
  }
}
