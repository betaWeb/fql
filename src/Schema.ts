import Table from './Table'

export default class Schema {

  public name: string

  private tables: object

  constructor(name: string) {
    this.name = name
  }

  public all(): object {
    return this.tables
  }

  public list(): Array<string> {
    return Object.keys(this.tables)
  }

  public createTable(table_name: string, struct: object, data: object[] = []): Table {
    return new Table(table_name, struct, data, this)
  }

  public has(table_name: string): boolean {
    return this.tables[table_name] !== undefined
  }

  public get(table_name: string): object | null {
    return this.tables[table_name] || null
  }

  public load(tables: Table[]): Schema {
    this.tables = {
      ...this.tables,
      ...this.buildTables(tables)
    }
    return this
  }

  public delete(table_name: string): Schema {
    if (this.has(table_name))
      this.tables[table_name] = undefined
    return this
  }

  private buildTables(tables) {
    return tables.reduce((acc, { name, struct, data }) => ({ ...acc, ...{ [name]: this.createTable(name, struct, data) } }), {})
  }

}
