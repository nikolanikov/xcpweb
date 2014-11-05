//Here are the functions that are recomended to be used by the UI
//some inits
var xen_db=new Array();
var xen_db_events=new Array(); 
//var xen=new xen_core();
//This function initializes the session.
function xen_init(username,password,callback_login,callback_error)
{
var params=new Array();
//var xen=new xen_core();
var params=new Array();
params[0]=username;
params[1]=password;
//xen.ApiCall('session.login_with_password',params,1,xen_callback_proceed_init,xen_callback_login_error,callback_login);
ApiCall('session.login_with_password',params,true,1,xen_callback_proceed_init,callback_error,callback_login);
return ;
}

function xen_register_db_event(db_array,function_call) //this register event (function to invoke after some xen_db array is changed)
//example 1 xen_register_db_event('VM',vm_list_change);
//example 2 xen_register_db_event('*',make_UI_modifications);
{
xen_db_events[db_array]=function_call;
}
