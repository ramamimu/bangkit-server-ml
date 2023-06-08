import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MysqlDbService } from './mysql-db.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import axios from 'axios';
import { nanoid } from 'nanoid';

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
      Latitude: number;
      Longitude: number;
      OverallRating: number;
      UserRatingTotal: number;
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
      error: boolean;
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
      // select available details
      const queryPlaceID = `SELECT Place_ID,Name,FormattedPhone,FormattedAddress,Latitude,Longitude,OverallRating,UserRatingTotal,ServesBeer,ServesWine,ServesVegetarianFood,WheelchairAccessibleEntrance,Halal,StreetAddress,District,City,Regency,Province,PostalNumber FROM Places WHERE Place_ID = '${id}'`;
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
    } catch (e) {
      console.log('error while getting detail place');
      return this.writeErrorMessage(e.message);
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

      open = operationHoursToday;
      close = operationHoursTodayClose;
    } catch (e) {
      console.log('error while getting operation hours');
      return this.writeErrorMessage(e.message);
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
    } catch (e) {
      console.log('error while getting categories');
      return this.writeErrorMessage(e.message);
    }

    // get photo reference
    try {
      const photoReferences = (await this.getPlacePhotoReference(id)) as {
        photo_reference: string;
      }[];
      for (const photoReference of photoReferences) {
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference.photo_reference}&key=${process.env.MAPS_API_KEY}`;
        images.push(url);
      }
      if (images.length === 0) {
        images.push('https://source.unsplash.com/random/400%C3%97400/?place');
      }
    } catch {
      console.log('error while getting photo reference');
      return this.writeErrorMessage('Place not found');
    }

    const {
      Place_ID,
      Name,
      FormattedAddress,
      StreetAddress,
      District,
      City,
      Regency,
      Province,
      PostalNumber,
      FormattedPhone,
      Latitude,
      Longitude,
      OverallRating,
      UserRatingTotal,
    } = detailPlace[0];

    const detailPlaceFinal = {
      Place_ID,
      Name,
      FormattedAddress,
      StreetAddress,
      District,
      City,
      Regency,
      Province,
      PostalNumber,
      FormattedPhone,
      Latitude,
      Longitude,
      OverallRating,
      UserRatingTotal,
    };

    const dataAPI: DataAPI = {
      error: false,
      overview: [
        {
          ...detailPlaceFinal,
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

  @Post('auth/login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    console.log(email, password);

    type User = {
      User_ID: string;
      FullName: string;
      Email: string;
      Password: string;
    };
    try {
      const query = `SELECT * FROM User WHERE Email = '${email}' AND Password = '${password}'`;
      const user: User[] = (await this.mysqlDbService.getQuery(
        query,
      )) as User[];
      if (user.length === 0) {
        throw new Error('User not found');
      }
      return {
        error: false,
        data: user,
      };
    } catch (e) {
      return {
        error: true,
        message: e.message,
      };
    }
  }

  @Post('auth/register')
  async register(
    @Body() body: { email: string; password: string; fullname: string },
  ) {
    const { email, password, fullname } = body;

    if (!email || !password || !fullname) {
      return {
        error: true,
        message: 'Please fill all the fields',
      };
    }

    type User = {
      User_ID: string;
      FullName: string;
      Email: string;
      Password: string;
    };
    try {
      const userId = nanoid(16);
      // check if email already exist
      const queryCheckEmail = `SELECT * FROM User WHERE Email = '${email}'`;
      const checkEmail: User[] = (await this.mysqlDbService.getQuery(
        queryCheckEmail,
      )) as User[];
      if (checkEmail.length > 0) {
        throw new Error('Email already exist');
      }
      const query = `INSERT INTO User (User_ID, FullName, Email, Password) VALUES ('${userId}','${fullname}', '${email}', '${password}')`;
      const user: User[] = (await this.mysqlDbService.getQuery(
        query,
      )) as User[];
      if (user.length === 0) {
        throw new Error('User not found');
      }
      return {
        error: false,
        message: 'Success register user',
      };
    } catch (e) {
      return {
        error: true,
        message: e.message,
      };
    }
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
