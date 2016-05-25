<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@ taglib prefix="s" uri="/struts-tags" %> 
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>百度地图切图工具</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.3"></script>
	<script type="text/javascript">
		function getData(){
			//var map = new BMap.Map("baiduMap");
			var centerX = document.form1.centerX.value;
			var centerY = document.form1.centerY.value;
			//alert(centerX);
			//alert(centerY);
			var center = new BMap.Point(centerX, centerY);
			/*获取中心点的魔卡托坐标*/
			var projection = new BMap.MercatorProjection();
			var mercatorPoint = projection.lngLatToPoint(center);
			document.form1.mercatorX.value = mercatorPoint.x;
			document.form1.mercatorY.value = mercatorPoint.y;
			document.form1.submit();
			//alert(mercatorPoint.x+","+mercatorPoint.y);
		}
		function chooseDir(){
			var savePath;
			var objSrc = new ActiveXObject("Shell.Application").BrowseForFolder(0,"请选择输出文件夹路径",0,"");
			if(objSrc!=null){
				savePath = objSrc.Items().Item().Path;
				document.form1.savePath.value = savePath;
				//alert(savePath);
			}
		}
	</script>
  </head>
  
  <body>
  	<!--  
  	<div id="baiduMap" style="width:600px,height:800px"></div>
    -->
    
    <form action="cutter" method="post" name="form1" id="form1" enctype="multipart/form-data">
    	请选择需要切图的图片来源<s:file name="pic" label="Picture"/><br/>
    	图片中心的经度坐标<input type="text" name="centerX" id="centerX" value="120.27628"/><br>
    	图片中心的纬度坐标<input type="text" name="centerY"/ id="centerY" value="30.27554"><br>
    	<input type="text" name="mercatorX" id="mercatorX" value="" style="display:none"/>
    	<input type="text" name="mercatorY"/ id="mercatorY" value="" style="display:none">
    	最小级别
    	<select name="minLevel">
    		<option selected>16</option>
    		<option>17</option>
    		<option>18</option>
    		<option>19</option>
    	</select><br>
    	最大级别
    	<select name="maxLevel">
    		<option>16</option>
    		<option>17</option>
    		<option>18</option>
    		<option selected>19</option>
    	</select><br>
    	图片所在级别
    	<select name="picLevel">
    		<option>16</option>
    		<option>17</option>
    		<option>18</option>
    		<option selected>19</option>
    	</select><br>
    	请选择输出目录
    	<input type="text" name="savePath"/>
    	<input type="button" name="selectDir" onClick="chooseDir()" value="浏览"/><br/>
    	<input type="button" value="提交" onClick="getData()"/>
    </form>
  </body>
</html>
