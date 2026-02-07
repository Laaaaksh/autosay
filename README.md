# AutoSay - Greeting Extension for Cursor & VS Code

A Cursor/VS Code extension that automatically speaks a personalized greeting when you open a new AI chat session.

## Features

- Speaks a customizable greeting when you open a new chat (`Cmd+Shift+L`)
- Speaks on editor startup
- Configurable message, voice, and speech rate
- Uses macOS native text-to-speech (female voice by default)
- Works with both **Cursor** and **VS Code**

## Requirements

- **macOS** (uses the native `say` command for text-to-speech)
- **Cursor IDE** or **VS Code**

## Installation

### Option 1: Install from .vsix file

```bash
# Clone the repository
git clone https://github.com/Laaaaksh/autosay.git
cd autosay

# Install dependencies
npm install

# Build the extension
npm run compile

# Package the extension
npx vsce package --allow-missing-repository

# Install in Cursor
cursor --install-extension autosay-1.0.0.vsix --force

# OR Install in VS Code
code --install-extension autosay-1.0.0.vsix --force
```

### Option 2: Development mode

```bash
# Clone and install
git clone https://github.com/Laaaaksh/autosay.git
cd autosay
npm install

# Open in Cursor/VS Code and press F5 to run in development mode
```

## Setup

### Step 1: Configure the keybinding

The extension requires a keybinding to trigger the greeting. Add this to your keybindings file:

**Keybindings file location:**

| Editor | Location |
|--------|----------|
| **Cursor** | `~/Library/Application Support/Cursor/User/keybindings.json` |
| **VS Code** | `~/Library/Application Support/Code/User/keybindings.json` |

Add these entries to your keybindings array:

```json
{
    "key": "shift+cmd+l",
    "command": "-workbench.action.gotoLine"
},
{
    "key": "shift+cmd+l",
    "command": "autosay.openNewChat"
}
```

> **Note:** The first entry disables the default "Go to Line" binding. The second binds `Cmd+Shift+L` to our greeting + new chat command.

### Step 2: Restart your editor

After installing and configuring, restart Cursor/VS Code completely (`Cmd+Q` and reopen).

## Configuration

Open Settings (`Cmd+,`) and search for "AutoSay":

| Setting | Default | Description |
|---------|---------|-------------|
| `autosay.message` | "Hello My Name!..." | The message to speak |
| `autosay.voice` | Samantha | Voice to use (see available voices below) |
| `autosay.rate` | 175 | Speech rate (90-720 words per minute) |
| `autosay.enabled` | true | Enable/disable the greeting |

### Available Voices (macOS)

Female voices:
- `Samantha` (US English - default)
- `Victoria` (US English)
- `Karen` (Australian English)
- `Moira` (Irish English)
- `Tessa` (South African English)
- `Fiona` (Scottish English)

To see all available voices on your system:
```bash
say -v '?'
```

## Commands

| Command | Description |
|---------|-------------|
| `AutoSay: Speak Greeting` | Manually trigger the greeting |
| `AutoSay: Show Detected Chat Commands` | Debug: shows available chat commands |
| `AutoSay: Open New Chat with Greeting` | Open new AI chat and speak greeting |

## Troubleshooting

### Greeting speaks but new chat doesn't open

The chat commands may vary between Cursor and VS Code versions. Check the Developer Console (`Help → Toggle Developer Tools → Console`) for "AutoSay:" log messages.

Try running the command manually:
1. Open Command Palette (`Cmd+Shift+P`)
2. Type "AutoSay: Open New Chat"
3. Check if it works

### Keybinding doesn't work / Opens "Go to Line"

Your keybindings file might have a conflicting binding. 

1. Open your keybindings file (see locations above)
2. Look for any existing `shift+cmd+l` bindings
3. Either remove them or add the `-` prefix to disable them:
   ```json
   {
       "key": "shift+cmd+l",
       "command": "-workbench.action.gotoLine"
   }
   ```

### Keybindings file location

| Editor | Correct Path |
|--------|--------------|
| **Cursor** | `~/Library/Application Support/Cursor/User/keybindings.json` |
| **VS Code** | `~/Library/Application Support/Code/User/keybindings.json` |

> **Note:** Do NOT use `~/.cursor/` or `~/.vscode/` - those are different directories.

### Extension not loading

1. Check if the extension is installed: `Cmd+Shift+P` → "Extensions: Show Installed Extensions"
2. Look for "AutoSay Greeting"
3. If not found, reinstall:
   - Cursor: `cursor --install-extension autosay-1.0.0.vsix --force`
   - VS Code: `code --install-extension autosay-1.0.0.vsix --force`

### No sound

1. Check your system volume
2. Test the `say` command in terminal: `say "Hello"`
3. Check if `autosay.enabled` is set to `true` in settings

### VS Code: No AI chat available

This extension is primarily designed for Cursor's AI chat feature. In vanilla VS Code, you'll need an AI chat extension (like GitHub Copilot Chat) for the new chat functionality to work. The greeting will still speak on startup.

## How It Works

1. The extension registers a command `autosay.openNewChat`
2. A keybinding maps `Cmd+Shift+L` to this command
3. When triggered, the extension:
   - Speaks the configured greeting using macOS `say` command
   - Executes the AI chat command to open a new chat (Cursor: `aichat.newchataction`)

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-compile on changes)
npm run watch

# Package for distribution
npx vsce package --allow-missing-repository
```

## License

GPL-3.0 License - see [LICENSE](LICENSE) for details.

This means you can use and modify this software, but any derivative work must also be open-source under GPL-3.0.

## Author

Laksh Sadhwani

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
