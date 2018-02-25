!function(){"use strict";angular.module("cra",["ngResource","ui.router","ui.calendar","ngDragDrop","ngTable","AdalAngular","ui.bootstrap","angularSpinner","ui.select","ngSanitize","angularFileUpload","colorpicker.module","LocalStorageModule","chart.js"])}(),function(){"use strict";angular.module("cra").factory("appsettings",["$http",function(a){return a.get("settings.json").then(function(a){return a.data})}]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider","$provide","adalAuthenticationServiceProvider","appconfig","localStorageServiceProvider",function(a,b,c,d,e,f,g,h){c.html5Mode(!0).hashPrefix("!");var i={};i[g.baseApiUrl]=g.apiUriId,f.init({tenant:g.azTenant,clientId:g.azIdClient,endpoints:i},d),a.state("home",{url:"/",templateUrl:"home/home.html",requireADLogin:!0}).state("cra",{url:"/cra",templateUrl:"cra/cra.html",requireADLogin:!0}).state("mission",{url:"/mission",template:"<ui-view/>"}).state("mission.list",{url:"/list",templateUrl:"mission/list/missions.html",requireADLogin:!0}).state("mission.edit",{url:"/edit/{id}",templateUrl:"mission/edit/edit.html",requireADLogin:!0}).state("mission.create",{url:"/create",templateUrl:"mission/create/create.html",requireADLogin:!0}).state("client",{url:"/client",template:"<ui-view/>"}).state("client.list",{url:"/list",templateUrl:"client/list/clients.html",requireADLogin:!0}).state("client.edit",{url:"/edit/{id}",templateUrl:"client/edit/edit.html",requireADLogin:!0}).state("client.create",{url:"/create",templateUrl:"client/create/create.html",requireADLogin:!0}).state("invoice",{url:"/invoice",template:"<ui-view/>"}).state("invoice.monthly",{url:"/monthly",templateUrl:"invoice/monthlyInvoice/monthlyInvoice.html",requireADLogin:!0}).state("invoice.list",{url:"/list",templateUrl:"invoice/list/Invoices.html",requireADLogin:!0}).state("invoice.parameters",{url:"/parameters",templateUrl:"invoice/parameters/invoiceParameters.html",requireADLogin:!0}),b.otherwise(function(a,b){console.log("default route is beeing hit");var c=a.get("$state");c.go("cra")}),d.interceptors.push("httpInterceptor"),h.setPrefix("scopit.teamsite")}])}(),String.prototype.supplant=function(a){return this.replace(/{([^{}]*)}/g,function(b,c){var d=a[c];return"string"==typeof d||"number"==typeof d?d:b})},function(){"use strict";function a(a,b,c){a.client={},a.create=function(){c.save(a.client).$promise.then(function(a){b.go("client.list")},function(a){console.log("An error occured. "+a.statusText)})}}angular.module("cra").controller("clientCreateController",["$scope","$state","clientService",a])}(),function(){"use strict";function a(a,b){a.confirmDelete=function(){b.close()},a.cancel=function(){b.dismiss("cancel")}}angular.module("cra").controller("deleteModalController",["$scope","$uibModalInstance",a])}(),function(){"use strict";function a(a,b,c,d){a.update=function(){d.update(a.client).$promise.then(function(a){c.go("client.list")},function(a){console.log("An error occured. "+a.statusText)})},d.loadClient(b.id).$promise.then(function(b){a.client=b})}angular.module("cra").controller("clientEditController",["$scope","$stateParams","$state","clientService",a])}(),function(){"use strict";function a(a,b,c,d,e,f,g){a.globalSearchTerm=null,a.tableParams=new b({count:10,sorting:{client:"asc",name:""}},{getData:function(a,b){f.getData().$promise.then(function(d){var e=_(d).filter({deletedBy:null}).value(),f=b.filter()?c("filter")(e,b.filter()):e,g=b.sorting()?c("orderBy")(f,b.orderBy()):f;b.total(g.length),g=g.slice((b.page()-1)*b.count(),b.page()*b.count()),a.resolve(g)})}}),a.applyGlobalSearch=function(){var b=a.globalSearchTerm;a.tableParams.filter({$:b}),a.tableParams.reload()},a.create=function(){d.go("client.create")},a.edit=function(a){d.go("client.edit",{id:a.id})},a.delete=function(b){var c=e.open({animation:!0,templateUrl:"/client/delete/deletemodal.html",controller:"deleteModalController",size:"md",resolve:{client:function(){return b}}});c.result.then(function(){console.log("Modal acknowledged at: "+new Date),f.markDelete(b.id).$promise.then(function(b){a.tableParams.reload()},function(a){console.log("An error occured while deleting client."+a.statusText)})},function(){console.log("delete modal dismissed at: "+new Date)}),console.log("deleting "+b)},g.isSupported&&(g.bind(a,"globalSearchTerm",null,"clients.searchFilter"),null!=a.globalSearchTerm&&a.applyGlobalSearch())}angular.module("cra").controller("clientListController",["$scope","NgTableParams","$filter","$state","$uibModal","clientService","localStorageService",a])}(),function(){"use strict";angular.module("cra").constant("appconfig",{baseApiUrl:"https://api.scop-it.com/api",azTenant:"SCOPIT.onmicrosoft.com",azIdClient:"1f92de6d-8fa3-4f3b-bc95-317849841211",apiUriId:"http://SCOPIT.onmicrosoft.com/api"})}(),function(){"use strict";function a(a,b,c,d,e,f,g,h){function i(c,d){var e=b("<scop-remove-event></scop-remove-event>")({event:c,collection:a.eventSources[0],callback:a.save,mainscope:a});null!=c.missionId&&d.find(".fc-content").prepend(e),d.attr("data-toggle","tooltip"),d.attr("data-original-title",c.title)}function j(b,c){var e=d.calendars.calendar.fullCalendar("getDate"),f=m(c.target.attributes["data-mission"].value);a.eventSources[0].push({title:"["+f.client+"] - "+f.name,missionId:f.id,start:new Date(b),stick:!0,allDay:!0,color:null!=f.color?f.color:"",constraint:{start:moment(e).startOf("month"),end:moment(e).startOf("month").add(1,"month")}}),a.save()}function k(b){var c=_(a.eventSources[0]).find({_id:b._id});_.merge(c,b),a.save()}function l(b,c){console.log("changing view to "+b.name);var d=_(a.eventSources[0]).any(function(a,c){return b.calendar.moment(a.start).format("MM")===b.calendar.getDate().format("MM")&&b.calendar.moment(a.start).format("YYYY")===b.calendar.getDate().format("YYYY")});!d&&null!=a.missions&&a.missions.length>0&&o();var e=_(a.eventSources[1]).any(function(a,c){return b.calendar.moment(a.start).format("YYYY")===b.calendar.getDate().format("YYYY")});e||n()}a.showSpinner=!0,a.missions=null,a.clients=null,a.eventSources=[[],[]];var m=function(b){return _(a.missions).where({id:b}).first()};a.uiConfig={calendar:{height:"auto",editable:!0,droppable:!0,defaultView:"month",lang:"fr",header:{left:"prev,next today",center:"title",right:"month,agendaWeek,agendaDay"},eventRender:i,eventDragStop:function(){$('[role="tooltip"]').tooltip("destroy")},drop:j,viewRender:l,eventResize:function(a,b,c){k(a)},eventDrop:function(a,b,c){k(a)},timezone:"local"}};var n=function(){var b=moment(new Date);e.loadHolidays(b.format("YYYY")).$promise.then(function(b){angular.forEach(b,function(b,c){a.eventSources[1].push({title:b.name,start:new Date(b.start),allDay:!0,stick:!0,color:"#dd4b39",editable:!1})})})},o=function(){var b=d.calendars.calendar.fullCalendar("getDate");a.showSpinner=!0,e.loadSchedule(b.format("YYYY"),b.format("MM")).$promise.then(function(c){angular.forEach(c,function(c,d){var e=c;angular.forEach(e.events,function(c,d){var e=m(c.missionId);null!=e&&a.eventSources[0].push({title:"["+e.client+"] - "+e.name,start:new Date(c.start),end:null!=c.end?new Date(c.end):null,allDay:c.allDay,missionId:e.id,stick:!0,color:null!=e.color?e.color:"",constraint:{start:moment(b).startOf("month"),end:moment(b).startOf("month").add(1,"month")}})})}),a.showSpinner=!1})},p=function(){if(null==d.calendars||null==d.calendars.calendar)return _();var b=d.calendars.calendar.fullCalendar("getDate");return _(a.missions).where({consultant:h.userInfo.userName}).filter({deletedBy:null}).filter(function(b){return null==_(a.clients).find({id:b.clientId}).deletedBy}).filter(function(a){return moment(a.startDate).format("YYYYMM")<=b.format("YYYYMM")&&moment(a.endDate).format("YYYYMM")>=b.format("YYYYMM")}).sortByOrder("endDate","desc")};a.getRecentMissions=function(){return p().take(5)},a.getDisplayableMissions=function(){var b=0,c=["green","burlywood","deepskyblue","blueviolet","crimson"],d=a.getRecentMissions().union(a.addedMissions).forEach(function(a){null==a.color&&(a.color=c[b%c.length],b++)}).value();return d},a.getSearchableMissions=function(){return p().difference(a.getDisplayableMissions()).value()},a.addmission=function(){a.canAddMission&&(console.log("adding mission : "+a.missionToAdd.selected.name),a.addedMissions.push(a.missionToAdd.selected),a.missionToAdd={})},a.canAddMission=function(){return _(a.missionToAdd).isEmpty()},a.missionToAdd={},a.addedMissions=[];var q=function(){var b=d.calendars.calendar.fullCalendar("getDate"),c={Month:b.format("MM"),Year:b.format("YYYY"),User:h.userInfo.userName,Events:[]};return _(a.eventSources[0]).filter(function(a){return moment(a.start).format("MM")===c.Month&&moment(a.start).format("YYYY")===c.Year}).forEach(function(a){var b={MissionId:a.missionId,Start:a.start,End:a.end,AllDay:a.allDay};c.Events.push(b)}).value(),c};a.save=function(){console.log("saving");var a=q();e.saveSchedule(a)},f.getData().$promise.then(function(b){g.getData().$promise.then(function(c){a.clients=c;var d=_(b).forEach(function(a){a.client=_(c).find({id:a.clientId}).name}).value();return d}).then(function(b){a.missions=b,o()})})}angular.module("cra").controller("craController",["$scope","$compile","$filter","uiCalendarConfig","consultantService","missionService","clientService","adalAuthenticationService",a])}(),function(){"use strict";function a(a){return function(b,c){console.log("Exception handler. "+b+" "+c);var d=a.get("$uibModal");d.open({animation:!0,templateUrl:"/errors/exceptionmodal.html",windowClass:"modal-danger",controller:"exceptionModalController",size:"md"})}}angular.module("cra").decorator("$exceptionHandler",["$injector",a])}(),function(){"use strict";function a(a){return{require:"ngModel",link:function(b,c,d,e){return a(function(){var a=d.value;return b.$watch(d.ngModel,function(){$(c).iCheck("update")}),$(c).iCheck({checkboxClass:"icheckbox_flat-red",radioClass:"iradio_flat-red"}).on("ifChanged",function(f){if("checkbox"===$(c).attr("type")&&d.ngModel&&b.$apply(function(){return e.$setViewValue(f.target.checked)}),"radio"===$(c).attr("type")&&d.ngModel)return b.$apply(function(){return e.$setViewValue(a)})})})}}}angular.module("cra").directive("icheck",["$timeout",a])}(),function(){"use strict";function a(){return{require:"ngInclude",restrict:"A",link:function(a,b,c){b.replaceWith(b.children())}}}angular.module("cra").directive("includeReplace",[a])}(),function(){"use strict";function a(){return{templateUrl:"directives/removeeventtpl.html",replace:!0,link:function(a,b,c,d,e){var f=a.collection,g=a.event,h=a.mainscope;b.on("click",function(){h.$apply(function(){console.log("removing {title} [id:{id}]".supplant({title:g.title,id:g._id})),angular.forEach(f,function(b,c){f[c]._id===g._id&&(f.splice(c,1),a.callback())})})})}}}angular.module("cra").directive("scopRemoveEvent",[a])}(),function(){"use strict";function a(a){return{replace:!0,transclude:!0,scope:{ngChange:"&",val:"=ngModel",ngTrueVal:"=?",ngFalseVal:"=?",ngNoVal:"=?"},template:"<i class=\"glyphicon \" ng-class=\"{'glyphicon-check text-success': val == ngTrueVal, 'glyphicon-unchecked text-danger': val == ngFalseVal, 'glyphicon-unchecked text-muted': val == ngNoVal}\" ng-click=\"toggle()\"/>",link:function(b){b.toggle=function(){b.val===b.ngTrueVal?b.val=b.ngFalseVal:b.val===b.ngFalseVal?b.val=b.ngNoVal:b.val=b.ngTrueVal,"undefined"!=typeof b.ngChange&&a(function(){b.ngChange(b.val)})},angular.isDefined(b.ngTrueVal)||(b.ngTrueVal=!0),angular.isDefined(b.ngFalseVal)||(b.ngFalseVal=!1),angular.isDefined(b.ngNoVal)||(b.ngNoVal=void 0),angular.isDefined(b.val)||(b.val=b.ngNoVal)}}}angular.module("cra").directive("triStateCheck",["$timeout",a])}(),function(){"use strict";function a(a,b){a.cancel=function(){b.dismiss("cancel")}}angular.module("cra").controller("exceptionModalController",["$scope","$uibModalInstance",a])}(),function(){"use strict";function a(a,b,c){a.error=c.error,a.cancel=function(){b.dismiss("cancel")}}angular.module("cra").controller("serverExceptionModalController",["$scope","$uibModalInstance","param",a])}(),function(){"use strict";function a(a,b,c){return{responseError:function(b){if(null!=b){var d=c.get("$uibModal");d.open({animation:!0,templateUrl:"/errors/serverExceptionmodal.html",windowClass:"modal-danger",controller:"serverExceptionModalController",size:"md",resolve:{param:function(){return{error:{status:b.status,statusText:b.statusText}}}}})}return a.reject(b)}}}angular.module("cra").factory("httpInterceptor",["$q","$location","$injector",a])}(),function(){"use strict";function a(a){var b=this;a.then(function(a){b.version=a.version})}angular.module("cra").controller("footerController",["appsettings",a])}(),function(){"use strict";function a(a){function b(){a.scheduledDays(c.Period.getFullYear(),c.Period.getMonth()+1).$promise.then(function(a){c.scheduledDays.labels=_(a).map("consultant").value(),c.scheduledDays.series=["Nb jours"],c.scheduledDays.data=_(a).map("duration").value(),c.scheduledDays.options={tooltips:{callbacks:{title:function(a,b){var c=a[0].index;return b.labels[c]}}},scales:{xAxes:[{gridLines:{display:!1},ticks:{callback:function(a,b,c){return a.substring(0,3)}}}],yAxes:[{type:"linear",ticks:{beginAtZero:!0},gridLines:{display:!1}}]}}})}var c=this;this.scheduledDays={},this.Period=new Date,this.picker={opened:!1},this.openPicker=function(){this.picker.opened=!0},this.changedate=function(){null==this.Period||isNaN(this.Period.getTime())||b()},b()}angular.module("cra").controller("homeController",["kpiService",a])}(),function(){"use strict";function a(a,b,c,d,e,f,g){function h(a){return console.log("generating an invoice"),d.generateInvoice(a.year,a.month,a.missionId).$promise.then(function(b){return a.invoiceId=b.id,a})}this.Period=new Date;var i=this;this.picker={opened:!1},this.tableParams=new a({count:10,sorting:{mission:"asc",name:""}},{getData:function(a,c){var e=i.Period;d.loadMonthlyInvoices(e.getFullYear(),e.getMonth()+1).$promise.then(function(d){var e=c.filter()?b("filter")(d,c.filter()):d,f=c.sorting()?b("orderBy")(e,c.orderBy()):e;c.total(f.length),f=f.slice((c.page()-1)*c.count(),c.page()*c.count()),a.resolve(f)})}}),this.changedate=function(){null==this.Period||isNaN(this.Period.getTime())||i.tableParams.reload()},this.openPicker=function(){this.picker.opened=!0},this.changePaidStatus=function(a){if(null!=a.invoiceId)return d.paidStatusChanged({Id:a.invoiceId,Paid:!a.paid}).$promise.then(function(b){a.paid=!a.paid})},this.download=function(a){var b;b=null==a.invoiceId?h(a):Promise.resolve(a),b.then(function(a){f.downloadFile(e.baseApiUrl+"/invoice/download/"+a.invoiceId,"application/vnd.openxmlformats-officedocument.wordprocessingml.document")})},this.regenerate=function(a){console.log("regenerate");var b=this;h(a).then(function(a){b.download(a)})}}angular.module("cra").controller("invoiceListController",["NgTableParams","$filter","$state","invoiceService","appconfig","fileDownloadService","$scope",a])}(),function(){"use strict";function a(a,b,c,d,e,f,g){function h(a){return console.log("generating an invoice"),e.generateInvoice(a.year,a.month,a.missionId).$promise.then(function(b){return a.invoiceId=b.id,a})}a.tableParams=new b({count:10,sorting:{mission:"asc",name:""}},{getData:function(a,b){var d=new Date;e.loadMonthlyInvoices(d.getFullYear(),d.getMonth()+1).$promise.then(function(d){var e=b.filter()?c("filter")(d,b.filter()):d,f=b.sorting()?c("orderBy")(e,b.orderBy()):e;b.total(f.length),f=f.slice((b.page()-1)*b.count(),b.page()*b.count()),a.resolve(f)})}}),a.download=function(a){var b;b=null==a.invoiceId?h(a):Promise.resolve(a),b.then(function(a){g.downloadFile(f.baseApiUrl+"/invoice/download/"+a.invoiceId,"application/vnd.openxmlformats-officedocument.wordprocessingml.document")})},a.regenerate=function(a){console.log("regenerate");var b=this;h(a).then(function(a){b.download(a)})}}angular.module("cra").controller("monthlyInvoiceController",["$scope","NgTableParams","$filter","$state","invoiceService","appconfig","fileDownloadService",a])}(),function(){"use strict";function a(a,b,c,d,e,f){function g(){c.loadTemplates().$promise.then(function(b){a.templates=b,h()})}function h(){c.loadConfiguration().$promise.then(function(b){a.params=b,i(b)})}function i(b){_(a.templates).where({id:b.templateFileId}).value().forEach(function(a){a.isSelected=!0})}var j=function(){_(a.templates).value().forEach(function(a){a.isSelected=!1})},k="unauthentified",l=e.getResourceForEndpoint(b.baseApiUrl);if(null!=l){var m=e.getCachedToken(l);k="Bearer "+m}a.uploader=new d({autoUpload:!0,headers:{Authorization:k},url:b.baseApiUrl+"/invoice/template",withCredential:!0,onBeforeUploadItem:function(b){console.log("before upload : "+b.file.name);var c={name:b.file.name,isCurrent:!0,isError:!1,isSuccess:!1};a.templates.push(c)},onErrorItem:function(b){console.log("Item error : "+b.file.name),_(a.templates).where({name:b.file.name}).value().forEach(function(a){a.isError=!0})},onSuccessItem:function(a){console.log("Item succeeded : "+a.file.name),g()}}),a.Select=function(b){b.isSelected||(j(),b.isSelected=!0,a.params.templateFileId=b.id,c.saveConfiguration(a.params))},a.save=function(){c.saveConfiguration(a.params)},a.templates=[],a.deleteTemplate=function(a){c.deleteTemplate(a).$promise.then(function(){g()})},a.downloadTemplate=function(a){f.downloadFile(b.baseApiUrl+"/invoice/template/"+a,"application/vnd.openxmlformats-officedocument.wordprocessingml.document")},g()}angular.module("cra").controller("invoiceParametersController",["$scope","appconfig","invoiceService","FileUploader","adalAuthenticationService","fileDownloadService",a])}(),function(){"use strict";function a(a,b,c,d,e){a.mission={billable:!0},a.selectedClient={},a.clientsRef=[],a.selectedConsultant={},a.consultantsRef=[],a.startPicker={opened:!1},a.endPicker={opened:!1},a.create=function(){a.mission.clientId=a.selectedClient.selected.id,a.mission.consultant=a.selectedConsultant.selected.email,c.save(a.mission).$promise.then(function(a){b.go("mission.list")},function(a){console.log("An error occured. "+a.statusText)})},e.getData().$promise.then(function(b){a.consultantsRef=b,a.selectedConsultant.selected=_(a.consultantsRef).find({email:a.mission.consultant})}),d.getData().$promise.then(function(b){a.clientsRef=b,a.selectedClient.selected=_(a.clientsRef).find({id:a.mission.clientId})}),a.searchedClient={name:""},a.openStartPicker=function(){a.startPicker.opened=!0},a.openEndPicker=function(){a.endPicker.opened=!0}}angular.module("cra").controller("missionCreateController",["$scope","$state","missionService","clientService","consultantService",a])}(),function(){"use strict";function a(a,b){a.confirmDelete=function(){b.close()},a.cancel=function(){b.dismiss("cancel")}}angular.module("cra").controller("deleteModalController",["$scope","$uibModalInstance",a])}(),function(){"use strict";function a(a,b,c,d,e,f){a.selectedClient={},a.clientsRef=[],a.selectedConsultant={},a.consultantsRef=[],a.startPicker={opened:!1},a.endPicker={opened:!1},a.update=function(){a.mission.clientId=a.selectedClient.selected.id,a.mission.consultant=a.selectedConsultant.selected.email,d.update(a.mission).$promise.then(function(a){c.go("mission.list")},function(a){console.log("An error occured. "+a.statusText)})},d.loadMission(b.id).$promise.then(function(b){b.startDate=new Date(b.startDate),b.endDate=new Date(b.endDate),a.mission=b,f.getData().$promise.then(function(b){a.consultantsRef=b,a.selectedConsultant.selected=_(a.consultantsRef).find({email:a.mission.consultant})}),e.getData().$promise.then(function(b){a.clientsRef=b,a.selectedClient.selected=_(a.clientsRef).find({id:a.mission.clientId})})}),a.searchedClient={name:""},a.openStartPicker=function(){a.startPicker.opened=!0},a.openEndPicker=function(){a.endPicker.opened=!0}}angular.module("cra").controller("missionEditController",["$scope","$stateParams","$state","missionService","clientService","consultantService",a])}(),function(){"use strict";function a(a,b,c,d,e,f,g,h){a.globalSearchTerm=null,a.tableParams=new b({count:10,sorting:{client:"asc",name:""}},{getData:function(a,b){f.getData().$promise.then(function(a){var b=_(a).filter({deletedBy:null}).value();return b}).then(function(d){g.getData().$promise.then(function(a){var b=_(d).forEach(function(b){b.client=_(a).find({id:b.clientId}).name}).value();return b}).then(function(d){var e=b.filter()?c("filter")(d,b.filter()):d,f=b.sorting()?c("orderBy")(e,b.orderBy()):e;b.total(f.length),f=f.slice((b.page()-1)*b.count(),b.page()*b.count()),a.resolve(f)})})}}),a.applyGlobalSearch=function(){var b=a.globalSearchTerm;a.tableParams.filter({$:b}),a.tableParams.reload()},a.create=function(){d.go("mission.create")},a.edit=function(a){d.go("mission.edit",{id:a.id})},a.delete=function(b){var c=e.open({animation:!0,templateUrl:"/mission/delete/deletemodal.html",controller:"deleteModalController",size:"md",resolve:{mission:function(){return b}}});c.result.then(function(){console.log("Modal acknowledged at: "+new Date),f.markDelete(b.id).$promise.then(function(b){a.tableParams.reload()},function(a){console.log("An error occured while deleting mission."+a.statusText)})},function(){console.log("delete modal dismissed at: "+new Date)}),console.log("deleting "+b)},h.isSupported&&(h.bind(a,"globalSearchTerm",null,"missions.searchFilter"),null!=a.globalSearchTerm&&a.applyGlobalSearch())}angular.module("cra").controller("missionListController",["$scope","NgTableParams","$filter","$state","$uibModal","missionService","clientService","localStorageService",a])}(),function(){"use strict";function a(a,b){a.username=b.userInfo.userName}angular.module("cra").controller("profileController",["$scope","adalAuthenticationService",a])}(),function(){"use strict";function a(a,b){var c=a(b.baseApiUrl+"/client/:Id",null,{update:{method:"put",url:b.baseApiUrl+"/client",isArray:!1},save:{method:"post",url:b.baseApiUrl+"/client",isArray:!1},delete:{method:"delete",url:b.baseApiUrl+"/client/:Id",isArray:!1}}),d=function(){return c.query()},e=function(a){return c.get({Id:a})},f=function(a){return c.update(a)},g=function(a){return c.save(a)},h=function(a){return c.delete({Id:a})},i={getData:d,loadClient:e,update:f,save:g,markDelete:h};return i}angular.module("cra").factory("clientService",["$resource","appconfig",a])}(),function(){"use strict";function a(a,b){var c=a(b.baseApiUrl+"/consultant/:id",null,{getSchedule:{method:"get",url:b.baseApiUrl+"/consultant/:year/:month/schedule",isArray:!0,data:!1,headers:{"Content-Type":"application/json; charset=UTF-8"}},postSchedule:{method:"post",url:b.baseApiUrl+"/consultant/schedule",isArray:!0},getHolidays:{method:"get",url:b.baseApiUrl+"/consultant/holidays/:year",isArray:!0}}),d=function(){return c.query()},e=function(a,b){return c.getSchedule({year:a,month:b})},f=function(a){c.postSchedule(a)},g=function(a){return c.getHolidays({year:a})},h={getData:d,loadSchedule:e,saveSchedule:f,loadHolidays:g};return h}angular.module("cra").factory("consultantService",["$resource","appconfig",a])}(),function(){"use strict";function a(a){function b(a){var b=a("Content-Disposition"),c=b.split(";")[1].trim().split("=")[1];return c.replace(/"/g,"")}var c=function(c,d){a({url:c,method:"GET",params:{},headers:{"content-type":d},responseType:"arraybuffer"}).success(function(a,c,e,f){var g=new Blob([a],{type:d}),h=URL.createObjectURL(g),i=document.createElement("a");i.href=h,i.target="_blank",i.download=b(e),document.body.appendChild(i),i.click()})},d={downloadFile:c};return d}angular.module("cra").factory("fileDownloadService",["$http",a])}(),function(){"use strict";function a(a,b){var c=a(b.baseApiUrl+"/invoice/:id",null,{getTemplates:{method:"get",url:b.baseApiUrl+"/invoice/templates",isArray:!0},deleteTemplate:{method:"delete",url:b.baseApiUrl+"/invoice/template/:Id",isArray:!1},saveConfiguration:{method:"post",url:b.baseApiUrl+"/invoice/configuration"},loadConfiguration:{method:"get",url:b.baseApiUrl+"/invoice/configuration"},monthlyInvoices:{method:"get",url:b.baseApiUrl+"/invoice/:year/:month",isArray:!0},generateInvoice:{method:"post",url:b.baseApiUrl+"/invoice/generate/:year/:month/:missionid",params:{year:"@year",month:"@month",missionid:"@missionid"},isArray:!1},paidStatusChanged:{method:"patch",url:b.baseApiUrl+"/invoice/paid",isArray:!1}}),d=function(){return c.getTemplates()},e=function(a){return c.deleteTemplate({Id:a})},f=function(a){return c.saveConfiguration(a)},g=function(){return c.loadConfiguration()},h=function(a,b){return c.monthlyInvoices({year:a,month:b})},i=function(a,b,d){return c.generateInvoice({year:a,month:b,missionid:d})},j=function(a){return c.paidStatusChanged(a)},k={loadTemplates:d,deleteTemplate:e,saveConfiguration:f,loadConfiguration:g,loadMonthlyInvoices:h,generateInvoice:i,paidStatusChanged:j};return k}angular.module("cra").factory("invoiceService",["$resource","appconfig",a])}(),function(){"use strict";function a(a,b){var c=a(b.baseApiUrl+"/kpi/",null,{scheduledDays:{method:"get",url:b.baseApiUrl+"/kpi/scheduleddays/:year/:month",isArray:!0,data:!1,headers:{"Content-Type":"application/json; charset=UTF-8"}}}),d=function(a,b){return c.scheduledDays({year:a,month:b})},e={scheduledDays:d};return e}angular.module("cra").factory("kpiService",["$resource","appconfig",a])}(),function(){"use strict";function a(a,b){var c=a(b.baseApiUrl+"/mission/:Id",null,{update:{method:"put",url:b.baseApiUrl+"/mission",isArray:!1},save:{method:"post",url:b.baseApiUrl+"/mission",isArray:!1},delete:{method:"delete",url:b.baseApiUrl+"/mission/:Id",isArray:!1}}),d=function(){return c.query()},e=function(a){return c.get({Id:a})},f=function(a){return c.update(a)},g=function(a){return c.save(a)},h=function(a){return c.delete({Id:a})},i={getData:d,loadMission:e,update:f,save:g,markDelete:h};return i}angular.module("cra").factory("missionService",["$resource","appconfig",a])}(),function(){"use strict";function a(a,b){a.isMissionMenuActive=function(){return b.includes("mission")},a.isInvoiceMenuActive=function(){return b.includes("invoice")},a.isInvoiceParametersMenuActive=function(){return b.includes("invoice.parameters")},a.isMonthlyInvoiceMenuActive=function(){return b.includes("invoice.monthly")},a.isInvoiceListMenuActive=function(){return b.includes("invoice.list")},a.isClientMenuActive=function(){return b.includes("client")}}angular.module("cra").controller("sidebarController",["$scope","$state",a])}();