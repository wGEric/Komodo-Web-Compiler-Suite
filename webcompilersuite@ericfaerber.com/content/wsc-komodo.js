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

	xtk.load('chrome://webcompilersuite/content/konsole.js');

	if (!ko.extensions) ko.extensions = {};
	if (!ko.extensions.wsc) ko.extensions.wsc = {};
	if (!ko.extensions.wsc.compilers) ko.extensions.wsc.compilers = {};

	ko.extensions.wsc.severity = {
		'INFO'	: 0,
		'WARN'	: 1,
		'ERROR'	: 2
	};

	ko.extensions.wsc.getBuffer = function() {
		return ko.views.manager.currentView.koDoc.buffer;
	};

	ko.extensions.wsc.setBuffer = function(data) {
		ko.views.manager.currentView.koDoc.buffer = data;

		return true;
	};

	ko.extensions.wsc.getSelection = function() {
			var view = ko.views.manager.currentView,
				scimoz = view.scintilla.scimoz;

			return scimoz.selText;
	};

	ko.extensions.wsc.setSelection = function(data) {
		var view = ko.views.manager.currentView,
				scimoz = view.scintilla.scimoz;

		/*scimoz.targetStart = scimoz.currentPos;
		scimoz.targetEnd = scimoz.anchor;
		scimoz.replaceTarget(data.length, data);*/

		scimoz.replaceSel(data);
	};

	ko.extensions.wsc.setNotification = function(prefix, tags, id, severity, description) {
		if (severity === ko.extensions.wsc.severity.WARN || severity === Components.interfaces.koINotification.SEVERITY_ERROR) {
			//ko.statusBar.AddMessage('[' + prefix + '] ' + description, id, 5000);
		}

		if (ko.notifications) {
			switch(severity) {
				case ko.extensions.wsc.severity.WARN:
					severity = Components.interfaces.koINotification.SEVERITY_WARNING;
				break;
				case ko.extensions.wsc.severity.ERROR:
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
	};

	ko.extensions.wsc.log = function(prefix, severity, description) {
			switch(severity) {
				case ko.extensions.wsc.severity.WARN:
					severity = konsole.S_WARNING;
				break;
				case ko.extensions.wsc.severity.ERROR:
					severity = konsole.S_ERROR;
				break;

				default:
					severity = konsole.S_OK;
				break;
			}

			var date = new Date().toString();
			konsole.writeln(date + ' [' + prefix + '] ' + description, severity);
			konsole.popup();
	};

	/**
	 * Adds compiler menus to a menu
	 *
	 * @param   {XULElement} parent Item to add the menus to
	 * @param   {Object} compilers Compilers containing the menu
	 *
	 * @returns void
	 */
	var addMenu = function(parent, compilers) {
		var parentId = parent.getAttribute('id');

		for(var j in compilers) {
			if (compilers.hasOwnProperty(j)) {
				var compiler = compilers[j];

				if (typeof compiler === 'object' && compiler.menu && compiler.menu.length > 0) {
					var menu = xtk.domutils.newElement('menu', {
						'label' : compiler.name,
						'id'	: parentId + '-' + compiler.id
					});

					var menupopup = document.createElement('menupopup');
					menu.appendChild(menupopup);

					for(var i = 0; i < compiler.menu.length; i++) {
						var menuItem = compiler.menu[i];

						if (menuItem.nodeName === 'menuitem') {
							menupopup.appendChild(menuItem);
						}
					}

					parent.appendChild(menu);
				}
			}
		}
	};

	/**
	 * Sets up the menus
	 *
	 * @returns void
	 */
	var onLoad = function() {
		var compilers = ko.extensions.wsc.compilers,
			contextMenu = document.getElementById('wsc-context-menu-popup');

		addMenu(contextMenu, compilers);
	};

	// add observer for when the ui has started to start the extension
	var wsc_observer = {
		observe: function(subject, topic, data) {
			if (topic == "komodo-ui-started") {
				onLoad();
			}
		}
	};

	var obsSvc = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	obsSvc.addObserver(wsc_observer, 'komodo-ui-started', false);
})();
