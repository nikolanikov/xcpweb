function xen_core() {
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

this.ApiCall=function(method,params,doupdate,callback,error_callback)
{
var data=this.xmlRpc(method, params);
this.makeRequest(url,'POST',data,1,doupdate,callback,error_callback);
}

this.makeRequest=function(url,method,data,async,doupdate,callback,error_callback) {

       var httpRequest=CreateHttpRequestObject();
	   var result;
	   var cur;
	   var par;
	if(!httpRequest)
	{
	alert('AJAX not supported.');
		   return false;
	}
		
    httpRequest.onreadystatechange = function() { 
		        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
				var xmldoc = httpRequest.responseXML;
				if(xmldoc)
				{
				//first looking for Status
				//todo da go napravq po dobre
					cur=xmldoc.getElementsByTagName('member');
						if(cur[0].childNodes[0].childNodes[0].nodeValue=='Status')
							{
								if(cur[0].childNodes[1].childNodes[0].nodeValue!='Success')
									{ //request error
									alert('error '+httpRequest.responseText);
									// call error_callback
									return;
									}
							}

					if(cur[1].childNodes[0].childNodes[0].nodeValue=='Value')
					{
					result=eval('(' + cur[1].childNodes[1].childNodes[0].nodeValue + ')');
					}
					
					
					if(doupdate)
					{
					//update the global database
					}
					
					if(callback)
					{
					callback(result,xmldoc);
					}
				}
			 	else
				{
				alert(httpRequest.responseText);
				}
				if(loadvar==false)
				{
				document.getElementById(loadvar).style.display="none";
				}
			} else {
				if(httpRequest.status!=0)
				alert("Error: status code is " + httpRequest.status);
					}
		}
	};
		
		if(loadvar!=false)
				{
				document.getElementById(loadvar).style.display="";
				}
        httpRequest.open(method, url, async);

		if(method=='POST')
		{
			httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}

		httpRequest.send(data);
	
    }

this.serializeToXml=function(data) {
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
					var ret = '<array><data>'+"\n";
					for (var i=0; i < data.length; i++) {
						ret += '  <value>'+ serializeToXml(data[i]) +"</value>\n";
					}
					ret += '</data></array>';
					return ret;
				} else {
					var ret = '<struct>'+"\n";
					for (key in data)
					{
					var value = data[key];
					ret += "  <member><name>"+ key +"</name><value>";
					ret += serializeToXml(value) +"</value></member>\n";
					}
					ret += '</struct>';
					return ret;
				}
			}
		}
this.xmlRpc=function(method, params) {
			var ret='<?xml version="'+version+'"?><methodCall><methodName>'+method+'</methodName><params>';
			var len=params.length;
			for(var i=0; i<len; i++) {
				ret+="<param><value>"+this.serializeToXml(params[i])+"</value></param>";
			}
			ret+="</params></methodCall>";
			return ret;
		}
}
	