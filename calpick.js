/*
	calpick.js

	JavaScript DHMTL Kalenderauswahl. Erzeugt einen klickbaren Button
	hinter Eingabefeldern, �ber die mit einem Office-�hnlichen Kalender
	das Datum ausgew�hlt werden kann, dass dann dort eingetragen wird.

	Version 0.6 - die aktuelle Version gibt's immer unter
	http://flocke.vssd.de/prog/code/js/calpick/

	Copyright (C) 2005, 2006, 2007 Volker Siebert <flocke@vssd.de>
	Alle Rechte vorbehalten.

	Permission is hereby granted, free of charge, to any person obtaining a
	copy of this software and associated documentation files (the "Software"),
	to deal in the Software without restriction, including without limitation
	the rights to use, copy, modify, merge, publish, distribute, sublicense,
	and/or sell copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
	DEALINGS IN THE SOFTWARE.
*/

// Customizable variables =====================================================
var _calDateFormat     = 'DMY';	// order of date components (this is fixed! you cannot change it here!)
var _calDateSeparator  = '.';	// date component separator
var _calDateYearDigits = 4;		// number of year digits
var _calDateFirstDay   = 1;		// first day of week (0 = sunday, 1 = monday)
var _calMonthName      = new Array('Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli',
                                   'August', 'September', 'Oktober', 'November', 'Dezember');
var _calDayName        = new Array('So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa');

var _calStrOpenClose   = 'Klicken &ouml;ffnet den Kalender';
var _calStrPrevMonth   = 'Gehe einen Monat zur&uuml;ck';
var _calStrCurMonth    = 'Gehe zum aktuellen Monat';
var _calStrNextMonth   = 'Gehe einen Monat weiter';

// Display & behaviour settings
if (typeof window._calImageAlign == 'undefined')
	var _calImageAlign   = window._calButtonAlign ? window._calButtonAlign : 'bottom';
if (typeof window._calImageStyle == 'undefined')
	var _calImageStyle   = '';
if (typeof window._calFontFace == 'undefined')
	var _calFontFace     = 'Tahoma';// font to use, separate alternatives by ","
if (typeof window._calFontSize == 'undefined')
	var _calFontSize     = 11;		// font size in px
if (typeof window._calCellWidth == 'undefined')
	var _calCellWidth    = 22;		// cell width in px
if (typeof window._calCellHeight == 'undefined')
	var _calCellHeight   = 18;		// cell height in px
if (typeof window._calBorderAdj == 'undefined')
	var _calBorderAdj    = 1;		// set to 1 if border increases width/height (CSS for HTML >=4.01)
if (typeof window._calLeftDistance == 'undefined')
	var _calLeftDistance = 4;		// horizontal offset from calendar picture
if (typeof window._calTopDistance == 'undefined')
	var _calTopDistance  = 4;		// vertical offset from top-of-line
if (typeof window._calHideDelay == 'undefined')
	var _calHideDelay    = 10000; // 1500;	// delay before auto-hide (ms)

if (typeof window._calColorWindow == 'undefined')
	var _calColorWindow       = 'window';
if (typeof window._calColorWindowText == 'undefined')
	var _calColorWindowText   = 'windowtext';
if (typeof window._calColorGrayText == 'undefined')
	var _calColorGrayText     = 'buttonface';
if (typeof window._calColorWindowFrame == 'undefined')
	var _calColorWindowFrame  = 'windowframe';
if (typeof window._calColorButtonFace == 'undefined')
	var _calColorButtonFace   = 'buttonface';
if (typeof window._calColorButtonText == 'undefined')
	var _calColorButtonText   = 'buttontext';
if (typeof window._calColorButtonLight == 'undefined')
	var _calColorButtonLight  = 'buttonhighlight';
if (typeof window._calColorButtonShadow == 'undefined')
	var _calColorButtonShadow = 'buttonshadow';
if (typeof window._calColorSelected == 'undefined')
	var _calColorSelected     = 'highlight';
