// functions to deal with VM part of the xen_db

function xen_vm_fix_record(vm_ref)
{
if(typeof(xen_db['vm'][vm_ref])=='undefined')
	{
	return xen_vm_get_record(vm_ref);
	}
}

function xen_vm_get_record(vm_ref)
{
var result;
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=vm_ref;
result=ApiCall('VM.get_record',params,false,0,0,0,0);
xen_db['vm'][vm_ref]=result;
invoke_event('vm');
return result;
}

function xen_vm_get_provision(provxml)
{
var xmlDoc;
	if (window.DOMParser)
  {
  parser=new DOMParser();
  xmlDoc=parser.parseFromString(provxml,"text/xml");
  }
else // Internet Explorer
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async="false";
  xmlDoc.loadXML(provxml);
  } 
  
 var cur;
var retarray=new Array();
if(xmlDoc.childNodes[0].nodeName=='provision')
	{
		for(var i in xmlDoc.childNodes[0].childNodes)
		{
			if(isINT(i))
			{
				retarray[retarray.length]=new Object();
				retarray[retarray.length-1]['device']=xmlDoc.childNodes[0].childNodes[i].getAttribute('device');
				retarray[retarray.length-1]['size']=parseInt(xmlDoc.childNodes[0].childNodes[i].getAttribute('size'));
				retarray[retarray.length-1]['size']=retarray[retarray.length-1]['size']/1048576;
				retarray[retarray.length-1]['sr']=xmlDoc.childNodes[0].childNodes[i].getAttribute('sr');
				retarray[retarray.length-1]['bootable']=xmlDoc.childNodes[0].childNodes[i].getAttribute('bootable');
				retarray[retarray.length-1]['type']=xmlDoc.childNodes[0].childNodes[i].getAttribute('type');
			}
		}
	}
  
  return retarray;
}

function xen_vm_make_provision(diskarray)
{
var retprov='&lt;provision&gt;';

//check for bootable
for(var u=0;u<diskarray.length && diskarray[u]['bootable']!='true';u++)
if(u==diskarray.length)diskarray[0]['bootable']='true';

for(var i in diskarray)
	{
	retprov+='&lt;disk device="'+i+'" size="'+diskarray[i]['size']*1048576+'" sr="'+diskarray[i]['sr_uuid']+'" bootable="'+diskarray[i]['bootable']+'" type="system" ionice="0" readonly="False" /&gt;'
	}

retprov+='&lt;/provision&gt;';
return retprov;
} 

function xen_vm_get_templates()
{
	var vm_pool=new Array();
	
	for ( var vm_id in xen_db['vm'] )
		{
			if(xen_db['vm'][vm_id]['is_a_template'])vm_pool.push(vm_id);
		}
		
	return vm_pool;
}



function xen_vm_get_name_label(vm_id)
{
	return	xen_db['vm'][vm_id]['name_label'];
}

function xen_vm_get_name_description(vm_id)
{
	return	xen_db['vm'][vm_id]['name_description'];
}

function xen_vm_get_other_config(vm_id)
{
	return	xen_db['vm'][vm_id]['other_config'];
}

function xen_get_vm_list_hosts()
{

var vm_pool=new Array();

 for ( var host_id in xen_db['host'] )
 {
	vm_pool[host_id] = xen_host_get_details(host_id);
 }

 return vm_pool;
}

function xen_get_vm_list_non_resident()
{
var vm_pool = new Array();

	for ( var vm_id in xen_db['vm'] )
		{
		   if(typeof(xen_db['vm'][vm_id]['resident_on'])!='undefined')
		   {
		   if((xen_db['vm'][vm_id]['resident_on']=="OpaqueRef:NULL" || xen_db['vm'][vm_id]['resident_on']=='') && !xen_db['vm'][vm_id]['is_a_template'])vm_pool.push(vm_id);
		   }
		}

return vm_pool;
}

function xen_vm_get_details(vm_id)
{
var vm_pool = new Array();
	
	vm_pool['name_label']=xen_db['vm'][vm_id]['name_label'];
	vm_pool['name_description']=xen_db['vm'][vm_id]['name_description'];
	try {if(vm_pool['name_description']=='')vm_pool['name_description']=xen_db['vm_guest_metrics'][xen_db['vm'][vm_id]['guest_metrics']]['os_version']['name'];}catch(err){}
	
	vm_pool['memory_total']=Math.floor(parseInt(xen_db['vm'][vm_id]['memory_target']) / (1024*1024));
	vm_pool['power_state']=xen_db['vm'][vm_id]['power_state'];
	vm_pool['vm_cpus_count']=xen_db['vm'][vm_id]['VCPUs_max'];
	vm_pool['vm_cpus_weight']='';// TODO 
	vm_pool['vm_cpus_cap']='';// TODO
return vm_pool;
}

