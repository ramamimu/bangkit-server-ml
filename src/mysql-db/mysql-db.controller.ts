import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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

  @Get('recomendation-place/:id')
  async getRecomendationPlace(@Param('id') id: string) {
    console.log(id);
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
        let referenceBuffer: string | null;
        try {
          const stringId = 'photo-reference:' + place.place_id;
          referenceBuffer = await this.redisCacheService.getCache(stringId);
        } catch {
          console.log('error while getting referenceBuffer');
        }
        try {
          let photoReference: string;
          if (!referenceBuffer) {
            photoReference = (
              await this.getPlacePhotoReference(place.place_id)
            )[0].photo_reference as string;
            await this.redisCacheService.setCache(
              `photo-reference:${place.place_id}`,
              photoReference,
            );
          } else {
            photoReference = referenceBuffer;
          }
          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.MAPS_API_KEY}`;
          place.photoReference = url;
        } catch {
          place.photoReference =
            'https://source.unsplash.com/random/400%C3%97400/?place';
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

  @Get('nearby-place/:id')
  async getNearbyPlace(@Param('id') id: string) {
    console.log(id);
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
        let referenceBuffer: string | null;
        try {
          const stringId = 'photo-reference:' + place.place_id;
          referenceBuffer = await this.redisCacheService.getCache(stringId);
        } catch {
          console.log('error while getting referenceBuffer');
        }
        try {
          let photoReference: string;
          if (!referenceBuffer) {
            photoReference = (
              await this.getPlacePhotoReference(place.place_id)
            )[0].photo_reference as string;
            await this.redisCacheService.setCache(
              `photo-reference:${place.place_id}`,
              photoReference,
            );
          } else {
            photoReference = referenceBuffer;
          }
          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.MAPS_API_KEY}`;
          place.photoReference = url;
        } catch {
          place.photoReference =
            'https://source.unsplash.com/random/400%C3%97400/?place';
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

  @Get('detail-place/:id')
  async getDetailPlace(@Param('id') id: string) {
    type Place = {
      Place_ID: string;
      Name: string;
      FormattedAddress: string;
      StreetAddress: string;
      District: string;
      City: string;
      Regency: string;
      Province: string;
      PostalNumber: string;
      FormattedPhone: string;
    };
    type Categories = {
      ServesBeer: boolean;
      ServesWine: boolean;
      ServesVegetarianFood: boolean;
      WheelchairAccessibleEntrance: boolean;
      Halal: boolean;
    };
    type SubOverview = {
      images: string[];
      open: boolean;
      close: boolean;
    };
    type TypePlace = {
      Place_ID: string;
      Bar: boolean;
      Cafe: boolean;
      Restaurant: boolean;
    };
    type OperationHours = {
      Place_ID: string;
      Monday_Open?: string;
      Monday_Close?: string;
      Tuesday_Open?: string;
      Tuesday_Close?: string;
      Wednesday_Open?: string;
      Wednesday_Close?: string;
      Thursday_Open?: string;
      Thursday_Close?: string;
      Friday_Open?: string;
      Friday_Close?: string;
      Saturday_Open?: string;
      Saturday_Close?: string;
      Sunday_Open?: string;
      Sunday_Close?: string;
    };
    type Overview = Place & SubOverview;
    type DataAPI = {
      overview: Overview[];
      tags: {
        categories: string[];
        services: string[];
      }[];
      reviews: {
        name: string;
        date: Date;
        review: string;
      }[];
    };
    type DetailPlaceTable = Place & Categories;

    const listServices: { key: string; value: string }[] = [
      {
        key: 'ServesBeer',
        value: 'beer',
      },
      {
        key: 'ServesWine',
        value: 'wine',
      },
      {
        key: 'ServesVegetarianFood',
        value: 'vegetarian',
      },
      {
        key: 'WheelchairAccessibleEntrance',
        value: 'wheel chair accessible',
      },
      {
        key: 'Halal',
        value: 'halal',
      },
    ];

    let detailPlace: DetailPlaceTable[];
    let operationHours: OperationHours[];
    let open: boolean;
    let close: boolean;
    const services: string[] = [];
    const listCategory: string[] = [];
    const images: string[] = [];
    const reviews = [
      {
        name: 'John Doe',
        date: new Date(),
        review:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliqua',
      },
    ];

    try {
      // select available detail
      const queryPlaceID = `SELECT * FROM Places WHERE Place_ID = '${id}'`;
      detailPlace = (await this.mysqlDbService.getQuery(
        queryPlaceID,
      )) as DetailPlaceTable[];
      if (detailPlace.length === 0) {
        throw new Error('Place not found');
      }
      for (const service of listServices) {
        if (detailPlace[0][service.key]) {
          services.push(service.value);
        }
      }
    } catch {
      console.log('error while getting detail place');
      return this.writeErrorMessage('Place not found');
    }

    try {
      // get the Operation Hours for Today
      const queryOperationHours = `SELECT * FROM OperationHours WHERE Place_ID = '${id}'`;
      operationHours = (await this.mysqlDbService.getQuery(
        queryOperationHours,
      )) as OperationHours[];
      if (operationHours.length === 0) {
        throw new Error('Place not found');
      }
      const day = new Date().getDay();
      const dayString = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ][day];
      const operationHoursToday = operationHours[0][`${dayString}_Open`];
      const operationHoursTodayClose = operationHours[0][`${dayString}_Close`];

      // get the current time
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });
      // logic open and close today
      open = operationHoursToday <= currentTime;
      close = operationHoursTodayClose <= currentTime;
    } catch {
      console.log('error while getting operation hours');
      return this.writeErrorMessage('Place not found');
    }

    try {
      // get category
      const queryCategory = `SELECT * FROM Types WHERE Place_ID = '${id}'`;
      const categories = (await this.mysqlDbService.getQuery(
        queryCategory,
      )) as TypePlace[];
      if (categories.length === 0) {
        throw new Error('Place not found');
      }
      if (categories[0].Bar) {
        listCategory.push('bar');
      } else if (categories[0].Cafe) {
        listCategory.push('cafe');
      } else if (categories[0].Restaurant) {
        listCategory.push('restaurant');
      }
    } catch {
      console.log('error while getting categories');
      return this.writeErrorMessage('Place not found');
    }

    // get photo reference
    try {
      const photoReferences = (await this.getPlacePhotoReference(
        id,
      )) as string[];
      for (const photoReference in photoReferences) {
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.MAPS_API_KEY}`;
        images.push(url);
      }
      if (images.length === 0) {
        images.push('https://source.unsplash.com/random/400%C3%97400/?place');
      }
    } catch {
      console.log('error while getting photo reference');
      return this.writeErrorMessage('Place not found');
    }

    // logic DataAPI
    const dataAPI: DataAPI = {
      overview: [
        {
          ...detailPlace[0],
          images,
          open,
          close,
        },
      ],
      tags: [
        {
          categories: listCategory,
          services,
        },
      ],
      reviews,
    };
    return dataAPI;
  }

  @Get('redis')
  async getRedis() {
    let error = false;
    let data: any;
    try {
      data = await this.redisCacheService.getCache(
        'photo-reference:ChIJ1d9wAUtYei4R-z0FAHihfvo',
      );
    } catch {
      error = true;
    }
    console.log(error ? 'failed get redis data' : 'success get redis data');
    return {
      error,
      data,
    };
  }

  // =================== //
  //  Ordinary Function  //
  // =================== //

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
      if (data.result.photos !== undefined) resolve(data.result.photos);
      else reject('error while get place photo reference');
    });
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
}
