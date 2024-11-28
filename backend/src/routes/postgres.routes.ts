import express, { Request, Response } from "express";

import prisma from "../middleware/prisma";

const router = express.Router();

router.post("/tests", (request: Request, response: Response) => {
    const { name, description, createdAt, updatedAt, } = request.body;

    const newTest = {
        name, description, createdAt, updatedAt,
    };

    prisma.test
        .create({ data: newTest })
        .then(test => {
            console.log("New test created", test);
            response.status(201).json(test);
        })
        .catch(error => {
            console.log("Error creating new test", error);
            response.status(500).json({ message: "Error creating new test" });
        });
});

router.get("/tests", (_request: Request, response: Response) => {
    prisma.test
        .findMany()
        .then(allTests => {
            response.json(allTests);
        })
        .catch(err => {
            console.log("Error getting tests from DB", err);
            response.status(500).json({ message: "Error getting tests from DB" });
        });
});

router.get("/tests/:testName", (request: Request, response: Response) => {
    const { testName } = request.params;

    prisma.test
        .findUnique({ where: { name: testName } })
        .then(test => {
            if (!test) {
                response.status(404).json({ message: "Test not found" });
            } else {
                response.json(test);
            }
        })
        .catch(error => {
            console.log("Error getting test from DB", error);
            response.status(500).json({ message: "Error getting test from DB" });
        });
});

router.put("/tests/:testId", (request: Request, response: Response) => {
    const { testId } = request.params;

    const { name, description, createdAt, updatedAt, } = request.body;

    const newTestDetails = {
        name, description, createdAt, updatedAt,
    };

    prisma.test
        .update({ where: { id: testId }, data: newTestDetails })
        .then(updatedTest => {
            response.json(updatedTest);
        })
        .catch(error => {
            console.log("Error updating a test", error);
            response.status(500).json({ message: "Error updating a test" });
        });
});

router.delete("/tests/:testId", (request: Request, response: Response) => {
    const { testId } = request.params;

    prisma.test
        .delete({ where: { id: testId } })
        .then(() => {
            response.status(204).json({ message: `Test with id ${testId} was deleted successfully` });
        })
        .catch(error => {
            console.log("Error deleting a test", error);
            response.status(500).json({ message: "Error deleting a test" });
        });
});

export default router;
