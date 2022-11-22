import {isKuiperError, KuiperError} from "./error";


export interface KuiperOptions {
    params?: { [p: string]: unknown } | URLSearchParams

    fetcher?: Fetcher | null
    method?: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS"
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
    if (!options) {
        return await fetch(url)
    }
    if (typeof options.params !== "undefined") {
        Object.entries(options.params).map(([key, value]) => urlobj.searchParams.set(key, value))
    }

    const response = await fetch(urlobj.toString(), {
        method: options.method,
        body: !options.json ? options.body : JSON.stringify(options.json),
        headers: options.headers,
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


async function post<T>(url: string, json: object, options?: KuiperOptions): Promise<T> {
    const newOptions: KuiperOptions = {
        ...options,
        json,
        method: "POST"
    }
    const headers = new Headers(newOptions.headers ?? [])
    headers.append("Content-Type", "application/json")
    newOptions.headers = Array.from(headers)

    const response = await kuiper(url, newOptions)
    return await response.json<T>()
}


function postWrapped(fetcher: Fetcher): typeof post {
    return async (url, json, options) => {
        return post(url, json, {...options, fetcher})
    }
}


interface Kuiper {
    (url: string, options?: KuiperOptions): Promise<Response>
    post: typeof post
    isKuiperError: typeof isKuiperError
}
interface KuiperWithWrapper extends Kuiper {
    (url: string, options?: KuiperOptions): Promise<Response>
    (fetcher: Fetcher): Kuiper
}


function wrapper(fetcher: Fetcher): Kuiper
function wrapper(url: string, options?: KuiperOptions): Promise<Response>
function wrapper(val: Fetcher | string, options?: KuiperOptions) {
    if (typeof val === "string") return kuiper(val, options)
    return Object.assign(
        kuiperWrapped(val),
        {
            post: postWrapped(val),
            isKuiperError,
        }
    )
}


export default Object.assign(wrapper, {
    post,
    isKuiperError
}) as KuiperWithWrapper
