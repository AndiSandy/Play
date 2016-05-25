package com.xiefei.core;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

public class GenerateHtml {
	private double centerX;//经度
	private double centerY;//纬度
	private int minLevel;
	private int maxLevel;
	private String targetFile;
	public GenerateHtml(double centerX, double centerY, int minLevel, int maxLevel, String targetFile){
		this.centerX = centerX;
		this.centerY = centerY;
		this.minLevel = minLevel;
		this.maxLevel = maxLevel;
		this.targetFile = targetFile;
	}
	
	public void generate(){
		String text = "";
		StringBuilder sb = new StringBuilder();
		sb.append("<html>" + "\r\n");
		sb.append("<head>" + "\r\n");
		sb.append("<title>BaiduMap Tile Cutter</title>" + "\r\n");
		sb.append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />" + "\r\n");
		sb.append("<script type=\"text/javascript\" src=\"http://api.map.baidu.com/api?v=1.3\"></script>"  + "\r\n");
		sb.append("</head>" + "\r\n");
		sb.append("<body>" + "\r\n");
		sb.append("<div id=\"baiduMap\" style=\"width:1024px;height:768px\"></div>" + "\r\n");
		sb.append("<script type=\"text/javascript\">" + "\r\n");
		sb.append("var map = new BMap.Map(\"baiduMap\",{minZoom:"+minLevel+",maxZoom:"+maxLevel+"});" + "\r\n");
		sb.append("var point = new BMap.Point("+centerX+", "+centerY+");" + "\r\n");	
		sb.append("map.centerAndZoom(point, "+maxLevel+");" + "\r\n");
		sb.append("var opts = {type:BMAP_NAVIGATION_CONTROL_LARGE,showZoomInfo:true};" + "\r\n");
		sb.append("var navigationControl = new BMap.NavigationControl(opts);" + "\r\n");			
		sb.append("map.addControl(new BMap.NavigationControl(opts));" + "\r\n");
		sb.append("map.addControl(new BMap.OverviewMapControl());" + "\r\n");
		sb.append("map.enableScrollWheelZoom();" + "\r\n");
		sb.append("map.enableContinuousZoom();" + "\r\n");
		sb.append("map.enableInertialDragging();" + "\r\n");	    
		sb.append("var marker = new BMap.Marker(point);" + "\r\n");			    
		sb.append("map.addOverlay(marker);" + "\r\n");
		sb.append("var tileLayer = new BMap.TileLayer({transparentPng: true});" + "\r\n");
		sb.append("tileLayer.getTilesUrl = function(tileCoord, zoom) {" + "\r\n");
		sb.append("var x = tileCoord.x;" + "\r\n");
		sb.append("var y = tileCoord.y;" + "\r\n");
		sb.append("return 'tiles/' + zoom + '/tile' + x + '_' + y + '.png';" + "\r\n");	    
		sb.append("}" + "\r\n");		    
		sb.append("map.addTileLayer(tileLayer);" + "\r\n");    
		sb.append("</script>" + "\r\n");
		sb.append("</body>" + "\r\n");	
		sb.append("</html>" + "\r\n");
		text = sb.toString();
		try {
			PrintWriter out = new PrintWriter(new File(targetFile).getAbsoluteFile());
			try {
				out.print(text);
				System.out.println("success generate index.html");
			} finally {
				out.close();
			}
		} catch(IOException e){
			throw new RuntimeException(e);
		}
	}
}
