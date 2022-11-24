import type {Method} from "../kuiper"
import type {Task, Parameters} from "./index"
import { Provider, Service} from "./index"


enum ApiRoutes {
    testGet = "/get",
    testPost = "/post",
    testPut = "/put"
}

type ApiTasks =
    Task<ApiRoutes.testGet, null> |
    Task<ApiRoutes.testPost, {key: string}> |
    Task<ApiRoutes.testPut, string>


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
            case ApiRoutes.testPut:
                return "PUT"
        }
    }

    tasks([route, data]: ApiTasks): Parameters {
        switch (route) {
            case ApiRoutes.testGet:
                return {}
            case ApiRoutes.testPost:
            case ApiRoutes.testPut:
                return {body: data}
        }
    }
}


test("Test provider `testGet`", async () => {
    const provider = new Provider<ApiRoutes, ApiTasks>(new ApiService())
    const response = await provider.request([ApiRoutes.testGet, null])
    expect(response.ok).toBe(true)
})

test("Test provider `testPost`", async () => {
    const provider = new Provider<ApiRoutes, ApiTasks>(new ApiService())
    const response = await provider.request([ApiRoutes.testPost, {key: "value"}])
    expect(response.ok).toBe(true)
    const result = await response.json<{data: "{\"key\":\"value\"}"}>()
    expect(result.data).toBe("{\"key\":\"value\"}")
})

test("Test provider `testPut`", async () => {
    const provider = new Provider<ApiRoutes, ApiTasks>(new ApiService())
    const response = await provider.request([ApiRoutes.testPut, "test"])
    expect(response.ok).toBe(true)
    const result = await response.json<{data: "test"}>()
    expect(result.data).toBe("test")
})
