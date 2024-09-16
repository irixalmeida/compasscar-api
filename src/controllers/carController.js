const db = require("../config/db");

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
    return res.status(400).json({
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

exports.getCars = (req, res) => {
  const { page = 1, limit = 5, brand, model, year } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  let limitNum = Math.max(1, Math.min(parseInt(limit) || 5, 10));

  const offset = (pageNum - 1) * limitNum;

  let query = `
    SELECT cars.id, cars.brand, cars.model, cars.year, GROUP_CONCAT(cars_items.name) AS items 
    FROM cars
    LEFT JOIN cars_items ON cars.id = cars_items.car_id
  `;
  let countQuery = "SELECT COUNT(*) AS total FROM cars";
  const queryParams = [];
  const countParams = [];

  if (brand || model || year) {
    query += " WHERE ";
    countQuery += " WHERE ";
    const filters = [];

    if (brand) {
      filters.push("cars.brand LIKE ?");
      queryParams.push(`%${brand}%`);
      countParams.push(`%${brand}%`);
    }

    if (model) {
      filters.push("cars.model LIKE ?");
      queryParams.push(`%${model}%`);
      countParams.push(`%${model}%`);
    }

    if (year) {
      filters.push("cars.year >= ?");
      queryParams.push(year);
      countParams.push(year);
    }

    query += filters.join(" AND ");
    countQuery += filters.join(" AND ");
  }

  query += " GROUP BY cars.id LIMIT ? OFFSET ?";
  queryParams.push(limitNum, offset);

  db.query(countQuery, countParams, (err, countResult) => {
    if (err) {
      console.error("Error counting cars:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const totalCars = countResult[0].total;
    const totalPages = Math.ceil(totalCars / limitNum);

    if (totalCars === 0) {
      return res.status(204).json({ message: "No cars found" });
    }

    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error("Error fetching cars:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(204).json({ message: "No cars found" });
      }

      const cars = results.map((car) => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        items: car.items ? car.items.split(",") : [],
      }));

      res.status(200).json({
        count: totalCars,
        pages: totalPages,
        data: cars,
      });
    });
  });
};

exports.getCarById = (req, res) => {
  const carId = req.params.id;
  const query = "SELECT * FROM cars WHERE id = ?";

  db.query(query, [carId], (err, results) => {
    if (err) {
      console.error("Error fetching car:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.status(200).json({ data: results[0] });
  });
};

exports.updateCar = (req, res) => {
  const carId = req.params.id;
  const { brand, model, year, items } = req.body;

  const checkQuery = "SELECT * FROM cars WHERE id = ?";
  db.query(checkQuery, [carId], (err, result) => {
    if (err) {
      console.error("Error fetching car:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    const currentYear = new Date().getFullYear();
    if (year && (year < currentYear - 10 || year > currentYear)) {
      return res
        .status(400)
        .json({
          error: `Year should be between ${
            currentYear - 10
          } and ${currentYear}`,
        });
    }

    const duplicateCheckQuery =
      "SELECT * FROM cars WHERE brand = ? AND model = ? AND year = ? AND id != ?";
    db.query(
      duplicateCheckQuery,
      [brand, model, year, carId],
      (err, duplicateResult) => {
        if (err) {
          console.error("Error checking for duplicates:", err);
          return res.status(500).json({ error: "Database error" });
        }
        if (duplicateResult.length > 0) {
          return res
            .status(409)
            .json({ error: "There is already a car with this data" });
        }

        const updateQuery = `
        UPDATE cars SET 
          brand = COALESCE(?, brand), 
          model = COALESCE(?, model), 
          year = COALESCE(?, year) 
        WHERE id = ?
      `;

        db.query(
          updateQuery,
          [brand || null, model || null, year || null, carId],
          (err) => {
            if (err) {
              console.error("Error updating car:", err);
              return res.status(500).json({ error: "Database error" });
            }

            if (items && Array.isArray(items) && items.length > 0) {
              const uniqueItems = [...new Set(items)];

              const deleteItemsQuery =
                "DELETE FROM cars_items WHERE car_id = ?";
              db.query(deleteItemsQuery, [carId], (err) => {
                if (err) {
                  console.error("Error deleting items:", err);
                  return res
                    .status(500)
                    .json({ error: "Error deleting items" });
                }

                const insertItemsQuery =
                  "INSERT INTO cars_items (name, car_id) VALUES ?";
                const itemsData = uniqueItems.map((item) => [item, carId]);

                db.query(insertItemsQuery, [itemsData], (err) => {
                  if (err) {
                    console.error("Error inserting items:", err);
                    return res
                      .status(500)
                      .json({ error: "Error inserting items" });
                  }

                  return res.status(204).send();
                });
              });
            } else {
              res.status(204).send();
            }
          }
        );
      }
    );
  });
};

exports.deleteCar = (req, res) => {
  const carId = req.params.id;

  const checkQuery = "SELECT * FROM cars WHERE id = ?";
  db.query(checkQuery, [carId], (err, result) => {
    if (err) {
      console.error("Error checking car:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    const deleteCarQuery = "DELETE FROM cars WHERE id = ?";
    db.query(deleteCarQuery, [carId], (err) => {
      if (err) {
        console.error("Error deleting car:", err);
        return res.status(500).json({ error: "Database error" });
      }

      return res.status(204).send();
    });
  });
};
