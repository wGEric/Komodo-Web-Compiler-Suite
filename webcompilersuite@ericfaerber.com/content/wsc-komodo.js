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
	xtk.load('chrome://webcompilersuite/content/classes/compiler.js');

	if (!ko.extensions) ko.extensions = {};
	if (!ko.extensions.wsc) ko.extensions.wsc = {};
	if (!ko.extensions.wsc.compilers) ko.extensions.wsc.compilers = {};

	ko.extensions.wsc.registerCompiler = function(id, compiler) {
		ko.extensions.wsc.compilers[id] = compiler;
		ko.extensions.wsc.addMenus(compiler);
	};

	/**
	 * Adds compiler menus to a menu
	 *
	 * @param   {XULElement} parent Item to add the menus to
	 * @param   {Object} compilers Compilers containing the menu
	 *
	 * @returns void
	 */
	ko.extensions.wsc.addMenus = function(compiler) {
		var parent = document.getElementById('wsc-context-menu-popup'),
			parentId = parent.getAttribute('id');

		if (typeof compiler === 'object' && compiler.menu && compiler.menu.length > 0) {
			var menu = xtk.domutils.newElement('menu', {
				'label' : compiler.name,
				'id'	: parentId + '-' + compiler.id + 'Menu'
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
	};
})();
