# DocuWriter.ai MCP Client

A Model Context Protocol (MCP) client that enables AI assistants like Cursor, Claude, and ChatGPT to interact with DocuWriter.ai for documentation generation and space management.

## Features

- **User Management**: Get user information and authentication status
- **Space Management**: List and search documentation spaces
- **Document Search**: Search within specific documentation spaces using Typesense
- **Code Generation**: Generate documentation, tests, and optimizations for source code
- **Multi-File Documentation**: Generate comprehensive documentation for multiple source files with token validation
- **Complete CRUD Operations**: Create, read, update, and delete documents in spaces
- **Modern AI Integration**: Uses OpenAI Responses API for enhanced generation capabilities

## Installation

### From npm (coming soon)
```bash
npm install -g @docuwriter/mcp-client
```

### From source
```bash
git clone https://github.com/docuwriter/mcp-client.git
cd mcp-client
npm install
npm link
```

## Configuration

### Environment Variables

- `DOCUWRITER_API_TOKEN` (required): Your DocuWriter.ai API token
- `DOCUWRITER_API_URL` (optional): API base URL 
  - **Production**: `https://app.docuwriter.ai/api` (default)
  - **Local development**: `https://docs-ai.test/api`
- `NODE_TLS_REJECT_UNAUTHORIZED` (optional): Set to "0" for local development SSL issues

### Cursor Configuration

