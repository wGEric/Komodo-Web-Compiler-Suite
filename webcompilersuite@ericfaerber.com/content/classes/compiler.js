/**
 * Web Compiler Suite
 *
 * Copyright (C) 2012 Eric Faerber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function() {
	if (!ko.extensions) ko.extensions = {};
	if (!ko.extensions.wsc) ko.extensions.wsc = {};
	if (!ko.extensions.wsc.classes) ko.extensions.wsc.classes = {};

	ko.extensions.wsc.classes.Compiler = function() { return this; };
	ko.extensions.wsc.classes.Compiler.prototype = {
		/**
		 * ID for the compiler
		 */
		id : '',

		/**
		 * Name of the compiler
		 */
		name : '',

		/**
		 * Contains the menu items for the compiler
		 */
		menu : [],

		/**
		 * Severity of messages/notifications
		 */
		severity : {
			'INFO'	: 0,
			'WARN'	: 1,
			'ERROR'	: 2
		},

		/**
		 * Gets the contents of the current buffer
		 *
		 * @returns {String} Contents of the current buffer
		 */
		getBuffer : function() {
			return ko.views.manager.currentView.koDoc.buffer;
		},

		/**
		 * Change the content of the current buffer
		 *
		 * @param   {String} data Content to set the current buffer to
		 */
		setBuffer : function(data) {
			ko.views.manager.currentView.koDoc.buffer = data;
		},

		/**
		 * Gets the current selection in the buffer
		 *
		 * @returns {String} Contents of what the user has selected
		 */
		getSelection : function() {
				var view = ko.views.manager.currentView,
					scimoz = view.scintilla.scimoz;

				return scimoz.selText;
		},

		/**
		 * Changes the contents of the current selection
		 *
		 * @param   {String} data Content to change the current selection to
		 */
		setSelection : function(data) {
			var view = ko.views.manager.currentView,
					scimoz = view.scintilla.scimoz;

			scimoz.replaceSel(data);
		},

		/**
		* Help method to set notifications
		*
		* @param   {String} message
		* @param   {Int} severity
		*/
		notify : function(message, severity) {
			this.setNotification(this.name, [this.name], this.id + '_notification', severity, message);

			if (severity === this.severity.ERROR || severity === this.severity.WARN) {
				this.log(this.name, severity, message);
			}
		},

		/**
		 * Adds a notification to the notifications pane
		 *
		 * @param   {String} prefix      Goes before the message
		 * @param   {Array} tags         Tags for the notification
		 * @param   {String} id          The id for the notification. Can be used to change the same notification multiple times.
		 * @param   {int} severity    	 The severity of the notification
		 * @param   {String} description The message
		 */
		setNotification : function(prefix, tags, id, severity, description) {
			if (ko.notifications) {
				switch(severity) {
					case this.severity.WARN:
						severity = Components.interfaces.koINotification.SEVERITY_WARNING;
					break;
					case this.severity.ERROR:
						severity = Components.interfaces.koINotification.SEVERITY_ERROR;
					break;
					default:
						severity = Components.interfaces.koINotification.SEVERITY_INFO;
					break;
				}

				ko.notifications.add(prefix, tags, id, {
					'severity' : severity,
					'description' : description
				});
			}
		},

		/**
		 * Writes to the command output
		 *
		 * @param   {String} prefix      Text that goes before the message
		 * @param   {int} severity    	 Severity of the message. Used to style the output.
		 * @param   {String} description The message
		 */
		log : function(prefix, severity, description) {
			switch(severity) {
				case this.severity.WARN:
					severity = konsole.S_WARNING;
				break;
				case this.severity.ERROR:
					severity = konsole.S_ERROR;
				break;
				default:
					severity = konsole.S_OK;
				break;
			}

			var date = new Date().toString();
			konsole.writeln(date + ' [' + prefix + '] ' + description, severity);
			konsole.popup();
		}
	};
})();
