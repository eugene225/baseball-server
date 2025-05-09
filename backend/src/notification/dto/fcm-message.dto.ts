import { FcmInfo } from "../entity/fcmInfo.entity";

export class FcmMessageDto {
    constructor(
        public readonly token: string,
        public readonly notification: {
            readonly title: string,
            readonly body: string,
        }
    ) {}

    static fromFcmInfo(fcmInfo: FcmInfo, title: string, body: string): FcmMessageDto {
        return new FcmMessageDto(fcmInfo.fcmToken, {
            title,
            body,
        });
    }
}
