# Express Book Review API

IBM Developer Skills Network final project implementation.

## Run

```bash
npm install
npm start
```

The API listens on `http://localhost:3000`.

## Endpoints

- `GET /books`
- `GET /isbn/:isbn`
- `GET /author/:author`
- `GET /title/:title`
- `GET /review/:isbn`
- `POST /register` with `{"username":"...","password":"..."}`
- `POST /login` with the same credentials
- Authenticated `PUT` and `DELETE /customer/review/:isbn`

`router/general.js` provides Axios async/await helpers for the book lookup endpoints.
