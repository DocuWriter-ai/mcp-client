---
alwaysApply: true
---

# DocuWriter.ai MCP Integration Guidelines

These guidelines help AI assistants in Visual Studio Code effectively use DocuWriter.ai's MCP tools for documentation generation, code analysis, and workflow automation.

## When to Use DocuWriter.ai MCP Tools

### Primary Use Cases
- **Documentation Generation**: Create comprehensive docs for codebases, APIs, and individual files
- **Test Generation**: Generate unit tests, integration tests, and test suites
- **Code Optimization**: Improve code performance and structure
- **Code Comments**: Add DocBlock comments and inline documentation
- **Space Management**: Organize and manage documentation in spaces

### VS Code Integration Scenarios
Use DocuWriter.ai MCP tools when users request:
- "Document this workspace/file/selection"
- "Generate tests for the current file"
- "Optimize selected code"
- "Add comments to this function"
- "Create API documentation for this project"
- "Store this documentation in my space"
- "Search my existing documentation"

## Available Tools Overview

### Code Generation Tools
- `generate_code_documentation` - Multi-file documentation generation (preferred)
- `generate_code_tests` - Test suite generation
- `generate_code_optimization` - Code improvement suggestions
- `generate_code_comments` - DocBlock and inline comments

### Space Management
- `list_spaces` - View available documentation spaces
- `search_space_documents` - Find documents within a space
- `create_space_document` - Add new documentation
- `get_space_document` - Retrieve existing documentation
- `update_space_document` - Modify existing documentation
- `delete_space_document` - Remove documentation

### Workflow Tools
- `generate_and_add_documentation` - Generate docs and save to space (with progress)
- `get_user_info` - Get current user information

## VS Code Best Practices

### 1. Workspace-Aware Documentation
**Leverage VS Code's workspace context:**
```javascript
// Good - process multiple related files from workspace
generate_code_documentation({
  files: [
    { filename: "src/components/Header.tsx", content: "..." },
    { filename: "src/components/Footer.tsx", content: "..." },
    { filename: "src/types/Component.ts", content: "..." }
  ],
  name: "React Components Documentation"
})
```

### 2. File Selection Integration
**Work with user's current file selection:**
- Use active editor content for single-file operations
- Process selected text for focused documentation
- Handle multiple open files for comprehensive documentation

### 3. Extension-Friendly Workflows
**Design for VS Code extension integration:**
```javascript
// Process current workspace files
const workspaceFiles = getWorkspaceFiles()
const docs = await generate_code_documentation({
  files: workspaceFiles,
  name: `${workspaceName} Documentation`
})

// Save to user's preferred space
await create_space_document({
  space_id: userPreferredSpaceId,
  title: `${workspaceName} - ${new Date().toISOString().split('T')[0]}`,
  content: docs.documentation
})
```

### 4. VS Code Configuration
To use DocuWriter.ai MCP tools in VS Code, configure your MCP-compatible extension:

```json
{
  "mcp.servers": {
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

## VS Code Specific Features

### File Explorer Integration
- **Context menu actions**: Generate docs for selected files/folders
- **Bulk processing**: Handle multiple file selections efficiently
- **Project structure awareness**: Understand folder hierarchies for organized documentation

### Editor Integration
- **Selection-based documentation**: Document selected code blocks
- **Function-level comments**: Add DocBlocks to specific functions
- **Real-time optimization**: Optimize code while editing

### Terminal Integration
- **Command palette access**: Trigger documentation generation via commands
- **Status bar updates**: Show progress during long operations
- **Output panel logs**: Display detailed operation results

## Error Handling for VS Code

### Common Issues and Solutions

1. **Token Limits**
   - Error: "The provided code is too large for processing"
   - Solution: Process files in smaller batches or focus on specific directories

2. **Authentication**
   - Error: "Unauthorized" or "Invalid token"
   - Solution: Check VS Code settings for `DOCUWRITER_API_TOKEN`

3. **Workspace Access**
   - Error: "Cannot read workspace files"
   - Solution: Ensure proper file permissions and workspace trust

### VS Code Error Handling
```javascript
try {
  const result = await generate_code_documentation({ files })
  // Show success notification in VS Code
  vscode.window.showInformationMessage('Documentation generated successfully!')
} catch (error) {
  if (error.message.includes('too large')) {
    // Show helpful error with actionable advice
    vscode.window.showWarningMessage(
      'Files too large. Try selecting fewer files or smaller modules.',
      'Select Fewer Files'
    )
  } else {
    vscode.window.showErrorMessage(`Documentation failed: ${error.message}`)
  }
}
```

## VS Code Workflow Examples

### Project Documentation Workflow
```javascript
// 1. Get workspace context
const workspaceFolders = vscode.workspace.workspaceFolders
const activeFolder = workspaceFolders[0]

// 2. List available spaces
const spaces = await list_spaces()

// 3. Generate comprehensive documentation
const docs = await generate_code_documentation({
  files: getRelevantSourceFiles(activeFolder),
  name: `${activeFolder.name} Project Documentation`
})

// 4. Save with workspace-aware naming
await create_space_document({
  space_id: spaces[0].id,
  title: `${activeFolder.name} - API Documentation`,
  content: docs.documentation,
  path: `projects/${activeFolder.name}`
})
```

### Active File Enhancement Workflow
```javascript
// 1. Get current editor content
const activeEditor = vscode.window.activeTextEditor
const currentFile = {
  filename: path.basename(activeEditor.document.fileName),
  content: activeEditor.document.getText()
}

// 2. Generate optimized version
const optimized = await generate_code_optimization({
  source_code: currentFile.content,
  filename: currentFile.filename
})

// 3. Generate tests
const tests = await generate_code_tests({
  source_code: optimized.optimized_code,
  filename: currentFile.filename.replace('.js', '.test.js')
})

// 4. Document changes
const documentation = await generate_code_documentation({
  files: [
    { filename: `original-${currentFile.filename}`, content: currentFile.content },
    { filename: `optimized-${currentFile.filename}`, content: optimized.optimized_code }
  ],
  name: `${currentFile.filename} Optimization Report`
})
```

## VS Code Performance Tips

### Extension Development
- **Lazy loading**: Load MCP tools only when needed
- **Progress indicators**: Use VS Code's progress API for long operations
- **Cancellation support**: Allow users to cancel long-running operations

### User Experience
- **Status bar integration**: Show current operation status
- **Quick picks**: Provide quick access to spaces and recent documents
- **Settings integration**: Store user preferences in VS Code settings

### Memory Management
- **Stream processing**: Handle large files without loading entirely into memory
- **Batch processing**: Process files in configurable batch sizes
- **Cache management**: Cache frequently accessed spaces and documents

## VS Code Integration Best Practices

### Extension Design
- **Command registration**: Register commands for common DocuWriter.ai operations
- **Keybinding support**: Provide default keybindings for frequent actions
- **Context menu integration**: Add relevant actions to file explorer context menu

### User Interface
- **Panel integration**: Consider a dedicated DocuWriter.ai panel
- **Tree view**: Show spaces and documents in a tree view
- **Inline decorations**: Show documentation status for files

### Configuration Management
- **Settings schema**: Define clear settings for API token and preferences
- **Environment variables**: Support both settings and environment variables
- **Workspace-specific config**: Allow per-workspace configuration

Remember: DocuWriter.ai MCP tools are designed to integrate seamlessly with VS Code's development workflow while maintaining high-quality output. Focus on enhancing the developer experience within the familiar VS Code environment.