if (typeof window._calColorSelectedText == 'undefined')
	var _calColorSelectedText = 'highlighttext';
if (typeof window._calColorCurrentFrame == 'undefined')
	var _calColorCurrentFrame = '#CC0000';

// Local constants & variables
if (typeof window._calPickDir == 'undefined')
	var _calPickDir  = 'template/inc_js/calpick/';   // +KH for phpwcms
var _calCalImageSrc  = 'calbutton.gif';
var _calPrevImageSrc = 'calprev.gif';
var _calNextImageSrc = 'calnext.gif';
var _calClrImageSrc  = 'calclear.gif';
var _calDaysPerMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

var _calGenId		 = 0;
var _calActiveObject = null;
var _calHiddenBoxes  = new Array();

// Calculated styles
var _calTotalWidth    = 2 + 7 * _calCellWidth;
var _calTotalHeight   = 2 + 8 * _calCellHeight;
var _calAdjCellWidth  = _calCellWidth - 2 * _calBorderAdj;
var _calAdjCellHeight = _calCellHeight - 2 * _calBorderAdj;
var _calStyleFont = 'font-family:' + _calFontFace + ',sans-serif; ' +
	'font-size:' + _calFontSize + 'px; ' +
	'cursor:default; text-align:center; ';
// Customizable variables ====END==============================================

