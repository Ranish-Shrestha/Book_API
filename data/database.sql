CREATE DATABASE booksecondbind;

CREATE TABLE inventory (
  entry_id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(50) NOT NULL,
  genre VARCHAR(100),
  publication_date DATE,
  isbn VARCHAR(20) UNIQUE NOT NULL
);