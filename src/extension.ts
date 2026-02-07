import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/** Debounce time to prevent multiple greetings in quick succession */
const DEBOUNCE_MS = 5000;

/** Timestamp of the last greeting */
let lastGreetingTime = 0;

/**
 * Configuration interface for AutoSay settings
 */
interface AutoSayConfig {
    message: string;
    voice: string;
    rate: number;
    enabled: boolean;
}

/**
 * Retrieves the AutoSay configuration from VS Code settings
 * @returns AutoSayConfig object with all settings
 */
function getConfig(): AutoSayConfig {
    const config = vscode.workspace.getConfiguration('autosay');
    return {
        message: config.get<string>('message') || 'Hello!',
        voice: config.get<string>('voice') || 'Samantha',
        rate: config.get<number>('rate') || 175,
        enabled: config.get<boolean>('enabled') ?? true
    };
}

/**
 * Speaks the given message using macOS text-to-speech
 * @param message - The text to speak
 * @param voice - The voice to use (e.g., 'Samantha')
 * @param rate - Speech rate in words per minute
 */
function speak(message: string, voice: string, rate: number): void {
    // Escape quotes to prevent command injection
    const escapedMessage = message.replace(/"/g, '\\"').replace(/'/g, "\\'");
    const command = `say -v "${voice}" -r ${rate} "${escapedMessage}"`;
    
    exec(command, (error) => {
        if (error) {
            console.error('AutoSay: TTS error:', error.message);
            vscode.window.showErrorMessage(`AutoSay: Failed to speak. Is the voice "${voice}" available?`);
        }
    });
}

/**
 * Triggers the greeting with debouncing to prevent spam
 * @param source - The source that triggered the greeting (for logging)
 */
function triggerGreeting(source: string): void {
    const now = Date.now();
    if (now - lastGreetingTime < DEBOUNCE_MS) {
        console.log(`AutoSay: Debounced greeting from ${source}`);
        return;
    }
    lastGreetingTime = now;

    const config = getConfig();
    if (config.enabled) {
        console.log(`AutoSay: Speaking greeting (triggered by ${source})`);
        speak(config.message, config.voice, config.rate);
    }
}

/**
 * Logs all available AI-related commands to a file for debugging
 * This helps users find the correct commands for their Cursor/VS Code version
 */
async function logAvailableCommands(): Promise<void> {
    try {
        const allCommands = await vscode.commands.getCommands(true);
        const relevantCommands = allCommands.filter(cmd => {
            const lowerCmd = cmd.toLowerCase();
            return lowerCmd.includes('chat') ||
                   lowerCmd.includes('composer') ||
                   lowerCmd.includes('aipopup') ||
                   lowerCmd.includes('cursor') ||
                   lowerCmd.includes('copilot') ||
                   lowerCmd.includes('ai');
        });
        
        const logPath = path.join(os.homedir(), 'autosay-commands.log');
        fs.writeFileSync(logPath, relevantCommands.join('\n'), 'utf8');
        console.log(`AutoSay: Commands written to ${logPath}`);
    } catch (error) {
        console.error('AutoSay: Failed to log commands:', error);
    }
}

/**
 * Attempts to open a new AI chat using various Cursor/VS Code commands
 */
async function openNewAIChat(): Promise<void> {
    // First, ensure the composer/chat panel is open
    try {
        await vscode.commands.executeCommand('composer.startComposerPrompt');
        console.log('AutoSay: Opened composer panel');
    } catch {
        // Panel might already be open, continue
    }

    // Small delay to ensure panel is ready
    await new Promise(resolve => setTimeout(resolve, 150));

    // Now create a new chat within the panel
    const newChatCommands = [
        'composer.createNew',         // Create new composer chat
        'composer.newAgentChat',      // Create new agent chat
        'aichat.newchataction'        // Fallback
    ];

    for (const command of newChatCommands) {
        try {
            await vscode.commands.executeCommand(command);
            console.log(`AutoSay: Successfully executed ${command}`);
            return;
        } catch (error) {
            console.log(`AutoSay: ${command} not available`);
        }
    }
    
    console.log('AutoSay: No new chat command succeeded');
}

/**
 * Extension activation point
 * @param context - VS Code extension context
 */
export function activate(context: vscode.ExtensionContext): void {
    console.log('AutoSay: Extension activated');

    // Log available commands for debugging
    logAvailableCommands();

    // Command: Manual greeting trigger
    const greetCommand = vscode.commands.registerCommand('autosay.greet', () => {
        const config = getConfig();
        speak(config.message, config.voice, config.rate);
        vscode.window.showInformationMessage('AutoSay: Greeting spoken!');
    });

    // Command: Show detected commands (for debugging)
    const showCommandsCommand = vscode.commands.registerCommand('autosay.showCommands', async () => {
        const logPath = path.join(os.homedir(), 'autosay-commands.log');
        if (fs.existsSync(logPath)) {
            const doc = await vscode.workspace.openTextDocument(logPath);
            await vscode.window.showTextDocument(doc);
        } else {
            vscode.window.showWarningMessage('AutoSay: Commands log not found. Restart the editor.');
        }
    });

    // Command: Open new chat with greeting (Cmd+Shift+L)
    const openNewChat = vscode.commands.registerCommand('autosay.openNewChat', async () => {
        console.log('AutoSay: Opening NEW chat with greeting');
        
        // Speak the greeting
        triggerGreeting('newChat');
        
        // Small delay to let greeting start, then open chat
        await new Promise(resolve => setTimeout(resolve, 100));
        await openNewAIChat();
    });

    // Register all commands
    context.subscriptions.push(greetCommand, showCommandsCommand, openNewChat);

    // Startup greeting (with delay to ensure editor is ready)
    const config = getConfig();
    if (config.enabled) {
        setTimeout(() => {
            triggerGreeting('startup');
        }, 2000);
    }
}

/**
 * Extension deactivation point
 */
export function deactivate(): void {
    console.log('AutoSay: Extension deactivated');
}
