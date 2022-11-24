import {Method} from "../kuiper";
import {Provider, Service, Task, Tasks} from "./index";

enum ApiRoutes {
    testGet = "/get"
}

interface ApiTasks extends Tasks<ApiRoutes> {
    [ApiRoutes.testGet]: null
}


class ApiService extends Service<ApiRoutes, ApiTasks> {
    baseUrl = "https://httpbin.org"

    headers(route: ApiRoutes): [string, string][] {
        return [["Content-Type", "application/json"]]
    }

    methods(route: ApiRoutes): Method {
        switch (route) {
            case ApiRoutes.testGet:
                return "GET"
        }
    }

    tasks(route: ApiRoutes, data: ApiTasks[ApiRoutes]): Task {
        switch (route) {
            case ApiRoutes.testGet:
                return {}
        }
    }
}


test("Test provider `testGet`", async () => {
    const provider = new Provider<ApiRoutes, ApiTasks>(new ApiService())
    const response = await provider.request(ApiRoutes.testGet, null)
    expect(response.ok).toBe(true)
})
