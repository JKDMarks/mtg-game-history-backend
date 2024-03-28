declare namespace Express {
    import { User } from "../../models/users";

    export interface Request {
        currentUser?: User;
    }
}
