# Clipboard Manager for GNOME Shell

A lightweight, modern, and privacy-first clipboard manager extension for GNOME Shell.

![GNOME Shell Versions](https://img.shields.io/badge/GNOME%20Shell-45%20--%2051-blue?logo=gnome)
![License: GPL-2.0-or-later](https://img.shields.io/badge/License-GPL--2.0--or--later-green.svg)

---

## Features

- **⚡ Event-Driven Performance:** Hooks directly into Mutter's window manager signals (`owner-changed`). Consumes zero CPU when idle—no polling timers or battery drain.
- **🔘 Clear Active Indicator:** Uses native radio ornaments (`DOT` / `NO_DOT`) and bold text to instantly show which snippet is currently on your system clipboard.
- **🔄 One-Click Restore:** Click any previous clip to silently put it back onto your system clipboard.
- **🗑️ Individual Deletion:** Delete sensitive clips (like passwords or tokens) individually with the trash icon without clearing your whole history.
- **🧹 Clear All:** Quick button to wipe clipboard history at any time.
- **🔒 Privacy First:** All clipboard data is stored strictly in memory and stays 100% on your local machine. No telemetry, no network calls, and no third-party sharing.

---

## Supported GNOME Versions

Compatible with modern GNOME Shell versions (ES Modules):
- **GNOME Shell 45, 46, 47, 48, 49, 50, 51+**

---

## Installation

### Method 1: Install from ZIP Release

Download the latest `.zip` release from the [Releases](https://github.com/hossamasr/gnome-clipboard-manager/releases) page and run:

```bash
gnome-extensions install ClipboardManger@hossamasr.com.shell-extension.zip
```

Then enable it:

```bash
gnome-extensions enable ClipboardManger@hossamasr.com
```

*(On Wayland, log out and log back in if prompted. On X11, press `Alt + F2`, type `r`, and press `Enter`).*

---

### Method 2: Install from Source

Clone this repository directly into your GNOME extensions folder:

```bash
git clone https://github.com/hossamasr/gnome-clipboard-manager.git ~/.local/share/gnome-shell/extensions/ClipboardManger@hossamasr.com
```

Enable the extension:

```bash
gnome-extensions enable ClipboardManger@hossamasr.com
```

---

## Building / Packaging

To create a clean release bundle ready for [extensions.gnome.org](https://extensions.gnome.org/):

```bash
gnome-extensions pack \
  --extra-source=icons \
  --extra-source=stylesheet.css \
  --force \
  --out-dir=.
```

---

## License

This project is licensed under the terms of the **GNU General Public License v2.0 or later** ([GPL-2.0-or-later](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)).
