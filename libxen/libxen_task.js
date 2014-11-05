function xen_task_get_list()
{

var pool=new Array();

 for ( var task_id in xen_db['task'] )
 {
	pool[task_id] = xen_task_get_details(task_id);
 }

 return pool;
}

function xen_task_get_details(task_id)
{
var pool = new Array();
	
	pool['name_label']=xen_db['task'][task_id]['name_label'];
	pool['name_description']=xen_db['task'][task_id]['name_description'];
	pool['progress']=xen_db['task'][task_id]['progress'];
	pool['status']=xen_db['task'][task_id]['status'];
return pool;
}

function xen_task_get_allowed_operations(ref)
{
return xen_db['task'][ref]['allowed_operations'];
}

function xen_task_cancel(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
return ApiCall('task.cancel',params,false,0,0,0,0);;
}

function xen_task_destroy(ref)
{
var params=new Array();
params[0]=xen_db['session_id'];
params[1]=ref;
return ApiCall('task.destroy',params,false,0,0,0,0);;
}
