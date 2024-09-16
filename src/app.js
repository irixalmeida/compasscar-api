const express = require('express')
const app = express();
app.use(express.json());
const carRoutes = require('./routes/carRoutes');
const connection = require('./config/db');

app.use('/api/v1/', carRoutes);

app.get('/', (req, res) => {
    res.send('Olá mundo, a minha api está funcionando.');
});

const PORT = process.env.PORT || 3000

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database!');
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
