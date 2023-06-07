import { Controller, Get, Post, Body } from '@nestjs/common';
import { MysqlDbService } from './mysql-db.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import axios from 'axios';

@Controller('api')
export class MysqlDbController {
  constructor(
    private readonly mysqlDbService: MysqlDbService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  @Get()
  getHello(): string {
    return 'Welcome to C23-PR513 API management!';
  }

  @Post('query')
  async getQuery(
    @Body() body: { query: string },
  ): Promise<{ error: boolean; data: any }> {
    let error = false;
    let data: any;
    try {
      data = await this.mysqlDbService.getQuery(body.query);
    } catch {
      error = true;
    }
    console.log(error ? 'failed query data' : 'success query data');
    return {
      error,
      data,
    };
  }

  @Get('recomendation-place')
  async getRecomendationPlace() {
    type Place = {
      place_id: string;
      name: string;
      Latitude: number;
      Longitude: number;
      OverallRating: number;
      UserRatingTotal: number;
      StreetAddress: string | null;
      District: string | null;
      City: string | null;
      Regency: string | null;
      Province: string | null;
      photoReference?: string;
    };
    let error = false;
    const query =
      'SELECT place_id,name,Latitude,Longitude,OverallRating, UserRatingTotal,StreetAddress,District,City,Regency,Province FROM Places ORDER BY RAND() LIMIT 5';
    let data: Place[];
    try {
      data = (await this.mysqlDbService.getQuery(query)) as Place[];
      for (const place of data) {
        try {
          const photoReference: string = (await this.getPlacePhotoReference(
            place.place_id,
          )) as string;
          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.MAPS_API_KEY}`;
          place.photoReference = url;
        } catch {
          place.photoReference = '';
          console.log('error while getting photo reference');
        }
      }
    } catch {
      error = true;
      console.log('error while getting recomendation place');
    }
    return {
      error,
      data,
    };
  }

  async getPlacePhotoReference(placeId: string) {
    return new Promise(async (resolve, reject) => {
      const uri = `https://maps.googleapis.com/maps/api/place/details/json?fields=photos&place_id=${placeId}&key=${process.env.MAPS_API_KEY}`;
      const response = await axios.get(uri);
      const data: {
        html_attributions: string[];
        status: string;
        result: {
          photos?: [
            {
              photo_reference: string;
            },
          ];
        };
      } = response.data;
      if (data.status !== 'OK') reject('error while get place photo reference');
      if (data.result.photos !== undefined)
        resolve(data.result.photos[0].photo_reference);
      else reject('error while get place photo reference');
    });
  }
}
