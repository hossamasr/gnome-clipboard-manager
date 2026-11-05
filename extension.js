/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import St from 'gi://St';
import Meta from 'gi://Meta';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const MAX_HISTORY = 10;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init(extension) {
        super._init(0.0, _('Clipboard Manager'));

        this._history = [];

        const iconPath = `${extension.path}/icons/clipboard-symbolic.svg`;
        this.add_child(new St.Icon({
            gicon: Gio.icon_new_for_string(iconPath),
            style_class: 'system-status-icon',
        }));

        this._historySection = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(this._historySection);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        const clearItem = new PopupMenu.PopupMenuItem(_('Clear History'));
        clearItem.connect('activate', () => {
            this.clearHistory();
        });
        this.menu.addMenuItem(clearItem);

        // Initial menu render
        this._updateMenu();
    }

    addText(text) {
        if (this._history.length > 0 && this._history[0] === text)
            return;

        const existingIndex = this._history.indexOf(text);
        if (existingIndex !== -1)
            this._history.splice(existingIndex, 1);

        this._history.unshift(text);

        if (this._history.length > MAX_HISTORY)
            this._history.pop();

        this._updateMenu();
    }

    deleteItem(index) {
        const isDeletingActive = (index === 0);
        this._history.splice(index, 1);

        if (isDeletingActive) {
            const clipboard = St.Clipboard.get_default();
            if (this._history.length > 0) {
                clipboard.set_text(St.ClipboardType.CLIPBOARD, this._history[0]);
            } else {
                clipboard.set_text(St.ClipboardType.CLIPBOARD, '');
            }
        }

        this._updateMenu();
    }

    clearHistory() {
        this._history = [];
        this._updateMenu();
    }

    _updateMenu() {
        this._historySection.removeAll();

        if (this._history.length === 0) {
            const emptyItem = new PopupMenu.PopupMenuItem(_('No items copied yet'));
            emptyItem.sensitive = false;
            this._historySection.addMenuItem(emptyItem);
            return;
        }

        this._history.forEach((fullText, index) => {
            const cleanText = fullText.replace(/\s+/g, ' ').trim();
            const preview = cleanText.length > 30 ? cleanText.substring(0, 30) + '...' : cleanText;

            const item = new PopupMenu.PopupMenuItem(preview);

            item.label.x_expand = true;

            const isSelected = (index === 0);

            const unselectedOrnament = PopupMenu.Ornament.NO_DOT ?? PopupMenu.Ornament.NONE;
            item.setOrnament(isSelected ? PopupMenu.Ornament.DOT : unselectedOrnament);

            item.label.style = isSelected ? 'font-weight: bold;' : '';

            const deleteIcon = new St.Icon({
                icon_name: 'edit-delete-symbolic',
                style_class: 'popup-menu-icon',
            });
            const deleteButton = new St.Button({
                child: deleteIcon,
                style_class: 'clipboard-delete-btn',
                can_focus: true,
                y_align: Clutter.ActorAlign.CENTER,
            });

            deleteButton.connect('clicked', () => {
                this.deleteItem(index);
            });

            item.add_child(deleteButton);

            item.connect('activate', () => {
                const clipboard = St.Clipboard.get_default();
                clipboard.set_text(St.ClipboardType.CLIPBOARD, fullText);
            });

            this._historySection.addMenuItem(item);
        });
    }
});

export default class ClipboardManagerExtension extends Extension {
    enable() {
        this._indicator = new Indicator(this);
        Main.panel.addToStatusArea(this.uuid, this._indicator);

        this._selection = global.display.get_selection();
        this._selectionSignalId = this._selection.connect(
            'owner-changed',
            (selection, selectionType) => {
                if (selectionType === Meta.SelectionType.SELECTION_CLIPBOARD) {
                    this._onClipboardChanged();
                }
            }
        );
    }

    _onClipboardChanged() {
        const clipboard = St.Clipboard.get_default();
        clipboard.get_text(St.ClipboardType.CLIPBOARD, (_clip, text) => {
            if (text && text.trim().length > 0) {
                this._indicator.addText(text);
            }
        });
    }

    disable() {
        if (this._selection && this._selectionSignalId) {
            this._selection.disconnect(this._selectionSignalId);
            this._selection = null;
            this._selectionSignalId = null;
        }

        this._indicator?.destroy();
        this._indicator = null;
    }
}
