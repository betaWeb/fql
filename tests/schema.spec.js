import { Schema } from '../index'

describe('Scehma', () => {
  let schema

  beforeEach(() => {
    schema = new Schema()
  })

  it('should contains posts table in his list of schemas', () => {
    load()

    expect(schema.list()).toEqual(expect.arrayContaining(['posts']))

  })

  it('should have a posts table', () => {
    load()

    expect(schema.has('posts')).toBe(true)

  })

  it('should have non empty data for posts', () => {
    load()

    expect(schema.get('posts').data).toHaveLength(1)

  })

  it('should have a valid post', () => {

    expect(() => load()).not.toThrow()

  })

  it('should have an invalid post', () => {

    expect(() => loadInvalid()).toThrow()

  })

  const struct = {
    id: {
      type: Number,
      primary_key: true,
      nullable: false,
      default_value: undefined,
      required: true
    },
    title: {
      type: String,
      nullable: false,
      default_value: undefined,
      required: true
    },
    body: {
      type: String,
      nullable: false,
      default_value: undefined,
      required: true
    },
    created_at: {
      type: Date,
      nullable: false,
      default_value: new Date,
      required: true
    },
    updated_at: {
      type: Date,
      nullable: false,
      default_value: new Date,
      required: true
    },
    category: {
      type: 'relation',
      references: 'category',
      foreign_key: 'id',
      nullable: true
    }
  }

  const load = () => {
    schema.load([
      {
        name: 'posts',
        struct,
        data: [{
          id: 1,
          title: 'Mon article',
          body: 'Le contenu de mon super article'
        }]
      }
    ])
  }

  const loadInvalid = () => {
    schema.load([
      {
        name: 'posts',
        struct,
        data: [{
          id: 2,
          title: 'Mon second article'
        }]
      }
    ])
  }

})