// Helper functions
function _calFixYear(year) {
	return (year < 999) ? year + 1900 : year;
}
function _calMonthDays(year, month) {
	if (month != 2) return _calDaysPerMonth[month - 1];
	if ((year % 400 != 0) && (year % 4 != 0 || year % 100 == 0))
		return _calDaysPerMonth[month - 1];
	return 29;
}
function _calDateEquals(date, year, month, day) {
	return (date != null)
		&& (_calFixYear(date.getYear()) == year)
		&& (date.getMonth() + 1 == month)
		&& (date.getDate() == day);
}
function _calParseDate(text, curDate) {
	if (text.match(/^\s*([0-9]{1,2})\s*\.\s*([0-9]{1,2})\s*\.\s*([0-9]{2,4})\s*$/)) {
		var day = parseInt(RegExp.$1, 10);
		var mon = parseInt(RegExp.$2, 10);
		var year = parseInt(RegExp.$3, 10);

		if (year < 100) {
			// Get current year and century
			var cyear = _calFixYear(curDate.getYear());
			var century = cyear - cyear % 100;
			// Sliding window of (-90,+9) around the current year
			year += century;
			if (year >= cyear + 10)
				year -= 100;
		}

		if ((1 <= mon && mon <= 12) && (1 <= day && day <= _calMonthDays(year, mon)))
			return new Date(year, mon - 1, day);
	}
	if (text.match(/^\s*([0-9]{1,2})\s*\.\s*([0-9]{1,2})\s*\.?\s*$/)) {
		var day = parseInt(RegExp.$1, 10);
		var mon = parseInt(RegExp.$2, 10);
		var year = _calFixYear(curDate.getYear());

		if ((1 <= mon && mon <= 12) && (1 <= day && day <= _calMonthDays(year, mon)))
			return new Date(year, mon - 1, day);
	}
	if (text.match(/^\s*([0-9]{1,2})\s*\.?\s*$/)) {
		var day = parseInt(RegExp.$1, 10);
		var mon = curDate.getMonth() + 1;
		var year = _calFixYear(curDate.getYear());

		if ((1 <= mon && mon <= 12) && (1 <= day && day <= _calMonthDays(year, mon)))
			return new Date(year, mon - 1, day);
	}
	if (!text.match(/^\s*$/))
		alert(_calErrInvalidDate + ': "' + text + '"');

	return null;
}
// Hovering
function _calHoverN1(cell) { cell.style.backgroundColor = _calColorButtonFace; return true; }
function _calHoverN0(cell) { cell.style.backgroundColor = _calColorWindow; return true; }
function _calHoverC1(cell) { cell.style.backgroundColor = _calColorButtonFace; return true; }
function _calHoverC0(cell) { cell.style.backgroundColor = _calColorWindow; return true; }
function _calHoverS1(cell) { cell.style.backgroundColor = _calColorButtonShadow; return true; }
function _calHoverS0(cell) { cell.style.backgroundColor = _calColorSelected; return true; }
function _calHoverB1(cell) {
	cell.style.borderTop = '1px solid ' + _calColorButtonLight;
	cell.style.borderRight = '1px solid ' + _calColorButtonShadow;
	cell.style.borderBottom = '1px solid ' + _calColorButtonShadow;
	cell.style.borderLeft = '1px solid ' + _calColorButtonLight;
	return true;
}
function _calHoverB0(cell) {
	cell.style.border = '1px solid ' + _calColorButtonFace;
	return true;
}
// Hiding & Showing select boxes (IE only)
function _calRestoreSelectLists() {
	while (_calHiddenBoxes.length > 0) {
		_calHiddenBoxes[_calHiddenBoxes.length - 1].style.visibility = 'visible';
		_calHiddenBoxes.pop();
	}
}
function _calHideSelectLists(divName) {
	function GetRealTop(thisObj) {
		return thisObj.offsetTop + ((thisObj.tagName != 'BODY' && thisObj.tagName != 'HTML')
			? GetRealTop(thisObj.offsetParent) : 0);
	}
	function GetRealLeft(thisObj) {
		return thisObj.offsetLeft + ((thisObj.tagName != 'BODY' && thisObj.tagName != 'HTML')
			? GetRealLeft(thisObj.offsetParent) : 0);
	}
	if (navigator.appName != 'Microsoft Internet Explorer')
		return;
	var calDiv = document.getElementById(divName);
	for (var f = 0; f < document.forms.length; f++) {
		var form = document.forms[f];
		for (var e = 0; e < form.elements.length; e++) {
			var elem = form.elements[e];
			// Skip those not of interest
			if (typeof elem.type != 'string') continue;
			if (elem.type.substr(0, 6) != 'select') continue;
			if (elem.style.visibility == 'hidden') continue;
			// Check vertical position
			var elemTop = GetRealTop(elem);
			if (elemTop >= calDiv.offsetTop + _calTotalHeight) continue;
			if (elemTop + elem.offsetHeight <= calDiv.offsetTop) continue;
			// Check horizontal position
			var elemLeft = GetRealLeft(elem);
			if (elemLeft >= calDiv.offsetLeft + _calTotalWidth) continue;
			if (elemLeft + elem.offsetWidth <= calDiv.offsetLeft) continue;
			// Ok, hide it but remember it
			_calHiddenBoxes.push(elem);
			elem.style.visibility = 'hidden';
		}
	}
}
// Hide the active calendar on clicking anywhere outside it
function _calHideOnClick() {
	if (_calActiveObject != null)
		_calActiveObject.showCalendar(false);
}
// Will be bound to span#xxx_Cal.onclick to prevent the above
// function from being called when clicking inside the calendar
function _calPreventClick(event) {
	event = event || window.event || {};
	if (event.preventDefault)
		event.preventDefault();
	else
		event.returnValue = false;
	if (event.stopPropagation)
		event.stopPropagation();
	else
		event.cancelBubble = true;
	return false;
}
// Returns the html for a single pixel table row
function _calGetPixelRowHtml(color) {
	var html = '';
	html += '<tr style="background-color:' + color + '">';
	for (var k = 0; k < 7; k++)
		html += '<td><img src="' + _calPickDir + _calClrImageSrc + '" width="'
			+ _calCellWidth + '" height="1" alt=""/></td>';
	html += '</tr>';
	return html;
}
// Member functions of the CalenderObject
// Returns the inner html to display the current month
function _calGetInnerHtml() {
	var startYear = this.displayYear;
	var startMonth = this.displayMonth;
	var startDay = 1;
	var numDays = _calMonthDays(startYear, startMonth);
	var event = 'self.' + this.name + '.selectDay';

	var startDate = new Date(startYear, startMonth - 1, 1);
	while (startDate.getDay() != _calDateFirstDay) {
		if (startDay == 1) {
			if (startMonth == 1) {
				startYear -= 1;
				startMonth = 12;
			}
			else
				startMonth -= 1;

			numDays = _calMonthDays(startYear, startMonth);
			startDay = numDays;
		}
		else
			startDay -= 1;

		startDate = new Date(startYear, startMonth - 1, startDay);
	}

	var eol = String.fromCharCode(13);
	var html = '<table border="0" cellspacing="0" cellpadding="0">' + eol;

	html += '<tr style="background-color:' + _calColorButtonShadow + '">' + eol;
	for (var k = 0; k < 7; k++)
		html += '<td><img src="' + _calPickDir + _calClrImageSrc + '" width="' +
				_calCellWidth + '" height="1" alt=""/></td>';
	html += '</tr>' + eol;

	do {
		html += '<tr>' + eol;
		for (var dom = 0; dom < 7; dom++) {
			if (startMonth != this.displayMonth)
				html += '<td style="' + _calStyleFont + 'color:' + _calColorGrayText
					+ '; width:' + _calCellWidth + 'px; height:' + _calCellHeight
					+ 'px;">' + startDay + '</td>' + eol;
			else {
				if (_calDateEquals(this.selDate, startYear, startMonth, startDay)) {
					var thisStyle = 'width:' + _calCellWidth + 'px; '
						+ 'height:' + _calCellHeight + 'px; '
						+ 'background-color:' + _calColorSelected + '; '
						+ 'color:' + _calColorSelectedText + '; font-weight:bold; ';
					var thisCode = 'S';
				}
				else if (_calDateEquals(this.curDate, startYear, startMonth, startDay)) {
					var thisStyle = 'width:' + _calAdjCellWidth + 'px; '
						+ 'height:' + _calAdjCellHeight + 'px; '
						+ 'font-weight:bold; border:1px solid ' + _calColorCurrentFrame + '; ';
					var thisCode = 'C';
				}
				else {
					var thisStyle = 'width:' + _calCellWidth + 'px; '
						+ 'height:' + _calCellHeight + 'px; ';
					var thisCode = 'N';
				}

				html += '<td style="' + _calStyleFont + thisStyle + '"'
					+ ' onmouseover="return _calHover' + thisCode + '1(this)"'
					+ ' onmouseout="return _calHover' + thisCode + '0(this)"'
					+ ' onclick="' + event + '(' + startDay + ')"'
					+ '">' + startDay + '</td>' + eol;
			}

			if (startDay < numDays)
				startDay += 1;
			else {
				if (startMonth < 12)
					startMonth += 1;
				else {
					startMonth = 1;
					startYear += 1;
				}

				startDay = 1;
				numDays = _calMonthDays(startYear, startMonth);
			}
		}
		html += '</tr>' + eol;
	}
	while (startMonth == this.displayMonth);

	return html + '</table>';
}
// Called when a day is clicked: the date is stored and the calendar closed
function _calSelectDay(day) {
	var dayPad = (day < 10) ? '0' : '';
	var monPad = (this.displayMonth < 10) ? '0' : '';
	var text = dayPad + day + '.' + monPad + this.displayMonth + '.' + this.displayYear;

	this.attachedControl.value = text;
	this.showCalendar(false);

	if (document.createEvent) {
		var e = document.createEvent("Events");
		e.initEvent('change', true, true);
		this.attachedControl.dispatchEvent(e);
	}
	else if (document.createEventObject) {
		var e = document.createEventObject();
		this.attachedControl.fireEvent('onchange', e);
	}
	else if (this.attachedControl.onchange)
		this.attachedControl.onchange();
}
// Refresh/clear the timer for automatic hiding
function _calHandleTimer(cancel) {
	var timerName = this.objPrefix + '_Timer';
	clearTimeout(self[timerName]);
	self[timerName] = null;
	if (!cancel)
		self[timerName] =
			setTimeout('self.' + this.name + '.showCalendar(false)', _calHideDelay);
}
// Fix the dynamic html portions to display the current month
function _calShowCurrent() {
	document.getElementById(this.objPrefix + '_Title').innerHTML =
		_calMonthName[this.displayMonth - 1] + ' ' + this.displayYear;
	document.getElementById(this.objPrefix + '_Days').innerHTML = this.getInnerHtml();
}
// Read the date from the attached input field
function _calSyncDate() {
	this.curDate = new Date();
	this.selDate = _calParseDate(this.attachedControl.value, this.curDate);
	var which = (this.selDate == null) ? this.curDate : this.selDate;
	this.displayMonth = which.getMonth() + 1;
	this.displayYear = _calFixYear(which.getYear());
}
// Shows or hides the calendar, showing=-1 toggles visibility
function _calShowCalendar(showing) {
	var cal = document.getElementById(this.objPrefix + '_Cal');
	var vis = !(cal.style.visibility != 'visible');
	if (showing == -1)
		showing = !vis;
	if (showing) {
		if (_calActiveObject != null && _calActiveObject != this)
			_calActiveObject.showCalendar(false);
		if (this.saveClick == null)
			this.saveClick = document.onclick;
		document.onclick = _calHideOnClick;
		if (_calActiveObject == null) {
			_calActiveObject = this;
			_calHideSelectLists(this.objPrefix + '_Cal');
		}
		cal.style.zIndex = 100;
		cal.style.visibility = 'visible';
		this.syncDate();
		this.showCurrent();
	}
	else {
		cal.style.visibility = 'hidden';
		cal.style.zIndex = 99;
		if (_calActiveObject == this) {
			_calRestoreSelectLists();
			document.onclick = this.saveClick;
			this.saveClick = null;
			_calActiveObject = null;
		}
	}
	this.handleTimer(!showing);
}
// Returns the html for the left/right navigation buttons
function _calGetNaviButtonHtml(method, title, pic) {
	return '<td style="' + _calStyleFont + 'color:'
		+ _calColorButtonText + '; border:1px solid ' + _calColorButtonFace
		+ '; height:' + _calAdjCellHeight + 'px;"'
		+ ' onmouseover="return _calHoverB1(this)"'
		+ ' onmouseout="return _calHoverB0(this)"'
		+ ' onclick="self.' + this.name + '.' + method + '"'
		+ ' ondblclick="self.' + this.name + '.' + method + '"'
		+ ' title="' + title + '">'
		+ '<img src="' + _calPickDir + pic + '"'
		+ ' border="0" alt="" title="' + title + '"/>'
		+ '</td>';
}
// Returns the outer html for the calendar box
function _calGetOuterHtml() {
	var eol = String.fromCharCode(13);
	var prefix = this.objPrefix;
	var name = 'self.' + this.name;
	var html = '';

	html += '<span id="' + prefix + '_Cal" style="background-color:' + _calColorWindow
		+ '; color:' + _calColorWindowText + '; border:1px solid ' + _calColorWindowFrame
		+ '; margin-left:' + _calLeftDistance + 'px; margin-top:' + _calTopDistance
		+ 'px; position:absolute; ' + 'visibility:hidden;"' + eol
		+ ' onmouseover="' + name + '.handleTimer(true)"'
		+ ' onmouseout="' + name + '.handleTimer(false)">';
	html += '<table border="0" cellspacing="0" cellpadding="0">' + eol;
	html += '<tr style="background-color:' + _calColorButtonFace + '; color:'
		+ _calColorButtonText + ';">' + eol;
	html += this.getNaviButtonHtml('prevMonth()', _calStrPrevMonth, _calPrevImageSrc);
	html += '<td id="' + prefix + '_Title" style="' + _calStyleFont + 'color:'
		+ _calColorButtonText + '; border:1px solid '
		+ _calColorButtonFace + '; height:' + _calAdjCellHeight + 'px;"'
		+ ' onmouseover="return _calHoverB1(this)"'
		+ ' onmouseout="return _calHoverB0(this)"'
		+ ' onclick="' + name + '.curMonth()"'
		+ ' title="' + _calStrCurMonth + '" colspan="5">?</td>' + eol;
	html += this.getNaviButtonHtml('nextMonth()', _calStrNextMonth, _calNextImageSrc);
	html += '</tr>' + eol;
	html += _calGetPixelRowHtml(_calColorWindow) + eol;
	html += '<tr valign="middle">' + eol;
	for (var k = 0; k < 7; k++)
		html += '<td style="' + _calStyleFont + 'width:' + _calCellWidth + 'px; height:'
			+ _calCellHeight + 'px;"><b>'
			+ _calDayName[(k + _calDateFirstDay) % 7] + '</b></td>' + eol;
	html += '</tr>' + eol;
	html += _calGetPixelRowHtml(_calColorWindow) + eol;
	html += '</table>';
	html += '<span id="' + prefix + '_Days">?</span>';
	html += '</span>';
	return html;
}
// Show the specified month
function _calShowMonth(month, year) {
	if (year == 0) year = this.displayYear;
	if (year == 1) year = _calFixYear(this.curDate.getYear());
	while (month <  1) { year -= 1; month += 12; }
	while (month > 12) { year += 1; month -= 12; }
	if (year < 1000) year = 1000;
	if (year > 2999) year = 2999;
	if (this.displayYear != year || this.displayMonth != month) {
		this.displayYear = year;
		this.displayMonth = month;
		this.showCurrent();
	}
	this.handleTimer(true);
}
// Create a new calender object
function CalenderObject(control) {
	// Properties
	this.attachedControl = control;
	this.objPrefix = 'cal_' + (++_calGenId);
	this.name = this.objPrefix + '_Obj';
	this.saveClick = null;
	// Methods
	this.syncDate = _calSyncDate;
	this.getInnerHtml = _calGetInnerHtml;
	this.getOuterHtml = _calGetOuterHtml;
	this.getNaviButtonHtml = _calGetNaviButtonHtml;
	this.showCurrent = _calShowCurrent;
	this.selectDay = _calSelectDay;
	this.showCalendar = _calShowCalendar;
	this.handleTimer = _calHandleTimer;
	this.showMonth = _calShowMonth;
	// Short methods
	this.toggleCalendar = function(event) {
		_calPreventClick(event);
		this.calenderObject.showCalendar(-1);
		return false;
	}
	this.prevMonth = function() { this.showMonth(this.displayMonth - 1, 0); }
	this.nextMonth = function() { this.showMonth(this.displayMonth + 1, 0); }
	this.curMonth = function() { this.showMonth(this.curDate.getMonth() + 1, 1); }
	// Initialization
	this.syncDate();
}
// Create the image code for the calender and attach it to the control
function AttachCalendarButton(obj) {
	if (obj == null || obj == 'undefined')
		return;
	// Create new calender object
	var calObj = new CalenderObject(obj);
	self[calObj.name] = calObj;
	// Write button plus initially hidden table code
	var html = '<img id="' + calObj.objPrefix + '_Pic" border="0" '
		+ 'src="' + _calPickDir + _calCalImageSrc + '" '
		+ 'style="cursor:pointer;' + _calImageStyle + '" ';
	if (_calImageAlign)
		html += 'align="' + _calImageAlign + '" ';
	html += 'alt="' + _calStrOpenClose + '" title="' + _calStrOpenClose + '"/>';
	document.write(html);
	document.write(calObj.getOuterHtml());
	document.getElementById(calObj.objPrefix + '_Pic').calenderObject = calObj;
	document.getElementById(calObj.objPrefix + '_Pic').onclick = calObj.toggleCalendar;
	document.getElementById(calObj.objPrefix + '_Cal').onclick = _calPreventClick;
}
