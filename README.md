# kuiper

[![GitHub](https://img.shields.io/github/license/machikado-network/kuiper)](https://github.com/machikado-network/kuiper/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@machikado-network/kuiper)](https://www.npmjs.com/package/@machikado-network/kuiper)
[![npm type definitions](https://img.shields.io/npm/types/@machikado-network/kuiper)](https://www.npmjs.com/package/@machikado-network/kuiper)

Kuiper is a HTTP Client that is Cloudflare Workers fetch function's wrapper.

```typescript
import kuiper from "./kuiper";
import {Request} from "@cloudflare/workers-types";

export default {
    async fetch(request: Request) {
        const response = await kuiper.post("https://httpbin.org/post", {key: "value"})
        return new Response(response.body, response)
    }
}
```

# Features

- **JSON Wrapper** - automatic JSON transforms
- **Fetcher support** - Service Bindings support

# ToDos

- [ ] **Request Builder**
- [ ] **Cache Control**
- [ ] **Full Method Support**
