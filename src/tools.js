/**
 * MCP Tool implementations for DocuWriter.ai
 */

/**
 * Get current user information
 */
export async function getUserInfo(apiClient, args) {
    try {
        const userInfo = await apiClient.getUserInfo();

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    data: userInfo.data || userInfo
                }, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown',
                    hint: 'Check that your DOCUWRITER_API_TOKEN is valid and has not expired'
                }, null, 2)
            }]
        };
    }
}

/**
 * List user's spaces
 */
export async function listSpaces(apiClient, args) {
    try {
        const spaces = await apiClient.listSpaces();

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    data: spaces.data || spaces,
                    count: spaces.data ? spaces.data.length : (Array.isArray(spaces) ? spaces.length : 0)
                }, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown',
                    hint: 'Ensure you have access to at least one documentation space'
                }, null, 2)
            }]
        };
    }
}

/**
 * Search space documents
 */
export async function searchSpaceDocuments(apiClient, args) {
    try {
        const { space_id, query, page = 1, per_page = 20, highlight = true } = args;

        // Validate required arguments
        if (!space_id) {
            throw new Error('space_id is required');
        }

        if (!query || typeof query !== 'string') {
            throw new Error('query is required and must be a string');
        }

        if (query.trim().length < 2) {
            throw new Error('query must be at least 2 characters long');
        }

        const results = await apiClient.searchSpaceDocuments(space_id, query.trim(), {
            page,
            per_page,
            highlight
        });

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    data: results.data || results,
                    query: query.trim(),
                    space_id: space_id
                }, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown'
                }, null, 2)
            }]
        };
    }
}


/**
 * Generate code tests
 */

/**
 * Generate code optimization
 */

/**
 * Update an existing document in a space
 */
export async function updateSpaceDocument(apiClient, args) {
    try {
        const { space_id, document_id, title, content, type, parent_id } = args;

        // Validate required arguments
        if (!space_id) {
            throw new Error('space_id is required');
        }

        if (!document_id) {
            throw new Error('document_id is required');
        }

        // Validate optional arguments
        if (title !== undefined && (typeof title !== 'string' || title.length > 255)) {
            throw new Error('title must be a string with 255 characters or less');
        }

        if (content !== undefined && typeof content !== 'string') {
            throw new Error('content must be a string');
        }

        if (type !== undefined && !['blank', 'markdown'].includes(type)) {
            throw new Error('type must be either "blank" or "markdown"');
        }

        const result = await apiClient.updateSpaceDocument(space_id, document_id, {
            title,
            content,
            type,
            parent_id
        });

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    data: result.data,
                    message: result.message || 'Document updated successfully',
                    document_details: {
                        document_id: document_id,
                        space_id: space_id,
                        title: title || undefined,
                        type: type || undefined,
                        parent_id: parent_id !== undefined ? parent_id : undefined
                    }
                }, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown',
                    hint: 'Ensure the document exists, you have write permissions, and all provided fields are valid'
                }, null, 2)
            }]
        };
    }
}

/**
 * Get a specific document from a space
 */
export async function getSpaceDocument(apiClient, args) {
    try {
        const { space_id, document_id } = args;

        // Validate required arguments
        if (!space_id) {
            throw new Error('space_id is required');
        }

        if (!document_id) {
            throw new Error('document_id is required');
        }

        const result = await apiClient.getSpaceDocument(space_id, document_id);

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    data: result.data,
                    message: result.message || 'Document retrieved successfully'
                }, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown',
                    hint: 'Ensure the document exists, you have read permissions, and the document belongs to the specified space'
                }, null, 2)
            }]
        };
    }
}

/**
 * Delete an existing document from a space
 */
export async function deleteSpaceDocument(apiClient, args) {
    try {
        const { space_id, document_id } = args;

        // Validate required arguments
        if (!space_id) {
            throw new Error('space_id is required');
        }

        if (!document_id) {
            throw new Error('document_id is required');
        }

        const result = await apiClient.deleteSpaceDocument(space_id, document_id);

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    data: result.data,
                    message: result.message || 'Document deleted successfully',
                    deletion_details: {
                        document_id: document_id,
                        space_id: space_id,
                        deleted_document_name: result.data?.deleted_document_name,
                        deleted_at: new Date().toISOString()
                    }
                }, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown',
                    hint: 'Ensure the document exists, you have delete permissions, and the document belongs to the specified space'
                }, null, 2)
            }]
        };
    }
}

/**
 * Create a new document in a space
 */
export async function createSpaceDocument(apiClient, args) {
    try {
        const { space_id, title, content, type = 'blank', parent_id, path } = args;

        // Validate required arguments
        if (!space_id) {
            throw new Error('space_id is required');
        }

        if (!title || typeof title !== 'string') {
            throw new Error('title is required and must be a string');
        }

        if (!content || typeof content !== 'string') {
            throw new Error('content is required and must be a string');
        }

        // Validate optional arguments
        if (title.length > 255) {
            throw new Error('title must be 255 characters or less');
        }

        if (type && !['blank', 'markdown'].includes(type)) {
            throw new Error('type must be either "blank" or "markdown"');
        }

        const result = await apiClient.createSpaceDocument(space_id, {
            title: title.trim(),
            content,
            type,
            parent_id,
            path
        });

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    data: result.data,
                    message: result.message || 'Document created successfully',
                    document_details: {
                        title: title.trim(),
                        type: type,
                        space_id: space_id,
                        parent_id: parent_id || null,
                        path: path || null
                    }
                }, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown',
                    hint: 'Ensure the space exists, you have write permissions, and all required fields are provided'
                }, null, 2)
            }]
        };
    }
}

