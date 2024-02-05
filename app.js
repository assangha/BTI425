/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ajaipal Singh Sangha Student ID: 027734144 Date: 02/02/2024
*  Cyclic Link: _______________________________________________________________
*
********************************************************************************/ 


require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import the 'cors' package
const MoviesDB = require('./moviesDB'); // Import the moviesDB module
const db = new MoviesDB();
const app = express();

// Load environment variables from the ".env" file
require('dotenv').config();

const PORT = process.env.PORT || 3000; // Use the provided PORT or default to 3000

// Using 'cors' as middleware before your routes
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
});

// Additional routes can now parse JSON from the request body

app.post('/example', (req, res) => {
    const requestData = req.body;
    res.json({ receivedData: requestData });
});

// Initialize MongoDB connection and start the server
db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

// Routes

// POST /api/movies
app.post('/api/movies', async (req, res) => {
    try {
        const newMovie = await db.addNewMovie(req.body);
        res.status(201).json(newMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/movies
app.get('/api/movies', async (req, res) => {
    try {
        let { page, perPage, title } = req.query;

        // Validate that page and perPage are valid numbers
        page = parseInt(page, 10);
        perPage = parseInt(perPage, 10);

        if (isNaN(page) || isNaN(perPage)) {
            return res.status(400).json({ error: 'Invalid page or perPage parameters' });
        }

        const movies = await db.getAllMovies(page, perPage, title);
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// GET /api/movies/:id
app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await db.getMovieById(req.params.id);
        if (!movie) {
            res.status(204).json({ message: 'No Content' });
        } else {
            res.status(200).json(movie);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/movies/:id
app.put('/api/movies/:id', async (req, res) => {
    try {
        const updatedMovie = await db.updateMovieById(req.body, req.params.id);
        if (!updatedMovie) {
            res.status(204).json({ message: 'No Content' });
        } else {
            res.status(200).json(updatedMovie);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/movies/:id
app.delete('/api/movies/:id', async (req, res) => {
    try {
        const deletedMovie = await db.deleteMovieById(req.params.id);
        if (!deletedMovie) {
            res.status(204).json({ message: 'No Content' });
        } else {
            res.status(200).json({ message: 'Movie deleted successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});