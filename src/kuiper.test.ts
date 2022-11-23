import kuiper from "./kuiper";


test("Test get", async () => {
    const response = await kuiper("https://example.com")
    expect(response.ok).toBe(true)
})

test("Test post", async () => {
    const response = await kuiper.post("https://httpbin.org/post", {key: "value"})
    expect(response.ok).toBe(true)
})

test("Test post formData", async () => {
    const data = new FormData()
    data.set("A", "B")
    const response = await kuiper.post("https://httpbin.org/post", data)
    expect(response.ok).toBe(true)
    const result = await response.json<{form: {A: "B"}}>()
    expect(result.form.A).toBe("B")
})

test("Test post Blob", async () => {
    const blob = new Blob(["test"])
    const response = await kuiper.post("https://httpbin.org/post", blob)
    expect(response.ok).toBe(true)
    const result = await response.json<{data: "test"}>()
    expect(result.data).toBe("test")
})

test("Test put", async () => {
    const response = await kuiper.put("https://httpbin.org/put", {key: "value"})
    expect(response.ok).toBe(true)
})

test("Test patch", async () => {
    const response = await kuiper.patch("https://httpbin.org/patch", {key: "value"})
    expect(response.ok).toBe(true)
})

test("Test delete", async () => {
    const response = await kuiper.delete("https://httpbin.org/delete")
    expect(response.ok).toBe(true)
})

test("Test header", async () => {
    const response = await kuiper("https://httpbin.org/get", {
        headers: [
            ["X-KEY", "Value"]
        ]
    })
    expect(response.ok).toBe(true)

    const result = await response.json<{headers: {"X-Key": "Value"}}>()
    expect(result.headers["X-Key"]).toEqual("Value")
})

test("Test cookie", async () => {
    const response = await kuiper("https://httpbin.org/cookies", {
        cookies: {
            key: "value",
            dog: "cat",
        }
    })
    expect(response.ok).toBe(true)

    const result = await response.json<{cookies: {key: "value", dog: "cat"}}>()
    expect(result.cookies).toEqual({key: "value", dog: "cat"})
})
