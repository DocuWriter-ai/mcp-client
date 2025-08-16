---
alwaysApply: true
---

# DocuWriter.ai MCP Integration Guidelines

These guidelines help Claude Desktop effectively use DocuWriter.ai's MCP tools for documentation generation, code analysis, and workflow automation.

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
- "Report feedback" or express suggestions for DocuWriter.ai improvements

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
- `report_feedback` - Collect user feedback for DocuWriter.ai improvements

## Best Practices for Claude Desktop

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

### 4. Feedback Collection Guidelines
**Proactively collect user feedback:**
```javascript
// Use when users express suggestions or issues
{
  feedback: "The MCP integration is great but I'd love to see support for more IDEs"
  // Minimum 10 characters required
  // Tool validates length and provides confirmation
}
```

### 5. Claude Desktop Configuration
To use DocuWriter.ai MCP tools in Claude Desktop, add this to your configuration:

```json
{
  "mcpServers": {
    "docuwriter": {
      "command": "npx",
      "args": ["--yes", "@docuwriter-ai/mcp-client@latest", "start"],
      "env": {
        "DOCUWRITER_API_TOKEN": "your_token_here"
      }
    }
  }
}
```



## Error Handling for Claude Desktop

### Common Issues and Solutions

1. **Token Limits**
   - Error: "The provided code is too large for processing"
   - Solution: Break files into smaller chunks or focus on specific modules

2. **Authentication**
   - Error: "Unauthorized" or "Invalid token"
   - Solution: Check `DOCUWRITER_API_TOKEN` environment variable in Claude Desktop settings

3. **Space Access**
   - Error: "Space not found" or "Access denied"
   - Solution: Use `list_spaces()` to verify available spaces and permissions

## Workflow Examples for Claude Desktop

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

### Feedback Collection Workflow
```javascript
// When users express suggestions or encounter issues
if (userMentionsSuggestion || userReportsIssue) {
  const feedback = await report_feedback({
    feedback: userFeedbackText // Ensure minimum 10 characters
  })
  
  // Confirm successful submission
  console.log("Thank you! Your feedback has been submitted to help improve DocuWriter.ai")
}
```

## Claude Desktop Specific Tips

### Performance Optimization
- **Batch Operations**: Group related files together for processing
- **Use appropriate granularity**: Balance between too many small calls and oversized requests
- **Consider processing time**: Inform users about expected processing duration

### User Experience
- **Clear status updates**: Provide progress information during long operations
- **Helpful error messages**: Translate technical errors into user-friendly language
- **Smart suggestions**: Offer relevant follow-up actions based on generated content

### Integration Best Practices
- **Environment setup**: Guide users through proper API token configuration
- **Space organization**: Help users structure their documentation logically
- **Workflow automation**: Chain multiple tools together for comprehensive results

Remember: DocuWriter.ai MCP tools are designed to enhance developer productivity in Claude Desktop while maintaining high-quality output. Always prioritize user needs and code quality over speed of generation.
