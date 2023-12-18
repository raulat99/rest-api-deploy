--- creación de la base de datos
drop database if exists moviesdb;
CREATE DATABASE moviesdb;

-- usar
USE moviesdb;

-- crear tabla movies
CREATE TABLE movie (
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	title VARCHAR(255) NOT NULL,
	year INT NOT NULL,
	director VARCHAR(255) NOT NULL,
	duration INT NOT NULL,
	poster TEXT,
	rate DECIMAL(2, 1) UNSIGNED NOT NULL
);

CREATE TABLE genre (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL UNIQUE
	);

CREATE TABLE movie_genres (
	movie_id BINARY(16) REFERENCES movies(id),
	genre_id BINARY(16) REFERENCES genres(id),
	PRIMARY KEY (movie_id, genre_id)
);

insert into genre (name) values 
('Drama'),
('Action'),
('Crime'),
('Adventure'),
('Sci-fi'),
('Romance');


insert into movie (id, title, year, director, duration, poster, rate) values
( UUID_TO_BIN(UUID()), "Inception", 2010, "Christopher Nolan", 180, "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp", 8.8),
(UUID_TO_BIN(UUID()), "The Shawshank Redemption", 1994, "Frank Darabont", 142, "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp", 9.3),
(UUID_TO_BIN(UUID()), "The Dark Knight", 2008, "Christopher Nolan", 152, "https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg", 9.0),
(UUID_TO_BIN(UUID()), "Pulp Fiction", 1994, "Quentin Tarantino", 154, "https://www.themoviedb.org/t/p/original/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg", 8.9),
(UUID_TO_BIN(UUID()), "Forrest Gump", 1994, "Robert Zemeckis", 142, "https://i.ebayimg.com/images/g/qR8AAOSwkvRZzuMD/s-l1600.jpg", 8.8),
(UUID_TO_BIN(UUID()), "Gladiator", 2000, "Ridley Scott", 155, "https://img.fruugo.com/product/0/60/14417600_max.jpg", 8.5),
(UUID_TO_BIN(UUID()), "The Matrix", 1999, "Lana Wachowski", 136, "https://i.ebayimg.com/images/g/QFQAAOSwAQpfjaA6/s-l1200.jpg", 8.7);

INSERT INTO movie_genres(movie_id, genre_id)
VALUES
	((SELECT id FROM movie WHERE title='Inception'), (SELECT id FROM genre WHERE name='Sci-fi')),
	((SELECT id FROM movie WHERE title='Inception'), (SELECT id FROM genre WHERE name='Action')),
	((SELECT id FROM movie WHERE title='The Shawshank Redemption'), (SELECT id FROM genre WHERE name='Drama')),
	((SELECT id FROM movie WHERE title='The Dark Knight'), (SELECT id FROM genre WHERE name='Action')),
	((SELECT id FROM movie WHERE title='The Dark Knight'), (SELECT id FROM genre WHERE name='Crime')),
	((SELECT id FROM movie WHERE title='The Dark Knight'), (SELECT id FROM genre WHERE name='Drama')),
	((SELECT id FROM movie WHERE title='Pulp Fiction'), (SELECT id FROM genre WHERE name='Crime')),
	((SELECT id FROM movie WHERE title='Pulp Fiction'), (SELECT id FROM genre WHERE name='Drama')),
	((SELECT id FROM movie WHERE title='Forrest Gump'), (SELECT id FROM genre WHERE name='Drama')),
	((SELECT id FROM movie WHERE title='Forrest Gump'), (SELECT id FROM genre WHERE name='Romance')),
	((SELECT id FROM movie WHERE title='Gladiator'), (SELECT id FROM genre WHERE name='Action')),
	((SELECT id FROM movie WHERE title='Gladiator'), (SELECT id FROM genre WHERE name='Adventure')),
	((SELECT id FROM movie WHERE title='Gladiator'), (SELECT id FROM genre WHERE name='Drama')),
	((SELECT id FROM movie WHERE title='The Matrix'), (SELECT id FROM genre WHERE name='Action')),
	((SELECT id FROM movie WHERE title='The Matrix'), (SELECT id FROM genre WHERE name='Sci-Fi'));

SELECT BIN_TO_UUID(m.id) as id , m.title, m.year, m.director, m.duration, m.poster, m.rate, g.name FROM MOVIE m, genre g, movie_genres mg
	where m.id = mg.movie_id and g.id = mg.genre_id ;
	
