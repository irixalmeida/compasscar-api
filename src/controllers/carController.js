const db = require('../config/db');

exports.createCar = (req, res) => {
  const { brand, model, year, items } = req.body;

  if (!brand) return res.status(400).json({ error: "Brand is required" });
  if (!model) return res.status(400).json({ error: "Model is required" });
  if (!year) return res.status(400).json({ error: "Year is required" });
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Items are required and must be an array" });
  }

  const currentYear = new Date().getFullYear();
  if (year < currentYear - 10 || year > currentYear) {
    return res
      .status(400)
      .json({
        error: `Year should be between ${currentYear - 10} and ${currentYear}`,
      });
  }

  const uniqueItems = [...new Set(items)];

  const checkQuery =
    "SELECT * FROM cars WHERE brand = ? AND model = ? AND year = ?";
  db.query(checkQuery, [brand, model, year], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length > 0) {
      return res
        .status(409)
        .json({ error: "There is already a car with this data" });
    }

    const insertCarQuery =
      "INSERT INTO cars (brand, model, year) VALUES (?, ?, ?)";
    db.query(insertCarQuery, [brand, model, year], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      const carId = result.insertId;

      const insertItemsQuery = "INSERT INTO cars_items (name, car_id) VALUES ?";
      const itemsData = uniqueItems.map((item) => [item, carId]);

      db.query(insertItemsQuery, [itemsData], (err) => {
        if (err)
          return res.status(500).json({ error: "Error inserting items" });

        res
          .status(201)
          .json({ message: "Car created successfully!", id: carId });
      });
    });
  });
};
