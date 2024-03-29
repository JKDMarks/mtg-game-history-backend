import { Router } from "express";

const usersRouter = Router();

usersRouter.get("/me", async (req, res) => {
    res.send(req.currentUser);
});

export default usersRouter;
