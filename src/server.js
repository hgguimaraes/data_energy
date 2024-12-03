const express = require('express');
const { setupRoutes } = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

setupRoutes(app);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});