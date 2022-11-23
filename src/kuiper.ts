import {isKuiperError, KuiperError} from "./error";
import {Cookies} from "./cookies";


type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS"
export type Body = object | null | string | FormData | Blob | URLSearchParams


export interface KuiperOptions {
    params?: { [p: string]: unknown } | URLSearchParams
    cookies?: { [p: string]: string }

    fetcher?: Fetcher | null
    method?: Method
    body?: BodyInit | null
    json?: object
    headers?: HeadersInit
}


/**
 * Request HTTP by fetch function.
 * @param url
 * @param options
 */
async function kuiper(url: string, options?: KuiperOptions): Promise<Response> {
    let urlobj = new URL(url)
    const headers = new Headers(options?.headers)
    if (!options) {
        return await fetch(url)
    }
    Object.entries(options.params ?? {}).forEach(([key, value]) => urlobj.searchParams.set(key, value))

    if (typeof options.cookies !== "undefined") {
        headers.set("cookie", new Cookies(Object.entries(options.cookies)).toString())
    }

    const response = await fetch(urlobj.toString(), {
        method: options.method,
        body: !options.json ? options.body : JSON.stringify(options.json),
        headers,
        fetcher: options.fetcher,
        cf: undefined,
    })

    if (!response.ok) throw new KuiperError(response)

    return response
}


function makeOptionWithBody(method: Method, baseOptions?: KuiperOptions, body?: Body): KuiperOptions {
    let options = {
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


function kuiperWrapped(fetcher: Fetcher): typeof kuiper {
    return async (url, options) => {
        return kuiper(url, {...options, fetcher})
    }
}


type MethodWrapped = (url: string, data?: Body, options?: KuiperOptions) => Promise<Response>

function wrapped(method: Method, fetcher?: Fetcher): MethodWrapped {
    return async (url: string, data?: Body, options?: KuiperOptions) => {
        return await kuiper(url, makeOptionWithBody(method, {...options, fetcher}, data))
    }
}


interface KuiperSources {
    post: MethodWrapped
    put: MethodWrapped
    patch: MethodWrapped
    delete: MethodWrapped
    options: MethodWrapped
    isKuiperError: typeof isKuiperError
}
interface Kuiper extends KuiperSources {
    (url: string, options?: KuiperOptions): Promise<Response>
    (fetcher: Fetcher): Kuiper
}


function wrapper(fetcher: Fetcher): Kuiper
function wrapper(url: string, options?: KuiperOptions): Promise<Response>
function wrapper(val: Fetcher | string, options?: KuiperOptions) {
    if (typeof val === "string") return kuiper(val, options)
    const sources: KuiperSources = {
        post: wrapped("POST", val),
        put: wrapped("PUT", val),
        patch: wrapped("PATCH", val),
        delete: wrapped("DELETE", val),
        options: wrapped("OPTIONS", val),
        isKuiperError,
    }
    return Object.assign(
        kuiperWrapped(val),
        sources
    )
}


const sources: KuiperSources = {
    post: wrapped("POST"),
    put: wrapped("PUT"),
    patch: wrapped("PATCH"),
    delete: wrapped("DELETE"),
    options: wrapped("OPTIONS"),
    isKuiperError
}


export default Object.assign(wrapper, sources) as Kuiper
