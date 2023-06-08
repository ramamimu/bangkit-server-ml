## Documentation API

### _link_

```https
https://sql-server-oislxufxaa-et.a.run.app
```

### _error_

Each response always contains error information in `error` variable. If `error` is `true` indicating an error occurred.

- response
  ```typescript
  {
    error: boolean,
    message: string
  }
  ```

<br/>
<br/>

> ## For Android

### _Recommendation Places_

```http
GET /api/recomendation-place/:id_user
```

- method
  - GET
- response
  ```typescript
  {
    error: boolean,
    data: [
      {
        place_id: string,
        name: string,
        Latitude: number,
        Longitude: number,
        OverallRating: number,
        UserRatingTotal: number,
        StreetAddress: string | null,
        District: string | null,
        City: string | null,
        Regency: string | null,
        Province: string | null,
        photoReference: string
      }
    ]
  }
  ```

### _Nearby Places_

```http
GET /api/nearby-place/:id_user
```

- method
  - GET
- response
  ```typescript
  {
    error: boolean,
    data: [
      {
        place_id: string,
        name: string,
        Latitude: number,
        Longitude: number,
        OverallRating: number,
        UserRatingTotal: number,
        StreetAddress: string | null,
        District: string | null,
        City: string | null,
        Regency: string | null,
        Province: string | null,
        photoReference: string
      }
    ]
  }
  ```

### _Detail Places_

```http
GET /api/detail-place/:place_id
```

- method:

  - GET

- response

```typescript
{
  error: boolean
  overview: [
    {
      Place_ID: string,
      Name: string,
      FormattedPhone: string,
      FormattedAddress: string | null,
      Latitude: number,
      Longitude: number,
      OverallRating: number,
      UserRatingTotal: number,
      StreetAddress: string | null,
      District: string | null,
      City: string | null,
      Regency: string | null,
      Province: string | null,
      PostalNumber: string | null,
      images:[string],
      open: string | null,
      close: string | null,
    }
  ],
  tags: [
    {
      categories:[string],
      services:[string],
    }
  ],
  reviews: [
    {
      name: string,
      date: string,
      review: string,
    }
  ],
}
```

<br/>
<br/>

> ## For Main Server

### _login_

```http
POST /api/auth/login
```

- method

  - POST

- body
  ```typescript
  {
    email: string,
    password: string
  }
  ```
- response
  ```typescript
  {
    "error": boolean,
    "data": [
      {
        "User_ID": string,
        "FullName": string,
        "Email": string,
        "Password": string
      }
    ]
  }
  ```

### _register_

```http
POST /api/auth/register
```

- method

  - POST

- body
  ```typescript
  {
    email: string,
    password: string,
    fullname: string
  }
  ```
- response
  ```typescript
  {
    error: boolean,
    message: string
  }
  ```

## Table structure

> places

| Field                        | Type         | Null | Key | Default | Extra |
| ---------------------------- | ------------ | ---- | --- | ------- | ----- |
| Place_ID                     | varchar(45)  | NO   | PRI | NULL    |       |
| Name                         | varchar(255) | NO   |     | NULL    |       |
| FormattedPhone               | varchar(25)  | YES  |     | NULL    |       |
| FormattedAddress             | varchar(255) | YES  |     | NULL    |       |
| Latitude                     | float        | YES  |     | NULL    |       |
| Longitude                    | float        | YES  |     | NULL    |       |
| OverallRating                | float        | YES  |     | NULL    |       |
| PriceLevel                   | float        | YES  |     | NULL    |       |
| Website                      | varchar(255) | YES  |     | NULL    |       |
| UserRatingTotal              | float        | YES  |     | NULL    |       |
| ServesBeer                   | tinyint(1)   | YES  |     | NULL    |       |
| ServesWine                   | tinyint(1)   | YES  |     | NULL    |       |
| ServesVegetarianFood         | tinyint(1)   | YES  |     | NULL    |       |
| WheelchairAccessibleEntrance | tinyint(1)   | YES  |     | NULL    |       |
| Halal                        | tinyint(1)   | YES  |     | NULL    |       |
| StreetAddress                | varchar(255) | YES  |     | NULL    |       |
| District                     | varchar(255) | YES  |     | NULL    |       |
| City                         | varchar(255) | YES  |     | NULL    |       |
| Regency                      | varchar(255) | YES  |     | NULL    |       |
| Province                     | varchar(255) | YES  |     | NULL    |       |
| PostalNumber                 | varchar(25)  | YES  |     | NULL    |       |

> operation hours

| Field           | Type        | Null | Key | Default | Extra |
| --------------- | ----------- | ---- | --- | ------- | ----- |
| Place_ID        | varchar(45) | YES  | MUL | NULL    |       |
| Monday_Open     | char(5)     | YES  |     | NULL    |       |
| Monday_Close    | char(5)     | YES  |     | NULL    |       |
| Tuesday_Open    | char(5)     | YES  |     | NULL    |       |
| Tuesday_Close   | char(5)     | YES  |     | NULL    |       |
| Wednesday_Open  | char(5)     | YES  |     | NULL    |       |
| Wednesday_Close | char(5)     | YES  |     | NULL    |       |
| Thursday_Open   | char(5)     | YES  |     | NULL    |       |
| Thursday_Close  | char(5)     | YES  |     | NULL    |       |
| Friday_Open     | char(5)     | YES  |     | NULL    |       |
| Friday_Close    | char(5)     | YES  |     | NULL    |       |
| Saturday_Open   | char(5)     | YES  |     | NULL    |       |
| Saturday_Close  | char(5)     | YES  |     | NULL    |       |
| Sunday_Open     | char(5)     | YES  |     | NULL    |       |
| Sunday_Close    | char(5)     | YES  |     | NULL    |       |

> types

| Field      | Type        | Null | Key | Default | Extra |
| ---------- | ----------- | ---- | --- | ------- | ----- |
| Place_ID   | varchar(45) | YES  | MUL | NULL    |       |
| Bar        | tinyint(1)  | YES  |     | NULL    |       |
| Cafe       | tinyint(1)  | YES  |     | NULL    |       |
| Restaurant | tinyint(1)  | YES  |     | NULL    |       |
