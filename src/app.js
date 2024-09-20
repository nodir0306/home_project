import path from "path";
import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import { create } from "express-handlebars";
import { appConfig } from "./config/app.config.js";
import { DB } from "./mongo/mongo.js";
import router from "./routes/index.routes.js";
import Handlebars from "handlebars";
import cookieParser from "cookie-parser";
import {ErrorHandlerMiddleware} from "./middleware/error.handler.middleware.js"
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import pageRoutes from "./module/pages/all-pages.routes.js";
const app = express();



// Set up view engine
app.set("views", path.join(process.cwd(), "src", "views"));


// use cookie
app.use(cookieParser());
// Setup express-handlebars
const hbs = create({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});


app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Serve static files
app.use("/public", express.static(path.join(process.cwd(), "src", "public")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
// app.use(PageMiddleWare)
// Database connection
DB()
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.log(`Database error: ${error}`));

// Routes
app.use("/api/v1",router);
app.use("/",pageRoutes)



app.all("*", (req, res) => {
    res.status(404).send({
        message: `Sorry, the ${req.url} endpoint you requested does not exist!`,
    });
});

app.use(ErrorHandlerMiddleware)


// Start server
app.listen(appConfig.port, () => {
    console.log(`Server is running on http://${appConfig.host}:${appConfig.port}`);
});
