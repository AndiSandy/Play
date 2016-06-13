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
				<label class="col-sm-1 control-label">资源域名:</label>
				<div class="col-sm-3"><input type="text" class="form-control" ng-model="params.host" placeholder="资源域名"></div>
			</div>
			<div class="form-group col-sm-12">
				<label class="col-sm-1 control-label">资源url:</label>
				<div class="col-sm-6"><input type="text" class="form-control" ng-model="params.urls" placeholder="资源url,逗号分隔"></div>
			</div>       
			<button class="btn btn-default col-sm-offset-1" ng-click="model.save()"><i class="fa fa-search"></i>保存</button>
		 	
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

	