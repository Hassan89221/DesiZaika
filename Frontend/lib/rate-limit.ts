interface RateLimitStore {
    [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

// Default: 5 requests per 60 seconds per key (IP / identifier)
export function checkRateLimit(key: string, limit = 5, windowMs = 60000): { success: boolean; remaining: number } {
    const now = Date.now()
    const record = store[key]

    if (!record || now > record.resetTime) {
        store[key] = {
            count: 1,
            resetTime: now + windowMs,
        }
        return { success: true, remaining: limit - 1 }
    }

    if (record.count >= limit) {
        return { success: false, remaining: 0 }
    }

    record.count += 1
    return { success: true, remaining: limit - record.count }
}
