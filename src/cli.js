#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * DocuWriter.ai MCP CLI
 * Handles both MCP server startup and rule installation
 */

const ENVIRONMENTS = {
  cursor: {
    name: 'Cursor',
    sourceFile: 'cursor.mdc',
    targetPath: '.cursor/rules/docuwriter-mcp.mdc',
    mcpConfigPath: '.cursor/mcp.json',
    mcpConfigKey: 'mcpServers',
    description: 'Cursor AI assistant rules'
  },
  claude: {
    name: 'Claude Desktop',
    sourceFile: 'claude.md',
    targetPath: 'CLAUDE.md',
    mcpConfigPath: '.mcp.json',
    mcpConfigKey: 'mcpServers',
    description: 'Claude Desktop AI assistant rules'
  },
  vscode: {
    name: 'Visual Studio Code',
    sourceFile: null,
    targetPath: null,
    mcpConfigPath: '.vscode/mcp.json',
    mcpConfigKey: 'servers',
    description: 'VS Code (MCP config only, no AI rules)'
  }
};

function showUsage() {
  console.log(`
🚀 DocuWriter.ai MCP Client

Usage:
  npx @docuwriter-ai/mcp-client [command] [options]

Commands:
  install [env]   Install AI assistant rules
                  env: cursor, claude, vscode, all (default: interactive prompt)
  
  start          Start MCP server (default if no command specified)
  
  --help, -h     Show this help message

Examples:
  npx @docuwriter-ai/mcp-client install cursor
  npx @docuwriter-ai/mcp-client install all
  npx @docuwriter-ai/mcp-client install
  npx @docuwriter-ai/mcp-client start
  npx @docuwriter-ai/mcp-client

Environment Variables:
  DOCUWRITER_API_TOKEN    Your DocuWriter.ai API token (required for MCP server)
`);
}

function findProjectRoot() {
  let currentDir = process.cwd();

  const indicators = ['package.json', 'composer.json', '.git', 'pyproject.toml', 'Cargo.toml', 'go.mod'];

  while (currentDir !== dirname(currentDir)) {
    const hasIndicator = indicators.some(indicator =>
      existsSync(join(currentDir, indicator))
    );

    if (hasIndicator) {
      return currentDir;
    }

    currentDir = dirname(currentDir);
  }

  return process.cwd();
}

function getRulesSourcePath() {
  const packageDir = dirname(__dirname);
  const rulesDir = join(packageDir, '.cursor-rules');

  if (existsSync(rulesDir)) {
    return rulesDir;
  }

  throw new Error('Could not find DocuWriter.ai rules source directory');
}

function writeMcpConfig(environment, projectRoot) {
  const env = ENVIRONMENTS[environment];
  if (!env || !env.mcpConfigPath) {
    return false;
  }

  const configPath = join(projectRoot, env.mcpConfigPath);
  const configDir = dirname(configPath);

  // Ensure directory exists
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  // Read existing config or create new one
  let config = {};
  if (existsSync(configPath)) {
    try {
      const configContent = readFileSync(configPath, 'utf8');
      config = JSON.parse(configContent) || {};
    } catch (error) {
      console.log(`⚠️  Could not read existing MCP config, creating new one: ${error.message}`);
    }
  }

  // Add DocuWriter.ai MCP server configuration
  const mcpConfig = {
    command: 'npx',
    args: ['-y', '@docuwriter-ai/mcp-client', 'start'],
    env: {
      DOCUWRITER_API_TOKEN: 'your_token_here'
    }
  };

  // Check if this is an update (config already exists)
  const isUpdate = existsSync(configPath) && config[env.mcpConfigKey]?.docuwriter;

  // Set the configuration using the environment's config key
  if (!config[env.mcpConfigKey]) {
    config[env.mcpConfigKey] = {};
  }
  config[env.mcpConfigKey].docuwriter = mcpConfig;

  // Write the configuration file
  try {
    const jsonConfig = JSON.stringify(config, null, 2);
    writeFileSync(configPath, jsonConfig, 'utf8');

    if (isUpdate) {
      console.log(`✅ ${env.name} MCP configuration updated successfully!`);
      console.log(`🔄 The configuration now uses the latest version (npx -y ensures auto-updates)`);
    } else {
      console.log(`✅ ${env.name} MCP configuration written successfully!`);
    }
    console.log(`📍 Location: ${configPath.replace(projectRoot + '/', '')}`);
    return true;
  } catch (error) {
    console.log(`⚠️  Failed to write MCP config for ${env.name}: ${error.message}`);
    return false;
  }
}

