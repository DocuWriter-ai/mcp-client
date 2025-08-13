#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { DocuWriterAPIClient } from './api-client.js';
import {
    getUserInfo,
    listSpaces,
    searchSpaceDocuments,
    generateCodeDocumentation,
    generateCodeTests,
    generateCodeOptimization,
    createSpaceDocument,
    getSpaceDocument,
    updateSpaceDocument,
    deleteSpaceDocument,
    generateAndAddDocumentation
} from './tools.js';

class DocuWriterMCPClient {
    constructor() {
        this.server = new McpServer({
            name: '@docuwriter/mcp-client',
            version: '1.0.0'
        }, {
            capabilities: {
                tools: {}
            }
        });

        this.apiClient = null;
        this.setupTools();
    }

    setupTools() {
        // Register get_user_info tool
        this.server.registerTool('get_user_info', {
            title: 'Get User Info',
            description: 'Get current user information from DocuWriter.ai',
            inputSchema: {}
        }, async (args) => {
            await this.ensureApiClient();
            return getUserInfo(this.apiClient, args);
        });

        // Register list_spaces tool
        this.server.registerTool('list_spaces', {
            title: 'List Spaces',
            description: 'List all documentation spaces for the authenticated user',
            inputSchema: {}
        }, async (args) => {
            await this.ensureApiClient();
            return listSpaces(this.apiClient, args);
        });

        // Register search_space_documents tool
        this.server.registerTool('search_space_documents', {
            title: 'Search Space Documents',
            description: 'Search for documents within a specific documentation space',
            inputSchema: {
                space_id: z.string().describe('The ID of the space to search in'),
                query: z.string().min(2).describe('Search query (minimum 2 characters)'),
                page: z.number().int().min(1).default(1).describe('Page number for pagination').optional(),
                per_page: z.number().int().min(1).max(100).default(20).describe('Number of results per page').optional(),
                highlight: z.boolean().default(true).describe('Whether to highlight search terms in results').optional()
            }
        }, async (args) => {
            await this.ensureApiClient();
            return searchSpaceDocuments(this.apiClient, args);
        });

        // Register generate_code_documentation tool (supports both single and multi-file)
        this.server.registerTool('generate_code_documentation', {
            title: 'Generate Code Documentation',
            description: 'Generate comprehensive documentation for source code files',
            inputSchema: {
                files: z.array(z.object({
                    filename: z.string().describe('Name of the file'),
                    source_code: z.string().describe('Source code content of the file')
                })).describe('Array of files to document (can be a single file or multiple files)'),
                output_language: z.string().describe('Output language for documentation').optional(),
                documentation_type: z.string().describe('Type of documentation to generate').optional(),
                additional_instructions: z.string().describe('Additional instructions for documentation generation').optional(),
                name: z.string().describe('Optional custom name for the generated documentation for better searchability').optional()
            }
        }, async (args) => {
            await this.ensureApiClient();
            return generateCodeDocumentation(this.apiClient, args);
        });

        // Register generate_code_tests tool
        this.server.registerTool('generate_code_tests', {
            title: 'Generate Code Tests',
            description: 'Generate comprehensive test suites for source code',
            inputSchema: {
                source_code: z.string().describe('The source code to generate tests for'),
                filename: z.string().describe('Name of the file being tested'),
                test_type: z.string().default('Unit').describe('Type of tests to generate').optional(),
                test_framework: z.string().describe('Testing framework to use').optional(),
                additional_instructions: z.string().describe('Additional instructions for test generation').optional(),
                name: z.string().describe('Optional custom name for the generated tests for better searchability').optional()
            }
        }, async (args) => {
            await this.ensureApiClient();
            return generateCodeTests(this.apiClient, args);
        });

        // Register generate_code_optimization tool
        this.server.registerTool('generate_code_optimization', {
            title: 'Generate Code Optimization',
            description: 'Generate optimized versions of source code',
            inputSchema: {
                source_code: z.string().describe('The source code to optimize'),
                filename: z.string().describe('Name of the file being optimized'),
                optimization_focus: z.string().default('Performance').describe('Focus area for optimization').optional(),
                additional_instructions: z.string().describe('Additional instructions for code optimization').optional(),
                name: z.string().describe('Optional custom name for the optimized code for better searchability').optional()
            }
        }, async (args) => {
            await this.ensureApiClient();
            return generateCodeOptimization(this.apiClient, args);
        });

        // Register create_space_document tool
        this.server.registerTool('create_space_document', {
            title: 'Create Space Document',
            description: 'Create a new document in a DocuWriter.ai space',
            inputSchema: {
                space_id: z.string().describe('The ID of the space to create the document in'),
                title: z.string().describe('The title of the document'),
                content: z.string().describe('The content of the document (markdown or plain text)'),
                type: z.enum(['blank', 'markdown']).default('blank').describe('The type of content being provided').optional(),
                parent_id: z.string().describe('The ID of the parent folder (optional)').optional(),
                path: z.string().describe('Folder path for the document (e.g., "docs/api") - creates folders if they don\'t exist').optional()
            }
        }, async (args) => {
            await this.ensureApiClient();
            return createSpaceDocument(this.apiClient, args);
        });

        // Register get_space_document tool
        this.server.registerTool('get_space_document', {
            title: 'Get Space Document',
            description: 'Get a specific document from a DocuWriter.ai space',
            inputSchema: {
                space_id: z.string().describe('The ID of the space containing the document'),
                document_id: z.string().describe('The ID of the document to retrieve')
            }
        }, async (args) => {
            await this.ensureApiClient();
            return getSpaceDocument(this.apiClient, args);
        });

        // Register update_space_document tool
        this.server.registerTool('update_space_document', {
            title: 'Update Space Document',
            description: 'Update an existing document in a DocuWriter.ai space',
            inputSchema: {
                space_id: z.string().describe('The ID of the space containing the document'),
                document_id: z.string().describe('The ID of the document to update'),
                title: z.string().describe('The new title of the document').optional(),
                content: z.string().describe('The new content of the document (markdown or plain text)').optional(),
                type: z.enum(['blank', 'markdown']).describe('The type of content being provided').optional(),
                parent_id: z.string().nullable().describe('The ID of the parent folder (null to move to root)').optional()
            }
        }, async (args) => {
            await this.ensureApiClient();
            return updateSpaceDocument(this.apiClient, args);
        });

        // Register delete_space_document tool
        this.server.registerTool('delete_space_document', {
            title: 'Delete Space Document',
            description: 'Delete an existing document from a DocuWriter.ai space',
            inputSchema: {
                space_id: z.string().describe('The ID of the space containing the document'),
                document_id: z.string().describe('The ID of the document to delete')
            }
        }, async (args) => {
            await this.ensureApiClient();
            return deleteSpaceDocument(this.apiClient, args);
        });

        // Register generate_and_add_documentation tool
        this.server.registerTool('generate_and_add_documentation', {
            title: 'Generate and Add Documentation',
            description: 'Generate documentation using DocuWriter.ai AI and automatically add it to a space with progress updates',
            inputSchema: {
                space_id: z.string().describe('The ID of the space to add the documentation to'),
                source_code: z.string().describe('The source code to document'),
                filename: z.string().describe('Name of the file being documented'),
                title: z.string().describe('Title for the document in the space'),
                output_language: z.string().describe('Output language for documentation').optional(),
                documentation_type: z.string().describe('Type of documentation to generate').optional(),
                additional_instructions: z.string().describe('Additional instructions for documentation generation').optional(),
                name: z.string().describe('Optional custom name for the generated documentation for better searchability').optional(),
                parent_id: z.string().describe('The ID of the parent folder (optional)').optional(),
                path: z.string().describe('Folder path for the document (e.g., "docs/api") - creates folders if they don\'t exist').optional()
            }
        }, async (args) => {
            await this.ensureApiClient();
            return generateAndAddDocumentation(this.apiClient, args);
        });
    }

    async ensureApiClient() {
        if (!this.apiClient) {
            const token = process.env.DOCUWRITER_API_TOKEN;
            if (!token) {
                throw new Error('DOCUWRITER_API_TOKEN environment variable is required');
            }
            this.apiClient = new DocuWriterAPIClient(token);
        }
    }

    async run() {
        // Start MCP server
        try {
            const transport = new StdioServerTransport();
            await this.server.connect(transport);
            console.error('DocuWriter.ai MCP client started successfully');
        } catch (error) {
            console.error('Failed to start DocuWriter.ai MCP client:', error.message);
            process.exit(1);
        }
    }
}

// Start the client
const client = new DocuWriterMCPClient();
client.run();