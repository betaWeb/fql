import Schema from "./Schema";

export default class Fql {

    private schemas: object = {}

    public createSchema(name): Schema {
        this.schemas[name] = new Schema(name)

        return this.schemas[name]
    }

    public getAllSchemas(): object {
        return this.schemas
    }

    public listAllSchemas(): Array<string> {
        return Object.keys(this.schemas)
    }

    public hasSchema(name: string): boolean {
        return this.schemas[name] !== undefined
    }

    public getSchema(name: string): object | null {
        return this.schemas[name] || null
    }

    public removeSchema(name: string): boolean {
        if (!this.hasSchema(name)) return false

        this.schemas[name] = undefined

        return true
    }

}