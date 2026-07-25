import { UAParser } from "ua-parser-js";

export const getDeviceInfo = (req) => {

    const parser = new UAParser(req.headers["user-agent"]);

    const result = parser.getResult();

    return {

        browser: `${result.browser.name || "Unknown"} ${result.browser.version || ""}`,

        os: `${result.os.name || "Unknown"} ${result.os.version || ""}`,

        device:
            result.device.model ||
            result.device.type ||
            "Desktop",

        userAgent: req.headers["user-agent"] || "",

        ipAddress:
            req.ip ||
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            "",

    };
};