import { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import { Prisma } from "../lib/prisma";
import {z} from 'zod'
import { openai } from "../lib/openai";

export async function createTranscriptionRoute(app: FastifyInstance) {
    app.post("/videos/:videoId/transcription", async (req) => {
        const paramsSchema = z.object({
            videoId: z.string().uuid(),
        })
        const { videoId } = paramsSchema.parse(req.params)

        const bodySchema = z.object({
            prompt: z.string(),
        })

        const { prompt } = bodySchema.parse(req.body)

        const video = await Prisma.video.findUniqueOrThrow({
            where: { id: videoId,}
        })

        const videoPath = video.path
        const audioReadStream = createReadStream(videoPath)

        const response = await openai.audio.transcriptions.create({
            file: audioReadStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt,
        })
        
        const transcription = response.text
        await Prisma.video.update({
            where: {
                id: videoId,
            },
            data: {
                transcription: response.text
            }
        })

            return { transcription }
    })

}