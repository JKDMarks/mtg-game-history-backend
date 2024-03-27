import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

// import { players, decks, games, auth } from "./routes";
import db from "./models";
// import { checkAuthCookie, disallowRestrictedUsers } from "./utils/helpers";

const app = express();
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(checkAuthCookie);
// app.use(disallowRestrictedUsers);

// app.use("/players", players);
// app.use("/decks", decks);
// app.use("/games", games);
// app.use("/auth", auth);

app.get("/test", async (_, res) => {
    const x = await db
        // @ts-ignore
        .selectFrom("Players")
        // @ts-ignore
        .selectAll("Players")
        .executeTakeFirst();
    console.log("***player1", x);
    return res.status(200).send({ message: "hi! :^)))" });
});

// db.sequelize.sync().then(() => {
app.listen(process.env.PORT);
// app.listen(3001);
// });
