import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

let lastGreetingTime = 0;
const DEBOUNCE_MS = 5000;

function getConfig() {
    const config = vscode.workspace.getConfiguration('autosay');
    return {
        message: config.get<string>('message') || 'Hello!',
        voice: config.get<string>('voice') || 'Samantha',
        rate: config.get<number>('rate') || 175,
        enabled: config.get<boolean>('enabled') ?? true
    };
}

function speak(message: string, voice: string, rate: number): void {
    const escapedMessage = message.replace(/"/g, '\\"').replace(/'/g, "\\'");
    const command = `say -v "${voice}" -r ${rate} "${escapedMessage}"`;
    
    exec(command, (error) => {
        if (error) {
            console.error('AutoSay TTS error:', error);
        }
    });
}

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

async function logAvailableCommands(): Promise<void> {
    const allCommands = await vscode.commands.getCommands(true);
    const relevantCommands = allCommands.filter(cmd => 
        cmd.toLowerCase().includes('chat') ||
        cmd.toLowerCase().includes('composer') ||
        cmd.toLowerCase().includes('aipopup') ||
        cmd.toLowerCase().includes('cursor') ||
        cmd.toLowerCase().includes('copilot') ||
        cmd.toLowerCase().includes('ask') ||
        cmd.toLowerCase().includes('ai')
    );
    
    const logPath = path.join(os.homedir(), 'autosay-commands.log');
    fs.writeFileSync(logPath, relevantCommands.join('\n'));
    console.log(`AutoSay: Commands written to ${logPath}`);
}

export function activate(context: vscode.ExtensionContext) {
    console.log('AutoSay extension activated');

    logAvailableCommands();

    // Manual greeting command
    const greetCommand = vscode.commands.registerCommand('autosay.greet', () => {
        const config = getConfig();
        speak(config.message, config.voice, config.rate);
        vscode.window.showInformationMessage('AutoSay: Greeting spoken!');
    });

    // Show detected commands
    const showCommandsCommand = vscode.commands.registerCommand('autosay.showCommands', async () => {
        const logPath = path.join(os.homedir(), 'autosay-commands.log');
        if (fs.existsSync(logPath)) {
            const doc = await vscode.workspace.openTextDocument(logPath);
            await vscode.window.showTextDocument(doc);
        }
    });

    // Cmd+L: Not needed - let Cursor handle it natively
    const openExistingChat = vscode.commands.registerCommand('autosay.openExistingChat', async () => {
        console.log('AutoSay: This command should not be triggered - Cmd+L passes through');
    });

    // Cmd+Shift+L: Open NEW chat (with greeting!)
    const openNewChat = vscode.commands.registerCommand('autosay.openNewChat', async () => {
        console.log('AutoSay: Opening NEW chat with greeting');
        
        // Speak the greeting
        triggerGreeting('newChat');
        
        // Wait a moment for greeting to start, then open chat
        setTimeout(async () => {
            // Try different Cursor commands
            console.log('AutoSay: Trying to open new chat...');
            
            // Try aichat.newchataction first
            vscode.commands.executeCommand('aichat.newchataction').then(
                () => console.log('AutoSay: aichat.newchataction executed'),
                (e) => console.log('AutoSay: aichat.newchataction error:', e)
            );
            
            // Also try composer.createNew as backup
            setTimeout(() => {
                vscode.commands.executeCommand('composer.createNew').then(
                    () => console.log('AutoSay: composer.createNew executed'),
                    (e) => console.log('AutoSay: composer.createNew error:', e)
                );
            }, 100);
        }, 50);
    });

    context.subscriptions.push(
        greetCommand,
        showCommandsCommand,
        openExistingChat,
        openNewChat
    );

    // Initial greeting on startup
    const config = getConfig();
    if (config.enabled) {
        setTimeout(() => {
            triggerGreeting('startup');
        }, 1500);
    }
}

export function deactivate() {
    console.log('AutoSay extension deactivated');
}
