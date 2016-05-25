<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8"  pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>操作成功</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

  </head>
  <%
  	String from = (String)request.getParameter("from");
  	String result = (String)request.getAttribute("result");
   %>
  <body>
  <% if(from!=null &&!from.equals("")) {
  		if(from.equals("4")){
  %>
  	操作结果：<%= result%> 
  <%
  		}
  	}
   %>
    操作成功！ <br>
  </body>
</html>
