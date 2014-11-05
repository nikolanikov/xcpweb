// functions to deal with Host part of the xen_db

function xen_host_get_pbd_list(host_id)
{
	return xen_db['host'][host_id]['PBDs'];
}

function xen_host_get_network_list(host_id)
{
var networks=new Array();

	var pifs=xen_db['host'][host_id]['PIFs'];
	
	for(var pif in pifs)
		{
			for(var network in xen_db['network'])
				{
				if(eval("xen_db['network']['"+network+"']['bridge'].search(/xapi/i);")>=0)networks[networks.length]=network;
				else
					{
						for(var pif in xen_db['network'][network]['PIFs'])
							{
							if(xen_db['network'][network]['PIFs'][pif]==pifs[pif])
								{
								networks[networks.length]=network;
								break;
								}
							}
					}
				}
		}
	
	return networks;
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

function xen_host_get_details(host_id)
{
	vm_pool = new Array();
	vm_pool['name_label']=xen_db['host'][host_id]['name_label'];
	vm_pool['name_description']=xen_db['host'][host_id]['name_description'];
	
	//to get other things from the metrics 
	//get the cpu_usage
	var cpu_usage=0;
	var cpus=0
		for (var cpu_id in xen_db['host'][host_id]['host_CPUs'])
			{
			cpu_usage=parseInt(cpu_usage)+parseInt(xen_db['host_cpu'][xen_db['host'][host_id]['host_CPUs'][cpu_id]]['utilisation']);
			cpus++;
			}
		cpu_usage=cpu_usage/cpus;
	vm_pool['vCPUs']=cpus;
	vm_pool['cpu_usage']=cpu_usage;

	vm_pool['memory_free']=Math.floor(parseInt(xen_db['host_metrics'][xen_db['host'][host_id]['metrics']]['memory_free']) / (1024*1024));
	vm_pool['memory_total']=Math.floor(parseInt(xen_db['host_metrics'][xen_db['host'][host_id]['metrics']]['memory_total']) / (1024*1024));
	
	vm_pool['resident_VMs']=new Array();
	vm_pool['resident_VMs_num']=0;
	for(var id in xen_db['host'][host_id]['resident_VMs'])
	{
	var vm_id=xen_db['host'][host_id]['resident_VMs'][id];
	if(!xen_db['vm'][vm_id]['is_a_template'] && !xen_db['vm'][vm_id]['is_control_domain'])
		{
		vm_pool['resident_VMs'].push(vm_id);
		vm_pool['resident_VMs_num']++;
		}
	}
	
	return vm_pool;
}

function xen_host_get_console(host_id)
{
var console_stuff = new Array(); 
var dom0 = 0;

 for(var id in xen_db['host'][host_id]['resident_VMs'])
	{
	var vm_id=xen_db['host'][host_id]['resident_VMs'][id];
	if(xen_db['vm'][vm_id]['is_control_domain'])dom0=vm_id;
	}

 if(dom0)
	{	
	return xen_vm_get_console(dom0);
	}
	
return 0;
}

function xen_host_get_allowed_operations(ref)
{
return xen_db['host'][ref]['allowed_operations'];
}

function xen_host_get_name_label(ref)
{
return xen_db['host'][ref]['name_label'];
}

function xen_host_shutdown(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('host.shutdown',params,true,0,0,0,0);
return ;
}

function xen_host_reboot(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('host.reboot',params,true,0,0,0,0);
return ;
}

function xen_host_enable(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('host.enable',params,true,0,0,0,0);
return ;
}

function xen_host_disable(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('host.disable',params,true,0,0,0,0);
return ;
}

function xen_host_evacuate(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
ApiCall('host.evacuate',params,true,0,0,0,0);
return ;
}
