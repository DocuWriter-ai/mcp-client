# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-19

### Added
- **🚀 AI Rules**: Environment-specific AI assistant rules with `alwaysApply: true`
  - Cursor-specific rules (`.cursor/rules/docuwriter-mcp.mdc`)
  - Claude Desktop rules (`CLAUDE.md`)
  - VS Code MCP configuration only (no AI rules support)
- **⚡ One-Command npx Installation**: Simple installation via `npx @docuwriter-ai/mcp-client install [env]`
  - Interactive installation prompts
  - Support for individual environments or all at once
  - Automatic project root detection
  - **Automatic MCP Configuration**: Writes MCP server configs to environment-specific files
- **🎯 Smart CLI Interface**: Unified CLI for both MCP server and rule installation
  - `npx @docuwriter-ai/mcp-client install [cursor|claude|vscode|all]`
  - `npx @docuwriter-ai/mcp-client start` for MCP server
  - Built-in help and usage information

### Changed
- **📦 Package Structure**: Updated to use CLI as main entry point
- **🔧 Installation Process**: Simplified from manual script execution to single npx command
- **📚 Documentation**: Comprehensive guidelines for AI assistants on tool usage
- **🎨 User Experience**: Professional installation flow matching Laravel Boost standards

### Features
- **AI Assistant Intelligence**: Rules teach AI when and how to use DocuWriter.ai tools effectively
- **Best Practices Integration**: Built-in guidance for multi-file documentation, space management, and error handling
- **Workflow Automation**: Complete end-to-end documentation generation workflows
- **Environment Optimization**: Tailored rules for Cursor, Claude Desktop, and VS Code

### Technical Improvements
- **Project Detection**: Smart detection of project root for rule placement
- **Error Handling**: Graceful error handling with user-friendly messages
- **Configuration Management**: Automatic directory creation and file management
- **Cross-Platform Support**: Works on Windows, macOS, and Linux

## [1.0.3] - 2024-08-13

### Added
- **Code Comments Generation**: New `generate_code_comments` tool for generating DocBlock comments
- **Enhanced Parameter Support**: All generation tools now support optional parameters (output_language, documentation_type, test_framework, test_type, etc.)
- **Better Default Values**: Updated parameter defaults to match backend API expectations
- **API Migration**: All tools now use the unified API endpoints

### Changed
- Updated `generate_code_tests` tool to use improved parameter defaults
- Enhanced error handling and validation across all tools
- Improved documentation and examples

## [1.0.2] - 2024-08-13

## [1.0.0] - 2024-08-13

### Added
- Initial release of DocuWriter.ai MCP client
- User management tools (get_user_info, list_spaces)
- Space document search functionality
- Code generation tools (documentation, tests, optimization)
- Multi-file documentation support with token validation
- Complete CRUD operations for space documents
- Advanced workflow tools with progress updates
- OpenAI Responses API integration
- Local development SSL certificate handling
- Comprehensive error handling and user-friendly messages

### Features
- Support for Cursor and Claude Desktop integration
- Automatic content conversion between Markdown and Editor.js
- Token validation for multi-file documentation
- Configurable environment variables for different deployment scenarios
- Comprehensive documentation and examples
