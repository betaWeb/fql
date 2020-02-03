import {Fql, Schema} from '../index'

describe('Schema', () => {
  let db

  beforeEach(() => {
    db = new Fql()
  })

  it('should contains no schemas', () => {

    expect(db.getAllSchemas()).toBeEmpty()

  })

  it('should contains 1 schema', () => {

    const schema = db.createSchema('simple_blog')

    expect(schema).toBeInstanceOf(Schema)
    expect(db.getSchema('simple_blog')).toBeInstanceOf(Schema)
    expect(db.getAllSchemas()).not.toBeEmpty()
    expect(db.hasSchema('simple_blog')).toBeTrue()

  })

  it('should remove a schema correctly', () => {

    db.createSchema('simple_blog')

    expect(db.hasSchema('simple_blog')).toBeTrue()

    expect(db.removeSchema('simple_blog')).toBeTrue()

    expect(db.hasSchema('simple_blog')).toBeFalse()

  })

  it('should returns false on unknown schema deletion', () => {

    expect(db.removeSchema('unknown_schema')).toBeFalse()

  })

})