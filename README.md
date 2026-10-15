# store-ui

React + TypeScript storefront for the Sticker Store, built with Vite, React
Router (data router), Tailwind CSS and Vitest.

> **About the live demo:** the deployed site runs on mock data
> (`VITE_USE_MOCK_PRODUCTS=true`) because the backend is not hosted. Browsing the
> catalogue, product pages and the cart all work. Sign-in, registration and the
> profile page need the API, so they fail on the demo — an error such as
> "Incorrect username or password." there does not mean the credentials were
> wrong. To try the full app, run it locally with the [backend](#backend).

## Getting started

```bash
npm ci
npm run dev
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server on http://localhost:5173 |
| `npm run build` | Typecheck (`tsc -b`) then build to `dist/` |
| `npm run lint` | ESLint over the project |
| `npm run test` | Vitest, single run |
| `npm run test:ui` | Vitest in watch mode |
| `npm run coverage` | Vitest with coverage |

## Backend

This app talks to the Spring Boot API in
[store-api](https://github.com/fernandocallejasr/store-api). The backend is not
deployed, so to use the whole app run the two side by side:

```bash
# in store-api
JWT_SECRET="$(openssl rand -base64 48)" ./mvnw spring-boot:run

# in store-ui, with VITE_API_BASE_URL="http://localhost:8080/api/v1" in .env.development
npm run dev
```

Login and registration always need the backend. Setting `VITE_USE_MOCK_PRODUCTS=true`
serves only the product catalogue from local data.

## Environment

Copy `.env.example` and fill it in. Every variable is compiled into the bundle
at build time and is therefore public — never put a secret in one.

| Variable | Notes |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL for the backend. Relative (`/api`) in deployed environments so requests stay same-origin. |
| `VITE_AXIOS_DEFAULT_TIMEOUT` | Request timeout in ms. |
| `VITE_USE_MOCK_PRODUCTS` | `true` serves products from local seed data instead of the API. |

Real environment variables override the `.env` files, so CI values win over
whatever is committed. In GitHub Actions these come from repository *variables*
and are passed to the build step in `.github/workflows/ci-cd.yml`.

## Deployment

Pushing to `main` runs CI and deploys `dist/` to S3, fronted by CloudFront.

### CloudFront configuration (not managed in this repo)

The distribution is configured by hand in the AWS console. Two decisions there
are load-bearing and easy to undo by accident:

**SPA routing is a CloudFront Function on viewer-request, not Custom Error
Responses.** Custom Error Responses are configured at the *distribution* level,
so they apply to every behaviour and rewrite **any** 403/404 into a 200 HTML
page — including responses from the API. A failed `POST /api/auth/login` then
arrives at the browser as a 200 whose body is `index.html`; axios resolves it,
`JSON.parse` fails silently, and the app sees a "successful" login carrying no
session. The symptom is a login that reports nothing at all.

**The function must leave `/api/*` untouched** for the same reason — those paths
have to keep their real status codes. It rewrites a request to `/index.html`
only when the path is not under `/api/` and its last segment contains no dot,
so `/cart` is a route while `/assets/index-abc.js` stays a file.

`authRepository.login` validates the response body at runtime for the same
class of problem: a 2xx does not guarantee the body is a `LoginResponse`, and a
proxy error page or SPA fallback must fail loudly rather than silently.

## Credits

The project was built while following the Eazy Bytes full-stack React and Spring
Boot course ([course repository](https://github.com/eazybytes/fullstack-react-springboot)). The sticker artwork
in `public/stickers/` comes from that course and remains the property of its
respective owners. Artwork depicting real people or third-party brands, shows and
characters has been removed from this repository.
