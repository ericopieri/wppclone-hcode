import { Format } from "../util/Format";
import { CameraController } from "./CameraController";

class WhatsappController {
	constructor() {
		this.el = {};
		this.elementsPrototype();
		this.getElements();
		this.initEvents();
		this.hideAllLeftPanels();
	}

	elementsPrototype() {
		Element.prototype.show = function () {
			this.style.display = "block";
			return this;
		};

		Element.prototype.hide = function () {
			this.style.display = "none";
			return this;
		};

		Element.prototype.toggleDisplay = function () {
			this.style.display = this.style.display === "none" ? "block" : "none";
			return this;
		};

		Element.prototype.on = function (events, fn) {
			events.split(" ").forEach((event) => {
				this.addEventListener(event, fn);
			});
			return this;
		};

		Element.prototype.css = function (styles) {
			Object.keys(styles).forEach((key) => {
				this.style[key] = styles[key];
			});
			return this;
		};

		Element.prototype.toggleClass = function (className) {
			this.classList.toggle(className);
			return this;
		};

		Element.prototype.addClass = function (className) {
			this.classList.add(className);
			return this;
		};

		Element.prototype.removeClass = function (className) {
			this.classList.remove(className);
			return this;
		};

		Element.prototype.hasClass = function (className) {
			return this.classList.contains(className);
		};

		HTMLFormElement.prototype.getForm = function () {
			return new FormData(this);
		};

		HTMLFormElement.prototype.toJSON = function () {
			let JSON = {};

			this.getForm().forEach((value, key) => {
				JSON[key] = value;
			});

			return JSON;
		};
	}

