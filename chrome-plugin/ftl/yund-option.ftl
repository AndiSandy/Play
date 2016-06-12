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
		<a href="#model-{{modelid}}" class="panel-heading" data-toggle="collapse">{{model.title}}</a>
		<div id="page-{{modelid}}" class="panel-collapse panel-body collapse in">
		       
			content
		 
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

</div>

	