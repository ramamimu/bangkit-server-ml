## Documentation API

```http
POST https://sql-server-oislxufxaa-et.a.run.app/api/query
```

- method
  - `POST`
- body
  ```javascript
  {
    query: string,
  }
  ```
- response

  ```javascript
  {
    error: boolean,
    data: array
  }
  ```
