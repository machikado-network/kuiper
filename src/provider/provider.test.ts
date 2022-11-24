import type {Method} from "../kuiper"
import type { Task, Tasks} from "./index"
import {Provider, Service} from "./index"

enum ApiRoutes {
    testGet = "/get",
    testPost = "/post",
}

interface ApiTasks extends Tasks<ApiRoutes> {
    [ApiRoutes.testGet]: null
    [ApiRoutes.testPost]: {key: string}
}


class ApiService extends Service<ApiRoutes, ApiTasks> {
    baseUrl = "https://httpbin.org"

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

    tasks(route: ApiRoutes, data: ApiTasks[ApiRoutes]): Task {
        switch (route) {
            case ApiRoutes.testGet:
                return {}
            case ApiRoutes.testPost:
                return {body: data}
        }
    }
}


test("Test provider `testGet`", async () => {
    const provider = new Provider<ApiRoutes, ApiTasks>(new ApiService())
    const response = await provider.request(ApiRoutes.testGet, null)
    expect(response.ok).toBe(true)
})
