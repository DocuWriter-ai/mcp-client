---
alwaysApply: true
---

# DocuWriter.ai MCP Integration Guidelines

These guidelines help AI assistants effectively use DocuWriter.ai's MCP tools for documentation generation, code analysis, and workflow automation in Cursor.

## When to Use DocuWriter.ai MCP Tools

### Primary Use Cases
- **Documentation Generation**: Create comprehensive docs for codebases, APIs, and individual files
- **Test Generation**: Generate unit tests, integration tests, and test suites
- **Code Optimization**: Improve code performance and structure
- **Code Comments**: Add DocBlock comments and inline documentation
- **Space Management**: Organize and manage documentation in spaces

### Triggering Scenarios
Use DocuWriter.ai MCP tools when users request:
- "Document this code/file/project"
- "Generate tests for..."
- "Optimize this code"
- "Add comments to..."
- "Create API documentation"
- "Store this in my docs space"
- "Search my documentation"

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

## Best Practices

### 1. Multi-File Documentation (Preferred Approach)
**Always use `generate_code_documentation` for multiple files:**
```javascript
// Good - handles multiple files efficiently
generate_code_documentation({
  files: [
    { filename: "src/user.js", content: "..." },
    { filename: "src/auth.js", content: "..." }
  ],
  name: "User Authentication System" // Optional but recommended
})

// Avoid - multiple single-file calls
generate_code_documentation({ source_code: "...", filename: "user.js" })
generate_code_documentation({ source_code: "...", filename: "auth.js" })
```

### 2. Smart Tool Selection
- **Small changes**: Use single-purpose tools (`generate_code_comments`)
- **Complete workflows**: Use `generate_and_add_documentation` for end-to-end documentation
- **Large codebases**: Break into logical chunks (max ~50 files per call)

### 3. Space Integration
**Always check spaces first:**
```javascript
// 1. List available spaces
const spaces = await list_spaces()

// 2. Search existing docs to avoid duplicates
const existing = await search_space_documents({
  space_id: spaceId,
  query: "authentication"
})

// 3. Create or update accordingly
if (existing.length > 0) {
  await update_space_document(...)
} else {
  await create_space_document(...)
}
```

### 4. Naming Conventions
- **Include descriptive names**: Use the `name` parameter for better organization
- **Use clear filenames**: Help users find generated content easily
- **Context-aware titles**: Include project/module context in documentation titles

## Tool-Specific Guidelines

### Documentation Generation
```javascript
// Best practices for generate_code_documentation
{
  files: [
    { filename: "path/to/file.js", content: "..." }
  ],
  name: "Feature Name - Module Overview", // Helps with discovery
  // Tool automatically handles:
  // - Token counting and validation
  // - Multi-language support
  // - Markdown formatting
}
```

### Test Generation
```javascript
// Best practices for generate_code_tests
{
  source_code: "...",
  filename: "user-service.js",
  name: "User Service Test Suite" // Optional but recommended
  // Consider the testing framework in use
  // Tool generates framework-appropriate tests
}
```

### Space Document Management
```javascript
// Always use numeric space_id (not slug)
{
  space_id: 123, // ✓ Correct
  // space_id: "my-space" // ✗ Wrong - spaces require numeric IDs
}
```

## Error Handling

### Common Issues and Solutions

1. **Token Limits**
   - Error: "The provided code is too large for processing"
   - Solution: Break files into smaller chunks or focus on specific modules

2. **Authentication**
   - Error: "Unauthorized" or "Invalid token"
   - Solution: Check `DOCUWRITER_API_TOKEN` environment variable

3. **Space Access**
   - Error: "Space not found" or "Access denied"
   - Solution: Use `list_spaces()` to verify available spaces and permissions

### Graceful Degradation
```javascript
try {
  const result = await generate_code_documentation({ files })
  // Process successful result
} catch (error) {
  if (error.message.includes('too large')) {
    // Split into smaller chunks
    const chunks = splitIntoChunks(files)
    // Process chunks individually
  } else {
    // Handle other errors appropriately
    console.error('Documentation generation failed:', error.message)
  }
}
```

## Workflow Examples

### Complete Documentation Workflow
```javascript
// 1. Get user context
const userInfo = await get_user_info()

// 2. List available spaces
const spaces = await list_spaces()

// 3. Generate documentation
const docs = await generate_code_documentation({
  files: projectFiles,
  name: "Project Overview Documentation"
})

// 4. Save to appropriate space
await create_space_document({
  space_id: spaces[0].id,
  title: "Project Documentation",
  content: docs.documentation
})
```

### Code Improvement Workflow
```javascript
// 1. Generate optimized version
const optimized = await generate_code_optimization({
  source_code: originalCode,
  filename: "performance-critical.js"
})

// 2. Generate tests for optimized code
const tests = await generate_code_tests({
  source_code: optimized.optimized_code,
  filename: "performance-critical.test.js"
})

// 3. Document the improvements
const documentation = await generate_code_documentation({
  files: [
    { filename: "original.js", content: originalCode },
    { filename: "optimized.js", content: optimized.optimized_code }
  ],
  name: "Performance Optimization Analysis"
})
```

## Performance Tips

### Batch Operations
- **Group related files**: Process logically related files together
- **Use appropriate granularity**: Balance between too many small calls and oversized requests
- **Consider user experience**: For large operations, inform users about processing time

### Caching Strategy
- **Search before creating**: Always check existing documentation to avoid duplicates
- **Update vs. recreate**: Update existing docs when appropriate rather than creating new ones

## Integration Reminders

### Environment Setup
Users need:
```bash
# Required
export DOCUWRITER_API_TOKEN="your_api_token"

# Optional - defaults to production
export DOCUWRITER_API_URL="https://app.docuwriter.ai/api"
```

### Cursor Configuration
```json
{
  "mcpServers": {
    "docuwriter": {
      "command": "node",
      "args": ["path/to/docuwriter-mcp-client/src/index.js"],
      "env": {
        "DOCUWRITER_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Success Patterns

### Documentation-First Development
1. **Start with spaces**: Help users organize documentation logically
2. **Generate comprehensive docs**: Use multi-file generation for complete coverage
3. **Iterate and improve**: Update documentation as code evolves
4. **Test integration**: Generate tests alongside documentation

### Quality Assurance
- **Review generated content**: Always encourage user review of generated documentation
- **Suggest improvements**: Offer to refine or expand generated content
- **Maintain consistency**: Use consistent naming and organization patterns

Remember: DocuWriter.ai MCP tools are designed to enhance developer productivity while maintaining high-quality output. Always prioritize user needs and code quality over speed of generation.
