import { FastifyInstance } from "fastify";
import { Prisma } from "../lib/prisma";

export async function getAllPromptsRoute(app: FastifyInstance) {
    app.get("/prompts", async () => {

        const prompts = await Prisma.prompt.findMany()
        return prompts
    })
    
}