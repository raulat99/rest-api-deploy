import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found ' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = await this.movieModel.create({ input: result.data })

    res.status(201).json({ message: 'Movie created', movie: newMovie })
  }

  delete = async (req, res) => {
    const { id } = req.params
    const deletedMovieResponse = await this.movieModel.delete({ id })

    if (deletedMovieResponse === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    return res.json({ message: 'Movie deleted', deletedMovieResponse })
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })

    const { id } = req.params

    const updatedMovieResponse = await this.movieModel.update({ id, input: result.data })

    if (updatedMovieResponse === false) return res.status(404).json({ message: 'Movie not found' })

    return res.json(updatedMovieResponse)
  }
}
