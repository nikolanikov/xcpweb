var param;


//Loag menu images
templates.LoadImage('/interface/img/menu_terminal.png');
templates.LoadImage('/interface/img/menu_reboot.png');
templates.LoadImage('/interface/img/menu_stats.png');
templates.LoadImage('/interface/img/menu_shutdown.png');
templates.LoadImage('/interface/img/menu_settings.png');
templates.LoadImage('/interface/img/menu_operations.png');
templates.LoadImage('/interface/img/server.png');
templates.LoadImage('/interface/img/plus_big.png');

function Cloud_Pool_VM_box()
{
var self = this;
var is_hidden = 0;

	this.show_hide = function()
	{
	if(is_hidden)
		{
		document.getElementById('vm_show_hide').src='/interface/img/minus_big.png';
		document.getElementById('vm_show_hide').style.top='-3px';
		document.getElementById('vm_box_content').style.display='';
		is_hidden=0;
		}
	else
		{
		document.getElementById('vm_show_hide').src='/interface/img/plus_big.png';
		document.getElementById('vm_show_hide').style.top='3px';
		document.getElementById('vm_box_content').style.display='none';		
		is_hidden=1;
		}
	}
	
	this.create_non_resident_host_table = function()
	{
	var pool = document.createElement('table');
	pool.width='100%';
	pool.id='pool_non_resident_vms';
	var y=document.getElementById('pool_server').insertRow(-1).insertCell(0);
	y.colSpan=5;
	y.appendChild(pool);
	
	return pool;
	}
	
	this.addHost = function(id,params)
	{
	var x=document.getElementById('pool_server').insertRow(-1);
	
	var pool = document.createElement('table');
	pool.width='100%';
	pool.id='pool_'+id;
	var y=document.getElementById('pool_server').insertRow(-1).insertCell(0);
	y.colSpan=5;
	y.appendChild(pool);
		
	var tempcell;
	x.className="pool_server_tr";
	x.id=id;
	x.onclick = function(e) {cp_submenus.host(id,e);}
	tempcell=x.insertCell(0);
	tempcell.className="img";
	tempcell.innerHTML='<img src="/interface/img/server.png" />';
	
	tempcell=x.insertCell(1);
	tempcell.className="server_name";
	tempcell.innerHTML=params['name_label'];
	
	tempcell=x.insertCell(2);
	tempcell.className="server_description";
	tempcell.innerHTML=params['name_description'];
	
	tempcell=x.insertCell(3);
	tempcell.className="memory_usage";
	tempcell.innerHTML='<div class="memory_usage_text">Memory Usage : </div><div id="Bar"><div style="float: left; height: 10px; padding: 0; background-image: url(/interface/img/bar.png); width: '+((parseInt(params['memory_free'])/parseInt(params['memory_total']))*100)+'px;" /></div></div><div class="memory_usage_text"> '+params['memory_free']+'M / '+params['memory_total']+'M</div>';
	
	tempcell=x.insertCell(4);
	tempcell.className="cpu_usage";
	tempcell.innerHTML='<div class="memory_usage_text">CPU Usage : </div><div id="Bar"><div style="float: left; height: 10px; padding: 0; background-image: url(/interface/img/bar.png); width: '+parseInt(params['cpu_usage'])+'px;" /></div></div><div class="memory_usage_text"> '+params['cpu_usage']+'%</div>';
	
	return pool;
	}
	
	this.addVM = function(id,params,host_table)
	{
	var x=host_table.insertRow(-1);
	var tempcell;
	var memory_percent=0;
	x.className="vm_row";
	x.id=id;
	x.onclick = function(e) {cp_submenus.vm(id,e);}
	tempcell=x.insertCell(0);
	tempcell.className="vm_row_status";
	if(params['power_state']=='Running')tempcell.innerHTML='<img src="/interface/img/running.png" style="position:relative;padding-left:3px;padding-right:3px;" />'; 
	else if(params['power_state']=='Halted')tempcell.innerHTML='<img src="/interface/img/stopped.png" style="position:relative;padding-left:3px;padding-right:3px;" />'; 
	else if(params['power_state']=='Paused')tempcell.innerHTML='<img src="/interface/img/paused.png" style="position:relative;padding-left:3px;padding-right:3px;" />'; 
	else tempcell.innerHTML='<img src="/interface/img/stopped.png" style="position:relative;padding-left:3px;padding-right:3px;" />';
	
	tempcell=x.insertCell(1);
	tempcell.className="vm_row_name";
	tempcell.innerHTML=params['name_label'];
	
	tempcell=x.insertCell(2);
	tempcell.className="vm_row_description";
	tempcell.innerHTML=params['name_description'];
	if(parseInt(params['max_memory'])>0)memory_percent=((parseInt(params['memory_total'])/parseInt(params['max_memory']))*100);
	tempcell=x.insertCell(3);
	tempcell.className="vm_row_memory";
	tempcell.innerHTML='<div class="memory_usage_text">Memory Usage : </div><div id="Bar"><div style="float: left; height: 10px; padding: 0; background-image: url(/interface/img/bar.png); width: '+memory_percent+'px;" /></div></div><div class="memory_usage_text"> '+params['memory_total']+'M</div>';
	
	tempcell=x.insertCell(4);
	tempcell.className="vm_row_cpus cpus_count";
	tempcell.innerHTML='CPU Count: '+params['vm_cpus_count'];
	
	tempcell=x.insertCell(5);
	tempcell.className="vm_row_cpus cpus_weight";
	tempcell.innerHTML='Weight: '+params['vm_cpus_weight'];
	
	tempcell=x.insertCell(6);
	tempcell.className="vm_row_cpus cpus_cap";
	tempcell.innerHTML='Cap: '+params['vm_cpus_cap'];
	
	return x;
	}
	
	this.createConsole = function (width,height,url,session,title)
	//function (640,500,url,session)
	{
	var msie=0;
	var consolestuff='';
	if (navigator.browserName=="Microsoft Internet Explorer")
	{
	msie=1;
	}
	
	if(msie)
	{
	consolestuff += '<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" type="application/x-java-applet" width="'+width+'",height="'+height+'">';
	consolestuff += '<param name="code" value="com.citrix.xenserver.console.Initialize">';
	}
	else 
	{
	consolestuff += '<object height="'+height+'" width="'+width+'" classid="java:com.citrix.xenserver.console.Initialize.class" type="application/x-java-applet" archive="XenServerConsole.jar">';
	consolestuff += '<param name="code" value="com.citrix.xenserver.console.Initialize.class">';
	}	
		consolestuff += '<param name="ipaddress" value="127.0.0.1"><param name="archive" value="XenServerConsole.jar"><param name="scriptable" value="false"><param name="password" value="none"><param name="port" value="5900"><param name="useurl" value="true"><param name="backcolor" value="ff:ff:ff">';
		consolestuff += '<param name="url" value="'+url+'">';
		consolestuff += '<param name="session" value="'+session+'">';
		consolestuff += '</object>';
 
	popup.create(url,title,consolestuff);
	}
	
	this.initBox = function()
	{
	if(main_buttons.active!='cloud_pool_button')return true;
	self.clearBox();
	//non resident
	var non_resident=xen_get_vm_list_non_resident();
	if(non_resident.length>0)
	{
		var non_resident_table_id=self.create_non_resident_host_table();
		for ( var vm_id in non_resident ) // every vm
		{ 
		var current_vm=xen_vm_get_details(non_resident[vm_id]);
		current_vm['max_memory']=0;
		self.addVM(non_resident[vm_id],current_vm,non_resident_table_id);
		}
	}
	
	//resident
	 var vm_pool=xen_get_vm_list_hosts();
	 for ( var server_id in vm_pool )
	 {
	 vm_pool[server_id]['table_id']=self.addHost(server_id,vm_pool[server_id]);
	
		for ( var vm_id in vm_pool[server_id]['resident_VMs'] ) // every vm
		{ 
		var current_vm=xen_vm_get_details(vm_pool[server_id]['resident_VMs'][vm_id]);
		current_vm['max_memory']=vm_pool[server_id]['memory_total'];
		self.addVM(vm_pool[server_id]['resident_VMs'][vm_id],current_vm,vm_pool[server_id]['table_id']);
		}
	
	 }
	
	
	}
	
	this.clearBox = function()
	{
	var x=document.getElementById('pool_server');
	for(var i=x.rows.length-1;i>=0;i--)x.deleteRow(i);
	}

}

