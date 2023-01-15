import { App, DropdownComponent, PluginSettingTab, Setting } from 'obsidian';
import ImportIBookPlugin from './main';

export class ImportIBookSettingTab extends PluginSettingTab {
	plugin: ImportIBookPlugin;

	constructor(app: App, plugin: ImportIBookPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'General settings' });

		new Setting(containerEl)
			.setName('Highlights folder')
			.setDesc('Highlights exported from iBook will be placed in this folder')
			.addText(text => text
				.setPlaceholder('/')
				.setValue(this.plugin.settings.destinationFolder)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.destinationFolder = value;
					await this.plugin.saveSettings();
				}));
	}
}
