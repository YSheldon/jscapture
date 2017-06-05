//创建调查问卷

var Questionnaire = function (myscroll) {

    this.scroll_send = myscroll;
    this.init();
}
Questionnaire.prototype = {

    init: function () {

        this.event();

        this.delBtn($('.aV_question >li'));

        this.leftBtn($(".aV_queCon"));//鼠标滑过问题显示左侧按钮

//点击问答题问题
        var aV_issue_title = "请填写问答题标题"
        $('.aV_issue_title').val(aV_issue_title);
        this.questionfouce($('.aV_issue_title'));//问答题获取焦点

//点击选择题-问题 显示可编辑
        this.queTitle($(".aV_t_editable .aV_queTitle"));
        this.editOpa($(".aV_queCon"));
////点击单选题“+”添加选项
//        this.addOpa($(".aV_quesRradio .cq_add"));
//点击多选题“+”添加选项
//        this.addOpa2($(".aV_quesRcheck .cq_add"));

    },
    event: function () {
        //自定义单选按钮，点击改变背景图片
        var _this = this;
        $(".radio_clickable .aV_radio").click(function () {

            $(this).parents(".aV_radioCon").find(".aV_radio").removeClass("aV_radioEd");
            $(this).addClass("aV_radioEd");
        })
        $(".aV_radioCon .aV_radioDiv label").click(function () {

            $(this).parents(".aV_radioCon").find(".aV_radio").removeClass("aV_radioEd");
            $(this).parents(".aV_radioDiv").find(".aV_radio").addClass("aV_radioEd");
        })

        $(".aV_qOption .aV_radio").click(function () {
            radio(this)
        })

        //自定义多选按钮，点击改变背景图片
        $(".aV_check").click(function () {
            check(this);
        })

      //添加问答题
        $('.add_q').click(function () {
            _this.addQuestion();
        })
        //添加单选题
        $('.add_s').click(function () {
            _this.addSingle();
        })
        //添加多选题
        $('.add_d').click(function () {
            _this.addDouble();
        })
        //点击单选题“+”添加选项
        //$(".aV_quesRradio .cq_add").click(function(){
            _this.addOpa($(".aV_quesRradio .cq_add"));
        //})
        //点击 //点击多选题“+”添加选项
        //$(".aV_quesRcheck .cq_add").click(function(){
            _this.addOpa2($(".aV_quesRcheck .cq_add"))
        //})
        //点击删除问卷
        $('.aV_delVote').click(function(){
            $('.add_vote').remove();
            $('.quest').addClass('color_h').removeClass('questionstatus').html('已添加的问卷')
            _this.scroll_send.refresh();

        })



    },
    delBtn: function ($ele) {
        //点击“删除问卷”删除当前问卷
        $ele.find(".aV_delVote").click(function () {
            $(this).parents(".add_vote").remove();
            _this.scroll_send.refresh();
        })

        //点击“垃圾桶”删除当前问题
        $ele.find(".aV_qL_btn .aV_del").click(function () {

            var oli = $(this).parents(".aV_queCon").parent();

            $(oli).remove();
            _this.scroll_send.refresh();

        })
    },
    leftBtn: function ($ele) {
        $ele.hover(function () {
            $(this).find(".aV_qL_btn").show();
        }, function () {
            $(this).find(".aV_qL_btn").hide();
        })
    },
    //点击选择题-问题 显示可编辑
    queTitle: function ($ele) {

        $ele.click(function (e) {

            var tit = $(this);
            var txt = tit.html();

            //取消所有的可编辑的标签


            $('.add_editDiv').remove();

            $(this).parents(".aV_t_editable").append('<div class="add_editDiv">\
				<div class="add_edit th4 q_title" contenteditable="true" style="min-height:20px;">' + txt + '</div>\
			</div>');

            var inputPre = $(".add_editDiv")
            var input = $(".add_edit")

            input.click(function () {
                return false;
            });

            //获取焦点
            input.trigger("focus");
//
            //文本框失去焦点后提交内容，重新变为文本
            input.blur(function () {
                var newtxt = $(this).text();
                inputPre.remove();

                //判断文本有没有修改
                if (newtxt != txt) {

                    var $parent=tit.parents('.aV_quesR ')

                    if(newtxt==''){

                        if($parent.hasClass('aV_quesRradio')){
                            newtxt='请填写单选题标题'
                        }else{
                            newtxt='请填写多选题标题'
                        }

                    }

                    tit.html(newtxt);
                }
                else {
                    tit.html(newtxt);
                }
            });
            e.stopPropagation();
        });
    },
//点击选择题-选项 显示可编辑
    editOpa: function ($ele) {
        _this = this;
        $ele.find(".aV_t_editOpa .aV_queTitle").click(function (e) {
            e.stopPropagation();
            var tit = $(this).parents(".aV_t_editOpa").find(".aV_queTitle");
            var txt = tit.html();
            var def_val=tit.attr('opt')
            //this.innerHTML='';
            var curtxt=''

            if(def_val==txt){
                curtxt=''
            }else{
                curtxt=txt
            }

            $(".add_editDiv").remove();
            $(this).parents(".aV_t_editOpa").append('<div class="add_editDiv">\
				<div class="add_edit th4 q_title" contenteditable="true" style="min-height:20px;">'+curtxt+'</div>\
				<div class="add_edit_btn"><a href="javascript:;" class="aV_edit_img"></a><a href="javascript:;" class="aV_del"></a></div>\
			</div>');

            var input = $(".add_edit")

            input.click(function () {

                return false;
            });
            //获取焦点
            input.trigger("focus")
            //input.select();
            /*input.focus(function() {
             input.select();
             })*/

            //更改相应选择框的背景色

            var $radio = input.parents('.aV_radioDiv').find('.aV_radio')
            if ($radio.length > 0) {//单选
                radio($radio[0]);
            }
            var $check = input.parents('.aV_radioDiv').find('.aV_check')
            if ($check.length > 0) {
                $($check[0]).addClass("aV_checkEd")
            }

            //文本框失去焦点后提交内容，重新变为文本
            //input.blur(function () {
            //    var newtxt = $(this).text();
            //    //inputPre.remove();
            //    //判断文本有没有修改
            //    if (newtxt != txt) {
            //        tit.html(newtxt);
            //    }
            //    else {
            //        tit.html(newtxt);
            //    }
            //    $(this).parents('.add_editDiv').remove();
            //});

            input.blur(function (e) {
                var newtxt = $(this).text();
                //inputPre.remove();
                //判断文本有没有修改


                if (newtxt == '') {
                    //var title=
                    tit.html(def_val);
                }

                else if (newtxt != txt) {
                    tit.html(newtxt);
                }
                else {
                    tit.html(newtxt);
                }

                var $curfocusele = $(e.relatedTarget)
                if (!$curfocusele.hasClass('aV_edit_img') && !$curfocusele.hasClass('aV_del')) {
                    $(this).parents('.add_editDiv').remove()
                }


            });


            _this.uploadImg();//上传图片
            _this.delOpa();	//删除选项

        });
    },//上传图片
    uploadImg: function () {
        var _this = this;
        $(".aV_edit_img").click(function (e) {
            var $ele = $(this);
            $ele.parents(".aV_t_editOpa").append('<div class="aV_queImg"><span class="preview"></span><a href="javascript:;" class="aV_a aV_queImg_del">删除</a></div>');

            _this.imgDel();//删除图片
            _this.uploadfile(function (file) {

                var Filepath = file["path"]
                var str = '<img src="' + Filepath + '"/>';
                $ele.parents(".aV_t_editOpa").find('.preview').append(str);

                $ele.parents('.aV_qOption_li').attr('resId', file['FileId'])
                my_layer({message: '上传文件成功'}, 'success')
                _this.scroll_send.refresh();

            });
            e.stopPropagation();
        });
    },
    imgDel: function () {//点击选项-图片右侧的删除，删除图片
        $(".aV_queImg_del").click(function () {
            $(this).parents(".aV_queImg").remove();
        })

    },
    //删除选项
    delOpa: function () {
        $(".add_edit_btn .aV_del").click(function () {
            $(this).parents("li.aV_qOption_li").remove();
            _this.scroll_send.refresh();
        })
    },
    //点击单选题“+”添加选项
    addOpa: function ($ele) {

        var _this = this;
        $ele.click(function () {
            var oprationlist = $ele.parents(".operationH").prev(".aV_qOption");
            var liNum = oprationlist.find("li").length + 1;

            oprationlist.append('<li class="aV_qOption_li"><div class="aV_radioDiv"><div class="aV_radioDiv_opt"><span class="aV_qOptionType"><a href="javascript:;" class="aV_radio" onclick="radio(this)"></a><input type="radio" class="opc0" /></span></div>\
				<div class="aV_title aV_t_editOpa aV_optTitle">\
					<label class="aV_queTitle T_edit" opt="选项' + liNum + '">选项' + liNum + '</label>\
				</div>\
			</div>\
		</li>');

            _this.scroll_send.refresh();
            var newItem = $ele.parents(".operationH").prev(".aV_qOption").find("li").last();
            _this.editOpa(newItem);	//选项可编辑
            _this.delOpa();	//删除选项

        });
    },
    //点击多选题“+”添加选项
    addOpa2: function ($ele) {

        var _this = this;
        $ele.click(function () {
            var oprationlist = $ele.parents(".operationH").prev(".aV_qOption").find("li");
            var liNum = oprationlist.length + 1;

            $ele.parents(".operationH").prev(".aV_qOption").append('<li class="aV_qOption_li"><div class="aV_radioDiv"><div class="aV_radioDiv_opt"><span class="aV_qOptionType"><a href="javascript:;" class="aV_check" onclick="check(this)"></a><input type="checkbox" class="opc0" /></span></div>\
					<div class="aV_title aV_t_editOpa aV_optTitle">\
						<label class="aV_queTitle T_edit" opt="选项' + liNum + '">选项' + liNum + '</label>\
					</div>\
				</div>\
			</li>');
            _this.scroll_send.refresh();
            var newItem = $ele.parents(".operationH").prev(".aV_qOption").find("li:last");
            _this.editOpa(newItem);	//选项可编辑
            _this.delOpa();	//删除选项


        });
    },
    //添加加简答题
    addQuestion: function () {
        //添加单选题
        var _this = this;

        //$('.add_q').click(function () {

            var lasttext = $('.aV_question >li:last').find('h4').html();
            var newtext = 'Q' + (parseInt(lasttext.substring(1, lasttext.length - 1)) + 1) + ':'

            var str = '';
            str += `<li class="queCon_Q">
                    <div class="aV_queCon">
                        <div class="aV_quesL">
                            <h4>${newtext}</h4>
                            <div class="aV_qL_btn"><a href="javascript:;" class="aV_del"></a></div>
                        </div>
                        <div class="aV_quesR">
                            <div class="aV_title aV_t_editable">
                                <div class="aV_issue_title" contenteditable="true">请填写问答题标题</div>
                            </div>
                        </div>
                    </div>
                </li>`

            $('.aV_question').append(str);
        _this.scroll_send.refresh();
            var $ele = $('.aV_question >li:last ').find('.aV_queCon'),
                $title = $ele.find('.aV_issue_title');
            _this.leftBtn($ele)
            _this.queTitle($(".aV_t_editable .aV_queTitle"))
            _this.questionfouce($title);
            _this.delBtn($ele);


        //})
    },
    //添加单选题
    addSingle: function () {
        var _this=this;
        //$('.add_s').click(function () {
            var lasttext = $('.aV_question >li:last').find('h4').html();
            var newtext = 'Q' + (parseInt(lasttext.substring(1, lasttext.length - 1)) + 1) + ':'

            var str = '';
            str += `<li class="queCon_R">
                                        <div class="aV_queCon">
                                            <div class="aV_quesL">
                                                <h4>${newtext}</h4>
                                                <div class="aV_qL_btn"><a href="javascript:;" class="aV_del"></a></div>
                                            </div>
                                            <div class="aV_quesR aV_quesRradio">
                                                <div class="aV_title aV_t_editable">
                                                    <div class="aV_queTitle T_edit">请填写单选题标题</div>

                                                </div>
                                                <ul class="aV_qOption">
                                                    <li class="aV_qOption_li"><div class="aV_radioDiv"><div class="aV_radioDiv_opt"><span class="aV_qOptionType"><a href="javascript:;" class="aV_radio" onclick="radio(this)"></a><input type="radio" class="opc0" /></span></div>
                                                        <div class="aV_title aV_t_editOpa aV_optTitle">
                                                            <label class="aV_queTitle T_edit">选项1</label>

                                                        </div>
                                                    </div>
                                                    </li>
                                                    <li class="aV_qOption_li"><div class="aV_radioDiv"><div class="aV_radioDiv_opt"><span class="aV_qOptionType"><a href="javascript:;" class="aV_radio" onclick="radio(this)"></a><input type="radio" class="opc0" /></span></div>
                                                        <div class="aV_title aV_t_editOpa aV_optTitle">
                                                            <label class="aV_queTitle T_edit">选项2</label>
                                                        </div>
                                                    </div>
                                                    </li>
                                                </ul>
                                                <div class="operationH"><a href="javascript:;" class="cq_add"><i class="add-icon-active"></i></a></div>
                                            </div>
                                        </div>
                                    </li>`

            $('.aV_question').append(str);
             _this.scroll_send.refresh();

            var $ele = $('.aV_question >li:last ').find('.aV_queCon');
            _this.leftBtn($ele);
            _this.delBtn($ele);

            _this.addOpa($ele.find('.cq_add'));
            _this.editOpa($ele);	//选项可编辑
            _this.queTitle($ele.find(".aV_t_editable .aV_queTitle"))//_this.queTitle($(".aV_t_editable .aV_queTitle"))

        //})
    },
    //添加多选题
    addDouble: function () {
        //添加多选题
        //$('.add_d').click(function () {
        var _this=this;
            var lasttext = $('.aV_question >li:last').find('h4').html();
            var newtext = 'Q' + (parseInt(lasttext.substring(1, lasttext.length - 1)) + 1) + ':'

            var str = `<li class="queCon_C">
                                        <div class="aV_queCon">
                                            <div class="aV_quesL">
                                                <h4>${newtext}</h4>
                                                <div class="aV_qL_btn"><a href="javascript:;" class="aV_del"></a></div>
                                            </div>
                                            <div class="aV_quesR aV_quesRcheck">
                                                <div class="aV_title aV_t_editable">
                                                    <div class="aV_queTitle T_edit">请填写多选题标题</div>

                                                </div>
                                                <ul class="aV_qOption">
                                                    <li class="aV_qOption_li"><div class="aV_radioDiv"><div class="aV_radioDiv_opt"><span class="aV_qOptionType"><a href="javascript:;" class="aV_check" onclick="check(this)"></a><input type="checkbox" class="opc0" /></span></div>
                                                        <div class="aV_title aV_t_editOpa aV_optTitle">
                                                            <label class="aV_queTitle T_edit">选项1</label>

                                                        </div>
                                                    </div>
                                                    </li>
                                                    <li class="aV_qOption_li"><div class="aV_radioDiv"><div class="aV_radioDiv_opt"><span class="aV_qOptionType"><a href="javascript:;" class="aV_check" onclick="check(this)"></a><input type="checkbox" class="opc0" /></span></div>
                                                        <div class="aV_title aV_t_editOpa aV_optTitle">
                                                            <label class="aV_queTitle T_edit">选项2</label>
                                                        </div>
                                                    </div>
                                                    </li>
                                                </ul>
                                                <div class="operationH"><a href="javascript:;" class="cq_add"><i class="add-icon-active"></i></a><div class="operationNum"><select><option>最多选2项</option></select></div></div>
                                            </div>
                                        </div>
                                    </li>`

            $('.aV_question').append(str);
        _this.scroll_send.refresh();
            var $ele = $('.aV_question >li:last ').find('.aV_queCon');
            _this.leftBtn($ele);
            _this.delBtn($ele);
            _this.addOpa2($ele.find('.cq_add'));
            _this.editOpa($ele);	//选项可编辑
            _this.queTitle($ele.find(".aV_t_editable .aV_queTitle"))//_this.queTitle($(".aV_t_editable .aV_queTitle"))


        //})
    },
    questionfouce: function ($ele) {

        $ele.focusin(function () {
            var aV_issue_title = "请填写问答题标题"
            var $ele = $(this);
            if ($ele.html() == aV_issue_title) {
                $ele.html('');
                $ele.addClass("c3");
            }
        }).focusout(function () {
            var aV_issue_title = "请填写问答题标题";
            var $ele = $(this);
            if ($ele.html() == '') {

                $ele.html(aV_issue_title);
                $ele.removeClass("c3");
            }
        });
    },
    uploadfile: function (callback) {


        new Promise(function (resolve, reject) {
            try {
                var parm = {};
                window.lxpc.exebusinessaction('Notice', 'OpenFileDialog', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
                    if (status == 0) {

                        var data = JSON.parse(jsondata);
                        var Filepath = data["filePath"]

                        var FileSize = data['fileSize'];
                        var file = {};
                        file.path = Filepath;
                        file.size = FileSize;


                        resolve(file)
                    } else {

                        my_layer({message:'调用接口出错，错误码'+e.mesage},'error')
                    }
                });


            } catch (e) {
                console.log(e.message)
            }

        }).then(function (file) {


            var totalSize = 0;

            var FileID = createGuid();
            file.FileId = FileID;
            var parm = {resourceList: [{fileNamePath: file['path'], fileResId: FileID, fileSize: file['size']}]};

            try {
                window.lxpc.exebusinessaction('UploadResource', 'Attachment', '0', JSON.stringify(parm), 2, function (status, jsondata, targ) {
                    if (status == 0) {

                        totalSize += parseFloat(jsondata);

                        var size = FormatSize(totalSize) + '/' + FormatSize(file['size']);
                        if (totalSize >= file['size']) {

                            if (Object.prototype.toString.call(callback) == '[object Function]') {
                                callback(file);
                            }

                        } else {

                        }


                        $('.send_content .btn_send').removeClass('noclick');

                    } else {
                        console.log(status);
                    }
                });


            } catch (e) {
                console.log(e.message)
            }


        });
    }

}
//单选题选题
var radio = function (ele) {

    var $ele = $(ele)
    $ele.parents(".aV_qOption").find(".aV_radio").removeClass("aV_radioEd");
    $ele.addClass("aV_radioEd");

}
var check = function (ele) {
    $(ele).toggleClass("aV_checkEd");
}
//填写问卷内容
var WriteQuest = function (curNotice, callback) {
    var _this = this;

    var id = curNotice.noticeEntity.id,
        recordDomain = curNotice.noticeEntity.recordDomain,
        realName = curNotice.noticeEntity.realName;


    var parm = {noticeId: id, recordDomain: recordDomain};


    try {

        window.lxpc.exebusinessaction('Notice', 'QueryNoticeDetail', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {

                var data = JSON.parse(jsondata),
                    questlist = data.noticeEntity.topicList;
                var str = '';

                var title = realName == 0 ? '匿名问卷' : '实名问卷'

                str += `<div class="quest_area"><h5>${title}</h5>`
                for (var i = 0, ln = questlist.length; i < ln; i++) {
                    var item = questlist[i],
                        type = item.type,
                        voteLimit = item.voteLimit,
                        content = 'Q' + (i + 1) + ': ' + item.content


                    if (type == 1) {//选择题
                        if (voteLimit == 1) {//单选题
                            str += `<div class="quest_con quest_R" topicId="${item.id}">
                                <h6 class="quest_t">${content}</h6>
                                <ul class="opt_lis">
                                    `

                            var optionList = item.optionList;
                            for (var j = 0, ln1 = optionList.length; j < ln1; j++) {

                                var optItem = optionList[j],
                                    optcontent = optItem.content,
                                    optId = optItem.id,
                                    joinCount = optItem.joinCount,
                                    resId = optItem.resId;


                                if (resId == '' || typeof(resId) == 'undefined') {
                                    str += `<li><a href="javascript:;" class="aV_radio " optId="${optId}" Limit="${voteLimit}"></a>
                                        <span>${(j + 1) + ': ' + optcontent}</span></li>`
                                } else {

                                    str += `<li><a href="javascript:;" class="aV_radio " optId="${optId}" Limit="${voteLimit}"></a>
                                        <span>${(j + 1) + ': ' + optcontent}</span><img src="./images/defpicture.png" resId="${resId}" alt="${optcontent}"></li>`
                                }

                            }

                            str += `</ul></div>`

                        } else {
                            str += `<div class="quest_con quest_C" topicId="${item.id}">
                                <h6 class="quest_t">${content}</h6>
                                <ul class="opt_lis">`

                            var optionList = item.optionList;
                            for (var j = 0, ln1 = optionList.length; j < ln1; j++) {

                                var optItem = optionList[j],
                                    optcontent = optItem.content,
                                    optId = optItem.id,
                                    joinCount = optItem.joinCount,
                                    resId = optItem.resId


                                if (resId == '' || typeof(resId) == 'undefined') {
                                    str += ` <li >
                                        <a href="javascript:;" class="aV_check " optId="${optId}" ></a>
                                        <span>${(j + 1) + ': ' + optcontent}</span>
                                    </li>`
                                } else {

                                    str += ` <li >
                                        <a href="javascript:;" class="aV_check " optId="${optId}" ></a>
                                        <span>${(j + 1) + ': ' + optcontent}</span><img src="./images/defpicture.png" alt="${optcontent}" resId="${resId}">
                                    </li>`
                                }
                            }
                            str += `</ul></div>`

                        }


                    } else {//问答题
                        var joinCount = item.joinCount,
                            quest_Q = '',
                            topicId = item.id

                        str += `<div class="quest_con quest_Q" topicId="${item.id}" targ="${targ}">
                                <h6 class="quest_t">${content}</h6>
                               <div class="quest_Q_conout">
                                  <textarea class="quest_Q_con"></textarea>
                                 </div>
                                </div>`

                    }


                }

                str += '</div>'

                $('.content_Re .content_right .detail').after(str);
                _this.scroll_Re_R.refresh();
                //获取可选项里面的信息

                $('.content_Re .opt_lis img').each(function (index, ele) {
                    var $ele = $(ele),
                        resId = $ele.attr('resId');
                    _this.imageId = _this.imageId + 1;
                    $ele.attr('targ', _this.imageId);
                    var parm = {resourceList: [{photoResId: resId}]};

                    downresource(parm, parseInt(_this.imageId), function (result, targ) {

                        var oimg = $('.opt_lis img[targ="' + targ + '"]');
                        oimg.attr('src', result);
                        _this.scroll_Re_R.refresh();
                        //打开图片预览
                        oimg.click(function () {
                            var parm_view = {picturePath: result}
                            ViewSrcPicture(oimg, parm_view)
                        })

                    })

                })


                $('.quest_con .aV_radio').click(function () {

                    var $ele = $(this);
                    $ele.parents('.opt_lis').find('.aV_radioEd').removeClass('aV_radioEd');
                    $ele.addClass('aV_radioEd');
                })

                $('.quest_con .aV_check').click(function () {

                    var $ele = $(this);
                    $ele.toggleClass('aV_checkEd');
                })

                if (Object.prototype.toString.call(callback) === '[object Function]') {
                    callback();
                }


                //提交并确认问卷
                Notification.prototype.JoinNotice = function () {
                    //$('#btnOk').on('click', function () {

                    var _that = this;
                    var sNoticeId = $('#content_Re .content_right .detail').attr('NoticeId'),
                        record = $('#content_Re .content_right .detail').attr('record'),
                        isQuestion = $('#content_Re .content_right .detail').attr('isQuestion');
                    if (!isQuestion) {
                        return;
                    }

                    if ($('.content_Re .btnOK ').hasClass('btn_unclick')) {
                        return;
                    }

                    var questList = $('.content_Re .quest_area .quest_con'),
                        TopicRecordList = [];

                    for (var i = 0, ln = questList.length; i < ln; i++) {
                        var item = $(questList[i]),
                            topicId = item.attr('topicId'),
                            content = '',
                            optlist = [];


                        if (item.hasClass('quest_Q')) {

                            content = item.find('.quest_Q_con').val();
                            if (content == '') {

                                my_layer({message: '请输入问答题的内容'}, 'error')
                                return;
                            }


                            TopicRecordList.push({topicId: topicId, content: content})
                        } else if (item.hasClass('quest_R')) {
                            var $opts = item.find('li .aV_radioEd');

                            if ($opts.length == 0) {
                                my_layer({message: '请完善单选项的信息'}, 'error');
                                return;
                            } else {
                                var optId = $opts.attr('optId');
                                optlist.push(optId);
                                TopicRecordList.push({topicId: topicId, checkOptionIdList: optlist})
                            }


                        } else {
                            var $opts = item.find('li .aV_checkEd');

                            if ($opts.length == 0) {
                                my_layer({message: '请完善多选项的信息'}, 'error');
                                return;
                            } else {

                                for (var j = 0, ln1 = $opts.length; j < ln1; j++) {
                                    var optItem = $($opts[j]);
                                    var optId = optItem.attr('optId');
                                    optlist.push(optId);
                                }

                            }

                            TopicRecordList.push({topicId: topicId, checkOptionIdList: optlist})
                        }


                    }

                    var parm = {noticeId: sNoticeId, recordDomain: record, noticeTopicRecordList: TopicRecordList};

                    try {
                        window.lxpc.exebusinessaction('notice', 'JoinNotice', sNoticeId.toString(), JSON.stringify(parm), 0, function (status, jsondata, targ) {
                            if (status == '0') {
                                $(".reply_content").show();

                                var curNotice=JSON.parse(jsondata);
                                ShowQuest.call(_that, curNotice)
                                var sNoticeId = $('#content_Re .content_right .detail').attr('NoticeId');
                                _this.confirmNotice(sNoticeId);
                                for(var i=0,ln=_that.DataList.length;i<ln;i++){
                                     var curitem=_that.DataList[i];
                                    if(typeof(curitem.noticeDetail)!='undefined'){

                                        curitem=curitem.noticeDetail;
                                        if(sNoticeId==curitem['noticeEntity'].id){
                                            _that.DataList[i].noticeDetail=curNotice;
                                        }
                                    }else{

                                        if(sNoticeId==curitem['noticeEntity'].id){
                                            _that.DataList[i]=curNotice;
                                        }
                                    }

                                }


                            } else {

                                my_layer({message:'调用接口出错，状态码'+status},'error');
                            }
                        })
                    }
                    catch (e) {

                        console.log(e.message);
                    }

                    //});
                }

            } else {
                my_layer({mesage: '请求数据出错，错误码' + e.message}, 'error')
            }

        })
    } catch (e) {
        my_layer({mesage: '请求数据出错，错误码' + e.message}, 'error')
    }


};
var ShowQuest = function (curNotice, ismyselfSend) {
    var _this = this;

    var id = curNotice.noticeEntity.id,
        recordDomain = curNotice.noticeEntity.recordDomain;

    var parm = {noticeId: id, recordDomain: recordDomain};


    if (typeof (ismyselfSend) == 'undefined' || ismyselfSend == false) {
        $('.content_Re .content_right .quest_area').remove();

    } else {

        $('.content_Se .content_right .quest_area').remove();
    }


    try {

        window.lxpc.exebusinessaction('Notice', 'QueryNoticeDetail', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {


            if (status == 0) {

                var data = JSON.parse(jsondata),
                    questlist = data.noticeEntity.topicList,
                    receiverCount = data.noticeEntity.receiverMemberCount,
                    realName = data.noticeEntity.realName,
                    NoticeId = data.noticeEntity.id;
                var str = '',
                    questitle = ''


                if (realName == 0) {//匿名
                    if(data.noticeEntity.status==2){//已经终止
                        questitle = '匿名问卷&nbsp;<span class="warn">[调查终止]</span>';
                    }else{
                        questitle = '匿名问卷';
                    }

                } else {//实名
                    if(data.noticeEntity.status==2){//已经终止
                        questitle = '实名问卷&nbsp;<span class="warn">[调查终止]</span>';
                    }else{
                        questitle = '实名问卷';
                    }
                    //questitle = '实名问卷'
                }
                str += '<div class="quest_area"><h5>' + questitle + '</h5>';

                for (var i = 0, ln = questlist.length; i < ln; i++) {
                    var item = questlist[i],
                        type = item.type,
                        voteLimit = item.voteLimit,
                        content = 'Q' + (i + 1) + ': ' + item.content


                    if (type == 1) {//选择题

                        str += `<div class="quest_con quest_R" topicId="${item.id}">
                                <h6 class="quest_t">${content}</h6>
                                <ul class="opt_lis">
                                    `
                        var optionList = item.optionList;
                        var totallcount = 0;

                        for (var k = 0, ln1 = optionList.length; k < ln1; k++) {
                            var optItem = optionList[k],
                                joinCount = optItem.joinCount;
                            totallcount += joinCount;
                        }

                        for (var j = 0, ln1 = optionList.length; j < ln1; j++) {

                            var optItem = optionList[j],
                                optcontent = optItem.content,
                                optId = optItem.id,
                                joinCount = optItem.joinCount,
                                per = totallcount == 0 ? '0%' : parseFloat((joinCount * 100 / totallcount).toFixed(2)) + '%',
                                resId = optItem.resId,
                                opttitle = (j + 1) + ': ' + optcontent;

                            str += `<li>
                                <span>${opttitle}</span>
                                <span class="quest_count" >${joinCount + '票'}</span><span class="quest_per" >${per}</span>`

                            if (joinCount != 0) {
                                str += `<progress  max="${totallcount}" class="quest_pro" value="${joinCount}"><span></span></progress>`
                            }

                            if (resId != '' && typeof(resId) != 'undefined') {

                                str += `<img src="./images/defpicture.png" alt="sdasdaserwer" resId="${resId}">`
                            }


                            str += ' </li>'

                        }

                        str += `</ul></div>`

                        //}


                    } else {//问答题
                        var joinCount = item.joinCount,
                            quest_Q = '',
                            topicId = item.id

                        _this.QuestId = _this.QuestId + 1
                        var targ = _this.QuestId;
                        str += `<div class="quest_con quest_Q" topicId="${item.id}" targ="${targ}">
                                <h6 class="quest_t">${content}</h6>
                                <a class="aV_a quest_ans" topicId="${topicId}">${joinCount}人已经回答></a>
                                </div>`

                    }


                }

                str += '</div>'


                if (typeof (ismyselfSend) == 'undefined' || ismyselfSend == false) {
                    $('.content_Re .content_right .detail').after(str);
                    _this.scroll_Re_R.refresh();

                    //绑定图片的内容
                    bindPicture($('.content_Re .opt_lis img'), ismyselfSend)

                } else {

                    if ($('.content_Se .content_right .unNotarize').length > 0) {
                        $('.content_Se .content_right .unNotarize').after(str);
                    }
                    else {
                        $('.content_Se .content_right .detail').after(str);
                    }
                    _this.scroll_Se_R.refresh();
                    //绑定图片
                    bindPicture($('.content_Se .opt_lis img'))

                }

                $('.quest_ans').click(function () {
                    var $ele = $(this);
                    var quest_con = $ele.parents('.quest_con'),
                        quest_conlist = $ele.parents('.quest_area').find('.quest_con');

                    //var index=$(this).parents('.quest_con').index($('.content_Re .quest_con'));
                    var index = quest_conlist.index(quest_con)

                    var data = questlist[index];

                    if (data.joinCount == 0) {
                        return;
                    }

                    var topicId = $(this).attr('topicId')
                    //if(_this.lastQuest_A!=topicId){
                    //    _this.lastQuest_A=topicId

                    getQuestAnswer.call(_this, data, recordDomain)
                    //}else{
                    //   $('.Quest_box').show();
                    //} ;

                });


                $('.opt_lis li').click(function () {
                    var $ele = $(this);

                    var topicId = $ele.parents('.quest_con').attr('topicId')
                    //var Pindex=$ele.parents('.quest_con').index();
                    //var $ele=$(this);
                    var quest_con = $ele.parents('.quest_con'),
                        quest_conlist = $ele.parents('.quest_area').find('.quest_con');

                    var Pindex = quest_conlist.index(quest_con)
                    var data = questlist[Pindex];

                    if (realName == 0) {//匿名
                        return;
                    } else {

                        //if(_this.lastQuest_A!=topicId){
                        _this.lastQuest_A = topicId;
                        var index = $ele.index();

                        var optdata = data.optionList[index];

                        if (optdata.joinCount != 0) {

                            getQuestAnswerforsel.call(_this, optdata, NoticeId, recordDomain)
                        }


                    }
                })


                //绑定图片

                function bindPicture(imglist, ismyselfSend) {
                    imglist.each(function (index, ele) {
                        var $ele = $(ele),
                            resId = $ele.attr('resId');
                        _this.imageId = _this.imageId + 1;
                        $ele.attr('targ', _this.imageId);
                        var parm = {resourceList: [{photoResId: resId}]};

                        downresource(parm, parseInt(_this.imageId), function (result, targ) {

                            var oimg = $('.opt_lis img[targ="' + targ + '"]');
                            oimg.attr('src', result);

                            if (ismyselfSend) {
                                _this.scroll_Se_R.refresh();
                            } else {
                                _this.scroll_Re_R.refresh();
                            }

                            //打开图片预览
                            oimg.click(function () {
                                var parm_view = {picturePath: result}
                                ViewSrcPicture(oimg, parm_view)
                            })

                        })

                    })
                }

            } else {
                my_layer({mesage: '请求数据出错，错误码' + e.message}, 'error')
            }

        })
    } catch (e) {
        my_layer({mesage: '请求数据出错，错误码' + e.message}, 'error')
    }

//显示问答题的信息
    function getQuestAnswer(data, recordDomain) {
var _this=this;

        $('.Quest_box .Quest_con').empty();
        $('.Quest_box').show();

        document.getElementById('ques_tip').innerHTML=data.content
        var parm = {topicId: data.id, recordDomain: recordDomain, batchSize: 50, lastTopicRecordId: 0};

        QueryNoticeTopicRecord(data.joinCount, parm, recordDomain, function (datalist) {

            var str=''
            for (var i = 0, ln = datalist.length; i < ln; i++) {

                var curData = datalist[i],

                    time = FormatTime(curData.createTime, 'yyyy-mm-dd hh:mm:ss');

                str += `
                    <li style="overflow: hidden;zoom: 1"><img src="./images/defuser.png" alt="" resId="${curData.noticeMember.photoResId}">
                    <span>${curData.noticeMember.name}</span>
                    <span class="fr Quest_con_t">${time}</span>
                <p>${curData.content}</p>
                </li>
                `


            }

            $('.Quest_box .Quest_con').append(str);

            if(_this.scroll_Que){

                _this.scroll_Que.refresh()
            }else{
                var option=scrollSetings();
                _this.scroll_Que=new IScroll('#Win_con', option);
            }

            //关闭弹窗
            document.getElementsByClassName('win_close')[0].onclick = function () {

                $('.Quest_box').hide();
                $('.Quest_box .Quest_con').empty()
            }
            //获取头像
            getImgs.call(_this)

        })


    }

    function getImgs(){

        $('.Quest_con img').each(function(){
            var $img=$(this);
            var resId=$img.attr('resId')

            if(typeof(resId)=='undefined'||resId==null||resId==''||resId=='undefined'){

                return;
            }

            _this.imageId = _this.imageId + 1;
            $img.attr('targ', _this.imageId);
            var parm = {resourceList: [{photoResId: resId}]};

            downresource(parm,_this.imageId, function (result, targ){

                $('.Quest_con img[targ='+targ+']').attr('src',result)

            })

        })
    }

    //获取问答题的信息
    function QueryNoticeTopicRecord(joinCount, parm, recordDomain, callback) {
        try {

            window.lxpc.exebusinessaction('Notice', 'QueryNoticeTopicRecord', id.toString(), JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {

                    var data = JSON.parse(jsondata).noticeTopicRecordList;

                    if (Object.prototype.toString.call(callback) == '[object Function]') {

                        callback(data);
                    }

                    if (joinCount > 50) {
                        var lastId = data[data.length - 1].id
                        var parm = {
                            topicId: data[data.length - 1].id.topicId,
                            recordDomain: recordDomain,
                            batchSize: 50,
                            lastTopicRecordId: lastId
                        }
                        QueryNoticeTopicRecord(joinCount, parm, recordDomain, callback);
                    }
                } else {
                    my_layer({message: '获取数据出错'}, 'error', function () {

                    })
                }

            })

        } catch (e) {
            console.log(e.message)
        }
    };

    //获取选择题的信息情况

    function getQuestAnswerforsel(data, NoticeId, recordDomain) {
var _this=this;
        $('.Quest_box .Quest_con').empty();
        $('.Quest_box').show();

        document.getElementById('ques_tip').innerHTML=data.content
        var parm = {optionId: data.id, operationType: 2, batchSize: 20, lastServerRecId: 0, recordDomain: recordDomain};

        QueryNoticeMember(data.joinCount, parm, NoticeId, recordDomain, function (datalist) {

            var str = '<ul class="Quest_con">';
            for (var i = 0, ln = datalist.length; i < ln; i++) {

                var curData = datalist[i],
                    time = FormatTime(curData.modifyTime, 'yyyy-mm-dd hh:mm:ss');

                str += `<li style="overflow: hidden;zoom: 1"><img src="./images/defuser.png" alt="" resId="${curData.photoResId}">
                    <span>${curData.name}</span>
                    <span class="fr Quest_con_t">${time}</span>
                <p>${curData.branchPath}</p>
                </li>
                `
            }
str+='</ul>'
            $('.Quest_box .Quest_con').append(str);

            if(_this.scroll_Que){
                _this.scroll_Que.refresh();
            }else{
                var option=scrollSetings()

                _this.scroll_Que=new IScroll('#Win_con', option);
            }
            document.getElementsByClassName('win_close')[0].onclick = function () {
                $('.Quest_box').hide();
                $('.Quest_box .Quest_con').empty()
            }

            getImgs.call(_this)

        })


    }
//查询选择题的详情
    function QueryNoticeMember(joinCount, parm, NoticeId, recordDomain, callback) {

        try {

            window.lxpc.exebusinessaction('notice', 'QueryNoticeMember', NoticeId.toString(), JSON.stringify(parm), 1, function (status, datalist, targ) {
                if (status == '0') {

                    var data = JSON.parse(datalist)
                    var NoticeMemeber = data['noticeMemberList'];
                    var lastServerRecId = data.lastServerRecId;
                    if (Object.prototype.toString.call(callback) == '[object Function]') {
                        callback(NoticeMemeber)
                    }

                    if (joinCount > 20) {

                        var parm = {
                            optionId: parm.optionId,
                            operationType: 2,
                            batchSize: 20,
                            lastServerRecId: lastServerRecId,
                            recordDomain: recordDomain
                        }
                        QueryNoticeMember(joinCount, parm, NoticeId, recordDomain, callback);
                    }

                } else {
                    my_layer({mesage: '请求数据出错，错误码' + e.message}, 'error')
                }
            })
        }
        catch (e) {
        }
    }

}




