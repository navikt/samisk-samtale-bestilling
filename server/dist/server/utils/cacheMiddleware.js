"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCacheMiddleware = void 0;
const lru_cache_1 = __importDefault(require("lru-cache"));
const createCacheMiddleware = ({ cacheOnErrors = false, ttlSec, maxSize, }) => {
    if (process.env.NODE_ENV === 'development') {
        return (req, res, next) => {
            next();
        };
    }
    const cache = new lru_cache_1.default({
        ttl: ttlSec * 1000,
        max: maxSize,
    });
    return (req, res, next) => {
        const { originalUrl } = req;
        const cachedRes = cache.get(originalUrl);
        if (cachedRes) {
            const { sentData, statusCode } = cachedRes;
            return res.status(statusCode).send(sentData);
        }
        const originalSend = res.send;
        res.send = (sentData) => {
            const { statusCode } = res;
            if (statusCode < 400 || cacheOnErrors) {
                cache.set(originalUrl, {
                    sentData,
                    statusCode,
                });
            }
            return originalSend.bind(res)(sentData);
        };
        next();
    };
};
exports.createCacheMiddleware = createCacheMiddleware;
