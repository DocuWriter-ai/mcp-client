import fetch from 'node-fetch';
import https from 'https';

// Create a custom HTTPS agent for local development
const createLocalHttpsAgent = () => {
    return new https.Agent({
        rejectUnauthorized: false
    });
};

// Set NODE_TLS_REJECT_UNAUTHORIZED for local development
const isLocalDevelopment = () => {
    const baseURL = process.env.DOCUWRITER_API_URL || 'https://app.docuwriter.ai/api';
    return baseURL.includes('docs-ai.test') || baseURL.includes('localhost') || baseURL.includes('127.0.0.1');
};

/**
 * API client for DocuWriter.ai
 */
export class DocuWriterAPIClient {
    constructor(token) {
        if (!token) {
            throw new Error('DOCUWRITER_API_TOKEN is required');
        }

        // Support both local development and production
        this.baseURL = process.env.DOCUWRITER_API_URL || 'https://app.docuwriter.ai/api';
        this.token = token;
        this.timeout = 30000; // 30 seconds

        // Handle SSL certificates for local development
        if (isLocalDevelopment()) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        }
    }

    /**
     * Make HTTP request to DocuWriter API
     */
    async request(method, endpoint, data = null) {
        const url = `${this.baseURL}${endpoint}`;

        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': '@docuwriter/mcp-client/1.0.0'
            },
            timeout: this.timeout
        };

        // Note: SSL certificate handling is done via NODE_TLS_REJECT_UNAUTHORIZED in constructor

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                const errorData = await response.text();
                let errorMessage;

                try {
                    const jsonError = JSON.parse(errorData);
                    errorMessage = jsonError.message || jsonError.error || `HTTP ${response.status}`;
                } catch {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }

                const error = new Error(errorMessage);
                error.status = response.status;
                error.response = response;
                throw error;
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    /**
     * Get current user information
     */
    async getUserInfo() {
        return this.request('POST', '/user');
    }

    /**
     * List user's spaces
     */
    async listSpaces() {
        return this.request('GET', '/spaces');
    }

    /**
     * Search space documents
     */
    async searchSpaceDocuments(spaceId, query, options = {}) {
        const {
            page = 1,
            per_page = 20,
            highlight = true
        } = options;

        return this.request('POST', `/spaces/${spaceId}/search`, {
            query,
            page,
            per_page,
            highlight
        });
    }

    /**
     * Create a new document in a space
     */
    async createSpaceDocument(spaceId, options = {}) {
        const {
            title,
            content,
            type = 'blank',
            parent_id,
            path
        } = options;

        const payload = {
            title,
            content,
            type
        };

        // Add optional fields if provided
        if (parent_id) {
            payload.parent_id = parent_id;
        }
        if (path) {
            payload.path = path;
        }

        return this.request('POST', `/spaces/${spaceId}/documents`, payload);
    }

    /**
     * Update an existing document in a space
     */
    async updateSpaceDocument(spaceId, documentId, options = {}) {
        const {
            title,
            content,
            type,
            parent_id
        } = options;

        const payload = {};

        // Add fields if provided (partial update)
        if (title !== undefined) {
            payload.title = title;
        }
        if (content !== undefined) {
            payload.content = content;
        }
        if (type !== undefined) {
            payload.type = type;
        }
        if (parent_id !== undefined) {
            payload.parent_id = parent_id;
        }

        return this.request('PUT', `/spaces/${spaceId}/documents/${documentId}`, payload);
    }

    /**
     * Get a specific document from a space
     */
    async getSpaceDocument(spaceId, documentId) {
        return this.request('GET', `/spaces/${spaceId}/documents/${documentId}`);
    }

    /**
     * Delete an existing document from a space
     */
    async deleteSpaceDocument(spaceId, documentId) {
        return this.request('DELETE', `/spaces/${spaceId}/documents/${documentId}`);
    }

    /**
     * Generate code documentation
     */
    async generateCodeDocumentation(sourceCode, filename, options = {}) {
        const {
            output_language = 'English',
            documentation_type = 'General Documentation',
            additional_instructions = '',
            name = ''
        } = options;

        const payload = {
            source_code: sourceCode,
            filename,
            output_language,
            documentation_type,
            additional_instructions
        };

        // Add name if provided
        if (name) {
            payload.name = name;
        }

        return this.request('POST', '/generate-code-documentation', payload);
    }

    /**
     * Generate code tests
     */
    async generateCodeTests(sourceCode, filename, options = {}) {
        const {
            test_type = 'Unit',
            test_framework = 'PHPUnit',
            additional_instructions = '',
            name = ''
        } = options;

        const payload = {
            source_code: sourceCode,
            filename,
            test_type,
            test_framework,
            additional_instructions
        };

        // Add name if provided
        if (name) {
            payload.name = name;
        }

        return this.request('POST', '/generate-code-tests', payload);
    }

    /**
     * Generate code optimization
     */
    async generateCodeOptimization(sourceCode, filename, options = {}) {
        const {
            optimization_focus = 'Performance',
            additional_instructions = '',
            name = ''
        } = options;

        const payload = {
            source_code: sourceCode,
            filename,
            optimization_focus,
            additional_instructions
        };

        // Add name if provided
        if (name) {
            payload.name = name;
        }

        return this.request('POST', '/generate-code-optimization', payload);
    }
}
