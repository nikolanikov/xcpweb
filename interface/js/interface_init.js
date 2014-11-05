function isINT(param)
{
   var ValidChars="0123456789";
   var isINT=1;

   for (i=0;i<param.length && isINT==1; i++)if(ValidChars.indexOf(param.charAt(i))==-1)isINT=0;
      
return isINT;
}

function templates_req() {
	var self = this;
	var xmldoc;
	var param;
	var url;
	var attr;

	var objElement;
	var strClass;
	var binMayAlredyExists;

	this.CreateHttpRequestObject = function(param) {
		if (!param) { param = 'text/xml'; }
		var http_request=false;
		if (window.XMLHttpRequest) {
			http_request = new XMLHttpRequest();
			if (http_request.overrideMimeType) { http_request.overrideMimeType(param); }
		}
		else if (window.ActiveXObject) {
			try {
				http_request = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e) {
				try {
					http_request = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e) {}
			}
		}
		return http_request;
	}
	this.LoadTemplate = function(url,put_id,onload) {
		var httpRequest=self.CreateHttpRequestObject();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState == 4) {
				if (httpRequest.status == 200) {
					document.getElementById(put_id).innerHTML=httpRequest.responseText;
					if(typeof(onload)!='undefined')onload();
				}
				else {
					if(httpRequest.status!=404) {
						setTimeout("templates.makeRequest('"+url+"','GET','','1')",5000);
					}
				}
			}
		};
		httpRequest.open('GET', url, '1');
		httpRequest.send();
	}
	this.LoadJS = function(param) {
		var fileref=document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", param);
		document.getElementsByTagName('head')[0].appendChild(fileref);
		return true;
	}
	this.LoadImage = function(img) {
	imageObj = new Image();
	imageObj.src=img;
	}
	this.LoadCSS = function(css) {
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('link');
		style.setAttribute('rel','stylesheet');
		style.setAttribute('href',css);
		style.setAttribute('type','text/css');
		style.setAttribute('media','all');
		head.appendChild(style);
	}
	// other functions
	this.select = function(fobj,varToSet)
	{
		var table;
		if(typeof(fobj)=='undefined') return false;
		if(typeof(fobj)=='string')fobj=document.getElementById(fobj);
		/*
		while(fobj.tagName!='TR' || fobj.tagName!='BODY')fobj=fobj.parentNode;
		if(fobj.tagName=='BODY') return false;
		*/
		table=fobj.parentNode;
		
		if(fobj.getAttribute('selectval') && typeof(varToSet)=='string')eval(varToSet+'="'+fobj.getAttribute('selectval')+'";');
				
		for(var i in table.rows)
			{
				if(isINT(i))
				{
				if(table.rows[i].getAttribute('selectval'))
				{
					table.rows[i].className='';
				}
				}
			}
			

	fobj.className='table_select';
		
		return fobj.getAttribute('selectval');
	}
	
	this.control_focus=function()
	{
		document.getElementById('control_focus').focus();
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
var templates = new templates_req();

//the sub menu part

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
					var menuObjLeft = templates.findPosX(menuObj);
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
	
}
var xcp_menu = new xcp_Menu();
// Popup Windows

