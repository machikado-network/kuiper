import type {Body, KuiperOptions, Method} from "./kuiper"

export function isUndefined(value: unknown) {
    return typeof value === "undefined"
}


export function makeOptionWithBody(method: Method, baseOptions?: KuiperOptions, body?: Body): KuiperOptions {
    const options = {
        ...baseOptions,
        method
    }
    if (body === null) return options
    switch (typeof body) {
        case "object":
            if (body instanceof FormData || body instanceof Blob || body instanceof URLSearchParams) {
                options.body = body
            } else {
                options.json = body
                const headers = new Headers(options.headers ?? [])
                headers.set("Content-Type", "application/json")
                options.headers = Array.from(headers)
            }
            break
        case "undefined":
        case "string":
        default:
            options.body = body
            break
    }

    return options
}
