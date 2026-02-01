import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";

const logger = pino({
    level: isDevelopment ? "debug" : "info",
    base: { hostname: undefined },
    redact: {
        paths: ['email', 'password', 'token', 'secret', 'key', 'url', 'fileKey', 'fileName'],
        censor: '***'
    }
});

const maskEmail = (email: string) => {
    if (!email) return email;
    const [user, domain] = email.split('@');
    if (!domain) return "***";
    return `${user[0]}***@${domain}`;
};

const maskId = (id: string) => {
    if (!id) return id;
    return `${id.substring(0, 4)}***`;
};

export { logger, maskEmail, maskId };
