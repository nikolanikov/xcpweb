function VM_Installation()
{
var self = this;
var done_steps=new Array(0,0,0,0,0);
var install_menu_table='installation_menu';
this.options=new Array();

this.make_active_step=function(step)
{
	var table=document.getElementById(install_menu_table);
	for(var i in table.rows)table.rows[i].className='menu_tr';
	table.rows[step].className='menu_tr_selected';
} 

this.fix_left_menu=function()
{	
	var menu=document.getElementById(install_menu_table);
	var last_unchecked=0;
	//make checked icons
	for(var i=0;i<done_steps.length && done_steps[i]!=0;i++)menu.rows[i+1].cells[0].innerHTML='<img src="/interface/img/checked.png" />';
	last_unchecked=i;
	for(;i<done_steps.length;i++)menu.rows[i+1].cells[0].innerHTML='';
	return last_unchecked;
}

this.init=function()
	{
	var last_unchecked;
	last_unchecked=self.fix_left_menu();	
	return;
	}

this.activate=function(step)
	{
		if(step==1)eval("install_vm.step_1()");
		else if(done_steps[step-1] || done_steps[step])eval('install_vm.step_'+step+'()');
		return true;
	}
//TODO: Steps memory
this.step_1=function()
	{
		//check for the required vars
		//some errors
		//if everything is ok invoke the step
		templates.LoadTemplate(interface_path+'/templates/create_new_step1.html','vm_content_td',install_vm.step_1_init);
		return true;
	}

this.step_1_init=function()
	{
		var template_types=new Object();
		var temp='';
		var template_type='';
		var template_name;
		var tempcell;
		var sorted_dists=new Array();
		var sorted_dists_types=new Array();
		self.options['memory']='';
		self.options['name_label']='';
		self.options['name_description']='';
		self.options['template_id']='';
		self.options['host']='';
		done_steps[0]=0;done_steps[1]=0;done_steps[2]=0;done_steps[3]=0;done_steps[4]=0;
		
		
		template_types['windows']='/interface/img/windows.png';
		template_types['centos']='/interface/img/centos.png';
		template_types['Red Hat']='/interface/img/redhat.png';
		template_types['suse']='/interface/img/suse.png';
		template_types['debian']='/interface/img/debian.png';
		template_types['oracle']='/interface/img/oracle.png';
		template_types['ubuntu']='/interface/img/ubuntu.png';
		template_types['fedora']='/interface/img/fedora.png';
		template_types['redhat']='/interface/img/redhat.png';
		template_types['rhel']='/interface/img/redhat.png';
		template_types['linux']='/interface/img/linux.png';
		template_types['template']='/interface/img/template_16.png';

		self.init();
		self.make_active_step(1);
	
	 //adding hosts
	 var pool=xen_get_vm_list_hosts();
	 for ( var server_id in pool )
	 {
		temp+='<option id="'+server_id+'" onClick="install_vm.options[\'host\']=\''+server_id+'\';install_vm.step_1_update_host_box(\''+server_id+'\');">'+pool[server_id]['name_label']+'</option>'
	 }
	 var host_servers=document.getElementById('host_servers');
	 host_servers.innerHTML=temp;
	 self.options['host']=host_servers.options[host_servers.selectedIndex].id;
	 self.step_1_update_host_box(host_servers.options[host_servers.selectedIndex].id);
	 
	 
	 var dist_list=xen_vm_get_templates();
	 for(var curtmpl in template_types)
		{
			for(var i in dist_list)
			{
			template_name=xen_vm_get_name_label(dist_list[i]);
			if(eval("template_name.search(/"+curtmpl+"/i);")>=0)
				{
				sorted_dists.push(dist_list[i]);
				sorted_dists_types.push(curtmpl);
				delete dist_list[i];
				}
			}
		}
	for(var i in dist_list)
			{
				sorted_dists.push(dist_list[i]);
				sorted_dists_types.push('template');
				delete dist_list[i];	
			}

	 
	 var dist_list_table=document.getElementById('dist_list');
	 for(var i in sorted_dists)
	 {
	 var x=dist_list_table.insertRow(-1);
	 x.id='dist_list_'+sorted_dists[i];
	 x.setAttribute('selectval',sorted_dists[i]);
	 x.onclick=function(e){
		var bw=document.getElementById&&!document.all;
		var fobj = bw ? e.target : event.srcElement;
			
			if(fobj!=null)
			{
			while(fobj!=null && fobj.tagName!='TR' && fobj.tagName!='BODY')fobj=fobj.parentNode;
			}
			
			self.options['template_id']=templates.select(fobj);
			
			}
			
	 template_name=xen_vm_get_name_label(sorted_dists[i]);
	 
	 
	 tempcell=x.insertCell(0);
	 tempcell.className='icon';
	 tempcell.innerHTML='<img src="'+template_types[sorted_dists_types[i]]+'" />';
	 
	 tempcell=x.insertCell(1);
	 tempcell.className='title';
	 tempcell.innerHTML=template_name;
	 
	 tempcell=x.insertCell(2);
	 tempcell.className='type';
	 tempcell.innerHTML=sorted_dists_types[i];
	 }
	 self.options['template_id']=templates.select(dist_list_table.rows[0]);
	
	 
	 return true;
	}

this.step_1_update_host_box=function(server_id)
	{
		var temp='';
		var host_details=xen_host_get_details(server_id);
		document.getElementById('host_box_title').innerHTML=host_details['name_label'];
		document.getElementById('host_box_vcpus').innerHTML=host_details['vCPUs'];
		document.getElementById('host_box_memory_total').innerHTML=host_details['memory_total'];
		document.getElementById('host_box_memory_free').innerHTML=host_details['memory_free'];
		document.getElementById('host_box_resident_vms').innerHTML=host_details['resident_VMs_num'];
		for(var i=0;i<host_details['vCPUs'];i++)temp+='<option>'+(i+1)+'</option>';
		document.getElementById('host_vcpus').innerHTML=temp;
		if(i>0)self.options['vCPUs']=1;
		else self.options['vCPUs']=0;
	}
	
this.step_2=function()
	{
		var error=0;
		var error_txt='';
		//check for the required vars
		//some errors
		//if everything is ok invoke the step
		if(self.options['name_label'].length==0)
			{
			error=1;
			error_txt+='<b>VM Name is not set.</b><br><br>';
			}
		if(self.options['memory'].length==0)
			{
			error=1;
			error_txt+='<b>The Memory field is not set.</b><br><br>';
			}
		if(!isINT(self.options['memory']))
			{
			error=1;
			error_txt+='<b>The Memory field must contain numbers only.</b><br><br>';
			}
		if(self.options['template_id'].length==0)
			{
			error=1;
			error_txt+='<b>VM Template is not set.</b><br><br>';
			}
		if(error)popup.create_error("Errors in Step 1",error_txt);
		else templates.LoadTemplate(interface_path+'/templates/create_new_step2.html','vm_content_td',install_vm.step_2_init);
		return true;
	}

this.step_2_init=function()
	{
	var other_config;
	var temp;
	done_steps[0]=1;done_steps[1]=0;done_steps[2]=0;done_steps[3]=0;done_steps[4]=0;
	self.options['allowed_devices']='';
	self.options['allowed_devices_id']='';
	self.options['allowed_devices_type']='';
	self.options['allowed_devices_url']='';
	
	self.init();
	self.make_active_step(2);
	
	document.getElementById('step2_template_title').innerHTML=xen_vm_get_name_label(self.options['template_id']);
	document.getElementById('step2_template_description').innerHTML=xen_vm_get_name_description(self.options['template_id']);
	
	other_config=xen_vm_get_other_config(self.options['template_id']);
	if(typeof(other_config['install-methods'])!='undefined')
	{
		if(other_config['install-methods'].search(/http/i)==-1 && other_config['install-methods'].search(/ftp/i)==-1 && other_config['install-methods'].search(/nfs/i)==-1)document.getElementById('step2_url').style.display='none';
		if(other_config['install-methods'].search(/cdrom/i)==-1)
		{
		document.getElementById('step2_phys_drive').style.display='none';
		document.getElementById('step2_cdrom').style.display='none';
		}
	}
	
	self.options['allowed_devices']=self.step_2_get_allowed_devices(self.options['host']);
	
	for ( var id in self.options['allowed_devices']['phys'] )
	 {
		temp+='<option id="'+id+'" onClick="install_vm.options[\'allowed_devices_id\']=\''+id+'\';">'+self.options['allowed_devices']['phys'][id]['name_label']+'</option>'
	 }
	 document.getElementById('step2_phys_select').innerHTML=temp;
	 temp='';
	 for ( var id in self.options['allowed_devices']['iso'] )
	 {
		temp+='<option id="'+id+'" onClick="install_vm.options[\'allowed_devices_id\']=\''+id+'\';">'+self.options['allowed_devices']['iso'][id]['name_label']+'</option>'
	 }
	 document.getElementById('step2_iso_select').innerHTML=temp;
	
	  self.step_2_disable_enable();
	
	}

this.step_2_disable_enable=function(enable_id)
	{
		document.getElementById('step2_iso_select').disabled=true;
		document.getElementById('step2_phys_select').disabled=true;
		document.getElementById('step2_url_select').disabled=true;
		if(typeof(enable_id)!='undefined')
		{
		document.getElementById(enable_id).disabled=false;
			if(enable_id=='step2_iso_select')
			{
			self.options['allowed_devices_type']='iso';
			self.options['allowed_devices_id']=document.getElementById(enable_id).options[document.getElementById(enable_id).selectedIndex].id;
			}
			if(enable_id=='step2_phys_select')
			{
			self.options['allowed_devices_type']='phys';
			self.options['allowed_devices_id']=document.getElementById(enable_id).options[document.getElementById(enable_id).selectedIndex].id;
			}
			if(enable_id=='step2_url_select')self.options['allowed_devices_type']='url';
		}

	}
	
this.step_2_get_allowed_devices=function(host_id)
	{
		var ret_array=new Object();
		ret_array['phys']=new Array();
		ret_array['iso']=new Array();
		var temp;
		var SR;
		
		var pbds=xen_host_get_pbd_list(host_id);
		for(var pbd_id in pbds)
		{
		SR=xen_pbd_get_sr(pbds[pbd_id]); 
		var sr_details=xen_sr_get_details(SR);
			//first check for iso images
			if(sr_details['type']=='iso')
				{
					for(var vdi in sr_details['VDIs'])
					{
					ret_array['iso'][ret_array['iso'].length] = {
						PBD: pbds[pbd_id],
						SR: SR,
						VDI: sr_details['VDIs'][vdi],
					    name_label: sr_details['name_label']+'( '+xen_vdi_get_name_label(sr_details['VDIs'][vdi])+' )'
						}
					}
				}
			//checking the physical devices
			if(sr_details['type']=='udev')
				{
					for(var vdi in sr_details['VDIs'])
					{
					ret_array['phys'][ret_array['phys'].length] = {
						PBD: pbds[pbd_id],
						SR: SR,
						VDI: sr_details['VDIs'][vdi],
						name_label: sr_details['name_label']+'( '+xen_vdi_get_name_label(sr_details['VDIs'][vdi])+' )'
						}
					}
				}
		}
		
		return ret_array;
	}
	
this.step_3=function()
	{
	
	var error=0;
		var error_txt='';
		//check for the required vars
		//some errors
		//if everything is ok invoke the step
		if(self.options['allowed_devices_type']=='')
			{
			error=1;
			error_txt+='<b>Please specify install source location.</b><br><br>';
			}
		if(self.options['allowed_devices_type']=='url' && self.options['allowed_devices_url'].length<6)
			{
			error=1;
			error_txt+='<b>The url location field is too small.</b><br><br>';
			}
		if(error)popup.create_error("Errors in Step 2",error_txt);
		else templates.LoadTemplate(interface_path+'/templates/create_new_step3.html','vm_content_td',install_vm.step_3_init);
		return true;
	
	}

this.step_3_init=function()
	{
	var other_config;
	var temp;
	done_steps[0]=1;done_steps[1]=1;done_steps[2]=0;done_steps[3]=0;done_steps[4]=0;
	self.options['disks']=new Array();
	self.options['allowed_disk_devices']=new Array();
	
	self.init();
	self.make_active_step(3);
	
	
	other_config=xen_vm_get_other_config(self.options['template_id']);
	
	if(typeof(other_config['disks'])!='undefined')
	{
	self.options['disks']=xen_vm_get_provision(other_config['disks']);
	}
	
	self.options['allowed_disk_devices']=self.step_3_get_allowed_disk_devices(self.options['host']);
	
	if(self.options['allowed_disk_devices'].length>0 && self.options['disks'].length>0)
		{
			for(var i in self.options['disks'])
			{
			
			if(self.options['disks'][i]['sr']=='')
				{
				self.options['disks'][i]['location_name']=self.options['allowed_disk_devices'][0]['name_label'];
				self.options['disks'][i]['allowed_disk_devices_id']=0;
				self.options['disks'][i]['sr']=self.options['allowed_disk_devices'][0]['SR'];
				self.options['disks'][i]['sr_uuid']=self.options['allowed_disk_devices'][0]['SR_uuid'];
				if(self.options['allowed_disk_devices'][0]['shared'])self.options['disks'][i]['is_shared']='True';
				else self.options['disks'][i]['is_shared']='False';
				self.step_3_add_disk_row(self.options['disks'][i],i);
				}
			else
				{
					self.options['disks'][i]['location_name']='Other SR';
					self.step_3_add_disk_row(self.options['disks'][i],i);
				}
			}
		}
	
	/*
	var temp=new Object();
	temp['size']=500;
	temp['location_name']='Local Storage on xcpweb';
	temp['is_shared']='false';
	self.step_3_add_disk_row(temp,2);
	*/
	
		return true;
	}	

this.step_3_get_allowed_disk_devices=function(host_id)
	{
		var ret_array=new Array();
		
		var pbds=xen_host_get_pbd_list(host_id);
		for(var pbd_id in pbds)
		{
		SR=xen_pbd_get_sr(pbds[pbd_id]);
		var sr_details=xen_sr_get_details(SR);
			for(var operation in sr_details['allowed_operations'])
			{
				if(sr_details['allowed_operations'][operation]=='vdi_create')
				{
					ret_array[ret_array.length] = {
								PBD: pbds[pbd_id],
								SR: SR,
								SR_uuid: sr_details['uuid'],
								all_space: Math.round((parseInt(sr_details['physical_size'])/(1024*1024*1024))*100)/100,
								free_space: Math.round(((Math.round((parseInt(sr_details['physical_size'])/(1024*1024*1024))*100)/100)-(Math.round((parseInt(sr_details['physical_utilisation'])/(1024*1024*1024))*100)/100))*100)/100,
								is_shared: sr_details['shared'],
								name_label: sr_details['name_label']+' on '+xen_host_get_name_label(xen_pbd_get_host(pbds[pbd_id]))
						}
				}
			}
		
		}
		
		return ret_array;
	}
	
this.step_3_add_disk_row=function(params,id)
	{
	var x=document.getElementById('disks_settings_table').insertRow(-1);
	var tempcell;
	
	
	 x.id='step3_disk_'+id;
	 x.setAttribute('selectval',id);
	 x.onclick=function(e){
		var bw=document.getElementById&&!document.all;
		var fobj = bw ? e.target : event.srcElement;
			
			if(fobj!=null)
			{
			while(fobj!=null && fobj.tagName!='TR' && fobj.tagName!='BODY')fobj=fobj.parentNode;
			}
			
			self.options['temp_step_3_selected_disk']=templates.select(fobj);
			
			}

	 tempcell=x.insertCell(0);
	 tempcell.className='size';
	 tempcell.innerHTML=params['size'];
	 
	 tempcell=x.insertCell(1);
	 tempcell.className='location';
	 tempcell.innerHTML=params['location_name'];
	 
	 tempcell=x.insertCell(2);
	 tempcell.className='shared';
	 tempcell.innerHTML=params['is_shared'];
	
	}
	
this.step_3_reinit_disk_rows=function()
	{
		var x=document.getElementById('disks_settings_table');
		for(var i=x.rows.length-1;i>=1;i--)x.deleteRow(i);
		
		for(var i in self.options['disks'])self.step_3_add_disk_row(self.options['disks'][i],i);
	}

this.step_3_insert_disk=function(do_edit_id)
	{
		var insert_id;
		if(typeof(do_edit_id)!='undefined')insert_id=do_edit_id;
		else insert_id=self.options['disks'].length;
		if(self.options['temp_step_3_disk_window']=='' || self.options['temp_step_3_disk_window_size']=='')return;
		//the storage
		self.options['disks'][insert_id]=new Object();
		self.options['disks'][insert_id]['location_name']=self.options['allowed_disk_devices'][parseInt(self.options['temp_step_3_disk_window'])]['name_label'];
		self.options['disks'][insert_id]['sr']=self.options['allowed_disk_devices'][parseInt(self.options['temp_step_3_disk_window'])]['SR'];
		self.options['disks'][insert_id]['sr_uuid']=self.options['allowed_disk_devices'][parseInt(self.options['temp_step_3_disk_window'])]['SR_uuid'];
		if(self.options['allowed_disk_devices'][parseInt(self.options['temp_step_3_disk_window'])]['shared'])self.options['disks'][insert_id]['is_shared']='True';
		else self.options['disks'][insert_id]['is_shared']='False';
		self.options['disks'][insert_id]['allowed_disk_devices_id']=parseInt(self.options['temp_step_3_disk_window']);
				self.options['disks'][insert_id]['size']=parseInt(self.options['temp_step_3_disk_window_size']);
				self.options['disks'][insert_id]['bootable']='false';
				self.options['disks'][insert_id]['type']='system';
		
		self.step_3_reinit_disk_rows();
	}

this.step_3_delete_disk=function()
	{
		self.options['disks'].splice(parseInt(self.options['temp_step_3_selected_disk']),1);
		self.step_3_reinit_disk_rows();
	}

this.step_3_new_disk_window=function(do_edit)
	{
	var cur_disk;
	var onclick='';
	var disk_size='';
	var do_edit_id='';
	self.options['temp_step_3_disk_window']='';
	self.options['temp_step_3_disk_window_size']='';
	var tmphtml='<div class="install_vm_content" style="width: 450px; margin-left: 0px;">';
	if(do_edit)
	{
	cur_disk=self.options['disks'][parseInt(self.options['temp_step_3_selected_disk'])];
	do_edit_id=self.options['temp_step_3_selected_disk'];
	disk_size=cur_disk['size'];
	}
	else
	{
	do_edit_id='';
	}
	
	tmphtml+='<div style="padding:5px;clear:both;width:100%;font-size:10pt;font-weight: bold;">Disk Size: <input type="text" id="disk_size_input" value="'+disk_size+'" style="width:80px;border: 1px solid #bde0fc;"> MB</div>';
	tmphtml+='<div style="padding:5px;clear:both;width:100%;font-size:10pt;font-weight: bold;">Location: </div>';
	tmphtml+='<div class="disks_settings" style="width: 426px; margin-top: 0px;">';
	tmphtml+='<table style="width:100%;border-collapse:collapse;clear:both;" id="disk_list_table">';
	tmphtml+='<tr><th style="border-right: 1px solid #717171;">Storage Name</th><th style="border-right: 1px solid #717171;">All Size(GB)</th><th>Free Size(GB)</th></tr>';
	
	for(var i in self.options['allowed_disk_devices'])
	{
	tmphtml+='<tr selectval="'+i+'" id="step3_cur_disk_'+i+'" onclick="install_vm.options[\'temp_step_3_disk_window\']=templates.select(this);"><td style="width:220px;padding-left:3px;">'+self.options['allowed_disk_devices'][i]['name_label']+'</td><td style="width:100px;padding-left:3px;">'+self.options['allowed_disk_devices'][i]['all_space']+' GB</td><td style="width:100px;padding-left:3px;">'+self.options['allowed_disk_devices'][i]['free_space']+' GB</td></tr>';
	}
	
	onclick="install_vm.options['temp_step_3_disk_window_size']=document.getElementById('disk_size_input').value;install_vm.step_3_insert_disk("+do_edit_id+");popup.destroy(\'disk_options\');";
	
	tmphtml+='</table></div>';
	tmphtml+='<div class="buttons"><button onclick="'+onclick+'">OK</button><button onclick="popup.destroy(\'disk_options\');">Close</button></div>';
	
	popup.create('disk_options','Disk Options',tmphtml,480,250);
	
	
	if(do_edit)self.options['temp_step_3_disk_window']=templates.select('step3_cur_disk_'+self.options['disks'][parseInt(self.options['temp_step_3_selected_disk'])]['allowed_disk_devices_id']);
	else if(self.options['allowed_disk_devices'].length)self.options['temp_step_3_disk_window']=templates.select('step3_cur_disk_0');
	
	}

	
this.step_4=function()
	{
		var error=0;
		var error_txt='';
		//check for the required vars
		//some errors
		//if everything is ok invoke the step
		if(self.options['disks'].length==0)
			{
			error_txt+='<b>There are not any attached storage devices.</b><br><br>Are you sure, that you don\'t need any devices?';
			popup.create_error("Errors in Step 3",error_txt);
			}
		
		templates.LoadTemplate(interface_path+'/templates/create_new_step4.html','vm_content_td',install_vm.step_4_init);
		return true;
	}

this.step_4_init=function()
	{// TODO to guess the installer network, but for test just put the uuid
	var other_config;
	var temp;
	var install_index=0;
	done_steps[0]=1;done_steps[1]=1;done_steps[2]=1;done_steps[3]=0;done_steps[4]=0;
	self.options['vifs']=new Array();
	
	
	self.init();
	self.make_active_step(4);
	
	self.options['allowed_network_devices']=self.step_4_get_allowed_network_devices(self.options['host']);
	
	
	if(self.options['allowed_network_devices'].length>0)
		{
		
		for(var i in self.options['allowed_network_devices'])
			{
				if(eval("self.options['allowed_network_devices']["+i+"]['bridge'].search(/xapi/i);")>=0)
				{
				install_index=i;
				break;
				}
			}
		
			self.options['vifs'][self.options['vifs'].length] = {
				network_id: self.options['allowed_network_devices'][install_index]['network_id'],
				name_label: self.options['allowed_network_devices'][install_index]['name_label'],
				bridge: self.options['allowed_network_devices'][install_index]['bridge'],
			}
			self.step_4_add_vif_row(self.options['vifs'][self.options['vifs'].length-1],self.options['vifs'].length-1);
		}
	
	return true;
	}

this.step_4_get_allowed_network_devices=function(host_id)
	{
		var ret_array=new Array();
		
		var networks=xen_host_get_network_list(host_id);
		for(var net_id in networks)
		{
		var network_details=xen_network_get_details(networks[net_id]);
		ret_array[ret_array.length] = {
			network_id: networks[net_id],
			name_label: network_details['name_label'],
			name_description: network_details['name_description'],
			bridge: network_details['bridge']
			}
		
		}
		
		return ret_array;
	}

this.step_4_add_vif_row=function(params,id)
	{
	var x=document.getElementById('network_settings_table').insertRow(-1);
	var tempcell;
			//<tr><td class="interface">Interface 1</td><td>Auto generated.</td><td>Guest installer network</td></tr>
	
	 x.id='step4_vif_'+id;
	 x.setAttribute('selectval',id);
	 x.onclick=function(e){
		var bw=document.getElementById&&!document.all;
		var fobj = bw ? e.target : event.srcElement;
			
			if(fobj!=null)
			{
			while(fobj!=null && fobj.tagName!='TR' && fobj.tagName!='BODY')fobj=fobj.parentNode;
			}
			
			self.options['temp_step_4_selected_vif']=templates.select(fobj);
			
			}

	 tempcell=x.insertCell(0);
	 tempcell.className='interface';
	 tempcell.innerHTML='Interface '+id;
	 
	 tempcell=x.insertCell(1);
	 tempcell.className='mac';
	 tempcell.innerHTML='Auto generated.';
	 
	 tempcell=x.insertCell(2);
	 tempcell.className='network';
	 tempcell.innerHTML=params['name_label'];
	
	}

	this.step_4_new_vif_window=function(do_edit)
	{
	var cur_disk;
	var onclick='';
	var disk_size='';
	var do_edit_id='';
	self.options['temp_step_4_selected_vif']='';
	var tmphtml='<div class="install_vm_content" style="width: 450px; margin-left: 0px;">';
	
	tmphtml+='<div class="disks_settings" style="width: 426px; margin-top: 0px;">';
	tmphtml+='<table style="width:100%;border-collapse:collapse;clear:both;" id="disk_list_table">';
	tmphtml+='<tr><th style="border-right: 1px solid #717171;">Network Name</th><th style="border-right: 1px solid #717171;">Bridge</th></tr>';
	
	for(var i in self.options['allowed_network_devices'])
	{
	tmphtml+='<tr selectval="'+i+'" id="step4_cur_net_'+i+'" onclick="install_vm.options[\'temp_step_4_net_window\']=templates.select(this);"><td style="width:250px;padding-left:3px;">'+self.options['allowed_network_devices'][i]['name_label']+'</td><td style="width:100px;padding-left:3px;">'+self.options['allowed_network_devices'][i]['bridge']+'</td></tr>';
	}
	
	onclick="install_vm.step_4_insert_vif();popup.destroy(\'network_options\');";
	
	tmphtml+='</table></div>';
	tmphtml+='<div class="buttons"><button onclick="'+onclick+'">OK</button><button onclick="popup.destroy(\'network_options\');">Close</button></div>';
	
	popup.create('network_options','Network Options',tmphtml,480,250);
	
	
	}
	
	this.step_4_reinit_network_rows=function()
	{
		var x=document.getElementById('network_settings_table');
		for(var i=x.rows.length-1;i>0;i--)x.deleteRow(i);
		
		for(var i in self.options['vifs'])self.step_4_add_vif_row(self.options['vifs'][i],i);
	}

this.step_4_insert_vif=function()
	{
		var insert_id=self.options['vifs'].length;

		if(self.options['temp_step_4_net_window']=='')return;
		//the vif
		self.options['vifs'][insert_id]= {
			network_id: self.options['allowed_network_devices'][parseInt(self.options['temp_step_4_net_window'])]['network_id'],
			name_label: self.options['allowed_network_devices'][parseInt(self.options['temp_step_4_net_window'])]['name_label'],
			bridge: self.options['allowed_network_devices'][parseInt(self.options['temp_step_4_net_window'])]['bridge']
			}
		
		
		self.step_4_reinit_network_rows();
	}

this.step_4_delete_vif=function()
	{
		self.options['vifs'].splice(parseInt(self.options['temp_step_4_selected_vif']),1);
		self.step_4_reinit_network_rows();
	}
	
this.step_5=function()
	{

	//here is the installation step
	templates.LoadTemplate(interface_path+'/templates/create_new_step5.html','vm_content_td',install_vm.step_5_init);
	}

this.step_5_init=function()
	{
	var new_vm_uuid='';
	var cd_ref='';
	var other_config;
	done_steps[0]=1;done_steps[1]=1;done_steps[2]=1;done_steps[3]=1;done_steps[4]=0;
	
	self.init();
	self.make_active_step(5);
		
		
	new_vm_uuid=xen_vm_clone_sync(self.options['template_id'],self.options['name_label']);
	if(new_vm_uuid!='')self.step_5_add_step(1,'Cloning the template.');
	else self.step_5_add_step(0,'Cloning the template.');
	
	self.step_5_add_step(1,'Making some settings to the new vm.');
	xen_vm_set_name_description(new_vm_uuid, self.options['name_description']);
	
	xen_vm_fix_record(new_vm_uuid);
	
	other_config = xen_vm_get_other_config(new_vm_uuid);
    other_config['default_template'] = "false";
	other_config['disks'] = xen_vm_make_provision(self.options['disks']);
	
	xen_set_affinity(new_vm_uuid,self.options['host']);
	
	if(self.options['allowed_devices_type']=='url')other_config["install-repository"]=self.options['allowed_devices_url'];
	else other_config["install-repository"] = "cdrom";
	
	//todo: to set mac_seed 
	self.step_5_add_step(1,'Setting the other_config.');
	xen_vm_set_other_config(new_vm_uuid, other_config);
	
	self.step_5_add_step(1,'Invoking vm_provision to create the block devices.');
	xen_vm_provision(new_vm_uuid);
	
	var vif_temp = {
            uuid: '',
            allowed_operations: [],
            current_operations: {},
            device: '0',
            network: '',
            VM: '',
            MAC: '',
            MTU: '0',
            other_config: {},
            currently_attached: false,
            status_code: '0',
            status_detail: '',
            runtime_properties: {},
            qos_algorithm_type:   '',
            qos_algorithm_params: {},
            metrics: '',
            MAC_autogenerated: false 
        }

			if(self.options['allowed_devices_type']!='url')
			{

    var vbd_temp = {
            VM: new_vm_uuid,
            VDI: self.options['allowed_devices'][self.options['allowed_devices_type']][self.options['allowed_devices_id']]['VDI'],
            userdevice: toString(self.options['disks'].length),
            bootable: True,
            mode: "RO",
            type: "CD",
            unplugabble: "0",
            storage_lock: "0",
            empty: false,
            currently_attached: "0",
            status_code: "0",
            other_config: {},
            qos_algorithm_type: "",
            qos_algorithm_params: {},
        }
	

			
			cd_ref=xen_vbd_create(vbd_temp);
			if(cd_ref!='')self.step_5_add_step(1,'Inserting install media device.');
			else self.step_5_add_step(0,'Inserting install media device.');
			xen_vbd_insert(cd_ref,self.options['allowed_devices'][self.options['allowed_devices_type']][self.options['allowed_devices_id']]['VDI']);
			}
	
	self.step_5_add_step(1,'Setting the memory and VCPUs.');
	
	xen_vm_set_memory_static_min(new_vm_uuid,(parseInt(self.options['memory']))*1024*1024);
	xen_vm_set_memory_dynamic_min(new_vm_uuid,(parseInt(self.options['memory']))*1024*1024);
	xen_vm_set_memory_static_max(new_vm_uuid,(parseInt(self.options['memory']))*1024*1024);
	xen_vm_set_memory_dynamic_max(new_vm_uuid,(parseInt(self.options['memory']))*1024*1024);
	xen_vm_set_VCPUs_max(new_vm_uuid,self.options['vCPUs']);
	xen_vm_set_VCPUs_at_startup(new_vm_uuid,self.options['vCPUs']);

	self.step_5_add_step(1,'Network Settings.');
	
	for(var i in self.options['vifs'])
		{
            vif_temp['device'] = i.toString();
            vif_temp['network'] = self.options['vifs'][i]['network_id'];
            vif_temp['VM'] = new_vm_uuid;
            xen_vif_create(vif_temp);
		} 
	
	//the end
	done_steps[0]=1;done_steps[1]=1;done_steps[2]=1;done_steps[3]=1;done_steps[4]=1;
	self.init();
	return true;
	}

this.step_5_add_step=function(is_ok,step_name)
	{
		var x=document.getElementById('passed_steps').insertRow(-1);
	var tempcell;
	var temp;
	if(is_ok)temp='<img src="/interface/img/checked.png">';
	else temp='<img src="/interface/img/close.png">';
	 tempcell=x.insertCell(0);
	 tempcell.className='status';
	 tempcell.innerHTML=temp;
	 
	 tempcell=x.insertCell(1);
	 tempcell.className='title';
	 tempcell.innerHTML=step_name;
	 
	}

}

var install_vm=new VM_Installation();


templates.LoadTemplate(interface_path+'/templates/create_new.html','main_content',install_vm.step_1);