	initEvents() {
		this.el.myPhoto.on("click", (event) => {
			this.hideAllLeftPanels();
			this.el.panelEditProfile.show();
			setTimeout(() => {
				this.el.panelEditProfile.addClass("open");
			}, 350);
		});

		this.el.btnClosePanelEditProfile.on("click", (event) => {
			this.el.panelEditProfile.removeClass("open");
		});

		this.el.btnNewContact.on("click", (event) => {
			this.hideAllLeftPanels();
			this.el.panelAddContact.show();
			setTimeout(() => {
				this.el.panelAddContact.addClass("open");
			}, 350);
		});

		this.el.btnClosePanelAddContact.on("click", (event) => {
			this.el.panelAddContact.removeClass("open");
		});

		this.el.photoContainerEditProfile.on("click", (event) => {
			this.el.inputProfilePhoto.click();
		});

		this.el.inputNamePanelEditProfile.on("keypress", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				this.el.btnSavePanelEditProfile.click();
			}
		});

		this.el.btnSavePanelEditProfile.on("click", (event) => {
			console.log(this.el.inputNamePanelEditProfile.innerHTML);
		});

		this.el.formPanelAddContact.on("submit", (event) => {
			event.preventDefault();
			console.log(this.el.formPanelAddContact.getForm());
		});

		this.el.contactsMessagesList.querySelectorAll(".contact-item").forEach((contact, index) => {
			contact.on("click", (event) => {
				this.el.home.hide();
				this.el.main.css({
					display: "flex",
				});
			});
		});

		this.el.btnAttach.on("click", (event) => {
			event.stopPropagation();
			this.el.menuAttach.addClass("open");
			document.addEventListener("click", this.closeMenuAndDeleteEvent.bind(this));
		});

		this.el.btnAttachPhoto.on("click", (event) => {
			this.el.inputPhoto.click();
		});

		this.el.inputPhoto.on("change", (event) => {
			[...event.target.files].forEach((file, i) => {
				console.log(`Arquivo - ${file.name}`);
			});
		});

		this.el.btnAttachCamera.on("click", (event) => {
			this.closeAllMainPanels();
			this.el.panelCamera.addClass("open");
			this.el.panelCamera.css({
				height: "100%",
			});
			this._camera = new CameraController(this.el.videoCamera);
		});

		this.el.btnTakePicture.on("click", (event) => {
			console.log("sorria!");
		});

		this.el.btnClosePanelCamera.on("click", (event) => {
			this.closeAllMainPanels();
			this.el.panelMessagesContainer.show();
			this._camera.stopCamera();
		});

		this.el.btnAttachDocument.on("click", (event) => {
			this.closeAllMainPanels();
			this.el.panelDocumentPreview.addClass("open");
			this.el.panelDocumentPreview.css({
				height: "100%",
			});
		});

		this.el.btnSendDocument.on("click", (event) => {
			console.log("enviando arquvio...");
		});

		this.el.btnClosePanelDocumentPreview.on("click", (event) => {
			this.closeAllMainPanels();
			this.el.panelMessagesContainer.show();
		});

		this.el.btnAttachContact.on("click", (event) => {
			this.el.modalContacts.show();
		});

		this.el.btnCloseModalContacts.on("click", (event) => {
			this.el.modalContacts.hide();
		});

		this.el.btnSendMicrophone.on("click", function (event) {
			const _this = window.app;
			_this.el.recordMicrophone.show();
			this.hide();
			_this.startTimerMicrophone();
		});

		this.el.btnCancelMicrophone.on("click", (event) => {
			this.closeMicrophoneRec();
		});

		this.el.btnFinishMicrophone.on("click", (event) => {
			this.closeMicrophoneRec();
		});

		this.el.inputText.on("keypress", (event) => {
			if (event.key == "Enter" && !event.ctrlKey) {
				event.preventDefault();
				this.el.btnSend.click();
			}
		});

		this.el.inputText.on("keyup", (event) => {
			if (this.el.inputText.innerHTML.length) {
				this.el.inputPlaceholder.hide();
				this.el.btnSendMicrophone.hide();
				this.el.btnSend.show();
			} else {
				this.el.inputPlaceholder.show();
				this.el.btnSendMicrophone.show();
				this.el.btnSend.hide();
			}
		});

		this.el.btnEmojis.on("click", (event) => {
			this.el.panelEmojis.toggleClass("open");
		});

		this.el.panelEmojis.querySelectorAll(".emojik").forEach((emoji, i) => {
			emoji.on("click", (event) => {
				let img = this.el.imgEmojiDefault.cloneNode();
				img.dataset.unicode = emoji.dataset.unicode;
				img.style.cssText = emoji.style.cssText;
				img.alt = emoji.dataset.unicode;
				emoji.classList.forEach((className) => {
					img.addClass(className);
				});

				let cursor = window.getSelection();

				if (!cursor.focusNode || !(cursor.focusNode.id == "input-text")) {
					this.el.inputText.focus();
					cursor = window.getSelection();
				}

				let range = document.createRange();

				range = cursor.getRangeAt(0);
				range.deleteContents();

				let frag = document.createDocumentFragment();
				frag.appendChild(img);

				range.insertNode(frag);

				/* if (!cursor.focusNode || !(cursor.focusNode.id == "input-text")) {
					this.el.inputText.focus();
					cursor = window.getSelection();
				} */

				this.el.inputText.dispatchEvent(new Event("keyup"));
			});
		});

		this.el.btnSend.on("click", (event) => {
			console.log(this.el.inputText.innerHTML.replace("<div><br></div>", ""));
		});
	}

	startTimerMicrophone() {
		let start = Date.now();

		this.intervalMicrophone = setInterval(() => {
			this.el.recordMicrophoneTimer.innerHTML = Format.formartTime2Human(Date.now() - start);
		}, 100);
	}

	closeMicrophoneRec() {
		this.el.recordMicrophone.hide();
		this.el.btnSendMicrophone.show();

		clearInterval(this.intervalMicrophone);
	}

	closeAllMainPanels() {
		this.el.panelMessagesContainer.hide();
		this.el.panelCamera.removeClass("open");
		this.el.panelDocumentPreview.removeClass("open");
	}

	closeMenuAndDeleteEvent() {
		document.removeEventListener("click", this.closeMenuAndDeleteEvent);
		this.el.menuAttach.removeClass("open");
	}

	getElements() {
		document.querySelectorAll("[id]").forEach((element) => {
			this.el[Format.text2camelcase(element.id)] = element;
		});
	}

	hideAllLeftPanels() {
		this.el.panelAddContact.hide();
		this.el.panelEditProfile.hide();
	}
}

export { WhatsappController };
