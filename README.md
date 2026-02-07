# AutoSay - Cursor Greeting Extension

A Cursor/VS Code extension that automatically speaks a personalized greeting when you open a new AI chat session.

## Features

- Speaks a customizable greeting when you open a new chat (`Cmd+Shift+L`)
- Speaks on Cursor startup
- Configurable message, voice, and speech rate
- Uses macOS native text-to-speech (female voice by default)

## Requirements

- **macOS** (uses the native `say` command for text-to-speech)
- **Cursor IDE** (or VS Code)

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
```

### Option 2: Development mode

```bash
# Clone and install
git clone https://github.com/Laaaaksh/autosay.git
cd autosay
npm install

# Open in Cursor and press F5 to run in development mode
```

## Setup

### Step 1: Configure the keybinding

The extension requires a keybinding to trigger the greeting. Add this to your Cursor keybindings file:

**Location:** `~/Library/Application Support/Cursor/User/keybindings.json`

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

### Step 2: Restart Cursor

After installing and configuring, restart Cursor completely (`Cmd+Q` and reopen).

## Configuration

Open Cursor Settings (`Cmd+,`) and search for "AutoSay":

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
| `AutoSay: Show Detected Chat Commands` | Debug: shows available Cursor chat commands |

## Troubleshooting

### Greeting speaks but new chat doesn't open

The Cursor commands may vary between versions. Check the Developer Console (`Help → Toggle Developer Tools → Console`) for "AutoSay:" log messages.

Try running the command manually:
1. Open Command Palette (`Cmd+Shift+P`)
2. Type "AutoSay: Open New Chat"
3. Check if it works

### Keybinding doesn't work / Opens "Go to Line"

Your keybindings file might have a conflicting binding. 

1. Open `~/Library/Application Support/Cursor/User/keybindings.json`
2. Look for any existing `shift+cmd+l` bindings
3. Either remove them or add the `-` prefix to disable them:
   ```json
   {
       "key": "shift+cmd+l",
       "command": "-workbench.action.gotoLine"
   }
   ```

### Keybindings file location

Cursor stores settings in a **different location** than `~/.cursor/`:

- **Correct:** `~/Library/Application Support/Cursor/User/keybindings.json`
- **Wrong:** `~/.cursor/User/keybindings.json`

### Extension not loading

1. Check if the extension is installed: `Cmd+Shift+P` → "Extensions: Show Installed Extensions"
2. Look for "AutoSay Greeting"
3. If not found, reinstall: `cursor --install-extension autosay-1.0.0.vsix --force`

### No sound

1. Check your system volume
2. Test the `say` command in terminal: `say "Hello"`
3. Check if `autosay.enabled` is set to `true` in settings

## How It Works

1. The extension registers a command `autosay.openNewChat`
2. A keybinding maps `Cmd+Shift+L` to this command
3. When triggered, the extension:
   - Speaks the configured greeting using macOS `say` command
   - Executes Cursor's `aichat.newchataction` to open a new chat

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

MIT License - see [LICENSE](LICENSE) for details.

## Author

Laksh Sadhwani

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
