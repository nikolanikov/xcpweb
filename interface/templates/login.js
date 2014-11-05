templates.LoadImage('/interface/img/login_button_active.png');
templates.LoadImage('/interface/img/loading.gif');

function login_req()
{
var username='';
var password='';

this.try_login = function()
	{
	var priv_username=document.getElementById('login_username').value;
	var priv_password=document.getElementById('login_password').value;
	if(priv_username==username && priv_password==password)return;
	username=priv_username;
	password=priv_password;
	document.getElementById('error_box').style.display='none';
	document.getElementById('loading_box').style.display='';
	xen_init(priv_username,priv_password,this.callback,this.callback_error);
	return ;
	}
	
this.callback = function()
	{
	templates.LoadJS(interface_path+'/templates/main.js');
	templates.LoadTemplate(interface_path+'/templates/main.html','content');
	return ;
	}

this.callback_error = function(raw,xmldoc,param_pass)
	{
	document.getElementById('loading_box').style.display='none';
	document.getElementById('error_box').style.display='';
	return ;
	}	

}

var login = new login_req();

