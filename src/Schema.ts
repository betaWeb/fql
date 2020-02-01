import Table from './Table'

export default class Schema {

  private schemas: object

  public all(): object {
    return this.schemas
  }

  public list(): Array<string> {
    return Object.keys(this.schemas)
  }

  public has(table_name: string): boolean {
    return this.schemas[table_name] !== undefined
  }

  public get(table_name: string): object | null {
    return this.schemas[table_name] || null
  }

  public load(tables: Table[]): Schema {
    this.schemas = {
      ...this.schemas,
      ...this.buildTables(tables)
    }
    return this
  }

  public delete(table_name: string): Schema {
    if (this.has(table_name))
      this.schemas[table_name] = undefined
    return this
  }

  private buildTables(tables) {
    return tables.reduce((acc, { name, struct, data }) => ({ ...acc, ...{ [name]: new Table(name, struct, data) } }), {})
  }

}
