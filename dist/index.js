"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const routes_1 = require("./routes");
const helpers_1 = require("./utils/helpers");
const decks_1 = __importDefault(require("./routes/decks"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.FRONTEND_URL.split(","),
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(helpers_1.autoSignupOnPostReq);
app.use(helpers_1.checkAuthCookie);
app.use(helpers_1.setHeaders);
// app.use(disallowRestrictedUsers);
app.use("/players", routes_1.players);
app.use("/decks", decks_1.default);
app.use("/games", routes_1.games);
app.use("/auth", routes_1.auth);
app.use("/users", routes_1.users);
app.get("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(req.currentUser);
}));
app.get("/test", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).send({ message: "hi! :^)" });
}));
app.listen(process.env.PORT);
