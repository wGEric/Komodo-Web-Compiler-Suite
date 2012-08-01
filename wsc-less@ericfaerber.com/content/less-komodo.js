/**
 * LESS Compiler for Web Complier Suite
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

	xtk.load('chrome://wsc-less/content/less.min.js');

	if (!ko.extensions) ko.extensions = {};
	if (!ko.extensions.wsc) ko.extensions.wsc = {};
	if (!ko.extensions.wsc.compilers) ko.extensions.wsc.compilers = {};

	/**
	 * The LESS Compiler extensions
	 */
	var lessCompiler = (function() {
		var _self = this;

		this.id = 'lessMenu';
		this.name = 'LESS';
		this.menu = [];

		/**
		 * Compiles a file
		 *
		 * @returns void
		 */
		this.compileFile = function() {
			setNotification("Compiling file.");

			var buffer = ko.extensions.wsc.getBuffer();


			setNotification("File compiled successfully.");
		};

		/**
		 * Compiles the current buffer
		 *
		 * @returns void
		 */
		this.compileBuffer = function() {
			setNotification("Compiling buffer.");

			var buffer = ko.extensions.wsc.getBuffer();

			_self._compileStr(buffer, function(css) {
				ko.extensions.wsc.setBuffer(css);

				setNotification("Buffer compiled successfully.");
			});
			
		};

		/**
		 * Compiles the current selection
		 *
		 * @returns void
		 */
		this.compileSelection = function() {
			setNotification("Compiling selection.");

			var selection = ko.extensions.wsc.getSelection();
			
			_self._compileStr(selection, function(css) {
				ko.extensions.wsc.setSelection(css);
	
				setNotification("Selection compiled successfully.");
			});
		};
		
		/**
		 * Compiles a string
		 * 
		 * @param   {String} str      
		 * @param   {Function} callback
		 * 
		 * @returns void
		 */
		this._compileStr = function(str, compress, callback) {
			if (typeof compress === "function") {
				callback = compress;
				compress = false;
			}

			var parser = new(less.Parser);

			try {
				parser.parse(str, function (err, tree) {
					if (err) {
						setNotification(err.message, ko.extensions.wsc.severity.ERROR);
					} else if (typeof callback === "function") {
						callback.call(_self, tree.toCSS());
					}
				});
			} catch (err) {
				setNotification("Error compiling", ko.extensions.wsc.severity.ERROR);
				ko.extensions.wsc.log(_self.name, ko.extensions.wsc.severity.ERROR, "Line: " + err.line + "    Column: " + err.column);
				ko.extensions.wsc.log(_self.name, ko.extensions.wsc.severity.ERROR, err.message);
			}
		};

		/**
		 * Add the menus
		 */
		// compile file menu
		var menuItemCompileFile = xtk.domutils.newElement('menuitem', {
			'label'	: 'Compile File',
			'class'	: 'menu-iconic-wide'
		});
		menuItemCompileFile.onclick = this.compileFile;
		this.menu.push(menuItemCompileFile);

		// compile buffer menu
		var menuItemCompileBuffer = xtk.domutils.newElement('menuitem', {
			'label'	: 'Compile Buffer',
			'class'	: 'menu-iconic-wide'
		});
		menuItemCompileBuffer.onclick = this.compileBuffer;
		this.menu.push(menuItemCompileBuffer);

		// compile selection menu
		var menuItemCompileSelection = xtk.domutils.newElement('menuitem', {
			'label'	: 'Compile Selection',
			'class'	: 'menu-iconic-wide'
		});
		menuItemCompileSelection.onclick = this.compileSelection;
		this.menu.push(menuItemCompileSelection);

		/**
		 * Help method to set notifications
		 *
		 * @param   {String} message
		 * @param   {Int} severity
		 *
		 * @returns void
		 */
		function setNotification(message, severity) {
			ko.extensions.wsc.setNotification(_self.name, [_self.name], _self + '_notification', severity, message);

			if (severity === ko.extensions.wsc.severity.ERROR || severity === ko.extensions.wsc.severity.WARN) {
				ko.extensions.wsc.log(_self.name, severity, message);
			}
		}

		return this;
	})();

	/**
	 * Register the compiler
	 */
	ko.extensions.wsc.compilers.less = lessCompiler;
})();
