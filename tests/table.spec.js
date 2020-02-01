import { Table } from '../index'

describe('Table', () => {
  let table
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
  const dataValid = {
    id: 1,
    title: 'Mon article',
    body: 'Le contenu de mon super article'
  }
  const dataInvalid = {
    id: 2,
    title: 'Mon second article'
  }

  beforeEach(() => {
    table = new Table('posts', struct, [])
  })

  it('should have no data', () => {

    expect(table.data).toBeEmpty()

  })

  it('should not throws error on invalid data store', () => {

    expect(() => table.insert(dataValid)).not.toThrow()

  })

  it('should throws error on invalid data store', () => {

    expect(() => table.insert(dataInvalid))
        .toThrowError("[Err] Table.struct - 'body' field cannot be empty on 'posts' table")

  })

  it('should returns the correct item when find with primary key', () => {

    table.insert(dataValid)

    const post = table.find(1)

    expect(post).not.toBeNull()
    expect(post).toContainValue('Mon article')
    expect(post).toContainValue('Le contenu de mon super article')

  })

  it('should returns null when find with primary key that not exists', () => {

    table.insert(dataValid)

    const post = table.find(2)

    expect(post).toBeNull()

  })

  it ('should returns the correct item on finding with parameters', () => {

    table.insertMany([dataValid, {
      id: 2,
      title: 'Mon article',
      body: 'Le contenu de mon deuxième super article'
    }])

    const posts = table.findBy('title', 'Mon article')

    expect(posts).not.toBeNull()
    expect(posts[0]).toContainEntries([['id', 1]])
    expect(posts[1]).toContainEntries([['id', 2]])
  })

  it ('should returns null on finding with parameters that not exists', () => {

    table.insertMany([dataValid, {
      id: 2,
      title: 'Mon article',
      body: 'Le contenu de mon deuxième super article'
    }])

    const posts = table.findBy('title', 'not exists')

    expect(posts).toBeEmpty()
  })

  it ('should update an existing entry without error', () => {

    table.insert(dataValid)

    expect(table.find(1)).toContainEntries([['title', 'Mon article']])

    table.update(1, {title: 'Mon article mis à jour' })

    expect(table.find(1)).toContainEntries([['title', 'Mon article mis à jour']])
  })

  it ('should throws an error when update a non existing entry', () => {

    expect(() => table.update(1, {title: 'Mon article mis à jour' }))
        .toThrowError("[Err] Table.update - cannot find element with a primary key of '1' on 'posts' table structure")

  })

  it('should delete an existing entry without error', () => {

    table.insert(dataValid)

    expect(table.find(1)).toContainEntries([['title', 'Mon article']])

    table.delete(1)

    expect(table.find(1)).toBeNil()

  })

  it('should soft delete an existing entry without error', () => {

    table.insert(dataValid)

    expect(table.find(1)).toContainEntries([['title', 'Mon article']])

    table.delete(1, true)

    expect(table.find(1)).toContainKey('_deleted')

  })

  it ('should throws an error when delete a non existing entry', () => {

    expect(() => table.delete(1))
        .toThrowError("[Err] Table.delete - cannot find element with a primary key of '1' on 'posts' table structure")

  })

})