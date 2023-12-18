import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'ElMysql&R4u102',
  database: 'moviesdb'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      // get genres ids and names
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
      )
      // no genres found
      if (genres.length === 0) return []

      const moviesWithGenreSelected = await connection.query(
        'SELECT m.title, m.year, m.director, m.duration, m.poster, m.rate, BIN_TO_UUID(m.id) as id FROM movie m, genre g, movie_genres mg WHERE m.id = mg.movie_id AND g.id = genre_id AND LOWER(g.name) = ?;', [lowerCaseGenre]
      )
      return moviesWithGenreSelected
    }

    const result = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
    )
    return result
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);', [id]
    )
    return movies
  }

  static async create ({ input }) {
    const {
      genre: genreInput, // genre is an array,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query('INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?),?,?,?,?,?,?);',
        [uuid, title, year, director, duration, poster, rate])
    } catch (e) {
      console.log({ message: e.message })
      throw new Error('Error creating movie')
    }

    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);',
      [uuid])

    return movies[0]
  }

  static async delete ({ id }) {
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);', [id]
    )
    if (movies.length === 0) {
      return false
    }

    try {
      await connection.query('DELETE FROM movie WHERE id = UUID_TO_BIN(?);', [id])
      await connection.query('DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);', [id])
    } catch (e) {
      console.log({ message: e.message })
      throw new Error('Error creating movie')
    }
    const [moviesUpdated] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;',
      [id])

    return moviesUpdated
  }

  static async update ({ id, input }) {
    // to - do

  }
}
