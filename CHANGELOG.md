# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
