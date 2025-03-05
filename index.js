const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Expense = require('./models/expense');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.post('/expenses', async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).send(expense);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.get('/expenses', async (req, res) => {
    try {

        const { category, date } = req.query;

        const filter = {};
        if (category) filter.category = category;
        if (date) {

            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1); 
            filter.date = { $gte: start, $lt: end };
        }
        const expenses = await Expense.find(filter);
        res.status(200).send(expenses);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Hello, World! This is the Expense Tracker Backend.');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});