/**
 * Generate documentation and add it to a space (complete workflow)
 */
export async function generateAndAddDocumentation(apiClient, args) {
    try {
        const {
            space_id,
            source_code,
            filename,
            title,
            output_language,
            documentation_type,
            additional_instructions,
            name,
            parent_id,
            path
        } = args;

        // Validate required arguments
        if (!space_id) {
            throw new Error('space_id is required');
        }

        if (!source_code || typeof source_code !== 'string') {
            throw new Error('source_code is required and must be a string');
        }

        if (!filename || typeof filename !== 'string') {
            throw new Error('filename is required and must be a string');
        }

        if (!title || typeof title !== 'string') {
            throw new Error('title is required and must be a string');
        }

        // Generate documentation
        const generationResult = await apiClient.generateCodeDocumentation(source_code, filename, {
            output_language,
            documentation_type,
            additional_instructions,
            name: name || title
        });

        // Add to space
        const spaceResult = await apiClient.createSpaceDocument(space_id, {
            title: title.trim(),
            content: generationResult.data?.content || generationResult.data?.markdown || 'Documentation generation completed successfully.',
            type: 'markdown',
            parent_id,
            path
        });

        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: true,
                    data: {
                        generation: generationResult.data,
                        space_document: spaceResult.data,
                        document_details: {
                            title: title.trim(),
                            space_id: space_id,
                            parent_id: parent_id || null,
                            path: path || null
                        }
                    }
                }, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown',
                    hint: 'Check that the space exists, you have write permissions, and the source code is valid'
                }, null, 2)
            }]
        };
    }
}

/**
 * Generate code documentation (multi-file support)
 */
export async function generateCodeDocumentation(apiClient, args) {
    const { files, output_language, documentation_type, additional_instructions, name } = args;

    // Validate files array is provided
    if (!files || !Array.isArray(files) || files.length === 0) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: 'No files provided',
                    hint: 'Provide a files array with at least one file containing filename and source_code properties'
                }, null, 2)
            }]
        };
    }

    // Validate all files have required properties
    for (const file of files) {
        if (!file.filename || !file.source_code) {
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: 'Invalid file format',
                        hint: 'Ensure all files have both filename and source_code properties'
                    }, null, 2)
                }]
            };
        }
    }

    try {
        const result = await apiClient.request('POST', '/generate-multi-file-documentation', {
            files,
            output_documentation_type: documentation_type,
            language: output_language,
            additional_instructions,
            name
        });

        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown',
                    hint: 'Ensure all files have both filename and source_code properties'
                }, null, 2)
            }]
        };
    }
}

/**
 * Generate code tests
 */
export async function generateCodeTests(apiClient, args) {
    try {
        const { source_code, filename, test_type = 'unit tests', test_framework = 'auto-detect', additional_instructions, name } = args;

        // Validate required arguments
        if (!source_code || typeof source_code !== 'string') {
            throw new Error('source_code is required and must be a string');
        }

        if (!filename || typeof filename !== 'string') {
            throw new Error('filename is required and must be a string');
        }

        const result = await apiClient.generateCodeTests(source_code, filename, {
            test_type,
            test_framework,
            additional_instructions,
            name
        });

        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown'
                }, null, 2)
            }]
        };
    }
}

/**
 * Generate code optimization
 */
export async function generateCodeOptimization(apiClient, args) {
    try {
        const { source_code, filename, optimization_focus = 'Performance', additional_instructions, name } = args;

        // Validate required arguments
        if (!source_code || typeof source_code !== 'string') {
            throw new Error('source_code is required and must be a string');
        }

        if (!filename || typeof filename !== 'string') {
            throw new Error('filename is required and must be a string');
        }

        const result = await apiClient.generateCodeOptimization(source_code, filename, {
            optimization_focus,
            additional_instructions,
            name
        });

        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown'
                }, null, 2)
            }]
        };
    }
}

/**
 * Generate code comments
 */
export async function generateCodeComments(apiClient, args) {
    try {
        const { source_code, filename, name } = args;

        // Validate required arguments
        if (!source_code || typeof source_code !== 'string') {
            throw new Error('source_code is required and must be a string');
        }

        if (!filename || typeof filename !== 'string') {
            throw new Error('filename is required and must be a string');
        }

        const result = await apiClient.generateCodeComments(source_code, filename, {
            name
        });

        return {
            content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
            }]
        };
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: error.message,
                    status: error.status || 'unknown'
                }, null, 2)
            }]
        };
    }
}
