import { imageKitClient } from "../clients/imagekit";
import { env } from "../env";
import { GetImageUploadParamsOutputSchemaType } from "./model";

export default class FileService {
    public getFileUploadParams(): GetImageUploadParamsOutputSchemaType {
        const { token, expire, signature } = imageKitClient.helper.getAuthenticationParameters();

        const publicKey = env.IMAGEKIT_PUBLIC_KEY

        return {
            token,
            expire,
            signature,
            publicKey
        };
    }
}
