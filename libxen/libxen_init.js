var loadjs = function(param) {
		var fileref=document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", param);
		document.getElementsByTagName('head')[0].appendChild(fileref);
		return true;
	}

loadjs(libxen_path+'/callbacks.js');
loadjs(libxen_path+'/db_callbacks.js');
loadjs(libxen_path+'/core.js');
loadjs(libxen_path+'/libxen.js');
loadjs(libxen_path+'/libxen_host.js');
loadjs(libxen_path+'/libxen_vm.js');
loadjs(libxen_path+'/libxen_task.js');
loadjs(libxen_path+'/libxen_other.js');
