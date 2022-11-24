# kuiper

[![GitHub](https://img.shields.io/github/license/machikado-network/kuiper)](https://github.com/machikado-network/kuiper/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@machikado-network/kuiper)](https://www.npmjs.com/package/@machikado-network/kuiper)
[![npm type definitions](https://img.shields.io/npm/types/@machikado-network/kuiper)](https://www.npmjs.com/package/@machikado-network/kuiper)

Kuiper is a HTTP Client that is Cloudflare Workers fetch function's wrapper.

```typescript
import kuiper from "@machikado-network/kuiper";

export default {
    async fetch(request: Request) {
        const response = await kuiper.post("https://httpbin.org/post", {key: "value"})
        return new Response(response.body, response)
    }
}
```

# Installing

```shell
$ npm install @machikado-network/kuiper
```

# Features

- **JSON Wrapper** - automatic JSON transforms
- **Fetcher support** - Service Bindings support

# ToDo

- [ ] **Request Builder**
- [ ] **Cache Control**
- [x] **Full Method Support**

# Example

```typescript
import kuiper from "@machikado-network/kuiper";

export default {
    async fetch(request: Request) {
        const response = await kuiper.post("https://httpbin.org/post", {key: "value"})
        return new Response(response.body, response)
    }
}
```

You can use Fetcher from [Service Bindings](https://developers.cloudflare.com/workers/runtime-apis/service-bindings/):


```typescript
import kuiper from "@machikado-network/kuiper";

interface Env {
    api: Fetcher
}

export default {
    async fetch(request: Request, env: Env) {
        const response = await kuiper(env.api).post("https://httpbin.org/post", {key: "value"})
        return new Response(response.body, response)
    }
}
```

## Provider

Kuiper Provider is a type-based API wrapper for Cloudflare Workers.

Its feature is:

- Compile-time checking for endpoints type definitions.
- Supports Service Bindings.

First, define API routes and argument types:

```typescript
enum ApiRoutes {
    testGet = "/get",
    testPost = "/post",
}

type ApiTasks =
    Task<ApiRoutes.testGet, null> |
    Task<ApiRoutes.testPost, {key: string}>
```

Second, improve service class.

```typescript
class ApiService extends Service<ApiRoutes, ApiTasks> {
    baseUrl = "https://httpbin.org"

    constructor(fetcher?: Fetcher) {
        // You can set Service Bindings fetcher in constructor
        super(fetcher)
    }

    headers(_route: ApiRoutes): [string, string][] {
        return [["Content-Type", "application/json"]]
    }

    methods(route: ApiRoutes): Method {
        switch (route) {
            case ApiRoutes.testGet:
                return "GET"
            case ApiRoutes.testPost:
                return "POST"
        }
    }

    tasks([route, data]: ApiTasks): Parameters {
        switch (route) {
            case ApiRoutes.testGet:
                return {}
            case ApiRoutes.testPost:
                return {body: data}
        }
    }
}
```

Third, create Provider instance and request with route and task:

```typescript
const provider = new Provider<ApiRoutes, ApiTasks>(new ApiService())
const response = await provider.request([ApiRoutes.testGet, null])
```
