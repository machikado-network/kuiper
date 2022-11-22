export class KuiperError extends Error {
    message: string;
    name: string;
    stack: any;
    response?: Response
    __isKuiperError = true

    constructor(response: Response) {
        const msg = `Http Request failed (status code ${response.status})`
        super(msg);

        this.message = msg
        this.name = "KuiperError"
        this.response = new Response(response.body, response)
    }
}

export function isKuiperError(payload: any) {
    return payload !== null && typeof payload === "object" && payload.__isKuiperError
}
