export interface KuiperOptions {
    params?: { [p: string]: unknown } | URLSearchParams
    fetcher?: Fetcher | null
    method?: string
    body?: BodyInit | null
    json?: object
    headers?: HeadersInit
}


async function kuiper(url: string, options?: KuiperOptions): Promise<Response> {
    let urlobj = new URL(url)
    if (!options) {
        return await fetch(url)
    }
    if (typeof options.params !== "undefined") {
        Object.entries(options.params).map(([key, value]) => urlobj.searchParams.set(key, value))
    }

    return await fetch(urlobj.toString(), {
        method: options.method,
        body: !options.json ? options.body : JSON.stringify(options.json),
        headers: options.headers,
        fetcher: options.fetcher,
        cf: undefined,
    })
}

async function post<T>(url: string, json: object, options?: KuiperOptions): Promise<T> {
    const response = await kuiper(url, {
        ...options,
        json,
        method: "POST"
    })
    return await response.json<T>()
}


const default_ = Object.assign(kuiper, {post})

export default default_