var cp_vm_box = new Cloud_Pool_VM_box();
xen_register_db_event('vm',cp_vm_box.initBox);

function Cloud_Pool_submenus()
{

this.vm = function(param,e)
	{
	if (xcp_menu.getMenu(param)) { xcp_menu.dropMenu(param); }
	var allowed_operations=xen_vm_get_allowed_operations(param);
	var power_state=xen_vm_get_power_state(param);
	var console_stuff=xen_vm_get_console(param);
	var possible_hosts=xen_vm_get_possible_hosts(param);
	var possible_hosts_label=new Array();
	var possible_hosts_num = 0;
	var vm_details=xen_vm_get_details(param);
	
	for (var i in possible_hosts) {
	possible_hosts_num++;
	possible_hosts_label[i]=xen_host_get_name_label(possible_hosts[i]);
	}

	
	var currentMenu = xcp_menu.createMenu(param);
	if (typeof(currentMenu) == 'object') {
		if(console_stuff)xcp_menu.appendInMenu(currentMenu,'console','Console',"cp_vm_box.createConsole(640,420,'"+console_stuff['location']+"','"+console_stuff['session_id']+"','Console : "+vm_details['name_label']+"')",'/interface/img/menu_terminal.png');
		var subcurrent = xcp_menu.appendSubInMenu(currentMenu,'oprations','Operations','/interface/img/menu_operations.png');
		if (typeof(subcurrent) == 'object') {
			if(power_state=='Running' && possible_hosts_num)
				{
				var submigrate = xcp_menu.appendSubInMenu(subcurrent,'migrate_on','Migrate On','/interface/img/menu_arrow.png');
					if (typeof(submigrate) == 'object') {
						for(var host in possible_hosts)
						{
						xcp_menu.appendInMenu(submigrate,possible_hosts[host],possible_hosts_label[host],"xen_vm_pool_migrate('"+param+"','"+possible_hosts[host]+"');",'/interface/img/server.png');
						}
					}
				}
			if(power_state=='Halted' && possible_hosts_num)
				{
				var substart = xcp_menu.appendSubInMenu(subcurrent,'start_on','Start On','/interface/img/menu_start.png');
					if (typeof(substart) == 'object') {
						for(var host in possible_hosts)
						{
						xcp_menu.appendInMenu(substart,possible_hosts[host],possible_hosts_label[host],"xen_vm_start_on('"+param+"','"+possible_hosts[host]+"');",'/interface/img/server.png');
						}
					}
				}
			if(power_state=='Suspended' && possible_hosts_num)
				{
				var subresume = xcp_menu.appendSubInMenu(subcurrent,'resume_on','Resume On','/interface/img/menu_start.png');
					if (typeof(subresume) == 'object') {
						for(var host in possible_hosts)
						{
						xcp_menu.appendInMenu(subresume,possible_hosts[host],possible_hosts_label[host],"xen_vm_resume_on('"+param+"','"+possible_hosts[host]+"');",'/interface/img/server.png');
						}
					}
				}
			
			for(var op_id in allowed_operations)
			{
			if(allowed_operations[op_id]=='clean_shutdown')xcp_menu.appendInMenu(subcurrent,'clean_shutdown','Shutdown',"xen_vm_clean_shutdown('"+param+"');",'/interface/img/menu_shutdown.png');
			if(allowed_operations[op_id]=='hard_shutdown')xcp_menu.appendInMenu(subcurrent,'hard_shutdown','Force Shutdown',"xen_vm_hard_shutdown('"+param+"');",'/interface/img/menu_shutdown.png');
			if(allowed_operations[op_id]=='clean_reboot')xcp_menu.appendInMenu(subcurrent,'clean_reboot','Reboot',"xen_vm_clean_reboot('"+param+"');",'/interface/img/menu_reboot.png');
			if(allowed_operations[op_id]=='hard_reboot')xcp_menu.appendInMenu(subcurrent,'hard_reboot','Force Reboot',"xen_vm_hard_reboot('"+param+"');",'/interface/img/menu_reboot.png');
			if(allowed_operations[op_id]=='pause')xcp_menu.appendInMenu(subcurrent,'pause','Pause',"xen_vm_pause('"+param+"');",'/interface/img/menu_pause.png');
			if(allowed_operations[op_id]=='unpause')xcp_menu.appendInMenu(subcurrent,'pause','UnPause',"xen_vm_unpause('"+param+"');",'/interface/img/menu_pause.png');
			if(allowed_operations[op_id]=='resume')xcp_menu.appendInMenu(subcurrent,'resume','Resume',"xen_vm_resume('"+param+"');",'/interface/img/menu_resume.png');
			if(allowed_operations[op_id]=='suspend')xcp_menu.appendInMenu(subcurrent,'suspend','Suspend',"xen_vm_suspend('"+param+"');",'/interface/img/menu_shutdown.png');
			if(allowed_operations[op_id]=='start')xcp_menu.appendInMenu(subcurrent,'start','Start',"xen_vm_start('"+param+"');",'/interface/img/menu_start.png');
			if(allowed_operations[op_id]=='destroy')xcp_menu.appendInMenu(subcurrent,'destroy','Destroy',"xen_vm_destroy('"+param+"');",'/interface/img/close.png');
			}
		}
		xcp_menu.appendInMenu(currentMenu,'graphics','Statistics',"",'/interface/img/menu_stats.png');
		xcp_menu.appendInMenu(currentMenu,'settings','Settings',"",'/interface/img/menu_settings.png');
		xcp_menu.openRightMenu('menu_'+param,e);
		}
	}
	
this.host = function(param,e)
	{
	//the param is the host ref
	var allowed_operations=xen_host_get_allowed_operations(param);
	var console_stuff=xen_host_get_console(param);
	var host_details=xen_host_get_details(param);
	
	if (xcp_menu.getMenu(param)) { xcp_menu.dropMenu(param); }
	var currentMenu = xcp_menu.createMenu(param);
	if (typeof(currentMenu) == 'object') {
		//test
		/*
		allowed_operations.push('evacuate');
		allowed_operations.push('shutdown');
		allowed_operations.push('reboot');
		*/
		if(console_stuff)xcp_menu.appendInMenu(currentMenu,'console','Console',"cp_vm_box.createConsole(640,420,'"+console_stuff['location']+"','"+console_stuff['session_id']+"','Console : "+host_details['name_label']+"')",'/interface/img/menu_terminal.png');
		for(var op_id in allowed_operations)
		{
		if(allowed_operations[op_id]=='evacuate')xcp_menu.appendInMenu(currentMenu,'evacuate','Evacuate',"xen_host_evacuate('"+param+"');",'/interface/img/menu_arrow.png');
		if(allowed_operations[op_id]=='shutdown')xcp_menu.appendInMenu(currentMenu,'shutdown','Shutdown',"xen_host_shutdown('"+param+"');",'/interface/img/menu_shutdown.png');
		if(allowed_operations[op_id]=='reboot')xcp_menu.appendInMenu(currentMenu,'reboot','Reboot',"xen_host_reboot('"+param+"');",'/interface/img/menu_reboot.png');
		}
		xcp_menu.appendInMenu(currentMenu,'disable','Disable',"xen_host_disable('"+param+"');",'/interface/img/menu_missing.png');
		xcp_menu.appendInMenu(currentMenu,'enable','Enable',"xen_host_enable'("+param+"');",'/interface/img/menu_missing.png');
		xcp_menu.appendInMenu(currentMenu,'settings','Settings',"alert('Settings');",'/interface/img/menu_settings.png');
		xcp_menu.openRightMenu('menu_'+param,e);
		}
	}
	
}

var cp_submenus = new Cloud_Pool_submenus();

//Load the template

templates.LoadTemplate(interface_path+'/templates/cloud_pool.html','main_content',cp_vm_box.initBox);

