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

async function post<T>(url: string, json: object, options?: KuiperOptions): Promise<T> {
    const response = await kuiper(url, {
        ...options,
        json,
        method: "POST"
    })
    return await response.json<T>()
}


const default_ = Object.assign(kuiper, {
    post,
    isKuiperError
})

export default default_