function PopupWindow() {
	var bw=document.getElementById&&!document.all;
	var self = this;
	var resizeObj = false;
	var resize = false;
	var oresize = false;
	var drag = false;
	var path = '/interface/';
	var offx = 0;
	var offy = 0;
	var id=0;
	var created_windows = new Array();
	this.error_windows=0;
	this.mouseX = function(e) { return e ? Number(e.clientX) : Number(event.clientX); }
	this.mouseY = function(e) { return e ? Number(e.clientY) : Number(event.clientY); }
	
	this.create = function(id,titlebar,content,width,height) {
	var temp;
	var mainobj;
		
		if(created_windows[id])return false;
		created_windows[id]=1;
		
		var tpl = '<div id="window'+id+'" class="window" win="'+id+'" onmouseout="popup.backCursor(this,event)" onmouseover="popup.changeCursor(this,event);">';
		tpl += '<div class="win-titlebar" dragwin="window'+id+'">';
		tpl += '<div class="title" dragwin="window'+id+'">'+titlebar+'</div>';
		tpl += '<div class="close"><img onclick="popup.destroy(\''+id+'\');" src="'+path+'img/close.png" alt="" /></div>';
		tpl += '<div class="clear"></div>';
		tpl += '</div>';
		if(typeof(width)!='undefined' && typeof(height)!='undefined')tpl += '<div class="win-content" style="width:'+width+'px;height:'+height+'px;" id="resize-'+id+'">';
		else tpl += '<div class="win-content" id="resize-'+id+'">';
		tpl += '<div class="cnt" id="wincnt'+id+'"></div>';
		tpl += '<img class="corner" src="'+path+'img/corner.png" />';
		tpl += '</div>';
		tpl += '</div>';
		try {
			document.getElementById('popupwindows').innerHTML += tpl;
			if(typeof(content)=='undefined')return id;
			else if(typeof(content)=='object')document.getElementById('wincnt'+id).appendChild(content);
			else document.getElementById('wincnt'+id).innerHTML=content;
			
			temp=document.getElementById('window'+id);
			mainobj=document.getElementById('content');
			temp.style.left=templates.findPosX(mainobj)+'px';
			temp.style.top=templates.findPosY(mainobj)+'px';
			
			return id;
		}
		catch(e) { return false; }
		
		
	
	}
	
	this.create_error = function(titlebar,content) {
	var temp;
	var mainobj;
		self.error_windows++;
		id='error_'+self.error_windows;
		if(created_windows[id])return false;
		created_windows[id]=1;
		var tpl = '<div id="window'+id+'" class="window_error" win="'+id+'" onmouseout="popup.backCursor(this,event)" onmouseover="popup.changeCursor(this,event);">';
		tpl += '<div class="win-titlebar" dragwin="window'+id+'">';
		tpl += '<div class="title" dragwin="window'+id+'">'+titlebar+'</div>';
		tpl += '<div class="close"><img onclick="popup.destroy(\''+id+'\');" src="'+path+'img/close_grey.png" alt="" /></div>';
		tpl += '<div class="clear"></div>';
		tpl += '</div>';
		tpl += '<div class="win-content" id="resize-'+id+'">';
		tpl += '<div class="cnt" id="wincnt'+id+'"></div>';
		tpl += '<img class="corner" src="'+path+'img/corner.png" />';
		tpl += '</div>';
		tpl += '</div>';
		try {
			document.getElementById('popupwindows').innerHTML += tpl;
			if(typeof(content)=='undefined')return id;
			else if(typeof(content)=='object')document.getElementById('wincnt'+id).appendChild(content);
			else document.getElementById('wincnt'+id).innerHTML=content;

			temp=document.getElementById('window'+id);
			mainobj=document.getElementById('content');
			temp.style.left=templates.findPosX(mainobj)+'px';
			temp.style.top=templates.findPosY(mainobj)+'px';
			return id;
		}
		catch(e) { return false; }
		
		
	
	}
	
	this.destroy = function(win) {
		if (document.getElementById('window'+win)) {
			document.getElementById('window'+win).parentNode.removeChild(document.getElementById('window'+win));
		}
		if(created_windows[win])created_windows[win]=undefined;
	}
	this.mousedown = function(e) {
		var fobj = bw ? e.target : event.srcElement;
		if (!fobj) { return true; }
		if (fobj.getAttribute('dragwin')) {
			drag = document.getElementById(fobj.getAttribute('dragwin'));
			offx = (templates.findPosX(drag) - self.mouseX(e));
			offy = (templates.findPosY(drag) - self.mouseY(e));
			return false;
		}
		else {
			if (oresize) {
				self.startResize(fobj,e);
				return false;
			}
		}
		return true;
	}
	this.mousemove = function(e) {
		if (drag) {
			drag.style.top = (self.mouseY(e) + offy)+'px';
			drag.style.left = (self.mouseX(e) + offx)+'px';
			return false;
		}
		else {
			var fobj = bw ? e.target : event.srcElement;
			if (self.moveCursor(fobj,e)) { return true; }
		}
	}
	this.mouseup = function(e) {
		if (drag) { drag = false; return false; }
		if (resize) {
			var fobj = bw ? e.target : event.srcElement;
			self.stopResize(fobj,e);
			return false;
		}
		return true;
	}
	this.changeCursor = function(win,e) {
		if (!drag && !resize) {
			offx = Number(templates.findPosX(win) + Number(win.clientWidth));
			offy = Number(templates.findPosY(win) + Number(win.clientHeight));
			resizeObj = win;
		}
		else { resizeObj = false; }
	}
	this.moveCursor = function(win,e) {
		if (!drag && !resize && offy && offx && resizeObj) {
			var mx = self.mouseX(e);
			var my = self.mouseY(e);
			var eres = false,sres = false;
			if ((offy - my) < 15) { sres = true; }
			if ((offx - mx) < 15) { eres = true; }
			if (sres && eres) { resizeObj.style.cursor = 'se-resize'; oresize = 'se'; }
			else {
				if (sres) { resizeObj.style.cursor = 's-resize'; oresize = 's'; }
				else if (eres) { resizeObj.style.cursor = 'e-resize'; oresize = 'e'; }
				else {
					if (resizeObj) { resizeObj.style.cursor = ''; }
					oresize = false; resizeObj = false;
				}
			}
		}
		if (resize) {
			if (oresize == 'e' || oresize == 'se') {
				var mx = self.mouseX(e);
				resize.style.width = (mx - templates.findPosX(resize.parentNode)) + 'px';
			}
			if (oresize == 's' || oresize == 'se') {
				var my = self.mouseY(e);
				resize.style.height = ((my - templates.findPosY(resize.parentNode)) - 26) + 'px';
			}
			return true;
		}
		return false;
	}
	this.startResize = function(win,e) {
		if (oresize && resizeObj) { resize = document.getElementById('resize-'+resizeObj.getAttribute('win')); }
	}
	this.stopResize = function(win,e) {
		if (resize) { oresize = false; resize = false; resizeObj = false; }
	}
	this.backCursor = function(win) {
		if (resize || oresize) {
			win.style.cursor = '';
			offy = 0;
			offx = 0;
		}
	}
}
var popup = new PopupWindow();

