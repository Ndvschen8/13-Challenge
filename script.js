// Import required packages and initialize express app
const express = require('express');
const app = express();
const sequelize = require('sequelize');

// Load environment variables
require('dotenv').config();

// Connect to the database
const db = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

// Define database schema using Sequelize
const Category = db.define('category', {
  name: {
    type: sequelize.STRING,
    allowNull: false
  },
  description: {
    type: sequelize.TEXT,
    allowNull: true
  }
});

const Product = db.define('product', {
  name: {
    type: sequelize.STRING,
    allowNull: false
  },
  description: {
    type: sequelize.TEXT,
    allowNull: true
  },
  price: {
    type: sequelize.DECIMAL(10, 2),
    allowNull: false
  }
});

const Tag = db.define('tag', {
  name: {
    type: sequelize.STRING,
    allowNull: false
  }
});

// Define associations between models
Product.belongsTo(Category);
Category.hasMany(Product);
Product.belongsToMany(Tag, { through: 'product_tag' });
Tag.belongsToMany(Product, { through: 'product_tag' });

// Sync models to the database and start the server
db.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Define API routes for categories, products, and tags
app.get('/api/categories', (req, res) => {
  Category.findAll()
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving categories');
    });
});

app.get('/api/products', (req, res) => {
  Product.findAll()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving products');
    });
});

app.get('/api/tags', (req, res) => {
  Tag.findAll()
    .then((tags) => {
      res.json(tags);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving tags');
    });
});

app.post('/api/categories', (req, res) => {
  Category.create(req.body)
    .then((category) => {
      res.json(category);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error creating category');
    });
});

app.post('/api/products', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error creating product');
    });
});

app.post('/api/tags', (req, res) => {
  Tag.create(req.body)
    .then((tag) => {
      res.json(tag);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error creating tag');
    });
});

aapp.put('/api/categories/:id', (req, res) => {
  Category.update(req.body, { where: { id: req.params.id } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error updating category');
    });
});