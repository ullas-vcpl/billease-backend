//configure dotenv
require('dotenv').config();
const connectDB = require('./db/index.js');
const app = require("./app");
const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
