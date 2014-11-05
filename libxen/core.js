//TODO:
//to parse the json with the json.js provided by json.org (safer way)
//because of the 4096 node limit in firefox
/*
//for some reason firefox loops on this function and stuck
//For now I will parse the request as a string.
function exportNodeText(xmlNode) {  
    if(!xmlNode) return '';  
    if(typeof(xmlNode.textContent) != "undefined") return xmlNode.textContent;  
    return xmlNode.childNodes[0].nodeValue;  
}  
*/
var loadvar=false;
var version='1.0';
var url='/json';


function CreateHttpRequestObject()
{
	var http_request=false;


	if (window.XMLHttpRequest) { // Mozilla, Safari,...
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType) http_request.overrideMimeType('text/xml');
	} else if (window.ActiveXObject) { // IE
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
			}			
		catch (e) {
		try {
			http_request = new ActiveXObject("Microsoft.XMLHTTP");
			}
		catch (e) {return 0;}
		}
	}

	return http_request;
}


ApiCall=function(method,params,async,doupdate,callback,error_callback,param_pass)
{
var data=xmlRpc(method, params);
return makeRequest(url,method,data,async,doupdate,callback,error_callback,param_pass);
}

/*
function parse_xml_to_json(response)
{
	return response=response.substring(137,response.length - 68); // bad way to make it, but it will be that way for some time
}
*/

makeRequest=function(url,method,data,async,doupdate,callback,error_callback,param_pass) {
rand=parseInt(Math.random()*99999999);
url+='&'+rand;
       var httpRequest=CreateHttpRequestObject();
	   var result;
	   var cur;
	   var par;
	if(!httpRequest)
	{
	alert('AJAX not supported.');
		   return false;
	}
		
	function parse_request(){
	if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
				var xmldoc = httpRequest.responseXML;
				if(xmldoc)
				{
				
				 //debug
				 //document.write('<br><textarea style="width:1200px;height:100px">==DATA FROM SERVER== '+httpRequest.responseText+'</textarea>');
				 //first looking for Status
				 //todo: to make it better
					cur=xmldoc.getElementsByTagName('member');
						if(cur[0].childNodes[0].childNodes[0].nodeValue=='Status')
							{
								if(cur[0].childNodes[1].childNodes[0].nodeValue!='Success')
									{ //request error
									//alert('error');
									if(error_callback)error_callback(httpRequest.responseText,xmldoc,param_pass);
									else if(typeof(error_callback_default) == 'function')error_callback_default(httpRequest.responseText,xmldoc,param_pass);
									return false;
									}
							}

					if(cur[1].childNodes[0].childNodes[0].nodeValue=='Value')
					{
					
					//TODO: to make better xml parser
					//response=parse_xml_to_json(httpRequest.responseText);
					response=cur[1].childNodes[1].textContent; //TODO: this is for firefox, have to make it for other browsers too.
					if(typeof(response)!="undefined" && response != '' && response != null)result=eval('('+response.replace(/&quot;/gi, '"').replace(/&apos;/gi, "'")+')');
					response = null;
					//eval('result='+response); //TODO to parse this with json.js if security is required
					//result=eval('(' + parse_xml_to_json() + ')');
					}
								
					if(doupdate)db_callbacks[method](result);
					
					if(callback)callback(result,xmldoc,param_pass);
					
					if(!callback && !async)return result;
					
				}
			 	else
				{
				alert(httpRequest.responseText);
				}
				if(loadvar!=false)
				{
				document.getElementById(loadvar).style.display="none";
				}
			} else {
				if(httpRequest.status!=0)
				alert("Error: status code is " + httpRequest.status);
					}
		}
	}
	
    httpRequest.onreadystatechange = function() { 
		        parse_request();
	};
		
		if(loadvar!=false)
				{
				document.getElementById(loadvar).style.display="";
				}
        httpRequest.open('POST', url, async);
		
		
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		
		//debug
		//document.write('<br><textarea style="width:1200px;height:100px">==DATA TO SERVER== '+data+'</textarea>');
		httpRequest.send(data);
		if(async==false)
		{
		return parse_request();
		}
    
	}


	
pad2 = function(number) {
     return (number < 10 ? '0' : '') + number 
}


//This 2 functions below are copyed and modified from the jquery rpc.
serializeToXml = function(data) {
			switch (typeof data) {
			case 'boolean':
				return '<boolean>'+ ((data) ? '1' : '0') +'</boolean>';
			case 'number':
				var parsed = parseInt(data);
				if(parsed == data) {
					return '<int>'+ data +'</int>';
				}
				return '<double>'+ data +'</double>';
			case 'string':
				return '<string>'+ data +'</string>';
			case 'object':
				if(data instanceof Date) {
					return '<dateTime.iso8601>'+ data.getFullYear() + pad2(data.getMonth()) + pad2(data.getDate()) +'T'+ pad2(data.getHours()) +':'+ pad2(data.getMinutes()) +':'+ pad2(data.getSeconds()) +'</dateTime.iso8601>';
				} else if(data instanceof Array) {
					var ret = '<array><data>';
					for (var i=0; i < data.length; i++) {
						ret += '<value>'+ serializeToXml(data[i]) +"</value>";
					}
					ret += '</data></array>';
					return ret;
				} else {
					var ret = '<struct>';
					for (key in data)
					{
					var value = data[key];
					ret += "<member><name>"+ key +"</name><value>";
					ret += serializeToXml(value) +"</value></member>";
					}
					ret += '</struct>';
					return ret;
				}
			}
		}
xmlRpc = function(method, params) {
			var ret='<?xml version="'+version+'"?><methodCall><methodName>'+method+'</methodName><params>';
			var len=params.length;
			for(var i=0; i<len; i++)ret+="<param><value>"+serializeToXml(params[i])+"</value></param>";
			ret+="</params></methodCall>";
			return ret;
		}



	