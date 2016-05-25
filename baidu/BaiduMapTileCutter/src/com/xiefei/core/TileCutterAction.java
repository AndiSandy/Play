package com.xiefei.core;

import java.io.File;

import javax.servlet.ServletContext;

import org.apache.commons.io.FileUtils;
import org.apache.struts2.util.ServletContextAware;

import com.opensymphony.xwork2.ActionSupport;

public class TileCutterAction extends ActionSupport implements ServletContextAware{
	private double centerX;
	private double centerY;
	private double mercatorX;
	private double mercatorY;
	private int minLevel;
	private int maxLevel;
	private int picLevel;
	
	private File pic;
	private String picFileName;
	private ServletContext context;
	private String savePath;
	
	public double getCenterX() {
		return centerX;
	}
	public void setCenterX(double centerX) {
		this.centerX = centerX;
	}
	public double getCenterY() {
		return centerY;
	}
	public void setCenterY(double centerY) {
		this.centerY = centerY;
	}
	public double getMercatorX() {
		return mercatorX;
	}
	public void setMercatorX(double mercatorX) {
		this.mercatorX = mercatorX;
	}
	public double getMercatorY() {
		return mercatorY;
	}
	public void setMercatorY(double mercatorY) {
		this.mercatorY = mercatorY;
	}
	public int getMinLevel() {
		return minLevel;
	}
	public void setMinLevel(int minLevel) {
		this.minLevel = minLevel;
	}
	public int getMaxLevel() {
		return maxLevel;
	}
	public void setMaxLevel(int maxLevel) {
		this.maxLevel = maxLevel;
	}
	public File getPic() {
		return pic;
	}
	public void setPic(File pic) {
		this.pic = pic;
	}
	
	public String getSavePath() {
		return savePath;
	}
	public void setSavePath(String savePath) {
		this.savePath = savePath;
	}
	public void setPicFileName(String fileName) {
		this.picFileName = fileName;
	}
	public void setServletContext(ServletContext context) {
		this.context = context;
	}
	
	public int getPicLevel() {
		return picLevel;
	}
	public void setPicLevel(int picLevel) {
		this.picLevel = picLevel;
	}
	@Override
	public String execute()throws Exception{
		System.out.println("centerX: " + centerX);
		System.out.println("centerY: " + centerY);
		System.out.println("mercatorX: " + mercatorX);
		System.out.println("mercatorY: " + mercatorY);
		System.out.println("minLevel: " + minLevel);
		System.out.println("maxLevel: " + maxLevel);
		System.out.println("picLevel: " + picLevel);
		try {
			String targetDirectory = context.getRealPath("/upload");
			//int position = picFileName.lastIndexOf(".");   
			//String targetFileName = picFileName.substring(position);
			System.out.println("targetDirectory: " + targetDirectory);
			System.out.println("targetFileName: " + picFileName);
			File target = new File(targetDirectory,picFileName);
			String targetFile = savePath + "\\" + "index.html";//生成html文件保存路径
			FileUtils.copyFile(pic, target);//文件由pic上传到target
			System.out.println("Copying File Success!");
			System.out.println("savePath: " + savePath);//切割图片保存路径
			System.out.println("targetFileName: " + target.getAbsolutePath());
			String saveFilePath = savePath + "\\" + picFileName.substring(0, picFileName.lastIndexOf(".")) + ".png";//待切割文件保存路径
			TileUtils tile = new TileUtils(target.getAbsolutePath(), minLevel, maxLevel, picLevel, mercatorX, mercatorY, saveFilePath);
			tile.cutterAll();
			GenerateHtml gh = new GenerateHtml(centerX, centerY, minLevel, maxLevel, targetFile);
			gh.generate();
			//tile.cutterOne(19);
		}catch(Exception ex) {
			ex.printStackTrace();
		}
		return SUCCESS;
	}
}
