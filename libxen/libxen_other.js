
function xen_network_get_details(net_ref)
{
vm_pool = new Array();
	vm_pool['name_label']=xen_db['network'][net_ref]['name_label'];
	vm_pool['name_description']=xen_db['network'][net_ref]['name_description'];
	vm_pool['bridge']=xen_db['network'][net_ref]['bridge'];
return vm_pool;
}

function xen_vbd_create(vbd_obj)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=vbd_obj;
return ApiCall('VBD.create',params,false,0,0,0,0);
}

function xen_vif_create(vif_obj)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=vif_obj;
ApiCall('VIF.create',params,true,0,0,0,0);
return ;
}

function xen_vbd_insert(vbd_ref,vdi_ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=vbd_ref;
params[2]=vdi_ref;
ApiCall('VBD.insert',params,true,0,0,0,0);
return ;
}
			
function xen_pbd_get_sr(pbd_id) 
{
	return xen_db['pbd'][pbd_id]['SR'];
}
function xen_pbd_get_host(pbd_id)
{
	return xen_db['pbd'][pbd_id]['host'];
}

function xen_vdi_get_name_label(vdi_id)
{
	return xen_db['vdi'][vdi_id]['name_label'];
}

function xen_sr_get_details(sr_id)
{ 
	vm_pool = new Array();
	vm_pool['name_label']=xen_db['sr'][sr_id]['name_label'];
	vm_pool['name_description']=xen_db['sr'][sr_id]['name_description'];
	vm_pool['VDIs']=xen_db['sr'][sr_id]['VDIs'];
	vm_pool['type']=xen_db['sr'][sr_id]['type'];
	vm_pool['uuid']=xen_db['sr'][sr_id]['uuid'];
	vm_pool['content_type']=xen_db['sr'][sr_id]['content_type'];
	vm_pool['other_config']=xen_db['sr'][sr_id]['other_config'];
	vm_pool['allowed_operations']=xen_db['sr'][sr_id]['allowed_operations'];
	vm_pool['shared']=xen_db['sr'][sr_id]['shared'];
	vm_pool['physical_size']=xen_db['sr'][sr_id]['physical_size'];
	vm_pool['physical_utilisation']=xen_db['sr'][sr_id]['physical_utilisation'];
	
	return vm_pool;
}