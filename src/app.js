const express = require('express')
const app = express();
app.use(express.json());
const carRoutes = require('./routes/carRoutes')

app.use('/api/v1/', carRoutes);

app.get('/', (req, res) => {
    res.send('Olá mundo');
});

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});