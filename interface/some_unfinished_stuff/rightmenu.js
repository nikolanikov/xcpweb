function xcp_Menu() {
	var bw=document.getElementById&&!document.all;
	var winm;
	var prgm;
	var param;
	var attr;
	var oname;
	var fobj;
	var self = this;
	this.openedForFiles = new Array();
	this.openedForObjects = false;
	this.menuopen = new Array();
	this.menubeforeopen = new Array();
	this.winm = false;
	this.mousedown = function(e) {
		fobj = bw ? e.target : event.srcElement;
		self.checkforopenmenu(e,fobj);
	}
	this.checkforopenmenu = function(e,fobj) {
		if (self.winm && typeof(self.winm) == 'object') {
			if (!fobj.getAttribute('submenu')) {
				var menuid;
				if (menuid = self.getMainMenuId(fobj)) {
					self.dropMenu(menuid.substr(5));
				}
				else if (menuid = self.getMainMenuId(self.winm)) {
					self.dropMenu(menuid.substr(5));
				}

			}
			else {
				var menuid = self.getMainMenuId(fobj);
				if (document.getElementById(menuid)) {
					var menuObj = document.getElementById(menuid);
					var menuObjLeft = tplf.findPosX(menuObj);
					if (menuObjLeft > menuObj.offsetWidth) {
						var mx = bw ? e.clientX : event.clientX;
						menuObj.style.left = (menuObjLeft-(menuObj.offsetWidth - 15))+'px';
					}
				}
			}
		}
		if (fobj.getAttribute('menuclick') && self.isEnabled(fobj)) {
			if (fobj.tagName == 'INPUT' && fobj.type == 'checkbox') {
				fobj.checked = !fobj.checked;
			}
			else {
				var obj = self.getMenuId(fobj);
				if (typeof(obj) == 'string' && document.getElementById(obj)) {
					self.changeCheckBox(obj);
				}
			}
			eval(fobj.getAttribute('menuclick'));
		}
	}
	this.openRightMenu = function(winm,e,param) {
		if (!document.getElementById(winm)) { return false; }
		var mx = bw ? e.clientX : event.clientX;
		var my = bw ? e.clientY : event.clientY;
		self.winm = document.getElementById(winm);
		if (!param) {
			self.winm.style.left=mx+"px";
			self.winm.style.top=my+"px";
		}
		self.winm.style.display="block";
		if (!param) {
			if (parseInt(navigator.appVersion)>3) {
				if (navigator.appName=="Netscape") {
					var winW = window.innerWidth;
					var winH = window.innerHeight;
				}
				if (navigator.appName.indexOf("Microsoft")!=-1) {
					var winW = document.body.scrollWidth;
					var winH = document.body.scrollHeight;
				}
			}
			if ((Number(self.winm.offsetLeft) + Number(self.winm.offsetWidth)) >= winW) {
				self.winm.style.left = Number(self.winm.offsetLeft) - Number(self.winm.offsetWidth)+'px';
			}
			if ((Number(self.winm.offsetTop) + Number(self.winm.offsetHeight)) >= winH) {
				self.winm.style.top = Number(winH) - Number(self.winm.offsetHeight)+'px';
			}
		}
	}

	
	var menuobj;
	var menupos;
	var menuname;
	var menuclick;
	var menuicon;
	this.isMenu = function(param) {
		if (document.getElementById('menu_'+param)) { return true; }
		else { return false; }
	}
	this.getMenu = function(param) {
		if (self.isMenu(param)) { return document.getElementById('menu_'+param); }
		else { return false; }
	}
	this.isInMenu = function(menuobj,param) {
		if (!menuobj) { return false; }
		if (typeof(menuobj) == 'object') {
			var mname = self.getMainMenuId(menuobj);
			if (!mname) { return false; }
			if (document.getElementById(mname+'_'+param)) { return true; }
			else { return false; }
		}
		return false;
	}
	this.getInMenu = function(menuobj,param) {
		if (!menuobj) { return false; }
		if (typeof(menuobj) == 'object') {
			var mname = self.getMainMenuId(menuobj);
			if (!mname) { return false; }
			if ((menuobj.className && menuobj.className == 'sub') || menuobj.tagName == 'DIV') {
				menuobj = menuobj.getElementsByTagName('UL');
				if (menuobj.length) { menuobj = menuobj[0]; }
				else { return false; }
			}
			for (i=0;i<menuobj.childNodes.length;i++) {
				if (menuobj.childNodes[i].id && menuobj.childNodes[i].id == mname+'_'+param) {
					return menuobj.childNodes[i];
				}
			}
			return false;
		}
		else { return false; }
	}
	this.getMainMenuId = function(menuobj) {
		if (!menuobj) { return false; }
		if (menuobj.className && menuobj.className == 'rightmenu') { return menuobj.id; }
		while (menuobj.tagName != undefined && menuobj.tagName != 'HTML' && menuobj.tagName != 'HEAD' && menuobj.tagName != 'BODY' && menuobj.parentNode) {
			menuobj = menuobj.parentNode;
			if (menuobj.className && menuobj.className == 'rightmenu') { return menuobj.id; break; }
		}
		return false;
	}
	this.getMenuId = function(menuobj) {
		if (!menuobj) { return false; }
		if (menuobj.tagName && menuobj.tagName == 'LI') { return menuobj.id; }
		while (menuobj.tagName != undefined && menuobj.tagName != 'HTML' && menuobj.tagName != 'HEAD' && menuobj.tagName != 'BODY' && menuobj.parentNode) {
			menuobj = menuobj.parentNode;
			if (menuobj.tagName && menuobj.tagName == 'LI') { return menuobj.id; break; }
		}
		return false;
	}
	this.createMenu = function(param) {
		if (!self.isMenu(param)) {
			var divmenu = document.createElement('DIV');
			divmenu.className = 'rightmenu';
			divmenu.setAttribute('id','menu_'+param);
			var ulmenu = document.createElement('UL');
			ulmenu.setAttribute('id','ul_'+param);
			divmenu.appendChild(ulmenu);
			document.getElementById('submenus').appendChild(divmenu);
			return ulmenu;
		}
		else { return false; }
	}
	this.dropMenu = function(param) {
		if (self.isMenu(param)) {
			var obj = self.getMenu(param);
			obj.parentNode.removeChild(obj);
			obj = undefined;
			return true;
		}
		else { return false; }
	}
	this.appendInMenu = function(menuobj,param,menuname,menuclick,menuicon,menupos) {
		if (typeof(menuobj) != 'object') { return false; }
		if (self.isInMenu(menuobj,param)) { return true; }
		if ((menuobj.className && menuobj.className == 'sub') || menuobj.tagName == 'DIV') {
			menuobj = menuobj.getElementsByTagName('UL');
			if (menuobj.length) { menuobj = menuobj[0]; }
			else { return false; }
		}
		var mname = self.getMainMenuId(menuobj);
		if (!mname) { return false; }
		var newmenu = document.createElement('li');
		newmenu.setAttribute('id',mname+'_'+param);
		newmenu.setAttribute('main','yes');
		if (menuclick) { newmenu.setAttribute('menuclick',menuclick); }
		var mico = document.createElement('span');
		mico.className = 'menu-ico';
		if (menuicon) {
			if (menuicon != 'checkbox' && menuicon != 'null') {
				var icoimg = document.createElement('IMG');
				icoimg.setAttribute('src',menuicon);
				icoimg.setAttribute('border','0');
				var ailink = document.createElement('A');
				ailink.style.cursor = 'pointer';
				ailink.setAttribute('id',mname+'_'+param);
				ailink.className = 'right-menu-'+param;
				if (menuclick) { mico.setAttribute('menuclick',menuclick); icoimg.setAttribute('menuclick',menuclick); ailink.setAttribute('menuclick',menuclick); }
				ailink.appendChild(icoimg);
				mico.appendChild(ailink);
			}
			else {
				if (menuicon == 'checkbox') {
					var icoimg = document.createElement('INPUT');
					icoimg.setAttribute('type',menuicon);
					icoimg.checked = true;
					icoimg.setAttribute('classname',menuicon);
					icoimg.setAttribute('id','checkbox_'+mname+'_'+param);
					if (menuclick) { mico.setAttribute('menuclick',menuclick); icoimg.setAttribute('menuclick',menuclick); }
					mico.appendChild(icoimg);
				}
				if (menuicon == 'null') {
					mico.innerHTML = '&nbsp';
				}
			}
		}
		newmenu.appendChild(mico);
		var alink = document.createElement('A');
		if (menuclick) { alink.setAttribute('menuclick',menuclick); }
		alink.style.cursor = 'pointer';
		alink.setAttribute('id',mname+'_'+param);
		alink.className = 'right-menu-'+param;
		alink.innerHTML = menuname;
		newmenu.appendChild(alink);
		if (menupos && menupos <= menuobj.childNodes.length) {
			menuobj.insertBefore(newmenu,menuobj.childNodes[menupos - 1]);
		}
		else { menuobj.appendChild(newmenu); }
		return newmenu;
	}

	this.appendSubInMenu = function(menuobj,param,menuname,menuicon,menupos) {
		if (typeof(menuobj) != 'object') { return false; }
		if (self.isInMenu(menuobj,param)) { return true; }
		if ((menuobj.className && menuobj.className == 'sub') || menuobj.tagName == 'DIV') {
			menuobj = menuobj.getElementsByTagName('UL');
			if (menuobj.length) { menuobj = menuobj[0]; }
			else { return false; }
		}
		var mname = self.getMainMenuId(menuobj);
		if (!mname) { return false; }
		var newmenu = document.createElement('li');
		newmenu.setAttribute('id',mname+'_'+param);
		newmenu.setAttribute('main','yes');
		newmenu.className = 'sub';
		var mico = document.createElement('span');
		mico.className = 'menu-ico-sub';
		if (menuicon) {
			if (menuicon == 'null') {
				mico.innerHTML = '&nbsp';
			}
			else {
				var icoimg = document.createElement('IMG');
				icoimg.setAttribute('src',menuicon);
				icoimg.setAttribute('border','0');
				icoimg.setAttribute('submenu','yes');
				mico.appendChild(icoimg);
			}
		}
		mico.setAttribute('submenu','yes');
		newmenu.appendChild(mico);

		var alink = document.createElement('A');
		alink.style.cursor = 'pointer';
		alink.setAttribute('submenu','yes');
		alink.innerHTML = menuname;
		newmenu.appendChild(alink);
		var subul = document.createElement('UL');
		newmenu.appendChild(subul);
		newmenu.setAttribute('submenu','yes');
		if (menupos && menupos <= menuobj.childNodes.length) {
			menuobj.insertBefore(newmenu,menuobj.childNodes[menupos - 1]);
		}
		else { menuobj.appendChild(newmenu); }
		return subul;
	}
	this.dropInMenu = function(menuobj,param) {
		if (typeof(menuobj) != 'object') { return false; }
		if (!self.isInMenu(menuobj,param)) { return true; }
		if ((menuobj.className && menuobj.className == 'sub') || menuobj.tagName == 'DIV') {
			menuobj = menuobj.getElementsByTagName('UL');
			if (menuobj.length) { menuobj = menuobj[0]; }
			else { return false; }
		}
		var mname = self.getMainMenuId(menuobj);
		if (!mname) { return false; }
		for (i = 0;i<menuobj.childNodes.length;i++) {
			if (menuobj.childNodes[i].tagName == 'LI' && menuobj.childNodes[i].id == mname+'_'+param) {
				menuobj.removeChild(menuobj.childNodes[i]);
				return true;
				break;
			}
		}
		return false;
	}
	this.isEnabled = function(menuobj) {
		if (typeof(menuobj) == 'object' && menuobj.getAttribute('menuclick')) {
			while(!menuobj.getAttribute('main')) {
				menuobj = menuobj.parentNode;
			}
			if (menuobj.getAttribute('disabled')) { return false; }
			return true;
		}
		return false;
	}
	this.enableMenu = function(menuobj) {
		if (typeof(menuobj) == 'object') {
			var elms = menuobj.getElementsByTagName('A');
			if (elms.length) {
				for (var i=0;i<elms.length;i++) {
					elms[i].style.color = "#000000";
				}
			}
			menuobj.style.color="#000000";
			if (menuobj.getAttribute('disabled')) {
				menuobj.removeAttribute('disabled');
			}
		}
	}
	this.changeCheckBox = function(param,attr) {
		if (typeof(param) != 'string' || !document.getElementById(param)) { return false; }
		var chb = self.getCheckBox(param);
		if (!chb) { return false; }
		if (typeof(attr) == 'undefined') {
			chb.checked = !chb.checked;
		}
		else { chb.checked = attr; }
	}
	this.getCheckBox = function(param) {
		if (typeof(param) != 'string' || !document.getElementById(param)) { return false; }
		if (document.getElementById('checkbox_'+param)) {
			return document.getElementById('checkbox_'+param);
		}
	}
	this.disableMenu = function(menuobj) {
		if (typeof(menuobj) == 'object') {
			var elms = menuobj.getElementsByTagName('A');
			if (elms.length) {
				for (var i=0;i<elms.length;i++) {
					elms[i].style.color = "#b1b1b1";
				}
			}
			menuobj.style.color="#b1b1b1";
			menuobj.setAttribute('disabled','yes');
		}
	}
	this.uploadMenu = false;
	this.openUploadMenu = function() {
		if (self.uploadMenu) { document.getElementById('uploadmenu').style.display = 'none'; }
		else { document.getElementById('uploadmenu').style.display = 'block'; }
		self.uploadMenu = !self.uploadMenu;
	}
}
var xcp_menu = new xcp_Menu();
function xcp_Functions() {
	var self = this;
	var param;
	var attr;

	var objElement;
	var strClass;
	var binMayAlredyExists;
	this.HasClassName = function(objElement, strClass) {
		if ( objElement.className ) {
			var arrList = objElement.className.split(' ');
			var strClassUpper = strClass.toUpperCase();
			for ( var i = 0; i < arrList.length; i++ ) {
				if ( arrList[i].toUpperCase() == strClassUpper ) {
					return true;
				}
			}
		}
		return false;
	}
	this.addClassName = function(objElement, strClass, blnMayAlreadyExist) {
		if ( objElement.className ) {
			var arrList = objElement.className.split(' ');
			if ( blnMayAlreadyExist ) {
				var strClassUpper = strClass.toUpperCase();
				for ( var i = 0; i < arrList.length; i++ ) {
					if ( arrList[i].toUpperCase() == strClassUpper ) {
						arrList.splice(i, 1);
						i--;
					}
				}
			}
			arrList[arrList.length] = strClass;
			objElement.className = arrList.join(' ');
		}
		else {
			objElement.className = strClass;
		}
	}
	this.removeClassName = function(objElement, strClass) {
		if ( objElement.className ) {
			var arrList = objElement.className.split(' ');
			var strClassUpper = strClass.toUpperCase();
			for ( var i = 0; i < arrList.length; i++ ) {
				if ( arrList[i].toUpperCase() == strClassUpper ) {
					arrList.splice(i, 1);
					i--;
				}
			}
			objElement.className = arrList.join(' ');
		}
	}
	this.findPos = function(fobj) {
		if (typeof(fobj) != 'object') { return [0,0]; }
		var curleft = curtop = 0;
		if (fobj.offsetParent) {
			curleft = fobj.offsetLeft
			curtop = fobj.offsetTop
			while (fobj = fobj.offsetParent) {
				curleft += fobj.offsetLeft
				curtop += fobj.offsetTop
			}
		}
		return [curleft,curtop];
	}
	this.findPosX = function(fobj) {
		if (typeof(fobj) != 'object') { return 0; }
		if (navigator.appName == 'Microsoft Internet Explorer' || navigator.appName == 'Opera' || navigator.appName == 'Netscape') {
			return fobj.offsetLeft;
		}
		if (navigator.userAgent.indexOf('Chrome') > -1) {
			return fobj.offsetLeft;
		}
		var curleft = 0;
		if(fobj.offsetParent)
		while(1) {
			curleft += fobj.offsetLeft;
			if(!fobj.offsetParent)
			break;
			fobj = fobj.offsetParent;
		}
		else if(fobj.x)
		curleft += fobj.x;
		return curleft;
	}
	this.findPosY = function(fobj) {
		if (typeof(fobj) != 'object') { return 0; }
		if (navigator.appName == 'Microsoft Internet Explorer' || navigator.appName == 'Opera' || navigator.appName == 'Netscape') {
			return fobj.offsetTop;
		}
		if (navigator.userAgent.indexOf('Chrome') > -1) {
			return fobj.offsetTop;
		}
		var curtop = 0;
		if(fobj.offsetParent)
		while(1) {
			  curtop += fobj.offsetTop;
			  if(!fobj.offsetParent)
			  break;
			  fobj = fobj.offsetParent;
		}
		else if(fobj.y)
		curtop += fobj.y;
		return curtop;
	}
}
var tplf = new xcp_Functions();
document.onmousedown = xcp_menu.mousedown;