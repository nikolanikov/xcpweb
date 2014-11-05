function FileTabs() {
	var self = this;
	var tempTab = false;
	this.clear = function() { tempTab = true; }
	this.construct = function(tabId) {
		var tbl = document.createElement('TABLE');
		tbl.className = 'tabs';
		tbl.setAttribute('tabList','yes');
		tbl.setAttribute('id',tabId);
		tbl.setAttribute('cellpadding',0);
		tbl.setAttribute('cellspacing',0);
		tbl.insertRow(0);
		tempTab = tbl;
		return tempTab;
	}
	this.getTr = function(param) { return param ? param.rows[0] : false; }
	this.getDom = function() { return tempTab; }
	this.append = function(tabAlias,tabName,onclickEvent,temp) {
		if (!temp) { temp = tempTab; }
		var tr = self.getTr(temp);
		var cl = tr.insertCell(tr.cells.length);
		var div = document.createElement('DIV');
		div.className = 'tabBg';
		cl.appendChild(div);
		cl.setAttribute('nowrap','nowrap');
		cl.setAttribute('tabAlias',tabAlias);
		var a = document.createElement('A');
		a.onclick = function() {
			tabs.activate(this.parentNode.parentNode);
			onclickEvent();
		}
		a.appendChild(document.createTextNode(tabName));
		div.appendChild(a);
		tempTab = temp;
		return tempTab;
	}
	this.activate = function(param) {
		var tr = param;
		while (tr = tr.parentNode) {
			if (tr.tagName == 'TR') { break; }
		}
		for (var i=0,len=tr.cells.length;i<len;i++) { tr.cells[i].className = 'singleTab'; }
		param.className = 'activeTab';
	}
	this.activateByAlias = function(alias,temp) {
		if (!temp) { return false; }
		var tr = self.getTr(temp);
		for (var i=0,len=tr.cells.length;i<len;i++) {
			if (tr.cells[i].getAttribute('tabAlias') == alias) {
				tr.cells[i].className = 'activeTab';
			}
			else { tr.cells[i].className = 'singleTab'; }
		}
	}
}
var tabs = new FileTabs();