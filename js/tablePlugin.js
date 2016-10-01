"use strict";
;
(function(root,factory,pluginName){
		factory(root.jQuery,pluginName);
	})(window,function($,plugin){

		var _DEFAULT = {//默认属性，包括按钮、颜色，以及大小

			_button : {
				button : ["commonBtn","deleteBtn","changeBtn","addBtn"],
				commonBtn : function(object,btnElement,btnText){
					return "<a role=\"button\" class=\"_btnClass "+btnElement+"\">"+btnText+"</a>";
				},
				btnContent : "",
				deleteBtn : function(){},
				changeBtn : function(){},
				addBtn : function(){}
			},
			btnColor : "#087BD6",
			btnSize : "",
			number : true,
			_alertSwitch : 0,//改值弹出框开关
		}

		var _proto = {
			_init : function(){//初始化数据
				if(!this.data) return;
				var $this = this;
				var $tableSwrap = $("<div class=\"tableSwrap\"></div>");
				var $tableHeader = $("<div class=\"tableHeader\"></div>");
				var $tableContent = $("<div class=\"tableContent\"></div>");
				var $ulC = $("<ul class=\"row\"></ul>");
				var $ulH = $("<ul class=\"row\"></ul>");
				var dataContent = "";//中间展示数据；

				var dataHeaderDemon = this.option.number?"<li class=\"number\">行数</li>":"";//默认最左边有个数量统计，显示第几几条数据

				for(var i=0; i<this.option.header.length; i++){//渲染表格的表头
					dataHeaderDemon+= "<li class=\""+this.option.header[i]+"\">"+this.option.headerContent[i]+"</li>";
				}
				
				$tableHeader.append($ulH.append(dataHeaderDemon));

				$(this._data).each(function(i,o){//渲染表格的展示数据内容
					
					var dataContentDemonLi = $this.option.number?"<li class=\"number\">"+(i+1)+"</li>":"";
					var index = -1;
						for(var k=0; k<$this.option.header.length; k++){
							var go = true;
							for(var j=0; j<$this.option._button.button.length; j++){
								if($this.option.header[k]==$this.option._button.button[j]){

									var btnClass = $this.option._button.button[j]+"Class";
									index++;
									var btnText = $this.option.btnContent[index];
									dataContentDemonLi+= "<li class=\""+$this.option.header[k]+"\">"+$this.option._button.commonBtn($this,btnClass,btnText)+"</li>";
									go = false;
									break;
								}
							}
							if(!go) continue;
							dataContentDemonLi+= "<li class=\""+$this.option.header[k]+"\">"+o[$this.option.header[k]]+"</li>";
						}
					var ulRow = "<ul class=\"row\">"+dataContentDemonLi+"</ul>";
					dataContent+= ulRow;
				});
				$tableContent.html(dataContent);

				$tableSwrap.append($tableHeader).append($tableContent);
				this.append($tableSwrap);//将表格渲染完成的整体插入绑定Dom对象里面

				//响应式处理
				this.option.responsive==true && $tableSwrap.css({"width":"100%"}).parent().css({"overflow-X":"auto"});

			},
			_alertRemove : function(object){//移除信息弹出框
				object.fadeOut(500,function(){
					$(this).remove();
				});
				
			},
			_alertBox : function(clickObject,cloumn){//更改信息弹出框
						var $this = this;
						var changeDataArry = 0;
						var btnLength = $this.option._button.button.length;
						var index = [];
						for(var k=0; k<$this.option.header.length; k++){
							if($this.option.header[k] !=="number"){
								var okay = false;
								for(var i=0; i< btnLength; i++){
									if($this.option.header[k] == $this.option._button.button[i]){
										okay =true;
									}
								}
								if(okay == false){
									changeDataArry++;
									index.push(k);
								}
							}
						}
						var alertBoxEle= "<div class=\"alertBox\">"+
											"<p class=\"alertHead\">更改第<span class=\"rowChangeData\"> "+cloumn+" </span>行的数据</p>"+
											"<div class=\"alertContent\">"+
												"<ul>"+
												"</ul>"+
											"</div>"+
											"<div class=\"alertBoxBottom\">"+
												"<a class=\"_btnClass saveBtn\" role=\"button\">保存更改</a>"+
												"<a class=\"_btnClass notsaveBtn\" role=\"button\">放弃保存</a>"+
											"</div>"+
										"</div>";

						var alertEleTarget = $(alertBoxEle);
						$("body").append(alertEleTarget);
						var $uiEle = $(".alertBox .alertContent ul");
						for(var g=0; g<changeDataArry; g++){
							var $li = $("<li></li>");
							var $p = $("<p></p>");
							var $input = $("<input type=\"text\" name=\""+$this.option.header[index[g]]+"\" value=\"\">");
							$p.append($input);
							$li.append($this.option.headerContent[index[g]]+":&nbsp;");
							$li.append($p);
							$uiEle.append($li);
						}
						alertEleTarget.fadeIn(500,function(){
							$(".alertBoxBottom .saveBtn").click(function(){//保存更改 退出弹框
								$this._setData($this.option.url);
								$this._alertRemove(alertEleTarget);
								$this.option._alertSwitch = 0;
							});
							$(".alertBoxBottom .notsaveBtn").click(function(){//取消保存更改 退出弹框
								$this._alertRemove(alertEleTarget);
							//	$this._sort($this._data,$this.option.compareElement);
								$this.option._alertSwitch = 0;
							});
						});
			},
			_getData : function(URL){
				var $this = this;
				$.ajax({
					url : URL,
					type : "get",
					dataType : "text",
					cache : false,
					async : false,
					timeout : 5000,
					success :  function(Data){
						$this._data = JSON.parse(Data).data;
					},
				})
			},
			_setData : function(url){
				var $this = this;
				var data = {};
				var $input = $(".alertContent ul li p input");
				$input.each(function(i,o){
					data[$(this).attr("name")] = $(this).val();
				});
				$.ajax({
					url : url,
					data :data,
					type : "post",
					dataType : "json",
					cache : false,
					async : false,
					timeout : 5000,
					success :  function(Data){
						$this.empty()._init();
					},
				})
			},
			_sort : function(sortEle,compareEle){
				// var sorData = this._data;
				// var num = this._data.length;
				// for(var i=0; i<num; i++){
				// 	for(var j=0; j<num-i; j++){
				// 		if(this._data[j+1]){
				// 			if(this._data[j][compareEle]<this._data[j+1][compareEle]){
				// 					var exchange = "";
				// 					exchange = this._data[j];
				// 					this._data[j] = this._data[j+1];
				// 					this._data[j+1] = exchange;
				// 			}
				// 		}
						
				// 	}
				// }
				sortEle.sort(function(a,b){
					return b[compareEle] - a[compareEle];
				});
				this.empty();
				this.tablePlugin(this.option);
			},
			_delete : function(){
				this.find(".deleteBtnClass").click(function(){
					$(this).parent().parent().nextAll().each(function(){
						var value = $(this).find(".number").html()-1;
						$(this).find(".number").html(value);
					});
					$(this).parent().parent().remove();
				});
			},
			_add : function(){
				$(".addBtnClass").click(function(){

				});
			},
			_change : function(){
				var $this = this;
				var changeBtnEle = this.find(".changeBtnClass");
				changeBtnEle && changeBtnEle.click(function(){
					$this.option._alertSwitch===0 && $this._alertBox($(this),$(this).parent().parent().index()+1);
					$this.option._alertSwitch = 1;
				})
			},
			_moveEvent : function(){

			},
			_move : function(){//移动区块的锁定
				var moveZoom = this.option.move;
				for(var i=0; i<moveZoom.length; i++){
					$(".tableHeader ul li[class="+moveZoom[i]+"]").css({"cursor":"move"}).hover(function(){
						$(this).parent().parent().parent().find("ul.row li[class="+$(this).attr("class")+"]").css(
							{"background-color":"black",
							"border":"0px solid #ffffff",
							"border-left-width":"1px",
							"border-right-width":"1px"});
					},function(){
					$(this).parent().parent().parent().find("ul.row li[class="+$(this).attr("class")+"]").css({"background-color":"","border":""});
					});
				}
			},
			_handle : function(){//绑定事件方法
				var $this = this;
				this.option.move&&this._move();
				this._delete();
				this._change();
			},

		}

		$.fn[plugin] = function(option){
			if(!option) return;
			this.option = $.extend(_DEFAULT,option);
			this.extend(_proto);
			this._data = this.option.data ? this.option.data.data : "";
			if(this.option.url&&!this.option.data) this._getData(this.option.url);
			this._init();
			this._handle();
		}

	},"tablePlugin")
