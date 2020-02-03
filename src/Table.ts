import Schema from "./Schema";

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

  public data: object[] = []

  private schema: Schema

  private _primary_key: string = 'id'

  private _relationships: object = {}

  constructor(name: string, struct: object, data: object[] = [], schema: Schema) {
    this.name = name
    this.struct = struct
    this.data = data
    this.schema = schema

    if (!this.data.length) return

    this.checkEntries()
    this.normalizeEntries()
  }

  insertMany(rows: object[] = []): Table {
    try {
      this.checkEntries(rows)
      this.data = this.data.concat(rows)
      return this
    } catch (e) {
      throw e
    }
  }

  insert(row: object): Table {
    try {
      this.checkEntry(row)
      this.data.push(row)
      return this
    } catch (e) {
      throw e
    }
  }

  public find(primary_key_val: number | string): Object | null {
    let dataset = this.data.find(item => item !== undefined && item[this._primary_key] === primary_key_val) || null

    dataset = this.feedRelationships(dataset)

    return dataset
  }

  public findIndex(primary_key_val: number | string): number {
    return this.data.findIndex(item => item !== undefined && item[this._primary_key] === primary_key_val)
  }

  public findBy(key: string, value: string|number|boolean, strict = false): object[] {
    return this.data.filter(item => {
      if (strict) return item[key] === value
      return item[key] == value
    })
  }

  public update(primary_key_val: number | string, params: object): object {
    const i = this.findIndex(primary_key_val)

    if (i < 0)
      throw `[Err] Table.update - cannot find element with a primary key of '${primary_key_val}' on '${this.name}' table structure`

    this.data[i] = {...this.data[i], ...params}

    return this.data[i]
  }

  public delete(primary_key_val: number | string, soft_delete: boolean = false): object {
    const i = this.findIndex(primary_key_val)

    if (i < 0)
      throw `[Err] Table.delete - cannot find element with a primary key of '${primary_key_val}' on '${this.name}' table structure`


    if (soft_delete)
      return this.update(primary_key_val, {_deleted: true})

    const row = this.data[i]

    this.data[i] = undefined

    return row
  }

  private checkEntries(rows: object[] | null = null): void {
    (rows || this.data).forEach(this.checkEntry.bind(this))
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

      if (struct.type === 'relation' && !this._relationships[field])
        this._relationships[field] = struct.type
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

  /**
   * @todo
   * get entries relationships via _relationships property (recursive way)
   * dataset.forEach(item => ...)
   */
  private feedRelationships(dataset: object) {
    return dataset
  }
}