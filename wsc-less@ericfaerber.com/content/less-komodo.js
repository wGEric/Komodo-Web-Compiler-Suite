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

	var lessCompiler = new ko.extensions.wsc.classes.Compiler();

	lessCompiler.id = 'less';
	lessCompiler.name = 'LESS';

	/**
	 * Compiles a file
	 *
	 * @returns void
	 */
	lessCompiler.compileFile = function() {
		lessCompiler.notify("Compiling file.");

		var buffer = lessCompiler.getBuffer();


		lessCompiler.notify("File compiled successfully.");
	};

	/**
	 * Compiles the current buffer
	 *
	 * @returns void
	 */
	lessCompiler.compileBuffer = function() {
		lessCompiler.notify("Compiling buffer.");

		var buffer = lessCompiler.getBuffer();

		lessCompiler._compileStr(buffer, function(css) {
			lessCompiler.setBuffer(css);

			lessCompiler.notify("Buffer compiled successfully.");
		});

	};

	/**
	 * Compiles the current selection
	 *
	 * @returns void
	 */
	lessCompiler.compileSelection = function() {
		lessCompiler.notify("Compiling selection.");

		var selection = lessCompiler.getSelection();

		lessCompiler._compileStr(selection, function(css) {
			lessCompiler.setSelection(css);

			lessCompiler.notify("Selection compiled successfully.");
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
	lessCompiler._compileStr = function(str, compress, callback) {
		if (typeof compress === "function") {
			callback = compress;
			compress = false;
		}

		var parser = new(less.Parser);

		try {
			parser.parse(str, function (err, tree) {
				if (err) {
					lessCompiler.notify(err.message, lessCompiler.severity.ERROR);
				} else if (typeof callback === "function") {
					callback.call(lessCompiler, tree.toCSS());
				}
			});
		} catch (err) {
			lessCompiler.notify("Error compiling", lessCompiler.severity.ERROR);
			lessCompiler.log(lessCompiler.name, lessCompiler.severity.ERROR, "Line: " + err.line + "    Column: " + err.column);
			lessCompiler.log(lessCompiler.name, lessCompiler.severity.ERROR, err.message);
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
	menuItemCompileFile.onclick = lessCompiler.compileFile;
	lessCompiler.menu.push(menuItemCompileFile);

	// compile buffer menu
	var menuItemCompileBuffer = xtk.domutils.newElement('menuitem', {
		'label'	: 'Compile Buffer',
		'class'	: 'menu-iconic-wide'
	});
	menuItemCompileBuffer.onclick = lessCompiler.compileBuffer;
	lessCompiler.menu.push(menuItemCompileBuffer);

	// compile selection menu
	var menuItemCompileSelection = xtk.domutils.newElement('menuitem', {
		'label'	: 'Compile Selection',
		'class'	: 'menu-iconic-wide'
	});
	menuItemCompileSelection.onclick = lessCompiler.compileSelection;
	lessCompiler.menu.push(menuItemCompileSelection);

	var registerLess = function() {
		/**
		* Register the compiler
		*/
		ko.extensions.wsc.lessCompiler = lessCompiler;

		ko.extensions.wsc.registerCompiler('less', lessCompiler);
	};

	var obsSvc = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	var wsc_observer = {
		observe: function(subject, topic, data) {
			if (topic == "komodo-ui-started") {
				registerLess();
				obsSvc.removeObserver(wsc_observer, 'komodo-ui-started');
			}
		}
	};

	obsSvc.addObserver(wsc_observer, 'komodo-ui-started', false);
})();
