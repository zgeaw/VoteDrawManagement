/*ARC 投票插件 32237384@qq.com*/
var arc_vote = function(options) {
	var opts = {
			vote_tab: '#vote_tab', //选项
			vote_tab_add: '#vote_tab_add', //添加选项		
			vote_tab_num: 2, //初始选项数量
			vote_tab_img: false, //选项图文配置	
			vote_tab_del: true, //选项删除开关
			vote_tab_Import: '#vote_tab_Import', //批量导入
			vote_draw: '#vote_draw', //奖品
			vote_draw_add: '#vote_draw_add', //添加奖品
			vote_draw_num: 2, //初始奖品数量	
			vote_draw_img: false, //奖品图文配置
			vote_draw_del: true, //选项删除开关
			vote_validate: true //开启验证
	}
	var _vote_tab = [];
	var _vote_draw = [];
	
	if(options) {//判断是否传入配置项
		$.extend(opts, options);
	}
	/*添加选项/奖品 
	 * type =0 选项
	 *	type =1奖品
	*/
	var add_rote = function(type) { 
		var newadd ={},_html='';
		if(!type){			
			newadd = { sort: _vote_tab.length + 1, option_title: '', link: '', icon: 'upload-pic.png' };
			_vote_tab.push(newadd);
			_html = $(votetab(newadd,type,0));
			$(opts.vote_tab).append(_html);
		}else{
			newadd = { level: _vote_draw.length + 1, prize_name: '', number: '', mark_phone: '', rate: '', turntable_place: '', icon: 'upload-pic.png' };
			_vote_draw.push(newadd);
			_html = $(votetab(newadd,type, 0));
			$(opts.vote_draw).append(_html);
		}
		voteEvent(_html);
		voteRefersh(type);
	}

	//选项批量导入
	this.voteImport = function(obj,type) {//外部方法
			if(obj) {
				var _html = [],_val;
				_val = $(votetab(obj, type,1));
				_html.push(_val);
				voteEvent(_val);
				if(!type){
					_vote_tab = obj;
					$(opts.vote_tab).html(_html);
				}else{					
					_vote_draw = obj;
					$(opts.vote_draw).html(_html);
				}
				voteRefersh(type);
			}
	}
		//验证
	this.vote_validate = function(type) {//外部方法
		if(opts.vote_validate){			
			return validate(type);
		}
	}	
	var validate = function(type) {//验证
		var _sel = '',_imgvalidate = '',_img='';
		if(!type){
			_sel = $(opts.vote_tab).find("input[type=text]");
			_img = $(opts.vote_tab).find("[name=special_thumb_img]");
			_imgvalidate = opts.vote_tab_img;
		}else{
			_sel = $(opts.vote_draw).find("input[type=text]");		
			_img = $(opts.vote_tab).find("[name=special_thumb_img]");	
			_imgvalidate = opts.vote_draw_img;
		}
		var tab_result = true;	
		// 验证文本框逻辑
        for (var i = 0; i < _sel.length; i++) {
            if (_sel.eq(i).val()=="") {
                _sel.eq(i).css('border', '1px red solid');
                tab_result = false;
            }
        }
		if(_imgvalidate){//图片验证						
			// 验证图片逻辑
	        for (var i = 0; i < _img.length; i++) {
	            if (_img.eq(i).prev().val()=="upload-pic.png") {
	                _img.eq(i).css('border', '1px red solid');
	                tab_result = false;
	            }
	        }
		}
		_sel.keyup(function(){//监听文本域输入
			var _this = $(this),
				_val = _this.val();
			if(_val!=''){
				_this.attr('style','');
			}
		}).change(function(){
			var _this = $(this),
				_val = _this.val();
			if(_val==''){
				_this.css('border', '1px red solid');
			}
		});
		 

		return tab_result;
	}

	//图文配置
	this.vote_tab_img = function(event,type) {//外部方法
		vote_tabimg(event,type);
	}
	var vote_tabimg = function(event,type) { //图文配置
		var _val = '',sel='';
		if(!type){
			_val = opts.vote_tab;
			opts.vote_tab_img = event;
		}else{
			_val = opts.vote_draw;
			opts.vote_draw_img = event;
		}
		sel = $(_val).find('.special_thumb_img');
		if(event) {
			sel.removeClass('hide');
		} else {
			sel.addClass('hide');
		}
	}

	//选项/奖品删除开关
	this.vote_tab_del = function(event,type) {
		vote_tabdel(event,type);
	}
	var vote_tabdel = function(event,type) { //选项删除开关
		if(!type){			
			opts.vote_tab_del = event;
		}else{
			opts.vote_draw_del = event;
		}
		voteRefersh(type);
	}

	//初始化
	this.init = function() {
		buildpage();
	}
	var buildpage = function() { //初始化
		for(var i = 0; i < opts.vote_tab_num; i++) {//选项
			if(opts.vote_tab_num != _vote_tab.length && _vote_tab.length < opts.vote_tab_num) {
				add_rote(0);
			}
		}
		for(var i = 0; i < opts.vote_draw_num; i++) {//奖品
			if(opts.vote_draw_num != _vote_draw.length && _vote_draw.length < opts.vote_draw_num) {
				add_rote(1);
			}
		}
		$(opts.vote_tab_add).click(function(){add_rote(0)});//添加选项
		$(opts.vote_draw_add).click(function(){add_rote(1)});//添加奖品
	}

	//注册事件
	var voteEvent = function(obj) {
		obj.find('.del_tab').click(function(){ deltab($(this),0) });
		obj.find('.luck_del').click(function(){ deltab($(this),1) });
	}

	//删除选项/奖品
	var deltab = function(event,type) {
		var sel = $(event);
		sel.parent().parent().parent().remove();
		voteRefersh(type);
		if(!type){
			_vote_tab.splice(0, 1);
		}else{
			_vote_draw.splice(0, 1);
		}
		
	}

	// 删除时调用/排序
	var voteRefersh = function(type) {
		if(!type) {//重新排序选项
			var sel = $(opts.vote_tab).find(".v-group-item");
			for(var i = 0; i < sel.length; i++) {
				sel.eq(i).find("input[name=sort]").val((i + 1));
				if(!opts.vote_tab_del){
					sel.eq(i).find('.del_tab').addClass('hide');
				}
			}
		} else {//重新排序奖品
			var sel = $(opts.vote_draw).find(".g-group-item");
			for(var i = 0; i < sel.length; i++) {
				sel.eq(i).find(".level").text((i + 1));
				if(!opts.vote_draw_del){
					sel.eq(i).find('.luck_del').remove();
				}
			}

		}
	};

	//组装数据
	var votetab = function(obj,type,Import) {
		var data = '',_html = [], _img1 = '',_img2 = '';
		if(!opts.vote_tab_img) {
			_img1 = 'hide';
		}
		if(!opts.vote_draw_img) {
			_img2 = 'hide';
		}
		if(!Import){
			if(!type){
				_html = votetab_html(obj,_img1);
			}else{
				_html = votedraw_html(obj,_img2);
			}			
		}else{
			for(var i = 0; i < obj.length; i++) { //批量导入
				if(!type){
					_html +=votetab_html(obj[i],_img1);
				}else{
					_html += votedraw_html(obj[i],_img2);
				}	
			}
		}
		return _html;
	}
	var votetab_html = function(data,hide){//选项初始数据
		var _html = '<div class="v-group-item"><div class="form-group">' +
			'<div class="col-md-1"><input type="text" name="sort" class="form-control" value="' + data.sort + '" placeholder="排序" required=""></div>' +
			'<div class="col-md-4"><input type="text" name="option_title" class="form-control" value="' + data.option_title + '" placeholder="标题" required=""></div>' +
			' <div class="col-md-3"><input type="text" name="link" class="form-control" value="' + data.link + '" placeholder="链接"></div>' +
			'<div class="col-md-1"><input type="hidden" name="icon" value="' + data.icon + '">' +
			'<img style="" src="' + data.icon + '" width="60" height="45" name="special_thumb_img" onclick="uploadImg(this)" class="special_thumb_img ' + hide + '"></div>' +
			'<div class="col-md-2">' +
			'<button type="button" class="btn btn-danger del_tab" >删除</button>' +
			'</div></div></div>';
		return _html;
	}
	var votedraw_html = function(data,hide) {//奖品初始数据
		var _html = '<div class="g-group-item"><div class="form-group">' +
			'<label for="" class="col-md-1 control-label"><span class="level">' + data.level + '</span>等奖</label>' +
			'<div class="col-md-2"><input type="text" name="prize_name" value="' + data.prize_name + '" class="form-control" placeholder="奖品名称"></div>' +
			'<div class="col-md-1"><input type="text" name="number" value="' + data.number + '" class="form-control" placeholder="数量"></div>' +
			'<div class="col-md-4"><input type="text" name="mark_phone" value="' + data.mark_phone + '" class="form-control" placeholder="指定用户手机，多个逗号隔开"></div>' +
			'<div class="col-md-2"><input type="text" name="rate" value="' + data.rate + '" class="form-control" placeholder="中奖概率,上限10000"></div>' +
			'<div class="col-md-2 hide"><input type="hide" name="turntable_place" value="' + data.turntable_place + '" class="form-control" placeholder="指针位置，填写上图数字"></div>' +
			'<div class="col-md-1"> <input type="hidden" name="icon" value="' + data.icon + '">' +
			'<img style="" src="' + data.icon + '" onclick="uploadImg(this)" width="60" height="45" name="special_thumb_img" class="special_thumb_img ' + hide + '"></div>' +
			'<div class="col-md-1"> <button type="button" class="btn btn-danger luck_del">删除</button></div>' +
			'</div></div>';
		return _html;
	}
};