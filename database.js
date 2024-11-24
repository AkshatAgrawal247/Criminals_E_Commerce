const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_PATH,
});

// User Model
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "customer",
  },
});

// Product Model
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null if no image
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    // Create initial admin user if it doesn't exist
    User.findOne({ where: { username: "admin" } }).then((user) => {
      if (!user) {
        require("./auth")
          .hashPassword(process.env.ADMIN_PASSWORD)
          .then((hashedPassword) => {
            User.create({
              username: "admin",
              password: hashedPassword,
              role: "admin",
            });
          });
      }
    });
  })
  .catch((err) => console.error("Error syncing database:", err));
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
});




const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, 
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  
  

// Define associations
User.hasMany(Order);
Order.belongsTo(User);
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

module.exports = { sequelize, User, Product, Order, OrderItem };
