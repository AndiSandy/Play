<div class="main-content" ng-controller="yundCtrl">
	
	<!-- [[header -->
	<div class="header">
	<h1 class="page-title">{{sys.backendName}}</h1>
	<ul class="breadcrumb">
	    <li><a href="javascript:void(0);">Home</a> </li>
	    <li class="active">{{model.title}}</li>
	</ul>
	</div>
	<!-- ]]header -->

    <div class="panel panel-default">
		<a href="javascript:void(0);" data-target="#model-{{model.modelid}}" class="panel-heading" data-toggle="collapse">{{model.title}}</a>
		<div id="model-{{model.modelid}}" class="panel-collapse panel-body collapse in">
			<div class="form-group col-sm-12">
				<label class="col-sm-1 control-label">资源服务器:</label>
				<div class="col-sm-3"><input type="text" class="form-control" ng-model="params.host" placeholder="资源域名"></div>
				<button class="btn btn-default" ng-click="model.add()"><i class="fa fa-search"></i>添加</button>
				<button class="btn btn-default" ng-click="model.save()"><i class="fa fa-search"></i>保存</button>
			</div>

			<table class="table">
			  <thead>
			    <tr>
			      <th>#</th>
			      <th class="col-sm-1">加载项</th>
			      <th class="col-sm-2">加载条件</th>
			      <th class="col-sm-2">资源服务器</th>
			      <th class="col-sm-4">脚本资源</th>
			      <th class="col-sm-3">样式资源</th>
			    </tr>
			  </thead>
			  <tbody>
			    <tr ng-repeat="pojo in resources track by $index" tabindex="{{$index+1}}">
			      <td>{{$index}}</td>
			      <td><input type="text" class="form-control" ng-model="pojo.name" placeholder="加载项"></td>
			      <td><input type="text" class="form-control" ng-model="pojo.matches" placeholder="加载条件"></td>
			      <td><input type="text" class="form-control" ng-model="pojo.host" placeholder="资源服务器"></td>
			      <td><input type="text" class="form-control" ng-model="pojo.scriptsTxt" placeholder="脚本资源"></td>
			      <td><input type="text" class="form-control" ng-model="pojo.stylesheetsTxt" placeholder="样式资源"></td>
			    </tr>
			  </tbody>
			</table>
		 	
		</div>
    </div>

    <!-- [[footer -->
	<footer>
	    <hr>
	    <!-- Purchase a site license to remove this link from the footer: http://www.portnine.com/bootstrap-themes -->
	    <p class="pull-right">A <a href="http://www.portnine.com/bootstrap-themes" target="_blank">Free Bootstrap Theme</a> by <a href="http://www.portnine.com" target="_blank">Portnine</a></p>
	    <p>© 2014 <a href="http://www.portnine.com" target="_blank">Portnine</a></p>
	</footer>
	<!-- ]]footer -->
	
	<!--div ng-include="'ftl/dialog.ftl'"></div-->
</div>

	