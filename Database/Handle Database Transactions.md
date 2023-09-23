## Sequelize

Sequelize, an Object-Relational Mapping (ORM) library for Node.js, provides a convenient way to handle database transactions. Database transactions are used to group multiple database operations into a single, atomic unit. This ensures that either all the operations within the transaction are successfully completed, or none of them are, maintaining the integrity of the database.

Here's how you can handle database transactions using Sequelize with a few examples:

**1. Basic Transaction:**

```javascript
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "mysql",
});

// Define a model
const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
});

// Example transaction
(async () => {
  const t = await sequelize.transaction();
  try {
    // Create a new user within the transaction
    await User.create(
      { name: "John", email: "john@example.com" },
      { transaction: t }
    );

    // Update a user within the transaction
    await User.update(
      { name: "Updated John" },
      { where: { name: "John" }, transaction: t }
    );

    // Commit the transaction
    await t.commit();
  } catch (error) {
    // If an error occurs, roll back the transaction
    await t.rollback();
    console.error("Transaction failed:", error);
  }
})();
```

In this example, we define a basic Sequelize model `User`, create a transaction `t`, and perform database operations (create and update) within the transaction. If any operation fails, the transaction is rolled back to maintain consistency.

**2. Nested Transactions:**

Sequelize allows you to nest transactions, which can be useful when you need to perform multiple transactions within a larger one. Here's an example:

```javascript
(async () => {
  const t1 = await sequelize.transaction();
  const t2 = await sequelize.transaction();

  try {
    await User.create({ name: "User1" }, { transaction: t1 });

    // Nested transaction
    await User.create({ name: "User2" }, { transaction: t2 });

    await t1.commit();
    await t2.commit();
  } catch (error) {
    await t1.rollback();
    await t2.rollback();
    console.error("Transaction failed:", error);
  }
})();
```

In this example, we create two nested transactions, `t1` and `t2`. Each transaction operates independently, but the outer transaction (`t1`) will be rolled back if any of its nested transactions (`t2`) fails.

## Mongoose

Mongoose, a popular Object Data Modeling (ODM) library for MongoDB in Node.js, allows you to handle database transactions using a feature called sessions. Sessions in Mongoose provide a way to group multiple database operations into a single transaction. Here's how you can handle database transactions with Mongoose along with a few examples:

**1. Basic Transaction:**

```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Define a Mongoose model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
  })
);

// Example transaction
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Create a new user within the transaction
  await User.create([{ name: "John", email: "john@example.com" }], { session });

  // Update a user within the transaction
  await User.updateOne({ name: "John" }, { name: "Updated John" }, { session });

  // Commit the transaction
  await session.commitTransaction();
} catch (error) {
  // If an error occurs, abort the transaction
  await session.abortTransaction();
  console.error("Transaction failed:", error);
} finally {
  // End the session
  session.endSession();
}
```

In this example, we define a Mongoose model `User`, create a session, and perform database operations (create and update) within the session. If any operation fails, the transaction is aborted to maintain consistency.

**2. Nested Transactions:**

Mongoose also allows nested transactions. Here's an example:

```javascript
const session1 = await mongoose.startSession();
session1.startTransaction();

const session2 = await mongoose.startSession();
session2.startTransaction();

try {
  // Operations within session1
  await User.create([{ name: "User1" }], { session: session1 });

  // Nested transaction within session1
  await session2.withTransaction(async () => {
    await User.create([{ name: "User2" }], { session: session2 });
  });

  await session1.commitTransaction();
  await session2.commitTransaction();
} catch (error) {
  await session1.abortTransaction();
  await session2.abortTransaction();
  console.error("Transaction failed:", error);
} finally {
  session1.endSession();
  session2.endSession();
}
```

In this example, we create two nested sessions, `session1` and `session2`. The outer session (`session1`) will be rolled back if any of its nested sessions (`session2`) fails.
