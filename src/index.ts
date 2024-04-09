import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { readFileSync } from "fs";
import https from "https";
import "dotenv/config";

import { auth, games, players, users } from "./routes";
import { checkAuthCookie, setHeaders } from "./utils/helpers";
import decks from "./routes/decks";

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL.split(","),
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(checkAuthCookie);
app.use(setHeaders);
// app.use(disallowRestrictedUsers);

app.use("/players", players);
app.use("/decks", decks);
app.use("/games", games);
app.use("/auth", auth);
app.use("/users", users);

app.get("/me", async (req, res) => {
    return res.send(req.currentUser);
});

app.get("/test", async (_, res) => {
    return res.status(200).send({ message: "hi! :^)" });
});

try {
    if (process.env.USE_HTTPS !== "true") {
        throw new Error("Not using HTTPS");
    }
    const options = {
        key: readFileSync(process.env.HOME + "/certs/key.pem"),
        cert: readFileSync(process.env.HOME + "/certs/cert.pem"),
    };
    https.createServer(options, app).listen(process.env.PORT);
    console.log("Server running securely");
} catch (e) {
    app.listen(process.env.PORT);
    console.log("Server running insecurely");
}
