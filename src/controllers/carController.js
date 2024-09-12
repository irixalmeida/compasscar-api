exports.createCar = (req, res) => {
    const {brand, model, year, items } = req.body;

    res.status(201).json({message: 'Car created successfully!'});
};