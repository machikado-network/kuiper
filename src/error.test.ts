import {isKuiperError, KuiperError} from "./error"

test("Test error is KuiperError", async () => {
    const error = new KuiperError(new Response("error", {status: 404}))

    expect(isKuiperError(error)).toBe(true)
})
