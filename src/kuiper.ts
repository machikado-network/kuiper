import {Cookies} from "./cookies"
import {isKuiperError, KuiperError} from "./error"
import {isUndefined, makeOptionWithBody} from "./util"


export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS"
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


async function kuiper(url: string, options?: KuiperOptions): Promise<Response> {
    const urlobj = new URL(url)
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


function kuiperWrapped(fetcher: Fetcher): typeof kuiper {
    return async (url, options) => {
        return kuiper(url, {...options, fetcher})
    }
}


type MethodWrapped = (url: string, data?: Body, options?: KuiperOptions) => Promise<Response>

function wrapped(method: Method, fetcher?: Fetcher): MethodWrapped {
    return async (url: string, data?: Body, options?: KuiperOptions) => {
        url = !isUndefined(fetcher) && url.startsWith("/") ? `https://fetcher${url}` : url
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


/**
 * Return kuiper function with fetcher.
 * If you use it, kuiper requests http request by using fetcher.
 * @param fetcher
 */
function wrapper(fetcher: Fetcher): Kuiper
/**
 * Request HTTP Request by fetch.
 * @param url request url
 * @param options request options
 */
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
