templates.LoadImage('/interface/img/cloud_pool_button_active.png');
templates.LoadImage('/interface/img/create_new_button_active.png');
templates.LoadImage('/interface/img/settings_button_active.png');

function TaskManager()
{
var self = this;
var is_hidden = 0;

this.addTask = function(id,params)
	{
	var x=document.getElementById('task_box_table').insertRow(-1);
	x.id=id;
	
	tempcell=x.insertCell(0);
	tempcell.className="cell_padding";
	tempcell.innerHTML=params['name_label'];
	/*
	tempcell=x.insertCell(1);
	//tempcell.className="";
	tempcell.innerHTML='<div id="Bar"><div style="float: left; height: 10px; padding: 0; background-image: url(/interface/img/bar.png); width: '+params['percent']+'px;" /></div>';
	
	
	tempcell=x.insertCell(2);
	tempcell.innerHTML=params['percent']+'%';
	*/
	
	tempcell=x.insertCell(1);
	//tempcell.className="cell_padding";
	tempcell.innerHTML=params['status'];
	
	tempcell=x.insertCell(2);
	tempcell.className="cell_padding";
	tempcell.innerHTML='<img src="/interface/img/close.png" style="cursor:pointer;" />';
	tempcell.onclick = function(e) {self.closeMenu(id,e);}
	
	return x;
	}

this.closeMenu = function(param,e)
	{	
	var allowed_operations=xen_task_get_allowed_operations(param);
	if (xcp_menu.getMenu(param)) { xcp_menu.dropMenu(param); }
	var currentMenu = xcp_menu.createMenu(param);
	if (typeof(currentMenu) == 'object') {
		
		for(var op_id in allowed_operations)
			{
			if(allowed_operations[op_id]=='cancel')xcp_menu.appendInMenu(currentMenu,'cancel','Cancel',"xen_task_cancel('"+param+"');",'/interface/img/menu_missing.png');
			if(allowed_operations[op_id]=='destroy')xcp_menu.appendInMenu(currentMenu,'destroy','Destroy',"xen_task_destroy'("+param+"');",'/interface/img/menu_missing.png');
			}
		xcp_menu.openRightMenu('menu_'+param,e);
		}
	}

this.clear = function()
	{
	var x=document.getElementById('task_box_table');
	if(typeof(x.rows)!='undefined')
		{
		for(var i=x.rows.length-1;i>=0;i--)x.deleteRow(i);
		}
	}
	
this.reinitTasks = function()
	{
	var task_num=0;
	self.clear();
	var task_pool=xen_task_get_list();
	for ( var task_id in task_pool )
		{
		task_num++;
		self.addTask(task_id,task_pool[task_id]);
		}
		
	var x=document.getElementById('task_box');
		if(task_num)x.style.display='';
		else x.style.display='none'
		
	}

}

var task_manager=new TaskManager();
xen_register_db_event('task',task_manager.reinitTasks);

function main_buttons_req()
{
var self = this;
var img_path ='/interface/img/'
var buttons = new Array('cloud_pool_button','create_new_button','settings_button');
this.active=0;

var make_active = function(button_id)
	{
	var i;
	
	for (i in buttons)
		{
		document.getElementById(buttons[i]).style.backgroundImage = "url("+img_path+buttons[i]+".png)";
		}
	document.getElementById(button_id).style.backgroundImage = "url("+img_path+button_id+"_active.png)";
	self.active=button_id;
	}

this.cloud_pool = function()
	{
	make_active('cloud_pool_button');
	templates.LoadCSS(interface_path+'/templates/cloud_pool.css');
	templates.LoadJS(interface_path+'/templates/cloud_pool.js');
	return ;
	}
	
this.create_new = function()
	{
	make_active('create_new_button');
	templates.LoadCSS(interface_path+'/templates/create_new.css');
	templates.LoadJS(interface_path+'/templates/create_new.js');
	return ;
	}

this.settings = function()
	{
	make_active('settings_button');
	templates.LoadJS(interface_path+'/templates/settings.js');
	templates.LoadTemplate(interface_path+'/templates/settings.html','main_content');
	return ;
	}

}
var main_buttons = new main_buttons_req();

templates.LoadCSS(interface_path+'/templates/main.css');
templates.LoadTemplate(interface_path+'/templates/main.html','content',main_buttons.create_new);
