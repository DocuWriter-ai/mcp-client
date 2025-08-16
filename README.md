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

## 🚀 **One-Command Setup** (Recommended)

Install the MCP client AND AI assistant rules in one command from your project folder:

```bash
# Navigate to your project directory first
cd /path/to/your/project

# Install for Cursor
npx @docuwriter-ai/mcp-client install cursor

# Install for Claude Desktop  
npx @docuwriter-ai/mcp-client install claude

# Install for VS Code
npx @docuwriter-ai/mcp-client install vscode

# Install for all environments
npx @docuwriter-ai/mcp-client install all

# Interactive installation (prompts you to choose)
npx @docuwriter-ai/mcp-client install
```

> [!IMPORTANT]
> Run these commands from your project's root directory where you want the AI rules to be installed.

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

### 🤖 **What This Installs**

**Environment-Specific AI Rules:**
- **Cursor**: Installs to `.cursor/rules/docuwriter-mcp.md` with `alwaysApply: true`
- **Claude Desktop**: Installs to `.claude/rules/docuwriter-mcp.md`  
- **VS Code**: Installs to `.vscode/ai-rules/docuwriter-mcp.md`

**Smart AI Guidance:**
- When and how to use DocuWriter.ai MCP tools effectively
- Best practices for code documentation workflows
- Smart tool selection for different scenarios
- Error handling and optimization strategies
- Complete workflow examples

**Benefits:**
- 🎯 **Smarter tool usage** - AI knows which tool to use for specific tasks
- 🔄 **Complete workflows** - AI can handle end-to-end documentation processes
- 🛡️ **Error prevention** - Built-in best practices prevent common issues
- 📈 **Better results** - Optimized prompts and strategies for higher quality output
- ⚡ **Always applies** - Rules are automatically applied to all conversations

### Quick Install

**Add DocuWriter.ai MCP server to Cursor:**

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=DocuWriter.ai&config=eyJjb21tYW5kIjoibnB4IC15IEBkb2N1d3JpdGVyLWFpL21jcC1jbGllbnQiLCJlbnYiOnsiRE9DVVdSSVRFUl9BUElfVE9LRU4iOiJ5b3VyX3Rva2VuX2hlcmUifX0%3D)


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
      "args": ["-y", "@docuwriter-ai/mcp-client", "start"],
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
      "args": ["-y", "@docuwriter-ai/mcp-client", "start"],
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

> **⚠️ Processing time notice**: All generation tools use advanced AI models and typically take time to complete, depending on code complexity and file size. Please be patient during processing.

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
Generate documentation using DocuWriter.ai AI and automatically add it to a space.

**Parameters**:
- `space_id` (string, required): The ID of the space to add the documentation to
- `files` (array, required): Array of file objects, each containing:
  - `filename` (string, required): Name of the file
  - `source_code` (string, required): Source code content of the file
- `title` (string, required): Title for the document in the space
- `output_language` (string, optional): Output language for documentation
- `documentation_type` (string, optional): Type of documentation to generate
- `additional_instructions` (string, optional): Additional instructions for documentation generation
- `name` (string, optional): Optional custom name for the generated documentation for better searchability
- `parent_id` (string, optional): The ID of the parent folder
- `path` (string, optional): Folder path for the document

**Workflow**: This tool handles the complete process from generation to space addition automatically.

**Example (Single File)**:
```
Generate documentation for my API code and add it to my project space:
files: [{"filename": "UserController.php", "source_code": "[paste your code here]"}]
title: User Controller Documentation
```

**Example (Multiple Files)**:
```
Generate documentation for my API and add it to my project space:
files: [
  {"filename": "UserController.php", "source_code": "[controller code]"},
  {"filename": "UserModel.php", "source_code": "[model code]"},
  {"filename": "UserService.php", "source_code": "[service code]"}
]
title: User API Documentation
```

## Processing Times & Best Practices

### Generation Tool Performance

All DocuWriter.ai generation tools use advanced AI models to analyze and process your code. Here's what to expect:

| Tool | Typical Processing Time | Factors Affecting Speed |
|------|------------------------|------------------------|
| **Code Documentation** | 30 sec - 2 min | File size, code complexity, number of files |
| **Test Generation** | 30 sec - 2 min | Code complexity, test coverage requirements |
| **Code Optimization** | 30 sec - 2 min | Code size, optimization focus (performance/readability) |
| **Language Conversion** | 30 sec - 2 min | Source language, target language, code complexity |

### Best Practices for Faster Processing

1. **Optimize File Size**: Keep individual files under 500KB for best performance
2. **Use Multi-File Support**: For related files, use the multi-file documentation tool instead of separate requests
3. **Provide Clear Instructions**: Specific additional instructions help the AI work more efficiently
4. **Batch Similar Requests**: Group related generation tasks together

### What Happens During Processing

- **Code Analysis**: AI analyzes your code structure, dependencies, and patterns
- **Context Understanding**: Builds comprehensive understanding of your codebase
- **Generation**: Creates high-quality, contextual output based on analysis
- **Quality Assurance**: Ensures output meets your specified requirements

### Handling Long Processing Times

- **Don't Interrupt**: Let the process complete to avoid partial results
- **Check File Size**: Large files (>1MB) may take longer to process
- **Monitor Progress**: The MCP client will show progress updates during generation
- **Contact Support**: If processing consistently takes >3 minutes, contact support

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
