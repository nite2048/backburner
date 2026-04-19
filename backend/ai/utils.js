function sleep(ms) {
     return new Promise(resolve => setTimeout(resolve, ms))
}

function isRetriableError(error) {
     if (error.name === "AbortError") return true
     
     if (error.message && (
          error.message.includes("timeout") ||
          error.message.includes("fetch failed") ||
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("ENOTFOUND") ||
          error.message.includes("ETIMEDOUT") ||
          error.message.includes("ECONNRESET")
     )) {
          return true
     }
     
     if (error.code && (
          error.code === "UND_ERR_CONNECT_TIMEOUT" ||
          error.code === "ECONNREFUSED" ||
          error.code === "ENOTFOUND" ||
          error.code === "ETIMEDOUT" ||
          error.code === "ECONNRESET"
     )) {
          return true
     }
     
     if (error.statusCode >= 500 && error.statusCode < 600) {
          return true
     }
     
     if (error.statusCode === 429) {
          return true
     }
     
     return false
}

function enhanceError(error, attempts) {
     const enhancedError = new Error(error.message)
     enhancedError.name = error.name
     enhancedError.stack = error.stack
     enhancedError.attempts = attempts + 1
     enhancedError.code = error.code
     enhancedError.statusCode = error.statusCode
     enhancedError.originalError = error
     
     return enhancedError
}

export async function withRetry(asyncFn, options = {}) {
     const config = {
          timeout: options.timeout || 60000,
          retries: options.retries || 3,
          backoff: options.backoff || [1000, 2000, 4000],
          onRetry: options.onRetry || (() => {})
     }
     
     let lastError
     
     for (let attempt = 0; attempt <= config.retries; attempt++) {
          const controller = new AbortController()
          let timeoutId
          
          try {
               const timeoutPromise = new Promise((_, reject) => {
                    timeoutId = setTimeout(() => {
                         controller.abort()
                         reject(new Error("Request timeout"))
                    }, config.timeout)
               })
               
               const executionPromise = (async () => {
                    try {
                         const result = await asyncFn(controller.signal)
                         return result
                    } catch (err) {
                         if (controller.signal.aborted) {
                              const timeoutError = new Error("Request timeout")
                              timeoutError.name = "AbortError"
                              throw timeoutError
                         }
                         throw err
                    }
               })()
               
               const result = await Promise.race([executionPromise, timeoutPromise])
               
               clearTimeout(timeoutId)
               return result
               
          } catch (error) {
               if (timeoutId) clearTimeout(timeoutId)
               
               lastError = error
               
               const shouldRetry = attempt < config.retries && isRetriableError(error)
               
               if (shouldRetry) {
                    const delay = config.backoff[attempt] || config.backoff[config.backoff.length - 1]
                    console.error(`[Retry ${attempt + 1}/${config.retries}] ${error.message} - Retrying in ${delay}ms`)
                    await sleep(delay)
                    config.onRetry(error, attempt + 1)
                    continue
               }
               
               throw enhanceError(error, attempt)
          }
     }
     
     throw enhanceError(lastError, config.retries)
}

export const withAIRetry = (fn) => withRetry(fn, { timeout: 60000, retries: 3 })

export const withAPIRetry = (fn) => withRetry(fn, { timeout: 30000, retries: 3 })