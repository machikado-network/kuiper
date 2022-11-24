import kuiper, {Body, Method} from "../kuiper";
import {isUndefined, makeOptionWithBody} from "../util";

export class Service<T extends string, E extends Tasks<T>> {
    fetcher?: Fetcher
    baseUrl: string = ""

    headers(route: T): [string, string][] {
        return []
    }

    methods(route: T): Method {
        throw new Error("unimplemented")
    }

    tasks(route: T, data: E[T]): Task {
        throw new Error("unimplemented")
    }

    constructor(fetcher?: Fetcher) {
        this.fetcher = fetcher
    }
}


export type Task = {
    params?: { [p: string]: string },
    queries?: { [p: string]: string },
    body?: Body
}


export type Tasks<T extends string> = { [k in T]: unknown }

export class Provider<T extends string, E extends Tasks<T>> {
    private service: Service<T, E>

    constructor(service: Service<T, E>) {
        this.service = service
    }

    async request(route: T, value: E[T]) {
        const f = isUndefined(this.service.fetcher) ? kuiper : kuiper(this.service.fetcher!)

        const task = this.service.tasks(route, value)
        let parsedRoute = route as string

        // replace url params
        for (const [key, value] of Object.entries(task?.params ?? {})) {
            parsedRoute = route.replaceAll(`{${key}}`, value)
        }
        const url = new URL(this.service.baseUrl + parsedRoute)

        // set queries
        Object.entries(task?.queries ?? {}).map(([key, value]) => url.searchParams.set(key, value))

        return await f(this.service.baseUrl + route,
            makeOptionWithBody(this.service.methods(route), {
                headers: this.service.headers(route),
            }, task?.body))
    }
}
