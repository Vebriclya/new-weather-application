import express from "express";
import axios from "axios";
import {functions} from "date-fns";

const app = express();

// Set static folder
app.use(express.static("public"));
// Parse URL-encoded bodies (as sent by HTML forms) - this is what allows you to get fahrenhiet. This is your middleware
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/* ALL YOUR SERVER STUFF WILL GO HERE */

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});