function installRule(environment, projectRoot, rulesSourcePath) {
  const env = ENVIRONMENTS[environment];
  if (!env) {
    throw new Error(`Unknown environment: ${environment}`);
  }

  // Write MCP configuration for all environments
  const mcpSuccess = writeMcpConfig(environment, projectRoot);

  // Handle VS Code (no AI rules support)
  if (environment === 'vscode') {
    if (mcpSuccess) {
      console.log(`✅ ${env.name} MCP configuration installed successfully!`);
      console.log(`📝 Remember to set your DOCUWRITER_API_TOKEN in the configuration.`);
    }
    return null;
  }

  const sourceFile = join(rulesSourcePath, env.sourceFile);
  const targetFile = join(projectRoot, env.targetPath);
  const targetDir = dirname(targetFile);

  if (!existsSync(sourceFile)) {
    throw new Error(`Source rule file not found: ${sourceFile}`);
  }

  if (!existsSync(targetDir)) {
    console.log(`📂 Creating directory: ${targetDir}`);
    mkdirSync(targetDir, { recursive: true });
  }

  if (existsSync(targetFile)) {
    console.log(`⚠️  ${env.name} rule already exists. Updating...`);
  }

  copyFileSync(sourceFile, targetFile);

  console.log(`✅ ${env.name} rules installed successfully!`);
  console.log(`📍 Location: ${targetFile.replace(projectRoot + '/', '')}`);

  return targetFile;
}

async function promptForEnvironment() {
  const { createInterface } = await import('readline');
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n📋 Available environments:');
    Object.entries(ENVIRONMENTS).forEach(([key, env], index) => {
      console.log(`  ${index + 1}. ${env.name} - ${env.description}`);
    });
    console.log(`  ${Object.keys(ENVIRONMENTS).length + 1}. All environments\n`);

    readline.question('Choose an environment (1-4): ', (answer) => {
      readline.close();

      const num = parseInt(answer);
      const envKeys = Object.keys(ENVIRONMENTS);

      if (num >= 1 && num <= envKeys.length) {
        resolve(envKeys[num - 1]);
      } else if (num === envKeys.length + 1) {
        resolve('all');
      } else {
        console.log('❌ Invalid selection. Installing for Cursor by default.');
        resolve('cursor');
      }
    });
  });
}

async function handleInstall(environment) {
  try {
    const projectRoot = findProjectRoot();
    const rulesSourcePath = getRulesSourcePath();

    console.log('📁 Project root detected:', projectRoot);
    console.log('📋 Installing DocuWriter.ai MCP rules...\n');

    if (!environment) {
      environment = await promptForEnvironment();
    }

    const installedFiles = [];

    if (environment === 'all') {
      console.log('🔄 Installing rules for all environments...\n');

      for (const [envKey, env] of Object.entries(ENVIRONMENTS)) {
        try {
          const installedFile = installRule(envKey, projectRoot, rulesSourcePath);
          if (installedFile) {
            installedFiles.push({ env: env.name, file: installedFile });
          }
        } catch (error) {
          console.log(`⚠️  Failed to install ${env.name} rules: ${error.message}`);
        }
      }
    } else {
      const installedFile = installRule(environment, projectRoot, rulesSourcePath);
      if (installedFile) {
        installedFiles.push({ env: ENVIRONMENTS[environment].name, file: installedFile });
      }
    }

    if (installedFiles.length > 0) {
      console.log('\n🎉 Installation complete!\n');

      console.log('📝 Installed rules for:');
      installedFiles.forEach(({ env, file }) => {
        console.log(`   • ${env}: ${file.replace(projectRoot + '/', '')}`);
      });

      console.log('\n🤖 Your AI assistant now knows how to use DocuWriter.ai effectively!\n');

      console.log('Next steps:');
      console.log('1. 🔑 Set your DOCUWRITER_API_TOKEN environment variable');
      console.log('2. ⚙️  Configure the MCP server in your AI assistant');
      console.log('3. 🚀 Start generating documentation with AI!\n');

      console.log('Example commands you can try:');
      console.log('• "Document this codebase using DocuWriter"');
      console.log('• "Generate tests for this file and save to my docs space"');
      console.log('• "Create API documentation and store it in DocuWriter"');
      console.log('• "Optimize this code and document the changes"\n');

      console.log('📚 Learn more: https://www.docuwriter.ai/docs/mcp-integration');
    } else if (environment === 'vscode') {
      console.log('\n✅ VS Code configuration information provided successfully!');
      console.log('📝 Follow the instructions above to configure MCP in VS Code.');
    } else {
      console.log('❌ No rules were installed successfully.');
    }

  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}

async function startMcpServer() {
  // Dynamic import to avoid loading MCP server when just installing rules
  await import('./index.js');
}

async function main() {
  const args = process.argv.slice(2);

  // Handle help flags
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }

  const command = args[0];
  const environment = args[1];

  switch (command) {
    case 'install':
      await handleInstall(environment);
      break;

    case 'start':
      await startMcpServer();
      break;

    default:
      // If first arg is an environment, assume install command
      if (ENVIRONMENTS[command] || command === 'all') {
        await handleInstall(command);
      } else if (command) {
        console.log(`❌ Unknown command: ${command}`);
        showUsage();
      } else {
        // No command specified - start MCP server
        await startMcpServer();
      }
      break;
  }
}

main().catch(console.error);
