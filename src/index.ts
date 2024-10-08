import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { auth, games, players, users } from "./routes";
import {
    autoSignupOnPostReq,
    checkAuthCookie,
    setHeaders,
} from "./utils/helpers";
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

app.use(autoSignupOnPostReq);
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

app.listen(process.env.PORT);
