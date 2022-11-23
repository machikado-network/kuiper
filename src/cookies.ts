export class Cookies {
    private items: [string, string][] = []

    constructor(items?: [string, string][]) {
        items?.forEach(([key, value]) => this.add(key, value))
    }

    add(key: string, value: string) {
        this.items.push([key, value])
    }

    toString() {
        return this.items.map(([key, value]) => `${key}=${value}`).join("; ")
    }
}
