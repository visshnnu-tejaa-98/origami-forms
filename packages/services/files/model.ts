import { z } from "zod"

export const getImageUploadParamsInputSchema = z.void()

export type GetImageUploadParamsInputSchemaType = z.infer<typeof getImageUploadParamsInputSchema>

export const getImageUploadParamsOutputSchema = z.object({
    token: z.string().describe("token for image upload"),
    expire: z.number().int().nonnegative().describe("expiry time of the token in seconds"),
    signature: z.string().describe("signature for image upload"),
    publicKey: z.string().describe("public key for image upload"),
})

export type GetImageUploadParamsOutputSchemaType = z.infer<typeof getImageUploadParamsOutputSchema>
