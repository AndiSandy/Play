<div class="main-content" ng-controller="configCtrl">
	
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
				<button class="btn btn-default" ng-click="model.add()"><i class="fa fa-search"></i>添加</button>
				<button class="btn btn-default" ng-click="model.save()"><i class="fa fa-search"></i>保存</button>
			</div>

			<table class="table">
			  <thead>
			    <tr>
			      <th>#</th>
			      <th>配置名称</th>
			      <th>配置描述</th>
			      <th>配置内容</th>
			      <th>配置备注</th>
			    </tr>
			  </thead>
			  <tbody>
			    <tr ng-repeat="pojo in configList track by $index" tabindex="{{$index+1}}">
			      <td>{{$index}}</td>
			      <td><input type="text" class="form-control col-sm-2" ng-model="pojo.name" placeholder="配置名称"></td>
			      <td><input type="text" class="form-control col-sm-2" ng-model="pojo.desc" placeholder="配置描述"></td>
			      <td><input type="text" class="form-control col-sm-4" ng-model="pojo.value" placeholder="配置内容"></td>
			      <td><input type="text" class="form-control col-sm-2" ng-model="pojo.memo" placeholder="配置备注"></td>
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

	