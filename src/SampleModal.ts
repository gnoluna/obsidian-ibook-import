import { App, Modal } from 'obsidian';
import { IBooksData } from './IBooksData';

export class SampleModal extends Modal {
	iBooksData: IBooksData
	constructor(app: App) {
		super(app);
		this.iBooksData = new IBooksData()
	}

	onOpen() {
		const { contentEl } = this;
		console.log(this.iBooksData.allBookMeta());
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
