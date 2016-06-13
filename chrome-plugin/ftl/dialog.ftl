<!-- 警告框 -->
<div class="alert alert-{{alert.msg.css}} alert-dismissible col-sm-8 fade out" data-top="50" role="alert" id="alert" data-dismiss="auto-center">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
  <span aria-hidden="true">&times;</span></button>
  <strong>{{alert.msg.title}}</strong> {{alert.msg.content}}
</div>