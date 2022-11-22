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
    const result = await response.json<{form: {A: "B"}}>()
    expect(response.ok).toBe(true)
    expect(result.form.A).toBe("B")
})

test("Test post Blob", async () => {
    const blob = new Blob(["test"])
    const response = await kuiper.post("https://httpbin.org/post", blob)
    const result = await response.json<{data: "test"}>()
    expect(response.ok).toBe(true)
    expect(result.data).toBe("test")
})
