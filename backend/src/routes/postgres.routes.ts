import express, { Request, Response } from "express";
import testAllChecks, { searchColorName } from "../check";
import Color from "../../../Color";

const router = express.Router();

router.post("/check", (request: Request, response: Response) => {
    const { content }: { content: string } = request.body;
    console.log("check data:", content);
    const result: Color | null = testAllChecks(content);
    console.log("check result:", result);
    if (result) {
        response.status(200).json({ message: "Found.", content: result });
    }
    response.status(400).json({ message: "Not a valid color." });
});

router.post("/name", (request: Request, response: Response) => {
    const { content }: { content: Color } = request.body;
    console.log("name data:", content);
    const result: string | null = searchColorName(content);
    console.log("name result:", result);
    if (result) {
        response.status(200).json({ message: "Found.", content: { name: result } });
    }
    response.status(400).json({ message: "Not a valid color." });
});
export default router;
