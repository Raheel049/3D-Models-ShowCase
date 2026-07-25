import sessionModel from "../models/auth/session.js";
import { getDeviceInfo } from "./deviceInfo.js";

export const createSession = async (user, refreshToken, req) => {

    const deviceInfo = getDeviceInfo(req);

    await sessionModel.create({
        user: user._id,

        refreshToken,

        browser: deviceInfo.browser,

        os: deviceInfo.os,

        device: deviceInfo.device,

        ipAddress: deviceInfo.ipAddress,

        userAgent: deviceInfo.userAgent,

        lastActive: new Date(),

        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

};