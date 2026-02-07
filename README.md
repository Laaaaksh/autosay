# AutoSay - Greeting Extension for Cursor & VS Code

> **macOS only** - This extension uses the native `say` command for text-to-speech.

A Cursor/VS Code extension that automatically speaks a personalized greeting when you open a new AI chat session.

## Features

- Speaks a customizable greeting when you open a new chat (`Cmd+Shift+L`)
- Speaks on editor startup
- Configurable message, voice, and speech rate
- Uses macOS native text-to-speech (female voice by default)
- Works with both **Cursor** and **VS Code**

## Requirements

| Requirement | Details |
|-------------|---------|
| **OS** | macOS only (uses native `say` command) |
| **Editor** | Cursor IDE or VS Code |
| **Node.js** | Required for building from source |

> **Note for Windows/Linux users:** This extension currently only supports macOS. Contributions to add cross-platform TTS support are welcome!

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

The extension requires a keybinding to trigger the greeting on new chat. Add this to your keybindings file.

**Keybindings file location:**

| Editor | Location |
|--------|----------|
| **Cursor** | `~/Library/Application Support/Cursor/User/keybindings.json` |
| **VS Code** | `~/Library/Application Support/Code/User/keybindings.json` |

**Complete keybindings.json example:**

```json
[
    {
        "key": "shift+cmd+l",
        "command": "-workbench.action.gotoLine"
    },
    {
        "key": "shift+cmd+l",
        "command": "-editor.action.selectHighlights"
    },
    {
        "key": "shift+cmd+l",
        "command": "-aichat.newchataction"
    },
    {
        "key": "shift+cmd+l",
        "command": "autosay.openNewChat"
    }
]
```

> **What this does:**
> - Lines with `-` prefix disable conflicting default bindings
> - The last entry binds `Cmd+Shift+L` to our greeting + new chat command

### Step 2: Restart your editor

After installing and configuring, **completely restart** Cursor/VS Code (`Cmd+Q` and reopen).

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

Open Command Palette (`Cmd+Shift+P`) and type "AutoSay":

| Command | Description |
|---------|-------------|
| `AutoSay: Speak Greeting` | Manually trigger the greeting |
| `AutoSay: Show Detected Chat Commands` | Debug: shows available chat commands |
| `AutoSay: Open New Chat with Greeting` | Open new AI chat and speak greeting |

## Troubleshooting

### Greeting speaks but new chat doesn't open

The chat commands vary between Cursor versions. 

1. Open Developer Console: `Help → Toggle Developer Tools → Console`
2. Press `Cmd+Shift+L` and look for "AutoSay:" messages
3. Run `AutoSay: Show Detected Chat Commands` to see available commands

### Keybinding doesn't work / Opens "Go to Line"

Your keybindings file has conflicting bindings.

1. Open your keybindings file (see locations above)
2. Make sure you have ALL the `-` prefixed entries to disable defaults
3. The file must be valid JSON (check for missing commas)

**Quick fix:** Copy the complete keybindings.json example from the Setup section above.

### Keybindings file location

| Editor | Correct Path |
|--------|--------------|
| **Cursor** | `~/Library/Application Support/Cursor/User/keybindings.json` |
| **VS Code** | `~/Library/Application Support/Code/User/keybindings.json` |

> **Important:** Do NOT use `~/.cursor/` or `~/.vscode/` - those are different directories!

### Extension not loading

1. Open Command Palette: `Cmd+Shift+P`
2. Type "Extensions: Show Installed Extensions"
3. Search for "AutoSay Greeting"
4. If not found, reinstall:
   ```bash
   # Cursor
   cursor --install-extension autosay-1.0.0.vsix --force
   
   # VS Code
   code --install-extension autosay-1.0.0.vsix --force
   ```

### No sound

1. Check your system volume is not muted
2. Test the `say` command in terminal:
   ```bash
   say "Hello, this is a test"
   ```
3. Check if `autosay.enabled` is `true` in settings
4. Try a different voice - some voices may not be installed

### Wrong voice (male instead of female)

If you hear a male voice instead of Samantha:

1. **Check if Samantha is available** on your system:
   ```bash
   say -v '?' | grep Samantha
   ```

2. **Test Samantha directly**:
   ```bash
   say -v "Samantha" "Hello, this is Samantha"
   ```

3. **Explicitly set the voice** in Cursor settings (`Cmd+,`):
   ```json
   "autosay.voice": "Samantha"
   ```

4. **If Samantha isn't available**, try another female voice:
   ```bash
   # List all available voices
   say -v '?'
   
   # Try Karen (Australian)
   say -v "Karen" "Hello, this is Karen"
   ```
   Then set that voice in settings.

5. **Download more voices** in macOS:
   - Go to **System Settings → Accessibility → Spoken Content**
   - Click **System Voice** dropdown → **Manage Voices**
   - Download "Samantha" or other preferred voices

### VS Code: No AI chat available

This extension is primarily designed for Cursor's AI chat feature. In vanilla VS Code:
- You need GitHub Copilot Chat or similar extension for the new chat functionality
- The greeting will still speak on startup and when manually triggered

## How It Works

1. On startup, the extension speaks the greeting (if enabled)
2. When you press `Cmd+Shift+L`:
   - The greeting is spoken using macOS `say` command
   - The extension tries to open a new AI chat using Cursor/VS Code commands
3. A debounce mechanism prevents multiple greetings within 5 seconds

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

## Project Structure

```
autosay/
├── src/
│   └── extension.ts    # Main extension code
├── out/                 # Compiled JavaScript (generated)
├── package.json         # Extension manifest
├── tsconfig.json        # TypeScript configuration
├── LICENSE              # GPL-3.0 license
├── CHANGELOG.md         # Version history
└── README.md            # This file
```

## License

GPL-3.0 License - see [LICENSE](LICENSE) for details.

This means you can use and modify this software, but any derivative work must also be open-source under GPL-3.0.

## Author

**Laksh Sadhwani**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Ideas for contributions:
- Cross-platform TTS support (Windows/Linux)
- More voice options
- Custom audio file support
- Integration with other AI chat extensions
