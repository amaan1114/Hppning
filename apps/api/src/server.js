import app from "./app.js";
import {config} from "./utils/config.js";

app.listen(config.PORT, () => {
  console.log("Server is up at port: ", config.PORT);
});