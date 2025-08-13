# DocuWriter.ai MCP Client

![DocuWriter.ai Logo](https://www.docuwriter.ai/assets/logo-horizontal.png)

A Model Context Protocol (MCP) client that enables AI assistants like Cursor, Claude, and ChatGPT to interact with DocuWriter.ai for documentation generation and space management.

## Features

- **User Management**: Get user information and authentication status
- **Space Management**: List and search documentation spaces
- **Document Search**: Search within specific documentation spaces
- **Code Generation**: Generate documentation, tests, and optimizations for source code
- **Multi-File Documentation**: Generate comprehensive documentation for multiple source files with token validation
- **Complete CRUD Operations**: Create, read, update, and delete documents in spaces

## Installation

### From npm
```bash
npm install -g @docuwriter-ai/mcp-client
```

### From source
```bash
git clone https://github.com/DocuWriter-ai/mcp-client.git
cd mcp-client
npm install
npm link
```

### Quick Install

**Add DocuWriter.ai MCP server to Cursor with one click:**

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.png)](cursor://anysphere.cursor-deeplink/mcp/install?name=docuwriter&config=eyJjb21tYW5kIjoibnB4IC15IEBkb2N1d3JpdGVyLWFpL21jcC1jbGllbnQiLCJlbnYiOnsiRE9DVVdSSVRFUl9BUElfVE9LRU4iOiJ7SU5TRVJUX1lPVVJfRE9DVVdSSVRFUl9BUElfVE9LRU5fSEVSRX0ifX0=)


### Getting Your API Token

1. Log into your [DocuWriter.ai account](https://www.docuwriter.ai)
2. Go to your profile/settings
3. Navigate to API tokens section
4. Create a new token or copy an existing one
5. When installing the MCP server, Cursor will automatically prompt you to enter your API token in the Environment Variables section

## Configuration

### Environment Variables

- `DOCUWRITER_API_TOKEN` (required): Your DocuWriter.ai API token

### Cursor Configuration

```json
{
  "mcpServers": {
    "docuwriter": {
      "command": "npx",
      "args": ["-y", "@docuwriter-ai/mcp-client"],
      "env": {
        "DOCUWRITER_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "docuwriter": {
      "command": "npx",
      "args": ["-y", "@docuwriter-ai/mcp-client"],
      "env": {
        "DOCUWRITER_API_TOKEN": "your_token_here"
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

**Workflow**: This tool handles the complete process from generation to space addition automatically.

**Example**:
```
Generate documentation for my API code and add it to my project space
```



## Troubleshooting

### Authentication Issues
- Verify your `DOCUWRITER_API_TOKEN` is correct
- Check that your token has the necessary permissions
- Ensure you're not hitting rate limits


### Testing with MCP Inspector
```bash
npx @modelcontextprotocol/inspector src/index.js
```

## Support

- **Documentation**: [DocuWriter.ai Docs](https://www.docuwriter.ai/docs)
- **Issues**: [GitHub Issues](https://github.com/DocuWriter-ai/mcp-client/issues)
- **Support**: [DocuWriter.ai Support](https://www.docuwriter.ai/support)

## License

MIT License - see [LICENSE](LICENSE) file for details.