#### Production (default)
```json
{
  "mcpServers": {
    "docuwriter": {
      "command": "npx",
      "args": ["-y", "@docuwriter/mcp-client"],
      "env": {
        "DOCUWRITER_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

#### Local Development
```json
{
  "mcpServers": {
    "docuwriter-local": {
      "command": "npx",
      "args": ["-y", "@docuwriter/mcp-client"],
      "env": {
        "DOCUWRITER_API_TOKEN": "your_local_token_here",
        "DOCUWRITER_API_URL": "https://docs-ai.test/api",
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

### Claude Desktop Configuration

#### Production (default)
```json
{
  "mcpServers": {
    "docuwriter": {
      "command": "npx",
      "args": ["-y", "@docuwriter/mcp-client"],
      "env": {
        "DOCUWRITER_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

#### Local Development
```json
{
  "mcpServers": {
    "docuwriter-local": {
      "command": "npx",
      "args": ["-y", "@docuwriter/mcp-client"],
      "env": {
        "DOCUWRITER_API_TOKEN": "your_local_token_here",
        "DOCUWRITER_API_URL": "https://docs-ai.test/api",
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

## Available Tools

### User & Space Management

#### `get_user_info`
Get current user information from DocuWriter.ai.

**Parameters**: None

**Example**:
```
Use get_user_info to check my account status
```

#### `list_spaces`
List all documentation spaces for the authenticated user.

**Parameters**: None

**Example**:
```
Show me all my documentation spaces
```

#### `search_space_documents`
Search for documents within a specific documentation space.

**Parameters**:
- `space_id` (integer, required): ID of the space to search in
- `query` (string, required): Search query (minimum 2 characters)
- `page` (integer, optional): Page number for pagination (default: 1)
- `per_page` (integer, optional): Number of results per page (default: 20, max: 100)
- `highlight` (boolean, optional): Whether to highlight search terms (default: true)

**Example**:
```
Search for "authentication" in space 123
```

### Code Generation Tools

#### `generate_code_documentation` ⭐ **Multi-File Support**
Generate comprehensive documentation for source code files.

**Parameters**:
- `files` (array, required): Array of file objects, each containing:
  - `filename` (string, required): Name of the file
  - `source_code` (string, required): Source code content

- `output_language` (string, optional): Language for documentation (default: "English")
- `documentation_type` (string, optional): Type of documentation to generate
- `additional_instructions` (string, optional): Additional instructions
- `name` (string, optional): Name for the generated documentation

**Features**:
- **Multi-File Support**: Process multiple files in a single request
- **Token Validation**: Automatic validation to ensure code fits within model limits
- **Modern AI**: Uses OpenAI Responses API for enhanced generation
- **Smart Context**: Analyzes relationships between files for comprehensive documentation

**Example (Single File)**:
```
Generate documentation for this React component:
files: [{"filename": "UserProfile.jsx", "source_code": "[paste your code here]"}]
name: User Profile Component Documentation
```

**Example (Multiple Files)**:
```
Generate documentation for this API:
files: [
  {"filename": "UserController.php", "source_code": "[controller code]"},
  {"filename": "UserModel.php", "source_code": "[model code]"},
  {"filename": "UserService.php", "source_code": "[service code]"}
]
documentation_type: API Documentation
```

#### `generate_code_tests`
Generate comprehensive test suites for source code.

**Parameters**:
- `source_code` (string, required): The source code to generate tests for
- `filename` (string, required): Name of the file to test
- `test_type` (string, optional): "Unit", "Integration", "Feature", or "All" (default: "Unit")
- `test_framework` (string, optional): Testing framework to use
- `additional_instructions` (string, optional): Additional instructions
- `name` (string, optional): Name for the generated tests

**Example**:
```
Generate unit tests for this function:
source_code: "[paste your code here]"
filename: calculator.js
test_framework: Jest
name: Calculator Function Tests
```

#### `generate_code_optimization`
Generate optimized versions of source code.

**Parameters**:
- `source_code` (string, required): The source code to optimize
- `filename` (string, required): Name of the file to optimize
- `optimization_focus` (string, optional): "Performance", "Readability", "Security", "Memory", or "All" (default: "Performance")
- `additional_instructions` (string, optional): Additional optimization instructions
- `name` (string, optional): Name for the optimized code

**Example**:
```
Optimize this code for performance:
source_code: "[paste your code here]"
filename: data-processor.py
optimization_focus: Performance
name: Optimized Data Processor
```

### Space Document Management (CRUD Operations)

#### `create_space_document`
Create a new document in a DocuWriter.ai space.

**Parameters**:
- `space_id` (string, required): The ID of the space to create the document in
- `title` (string, required): The title of the document
- `content` (string, required): The content of the document (markdown or plain text)
- `type` (string, optional): Content type - "blank" (default) or "markdown"
- `parent_id` (string, optional): The ID of the parent folder
- `path` (string, optional): Folder path for the document (e.g., "docs/api") - creates folders if they don't exist

**Example**:
```
Create a new document in space 123 with title "API Guide" and content "# API Guide\n\nThis is a comprehensive guide..."
```

#### `get_space_document`
Retrieve a specific document from a space.

**Parameters**:
- `space_id` (string, required): The ID of the space containing the document
- `document_id` (string, required): The ID of the document to retrieve

**Response**: Returns both markdown content and raw Editor.js format

#### `update_space_document`
Update an existing document in a space.

**Parameters**:
- `space_id` (string, required): The ID of the space containing the document
- `document_id` (string, required): The ID of the document to update
- `title` (string, required): The new title of the document
- `content` (string, required): The new content of the document
- `type` (string, optional): Content type - "blank" or "markdown"
- `parent_id` (string, optional): The ID of the parent folder (null to move to root)

#### `delete_space_document`
Delete a document from a space.

**Parameters**:
- `space_id` (string, required): The ID of the space containing the document
- `document_id` (string, required): The ID of the document to delete

**Response**: Returns confirmation with deleted document details

### Advanced Workflow Tools

#### `generate_and_add_documentation` ⭐ **Recommended Workflow**
Generate documentation using DocuWriter.ai AI and automatically add it to a space with progress updates.

**Parameters**:
- `space_id` (string, required): The ID of the space to add the documentation to
- `source_code` (string, required): The source code to document
- `filename` (string, required): Name of the file being documented
- `title` (string, required): Title for the document in the space

- `output_language` (string, optional): Output language for documentation
- `documentation_type` (string, optional): Type of documentation to generate
- `additional_instructions` (string, optional): Additional instructions for documentation generation
- `name` (string, optional): Optional custom name for the generated documentation for better searchability
- `parent_id` (string, optional): The ID of the parent folder
- `path` (string, optional): Folder path for the document

**Progress Updates**: This tool provides real-time status updates:
- 🚀 Starting documentation generation
- ✅ Documentation generated successfully
- 📝 Adding generated documentation to space
- 🎉 Documentation successfully generated and added to space!

**Example**:
```
Generate documentation for my API code and add it to my project space with progress updates
```

## Getting Your API Token

1. Log into your DocuWriter.ai account
2. Go to your profile/settings
3. Navigate to API tokens section
4. Create a new token or copy an existing one
5. Use this token as your `DOCUWRITER_API_TOKEN`

## Troubleshooting

### Authentication Issues
- Verify your `DOCUWRITER_API_TOKEN` is correct
- Check that your token has the necessary permissions
- Ensure you're not hitting rate limits

### SSL Certificate Issues (Local Development)
- **Problem**: "unable to verify the first certificate" errors with local development URLs
- **Solution**: The MCP client automatically handles self-signed certificates for local development
- **Supported URLs**: `docs-ai.test`, `localhost`, `127.0.0.1`
- **Note**: Production URLs (`app.docuwriter.ai`) use proper SSL certificates

### Multi-File Documentation Issues
- **Token Limit**: If you get "code is too large" errors, reduce the number of files or code size
- **File Format**: Ensure each file object has both `filename` and `source_code` properties
- **Array Format**: Always use the `files` array format, even for single files

### Search Issues
- Make sure the space ID exists and you have access to it
- Search queries must be at least 2 characters long
- Check that the space contains searchable content

### Connection Issues
- Verify your internet connection
- Check if DocuWriter.ai is accessible
- Try with a different AI assistant to isolate the issue

## Development

### Running Locally
```bash
# Set your API token
export DOCUWRITER_API_TOKEN="your_token_here"

# Run the MCP client
npm start
```

### Testing with MCP Inspector
```bash
npx @modelcontextprotocol/inspector src/index.js
```

## Technical Details

### OpenAI Responses API Integration
The MCP client uses the modern OpenAI Responses API (`/v1/responses`) for enhanced generation capabilities:
- **Better Reasoning**: Supports advanced reasoning models like o4-mini
- **Improved Context**: Better handling of complex multi-file scenarios
- **Enhanced Quality**: Superior documentation generation with better understanding of code relationships

### Token Validation
Multi-file documentation generation includes automatic token validation:
- **Accurate Counting**: Uses tiktoken library for precise token calculation
- **Model Limits**: Respects different token limits for different models
- **Safety Buffer**: Includes 20% buffer for response tokens
- **User-Friendly Errors**: Clear messages without exposing technical details

### Content Conversion
The MCP client handles seamless content conversion between formats:
- **Markdown ↔ Editor.js**: Automatic conversion for space documents
- **Consistent Storage**: Proper Editor.js format storage in database
- **Compatible Display**: Works seamlessly with DocuWriter.ai interface

## Support

- **Documentation**: [DocuWriter.ai Docs](https://www.docuwriter.ai/docs)
- **Issues**: [GitHub Issues](https://github.com/docuwriter/mcp-client/issues)
- **Support**: [DocuWriter.ai Support](https://www.docuwriter.ai/support)

## License

MIT License - see [LICENSE](LICENSE) file for details.