function xen_vm_get_console(vm_id)
{
var console_stuff = new Array(); 
if(typeof(xen_db['vm'][vm_id]['consoles']) != 'undefined' && typeof(xen_db['vm'][vm_id]['consoles'][0]) != 'undefined' && typeof(xen_db['vm'][vm_id]['consoles'][0]) != 'undefined'  && typeof(xen_db['console'][xen_db['vm'][vm_id]['consoles'][0]]['location']) != 'undefined' )
{
console_stuff['location']=xen_db['console'][xen_db['vm'][vm_id]['consoles'][0]]['location'];
console_stuff['session_id']=xen_db['session_id'];
return console_stuff;
}
return 0;
}

function xen_vm_get_allowed_operations(ref)
{
return xen_db['vm'][ref]['allowed_operations'];
}

function xen_vm_get_power_state(ref)
{
return xen_db['vm'][ref]['power_state'];
}

function xen_set_affinity(vm_id,host_id)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=vm_id;
params[2]=host_id;
ApiCall('VM.set_affinity',params,true,0,0,0,0);
return;
}

function xen_vm_set_other_config(ref,other_config)
{
var params=new Array();
	params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=other_config;
ApiCall('VM.set_other_config',params,true,0,0,0,0);
return;
}

function xen_vm_set_name_description(ref,name_label)
{
var params=new Array();
	params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=name_label;
ApiCall('VM.set_name_description',params,true,0,0,0,0);
return;
}

function xen_vm_provision(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
return ApiCall('VM.provision',params,true,0,0,0,0);
}

function xen_vm_clone_sync(ref,name_label)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=name_label;
return ApiCall('VM.clone',params,false,0,0,0,0);
}


function xen_vm_clone(ref,name_label)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=name_label;
return ApiCall('VM.clone',params,true,0,0,0,0);
}

function xen_vm_get_possible_hosts(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
return ApiCall('VM.get_possible_hosts',params,false,0,0,0,0);
}

function xen_vm_set_memory_static_min(ref,memory)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=memory.toString();
ApiCall('VM.set_memory_static_min',params,true,0,0,0,0);
return ;
}

function xen_vm_set_memory_dynamic_min(ref,memory)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=memory.toString();
ApiCall('VM.set_memory_dynamic_min',params,true,0,0,0,0);
return ;
}

function xen_vm_set_memory_static_max(ref,memory)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=memory.toString();
ApiCall('VM.set_memory_static_max',params,true,0,0,0,0);
return ;
}

function xen_vm_set_memory_dynamic_max(ref,memory)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=memory.toString();
ApiCall('VM.set_memory_dynamic_max',params,true,0,0,0,0);
return ;
}

function xen_vm_set_VCPUs_max(ref,vcpus)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=vcpus.toString();
ApiCall('VM.set_VCPUs_max',params,true,0,0,0,0);
return ;
}

function xen_vm_set_VCPUs_at_startup(ref,vcpus)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=vcpus.toString();
ApiCall('VM.set_VCPUs_at_startup',params,true,0,0,0,0);
return ; 
}
		
function xen_vm_clean_shutdown(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('VM.clean_shutdown',params,true,0,0,0,0);
return ;
}

function xen_vm_clean_reboot(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('VM.clean_reboot',params,true,0,0,0,0);
return ;
}

function xen_vm_hard_shutdown(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('VM.hard_shutdown',params,true,0,0,0,0);
return ;
}

function xen_vm_hard_reboot(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('VM.hard_reboot',params,true,0,0,0,0);
return ;
}

function xen_vm_destroy(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('VM.destroy',params,true,0,0,0,0);
return ;
}

function xen_vm_pause(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('VM.pause',params,true,0,0,0,0);
return ;
}

function xen_vm_unpause(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('VM.unpause',params,true,0,0,0,0);
return ;
}

function xen_vm_suspend(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('VM.suspend',params,true,0,0,0,0);
return ;
}

function xen_vm_resume(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=false;
params[3]=true;
ApiCall('VM.resume',params,true,0,0,0,0);
return ;
}

function xen_vm_start(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
params[2]=false;
params[3]=true;
ApiCall('VM.start',params,true,0,0,0,0);
return ;
}

function xen_vm_start_on(vm_ref,host_ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=vm_ref;
params[2]=host_ref;
params[3]=false;
params[4]=true;
ApiCall('VM.start_on',params,true,0,0,0,0);
return ;
}

function xen_vm_resume_on(vm_ref,host_ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=vm_ref;
params[2]=host_ref;
params[3]=false;
params[4]=true;
ApiCall('VM.resume_on',params,true,0,0,0,0);
return ;
}

function xen_vm_pool_migrate(vm_ref,host_ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=vm_ref;
params[2]=host_ref;
params[3]=new Object();
ApiCall('VM.pool_migrate',params,true,0,0,0,0);
return ;
}


