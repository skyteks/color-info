import express, { Request, Response } from "express";
import prisma from "../middleware/prisma";
import testAllChecks from "../check";
import Color from "../../../Color";

const router = express.Router();

router.post("/", (request: Request, response: Response) => {
    const { data }: { data: string } = request.body;
    console.log(data);
    const result: Color | null = testAllChecks(data);
    if (result) {
        response.status(200).json({ message: "Found.", color: result });
    }
    response.status(400).json({ message: "Not a valid color." });
});

/*
router.get("/:testName", (request: Request, response: Response) => {
    const { testName } = request.params;

    prisma.test
        .findUnique({ where: { name: testName } })
        .then(test => {
            if (!test) {
                response.status(102).json({ message: "Test not found" });
            } else {
                response.json(test);
            }
        })
        .catch((error:Error) => {
            console.log("Error getting test from DB", error);
            response.status(500).json({ message: "Error getting test from DB" });
        });
});
*/
export default router;