//Tabs

function Tabs() {
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
var tabs = new Tabs();

//Events

document.onmousedown = function(e) {
var bw=document.getElementById&&!document.all;
var fobj = bw ? e.target : event.srcElement;
				xcp_menu.mousedown(e);
                popup.mousedown(e);
if (fobj.tagName == 'INPUT' || fobj.tagName == 'BUTTON' || fobj.tagName == 'A') {  return true; }

				return false; 
        }

document.onmousemove = popup.mousemove;
document.onmouseup = popup.mouseup;

//The Error Default handling



function error_callback_default(raw,xmldoc,param_pass)
{
var cur=xmldoc;
var error=0;
var title='';
var description='';
while(cur.nodeName!='struct' && typeof(cur.childNodes[0])!='undefined')cur=cur.childNodes[0];
if(cur.nodeName!='struct')error=1;

var par=cur;
for(var i in par.childNodes)
{
if(isINT(i))
{
if(par.childNodes[i].nodeName=='member')
	{
	cur=par.childNodes[i];
		if(typeof(cur)!='undefined')
		{
			if(cur.childNodes[0].childNodes[0].nodeValue=='Status')title=cur.childNodes[1].childNodes[0].nodeValue;
		}
		else error=1;
		
		if(typeof(cur)!='undefined')
		{
			if(cur.childNodes[0].childNodes[0].nodeValue=='ErrorDescription')
			{
			description='<h4>Error Description</h4><br />';
			cur=cur.childNodes[1].getElementsByTagName("value");
			for(var desc in cur)
			{
				if(isINT(desc))
				{
				try {description+=cur[desc].childNodes[0].nodeValue+'<br />';}catch(err){}
				}
			}
			}
		}
		else error=1;
		
	
	}
else error=1;
}
}

if(error==1)
	{
	title='Raw Error';
	description=raw;
	}
	
popup.create_error(title,description);
return ;
}


