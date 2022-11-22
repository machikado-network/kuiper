import kuiper from "./kuiper";


test("Test get", async () => {
    const response = await kuiper("https://example.com")
    expect(response.ok).toBe(true)
})

test("Test post", async () => {
    const response = await kuiper.post("https://httpbin.org/post", {key: "value"})
    expect(response.ok).toBe(true)
})
