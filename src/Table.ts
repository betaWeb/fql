interface Struct {
  type: any,
  primary_key: Boolean,
  nullable?: Boolean,
  default_value?: any,
  required?: Boolean,
  references?: string,
  foreign_key?: string
}

export default class Table {

  public name: string

  public struct: object

  public data: Array<object>

  private _primary_key: string

  constructor(name: string, struct: object, data: Array<object>) {
    this.name = name
    this.struct = struct
    this.data = data
    this._primary_key = null

    if (!this.data.length) return

    this.checkEntries()
    this.normalizeEntries()
  }

  public find(primary_key_val: number | string): Object | null {
    return this.data.find(item => item[this._primary_key] === primary_key_val) || null
  }

  private checkEntries(): void {
    this.data.forEach(this.checkEntry.bind(this))
  }

  private normalizeEntries(): void {
    this.data.forEach(this.normalizeEntry.bind(this))
  }

  private checkEntry(entry): void {
    let struct, value

    Object.keys(this.struct).forEach(field => {
      struct = this.struct[field]
      value = entry[field]

      if (struct.primary_key === true)
        this._primary_key = field

      if (!struct)
        throw `[Err] Table.struct - '${field}' field does not exists on '${this.name}' table structure`

      if (
        struct.nullable === false &&
        struct.required === true &&
        (value === null || value === undefined) &&
        struct.default_value === undefined
      )
        throw `[Err] Table.struct - '${field}' field cannot be empty on '${this.name}' table`

      if (value !== undefined && value.constructor !== struct.type)
        throw `[Err] Table.struct - '${field}' field have to be of type ${struct.type.name} on '${this.name}' table`
    })
  }

  private normalizeEntry(entry): void {
    let struct, value

    Object.keys(this.struct).forEach(field => {
      struct = this.struct[field]
      value = entry[field]

      if (struct.nullable && value === undefined)
        entry[field] = null

      if (!struct.nullable && struct.default_value)
        entry[field] = struct.default_value
    })
  }

}