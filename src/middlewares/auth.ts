import { Request, Response, NextFunction } from "express";
import { isAuth } from "../lib/jwt";

export default async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<any> {
    try {
        const token = req.cookies.token
        let isAuthenticated;
        
        if (!token || token === "") {
            const Response = res.status(403).json({ error: "Unauthenticated" })
            return Response;
        }
        isAuthenticated = await isAuth(token);

        if (!isAuthenticated) {
            const Response = res.status(403).json({ error: "Unauthenticated" })
            return Response;
        }

        next();
    } catch (e) {
        console.log(`Error in isAuth ${e}`);
        return res.status(500).json({error:"Internal server error",e})
    }
}