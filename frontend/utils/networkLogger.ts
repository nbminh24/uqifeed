let globalStartTime = Date.now();

function formatTimestamp() {
    const timestamp = Date.now() - globalStartTime;
    const seconds = Math.floor(timestamp / 1000);
    const milliseconds = timestamp % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
}

export function setupNetworkLogging() {
    const originalFetch = window.fetch; window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input :
            input instanceof URL ? input.toString() :
                input instanceof Request ? input.url :
                    String(input);
        const method = init?.method || 'GET';
        const startTime = Date.now();

        console.log(`[${formatTimestamp()}] 🌐 Request:`, {
            url,
            method,
            headers: init?.headers,
            bodyLength: init?.body ? JSON.stringify(init.body).length : 0,
        });

        try {
            const response = await originalFetch(input, init);

            const endTime = Date.now();
            const duration = endTime - startTime;

            try {
                // Clone the response to read its body
                const clonedResponse = response.clone();
                const responseBody = await clonedResponse.json();
                console.log(`[${formatTimestamp()}] ✅ Response (${duration}ms):`, {
                    url,
                    status: response.status,
                    ok: response.ok,
                    body: responseBody,
                });
            } catch (e) {
                console.log(`[${formatTimestamp()}] ✅ Response (${duration}ms):`, {
                    url,
                    status: response.status,
                    ok: response.ok,
                    error: 'Could not parse response body'
                });
            }

            return response;
        } catch (error) {
            const endTime = Date.now();
            const duration = endTime - startTime;

            console.error(`[${formatTimestamp()}] ❌ Error (${duration}ms):`, {
                url,
                error: error instanceof Error ? error.message : String(error)
            });

            throw error;
        }
    };
}
