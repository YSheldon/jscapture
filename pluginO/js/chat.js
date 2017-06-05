function Chat() {

    this.Scrollleft = null;
    this.Scrollright = null;
    this.search = '';
    this.searchId = 0;
    this.Filecount = [];
    this.dialogId = null;
    this.userUniId = null;//用于在群聊中打开某个人的聊天记录
    this.imageId = 0;
    this.SenderId = 0;
    this.FileId = 0;
    this.VoiceId=0;
    this.datalist = [];
    this.Picturecount = 0;
    this.userUniIdList = [];
    this.selectId = 0;
    this.userName = [];
    this.loadMore = true;
    this.initInfo=null;
    this.init();
}
Chat.prototype = {
    constructor: Chat,
    init: function () {
        this.loadScroll();
        this.bindData();
        this.bindEvent();
        //this.backTop();
    },
    bindEvent: function () {
        var _this = this;
        var secText = "";
        var $Search = $("#secText");
        //$("#secText").val(secText);

        var timer = null;

        $("#secText").focusin(function () {

            $(this).addClass("ipt")
            if ($(this).val().trim() == '') {

            } else {
                $(this).parents(".mlL_secIpt").addClass("mlL_secIpt2")

                $(".mlL_lList").hide();
                $(".mlL_lFList").show();
            }

            timer = setInterval(function () {

                if (_this.search == $("#secText").val().trim()) {
                    return;
                } else {
                    _this.search = $("#secText").val().trim();
                }

                _this.seachReasult(_this.search)
            }, 400)


        }).focusout(function () {
            $(this).parents(".mlL_secIpt").removeClass("mlL_secIpt2")
            if ($(this).val() == '') {
                //$(this).val(secText);
                $(this).removeClass("ipt")
                clearInterval(timer)
                $(".mlL_lList").show();
                $(".mlL_lFList").hide();
                $(".mlL_lFList").empty();
                _this.Scrollleft.refresh();

            }
        });
        $("#secText").each(function () {
            $(this).keyup(function () {
                if ($(this).val() != secText && $(this).val() != '') {
                    $(".sec_del").css({"visibility": "visible"})
                }
                else {
                    $(".sec_del").css({"visibility": "hidden"})
                }

            })
        })

        //点击删除按钮时，删除按钮隐藏，文本框文字为“搜索”
        $(".sec_del").on("click", function () {
            $("#secText").val(secText);
            $(this).parents(".mlL_secIpt").removeClass("mlL_secIpt2")
            $(this).css({"visibility": "hidden"})
            $(this).siblings("#secText").removeClass("ipt")
            clearInterval(timer);
            $(".mlL_lList").show();
            $(".mlL_lFList").hide();
            $(".mlL_lFList").empty();
            _this.Scrollleft.refresh();
            var diaId = $('.mlL_lList .ml_bg').attr('diaId');
            var diaType = $('.mlL_lList .ml_bg').attr('typeinfo');
            _this.userUniId = '';
            _this.QueryChatlog(diaId, diaType)
        })

        //点击左侧消息记录列表，添加背景颜色-搜索结果
        $(".mlL_lFList li").click(function () {
            $(".mlL_lFList li").removeClass("ml_bg");
            $(this).addClass("ml_bg");
            $('.mlR_secFNull').remove();
        })


        $(".mlR_tabList a").each(function (index) {
            _this.type = 'tb1'
            $(this).click(function () {

                $(".mlR_Con").addClass("disN")
                $(".mlR_Con:eq(" + index + ")").removeClass("disN")
                $(".mlR_tabList a").removeClass("mlR_tabLLink")
                $(this).addClass("mlR_tabLLink");
                $(this).data('type', 'tb' + index);
                _this.type = $(this).data('type');
                _this.Scrollright.refresh();

            })
        });

        //加载更多信息

        $('.mlR_Cload').click(function () {

            var lastinfo,
                lastinfoId;

            if (_this.datalist.length > 0) {

                lastinfo = _this.datalist[0]
                if (typeof(lastinfo.userMessage) != 'undefined') {
                    lastinfo = lastinfo.userMessage;
                }
                lastinfoId = lastinfo.id
            } else {
                lastinfoId = 0;
            }

            var $ele = $(this);

            if ($ele.data('targ') == 1) {//已经加载完毕
                return;
            }
            $ele.find('img').show();

            var diaId = '';
            var diaType = '';

            var ssearch = $("#secText").val();

            if (ssearch != '' && ssearch != '搜索') {//搜索

                var parm = {dialogID: _this.dialogId, userMsgID: lastinfoId, count: 5};

                if (_this.loadMore) {
                    _this.loadMorechartlog(parm, diaType, true)
                }
            } else {//正常聊天记录

                if (_this.loadMore == true) {
                    diaId = $('.mlL_lList .ml_bg').attr('diaId');
                    diaType = $('.mlL_lList .ml_bg').attr('typeinfo');
                    var parm = {dialogID: _this.dialogId, userMsgID: lastinfoId, count: 5};
                    if (_this.loadMore) {
                        _this.loadMorechartlog(parm, diaType)
                    }

                }


            }
            //_this.QueryChatlog_searchBind()


        })

    },
    loadScroll: function () {
        var _this = this;
        var option = scrollSetings();

        this.Scrollleft = new IScroll('#wrapper', option);
        this.Scrollright = new IScroll('#wrapper2', option);

        this.Scrollright.on("scroll", function () {

            var isLoad = false
            if (this.directionY == -1) {
                if (this.y > -3) {
                    isLoad = true;
                }
            } else if (this.directionY == 0) {
                if (this.directionX == -1) {
                    isLoad = true;
                }
            }

            if (isLoad) {

                var $ele = $('.mlR_Cload');
                var lastinfo = _this.datalist[0]
                if (typeof(lastinfo.userMessage) != 'undefined') {
                    lastinfo = lastinfo.userMessage;
                }
                //var $ele = $(this);

                if ($ele.data('targ') == 1) {//已经加载完毕
                    return;
                }
                $ele.find('img').show();

                var diaId = '';
                var diaType = '';

                var ssearch = $("#secText").val();

                if (ssearch != '' && ssearch != '搜索') {//搜索

                    var parm = {dialogID: _this.dialogId, userMsgID: lastinfo.id, count: 5};

                    if (_this.loadMore) {
                        _this.loadMorechartlog(parm, diaType, true)
                    }

                } else {//正常聊天记录
                    diaId = $('.mlL_lList .ml_bg').attr('diaId');
                    diaType = $('.mlL_lList .ml_bg').attr('typeinfo');
                    var parm = {dialogID: _this.dialogId, userMsgID: lastinfo.id, count: 5};

                    if (_this.loadMore) {
                        _this.loadMorechartlog(parm, diaType)
                    }


                }
            }


        })

    },

    bindData: function () {
        var _this = this;
        try {
            var parm = {};
            window.lxpc.exebusinessaction('ChatRecord', 'InitFinished', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
                if (status == 0) {

                    var data = JSON.parse(jsondata);
                    _this.initInfo=data
                    var dialogId = data['dialogId'],
                        dialogType = data['dialogType'],
                        userUniId = data['userUniId']

                    if (_this.dialogId != null) {

                        if (_this.dialogId == dialogId) {

                            //应经存在
                            //打开某个群聊里面某个人在当前群的聊天记录
                            if (typeof(userUniId) != 'undefined' && userUniId != '') {

                                if (_this.userUniId == userUniId) {

                                    return;
                                } else {

                                    _this.userUniId = userUniId;
                                    _this.dialogId=dialogId;
                                    _this.reorderleftInfo(data);
                                    _this.QueryChatlog(dialogId, dialogType, userUniId);
                                }
                            } else {

                                _this.userUniId = null;
                            }


                        } else {

                            //dialogId已经发生变化需要重新刷新页面
                            _this.dialogId = dialogId;

                            if (typeof(userUniId) != 'undefined' && userUniId != '') {//入口是在一个群里查看此人发言

                                _this.userUniId = userUniId;
                                _this.dialogId=dialogId;
                                //_this.reorderleftInfo(data);

                            } else {
                                _this.userUniId = null;

                            }
                            _this.reorderleftInfo(data);
                            _this.QueryChatlog(dialogId, dialogType, userUniId);

                        }

                    } else {//第一次进入给全局变量dialogId赋值

                        if (typeof(userUniId) != 'undefined' && userUniId != '' && userUniId != null) {

                            _this.userUniId = userUniId

                        } else {

                            _this.userUniId = null;
                        }
                        _this.dialogId = dialogId;
                        //_this.getChatInfo(data);
                        _this.getAllChatinfo();
                        _this.QueryChatlog(dialogId, dialogType, userUniId);

                    }


                } else {
                    console.log(status)
                }
            })
        } catch (e) {
            console.log(e.message)
        }

    },
    //获取聊天记录里面的数据
    QueryChatlog: function (dialogId, dialogType, userUniId) {

        var _this = this;

        //if (_this.datalist.length > 0) {

        //$('.mlR_msgList .mlR_Con .mlR_CMsg').eq(0).empty();
        //$('.mlR_msgList .mlR_Con .mlR_CMsg').eq(1).empty();
        //$('.mlR_msgList .mlR_Con  ').eq(2).empty();
        //把页面初始化
        initchat();
        //}

        try {
            var parm = null;
            if (typeof(userUniId) == 'undefined' || userUniId == '') {
                parm = {dialogId: dialogId};

            } else {
                parm = {dialogId: dialogId, userUniId: userUniId};
            }

            window.lxpc.exebusinessaction('ChatRecord', 'QueryRecord', '0', JSON.stringify(parm), 0, function (status, data, targ) {

                if (status == 0) {
                    var datalist = JSON.parse(data)


                    var str = '';
                    var strpic = '';
                    var strfile = '';

                    $('.mlR_secFNull').remove();

                    if (datalist.length == 0) {
                        _this.showNochatlog();
                        return;
                    }

                    _this.datalist = datalist = datalist.sort(function (a, b) {

                        var sendTimeA,
                            sendTimeB;
                        if (typeof(a.userMessage) == 'undefined') {
                            sendTimeA = a.sendTime
                        } else {
                            sendTimeA = a.userMessage.sendTime
                        }
                        if (typeof(b.userMessage) == 'undefined') {
                            sendTimeB = b.sendTime
                        } else {
                            sendTimeB = b.userMessage.sendTime
                        }

                        return sendTimeA - sendTimeB;

                    })
                    _this.Filecount = 0;
                    _this.Picturecount = 0;
                    _this.QueryChatlog_bind(datalist, dialogType);

                } else {
                    console.log(status)
                }
            })

        } catch (e) {
            console.log(e.message)
        }
    },
    //绑定聊天记录的数据信息
    QueryChatlog_bind: function (datalist, dialogType) {
        var _this = this;
        var str = '';
        var strpic = '';
        var strfile = '';
        _this.Scrollright.refresh();
        str = '';
        var filelist = [];

        for (var i = 0; i < datalist.length; i++) {
            var curData
            if (typeof(datalist[i]['userMessage']) == 'undefined') {
                curData = datalist[i]
            } else {
                curData = datalist[i]['userMessage'];
            }

            if (_this.userUniId != '' && _this.userUniId != null && typeof(_this.userUniId) != 'undefined') {

                if (_this.userUniId != curData.sender) {
                    continue;
                }
            }

            var types = curData['contentType'];
            var message = curData['message'];
            var name = '';
            var sendTime = FormatTime(curData['sendTime'], 'yyyy-mm-dd hh:mm');
            var result = Base64.decode(message);

            //链接
            var urllist = getUrl(result);
            if (urllist.length == 0) {
                result = result;
            } else {
                result = _this.resetResult(result);
            }

            switch (types) {
                case 0:
                    str += '<li class="mlR_CMsg_li"><h5 class="mlR_CMsg_title" userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div><p class="mlR_CMsg_font">' + result + '</p></div></li>';
                    break;
                case 1:

                    if (curData['mimeType'].indexOf('image') > -1) {
                        _this.Picturecount = _this.Picturecount + 1;
                        var imagelist = curData['extraContent'];
                        if (typeof(imagelist) == 'undefined' || imagelist == '') {
                            //一个图片

                            str += '<li class="mlR_CMsg_li"><h5 class="mlR_CMsg_title" userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div><p class="mlR_CMsg_font">' + result + '</p><ul class=" mlR_CMsg_img mlR_img1"> <li issingle="true" ><img src="images/defpicture.png"  resourceId="' + curData['attachmentResId'] + '"/></li></ul></li>'

                            strpic += '<li class="mlR_CMsg_li" ><h5 class="mlR_CMsg_title">' + sendTime + '</h5><ul class="mlR_CImg"> <li style="background-image: url(images/defpicture.png)" resourceId="' + curData['attachmentResId'] + '" ispicTab="true"></li></ul></li>'


                            //图片页

                        } else {//多个图片
                            str += ' <li class="mlR_CMsg_li" ><h5 class="mlR_CMsg_title" userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em> <div> <p class="mlR_CMsg_font">' + result + '</p> ';

                            strpic += '<li class="mlR_CMsg_li"><h5 class="mlR_CMsg_title">' + sendTime + '</h5><ul class="mlR_CImg">'

                            strpic += ''
                            imagelist = JSON.parse(imagelist);

                            if (imagelist.length == 4) {//四宫格
                                str += '<ul class="mlR_CMsg_img mlR_img4">'

                            } else {//九宫格
                                str += '<ul class="mlR_CMsg_img">'
                            }

                            for (var j = 0, ln = imagelist.length; j < ln; j++) {

                                var oimg = imagelist[j];

                                str += '<li style="background-image: url(images/defpicture.png)" resourceId="' + oimg.resourceId + '"></li>';
                                strpic += '<li style="background-image: url(images/defpicture.png)" resourceId="' + oimg.resourceId + '" ispicTab="true"></li>';

                            }
                            str += '</ul></div></li>'
                            strpic += '</ul></li>'
                        }
                    } else if (curData['mimeType'].indexOf('application') > -1) {//文档
                        _this.Filecount = _this.Filecount + 1;
                        filelist.push(curData)
                        //mm-dd hh:mm
                        var attachmentInfo = curData['attachmentName'].split(','),
                            attachmentResId = curData['attachmentResId']
                        var filename = attachmentInfo[0]
                        var filesize = attachmentInfo[1]
                        var timeary = sendTime.split(' ')[0].split('-'),
                            time = timeary[1] + '/' + timeary[0] + '月';
                        //var time = sendTime.split(' ')[0] + '月';
                        var filepath = '';
                        if (curData['mimeType'] == 'application/zip') {

                            filepath = 'images/ml_file_zip.png'


                        } else if (curData['mimeType'] == 'application/pdf') {
                            filepath = 'images/ml_file_pdf.png'

                        } else {
                            filepath = 'images/ml_file_default.png'
                        }

                        str += ' <li class="mlR_CMsg_li locationR_1"><h5 class="mlR_CMsg_title" userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div> <p>'+result+'</p><div class="mlR_CMsg_file" ResId="' + attachmentResId + '" filename="' + filename + '"> <img src="' + filepath + '" class="mlR_CMsg_Ficon" /> <div class="mlR_CMsg_fileR"> <h4><p class="filename">' + filename + '</p><em>' + time + '</em></h4> <div class="mlR_CMsg_fileNews"><em>' + filesize + '</em><p><a href="javascript:;" class="aV_a">下载</a><a href="javascript:;" class="aV_a">另存为</a></p></div></div></div></div></li>';

                        strfile += ' <tr> <td><div class="mlR_table_file" ResId="' + attachmentResId + '" name="' + filename + '"> <img src="' + filepath + '" /> <div> <h4>' + filename + '</h4> <p>' + name + '<span>' + filesize + '</span></p> </div> </div> </td> <td>' + sendTime + '</td> <td><a href="javascript:;" class="aV_a">下载</a><a href="javascript:;" class="aV_a">转发</a></td> </tr>';

                    } else if (curData['mimeType'].indexOf('voice') > -1)//绑定语音信息
                    {

                        str+=`<li class="mlR_CMsg_li">
                            <h5 class="mlR_CMsg_title" userid="${curData.sender}"><em>${sendTime}</em></h5>
                            <div>
                                <div class="mlR_CMsg_voice" resId="${curData.attachmentResId}" onclick="playOrStopVoice(this,\'${curData.attachmentResId}\')">
                                    <img src="images/message_voice_bg.png" alt="">
                                    <span class="voice_play"></span>
                                    <span class="voice_time">0"</span>
                                </div>

                            </div>
                        </li>`

                    }

                    break;
                case 19://蓝名片

                    var extraContent=JSON.parse(curData.extraContent)

                    str+=`<li class="mlR_CMsg_li">
                            <h5 class="mlR_CMsg_title" userid="${curData.sender}"></h5><em>${sendTime}</em>
                            <div class="mlR_CMsg_box mlR_CMsg_card" >
                               <span>用户名片</span>
                                <hr>
                                <div class="card_det" >
                                    <img src="images/defuser.png" alt="" resId="${extraContent.photoResId}">
                                    <span>${extraContent.name}</span>
                                    <span>${extraContent.branchPath}</span>
                                </div>

                            </div>
                        </li>`;
                    break;

                case 3://卡片信息

                    str+=`<li class="mlR_CMsg_li">
                            <h5 class="mlR_CMsg_title" userid="${curData.sender}"></h5><em>${sendTime}</em>
                            <div class="mlR_CMsg_box mlR_CMsg_ManuCard" >
                               <span>链接</span>
                                <hr>
                                <div class="card_det" >
                                    <img src="images/micro_card.png" alt="" >
                                    <span class="manu_url">${result}</span>
                                  </div>
                            </div>
                        </li>`


break;
                default :
                    break;
            }


        }

        $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(0).prepend(str);

        _this.Scrollright.refresh();
        $('.mlR_Con:eq(0)').scrollTop(6)

        $('.mlR_NF').remove();
        $('.mlR_NP').remove();

        var result = ''
        if (strfile != '') {

            if ($('.mlR_table').length == 0) {
                result = `<table class="mlR_table">
                    	<tr>
                        	<th>名称</th>
                        	<th>时间</th>
                        	<th>操作</th>
                        </tr>` + strfile + `
                        </table>`;

                $('.mlR_msgList .mlR_Con').eq(2).append(result);
            } else {
                $('.mlR_msgList .mlR_Con ').eq(2).find('.mlR_table tr:first').after(strfile);
            }

        } else {
            //$('.mlR_msgList .mlR_Con:eq(2) tr').eq(2)
//if(_this.Filecount==0){
            if ($('.mlR_table').length == 0) {
                result = '<li><div class="mlR_secFNull mlR_NF" style="margin-top: 150px"><img src="images/ml_bubbleNull.png" /><p>没有文件信息</p></div></li>';
                $('.mlR_msgList .mlR_Con:eq(2)').prepend(result);
            }

        }
        _this.Scrollright.refresh();
        if (strpic != '') {

            $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(1).prepend(strpic);
            _this.Scrollright.refresh();

        } else {
            if ($('.mlR_msgList .mlR_Con .mlR_CMsg:eq(1) li').length == 0) {
                result = '<div class="mlR_secFNull mlR_NP" style="margin-top: 150px"><img src="images/ml_bubbleNull.png" /><p>没有图片信息</p></div>';
                $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(1).prepend(result);
            }


        }
        //获取sender的信息

        _this.getSenderInfo(dialogType);

        //获取内容图片
        $('.mlR_CMsg_li li ').each(function (index, ele) {

            var imgstr = '';
            _this.imageId = _this.imageId + 1;

            if ($(this).attr('issingle')) {
                var oimg = $(ele).children('img');
                imgstr = oimg.attr('resourceId');
                oimg.attr('imageId', _this.imageId);
            } else {
                imgstr = $(ele).attr('resourceId');
                $(ele).attr('imageId', _this.imageId);
            }
            var parm = {resourceList: [{photoResId: imgstr}]};

            _this.getContentImgePath(parm, _this.imageId, function (result, targ) {
                if ($('.mlR_CMsg_li  li[imageId="' + targ + '"]').length == 0) {

                    var oimg = $('.mlR_CMsg_li  li img[imageId="' + targ + '"]')
                    if (result != '') {
                        $('.mlR_CMsg_li  li img[imageId="' + targ + '"]').attr('src', result).load(function () {
                            _this.Scrollright.refresh();
                        });

                        oimg.on('click', function () {

                            var parm = {picturePath: result};
                            try {
                                window.lxpc.exebusinessaction('ChatRecord', 'ViewSrcPicture', '0', JSON.stringify(parm), 0, null)
                            }
                            catch (e) {

                                console.log(e.message);
                            }
                        })

                    }

                } else {
                    $('.mlR_CMsg_li  li[imageId="' + targ + '"]').css('background-image', 'url("' + result + '")');
                    _this.Scrollright.refresh();
                    $('.mlR_CMsg_li  li[imageId="' + targ + '"]').on('click', function () {
                        var parm = {picturePath: result};
                        try {
                            window.lxpc.exebusinessaction('ChatRecord', 'ViewSrcPicture', '0', JSON.stringify(parm), 0, null)
                        }
                        catch (e) {

                            console.log(e.message);
                        }
                    })
                }


            })

        })




        //文件操作
        _this.bindFile(filelist);

        //音频操作
        _this.bindVoice()

        //获取蓝名片的头像

        $('.mlR_CMsg_card img').each(function(index,ele){
            var $ele=$(ele)
            var resId=$ele.attr('resId')
            _this.imageId = _this.imageId + 1;
            $ele.attr('imageId', _this.imageId);
            var parm={resourceList: [{photoResId: resId}]}

            try {
                window.lxpc.exebusinessaction('DownloadResource', 'cardImage', '0', JSON.stringify(parm), parseInt(_this.imageId), function (status, result, targ) {

                    if (status == 0) {

                        $('.mlR_CMsg_card img[imageId="'+targ+'"]').attr('src',result)

                    } else {

                        console.log(status)

                    }
                })
            } catch (e) {

                my_layer({message: '调用接口出错，错误码' + e.message}, 'error')
            }


        })



    },
    getChatInfo: function (data) {


        var _this = this;
        $('.mlL_lList li').removeClass('ml_bg')

        var chatInfo = JSON.parse(data);
        var name = chatInfo.name,
            dialogid = chatInfo.dialogId,
            dialogtype = chatInfo.dialogType,
            photoResId = chatInfo.photoResId;

        var str = '';
        switch (dialogtype) {
            case 2://私信会话
                str += '<li class="ml_bg" diaId="' + dialogid + '" typeinfo="' + dialogtype + '"><img src="images/ml_headIcon.jpg" class="ml_icon20" imagepath="' + photoResId + '"/><div>' + name + '</div></li>'

                break;
            default ://0 群聊会话 1群发会话 3广播号会话 4订阅号会话


                str += '<li class="ml_bg" diaId="' + dialogid + '" typeinfo="' + dialogtype + '"><img src="images/ml_qunIcon.jpg" class="ml_icon20" imagepath="' + photoResId + '"/><div>' + name + '</div></li>'
                break;
        }
        $('.mlL_lList').append(str)

    },
    getAllChatinfo: function () {
        var _this = this;
        try {
            var parm = {};
            window.lxpc.exebusinessaction('ChatRecord', 'QueryAllDialog', '0', JSON.stringify(parm), 0, function (status, data, targ) {
                if (status == 0) {
                    var datalist = JSON.parse(data);

                    var fined=null;
                    for(var i=0;i<datalist.length;i++){
                        var item=datalist[i];
                        if(_this.initInfo.userUniId){//从群里打开某个人在该群里的的聊天记录

                            if(item.dialogId==_this.initInfo.userUniId){
                                fined=datalist.splice(i,1)[0];

                                break;
                            }
                        }else{
                            if(item.dialogId==_this.initInfo.dialogId){
                                fined=datalist.splice(i,1)[0];
                                break;
                            }
                        }

                    }
                    //
                    //if(fined==null){//打开的某人的聊天记录不存在左侧的导航中，需要添加新联系人
                    //    if(_this.initInfo.userUniId){
                    //        fined={};
                    //        fined.dialogId=_this.initInfo.userUniId;
                    //        fined.dialogType=2;
                    //        fined.name=_this.initInfo.username;
                    //        fined.photoResId=_this.initInfo.userphotoResId
                    //        datalist.unshift(fined)
                    //    }else{
                    //        datalist.unshift(_this.initInfo)
                    //    }
                    //    datalist.unshift(_this.initInfo)
                    //
                    //}else{
                    //    datalist.unshift(fined)
                    //}
                    datalist.unshift(_this.initInfo)
                    _this.bindleftinfo(datalist)


                } else {
                    console.log(status)
                }

            })
        } catch (e) {
            console.log(e.message)
        }
    },
    QuerySenderInfo: function (parm, itarg, callback) {

        var _this = this;
        try {

            window.lxpc.exebusinessaction('ChatRecord', 'QuerySenderInfo', '1', JSON.stringify(parm), itarg, function (status, result, targ) {
                if (status == 0) {

                    if (Object.prototype.toString.call(callback) == '[object Function]') {

                        callback(result, targ);
                    }

                } else {
                    console.log(status)
                }

            })
        } catch (e) {
            console.log(e.message)
        }

    },
    showNochatlog: function () {
        //stype 0:无聊天信息 1，无图片信息 2:无文件信息

        var str = '<div class="mlR_secFNull"><img src="images/ml_bubbleNull.png" /><p>无消息记录</p></div>';
        $('.ml_R').prepend(str);


    },
    getImgePath: function getImgePath(parm, starg, callback) {

        try {
            window.lxpc.exebusinessaction('DownloadResource', 'HeaderImage', '0', JSON.stringify(parm), parseInt(starg), function (status, result, targ) {

                if (status == 0) {

                    if (Object.prototype.toString.call(callback) === '[object Function]') {

                        callback(result, targ);
                    }

                } else {
                    my_layer({message: '调用接口出错，错误码' + status}, 'error');
                    console.log(status)
                }
            })
        } catch (e) {

            my_layer({message: '调用接口出错，错误码' + e.message}, 'error')
        }

    },
    getContentImgePath: function (parm, starg, callback) {

        try {
            window.lxpc.exebusinessaction('DownloadResource', 'contentImage', '0', JSON.stringify(parm), parseInt(starg), function (status, result, targ) {

                if (status == 0) {

                    if (Object.prototype.toString.call(callback) === '[object Function]') {

                        callback(result, targ);
                    }

                } else {

                    console.log(status)
                    callback(result, targ);
                    console.log(targ)
                    //my_layer({message: '调用接口出错，错误码' + status}, 'error')

                }
            })
        } catch (e) {
            console.log(e.message)

            my_layer({message: '调用接口出错，错误码' + e.message}, 'error')
        }

    },
    computeImgSize: function computeImgSize(oimg, path, boxW, BoxminW, ismulimages) {

        var realWidth;//真实的宽度
        var realHeight;//真实的高度

        $("<img/>").attr("src", path).load(function () {
            realWidth = this.width;
            realHeight = this.height;
//如果真实的宽度大于浏览器的宽度就按照100%显示


            if (ismulimages) {
                if (realWidth > realHeight) {
                    if (realHeight > BoxminW) {
                        oimg.css("width", (boxW / realHeight) * 100 + '%');
                    } else if (realHeight <= BoxminW) {


                    } else {
                        oimg.css('width', '100%')
                    }
                } else {
                    if (realWidth > BoxminW) {

                        oimg.css("width", (boxW / realWidth) * 100 + '%');
                    } else if (realWidth <= BoxminW) {

                    }
                }
            } else {

            }


        });

    },
    resetResult: function resetResult(str_url) {


        //var strRegex = /(http|ftp|https)?:?\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
        //var strRegex=reg=/((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
        //var strRegex=reg=/((http|ftp|https):\/\/)|(www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
        var strRegex=reg=/(((http|ftp|https):\/\/)|(www\.))[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
//
        var newstr = str_url.replace(strRegex, function () {
            var cururl = arguments[0];
            return '<a href="javascript:;" class="aV_a"  onclick="openUrl(\'' + cururl + '\')">' + cururl + '</a>'
        })
        return newstr

    },
    reorderleftInfo: function (data) {

        var dialogId = data['dialogId'],
            userUniId = data['userUniId'],
            queryInfo = '';

        if (typeof(userUniId) == 'undefined' || userUniId == '') {
            queryInfo = dialogId;
        } else {
            queryInfo = userUniId;//把从群里进入某个人的聊天记录
            //queryInfo = dialogId
        }


        var $li = $('.mlL_nameList .mlL_lList li[diaId="' + queryInfo + '"]')

        if ($li.length > 0) {
            //var $Newli = $li.clone(true);
            //$('.mlL_nameList .mlL_lList ').prepend($('.mlL_nameList .mlL_lList li[diaId="' + queryInfo + '"]'));
            $('.mlL_nameList .mlL_lList ').prepend($li);
            //$li.remove()
            $('.mlL_nameList .mlL_lList li').removeClass('ml_bg');
            $('.mlL_nameList .mlL_lList li:eq(0)').addClass('ml_bg')
        } else {//新加的成员没有在左侧信息里面所以需要重新加进去

            //this.addnewleftinfo(data)
            this.bindleftinfo([data])

        }


    },
    bindleftinfo: function (datalist) {
        var _this = this;
        var path = 'images/defuser.png', str = '';

        for (var i = 0; i < datalist.length; i++) {

            var curdata = datalist[i];

            var name = curdata.name,
                dialogId = curdata.dialogId,
                dialogType = curdata.dialogType,
                photoResId = curdata.photoResId;

            if(curdata.userUniId){
                name=_this.initInfo.username;
                photoResId = _this.initInfo.userphotoResId;
                //dialogType=2;
                //dialogId=_this.initInfo.userUniId;
            }

            switch (dialogType) {

                case 0://1：群发会话 //3：广播号会话//4：订阅号会话

                    path = 'images/ml_qunIcon.jpg';
                    break;
                case 2://2：私信会话
                    path = 'images/ml_headIcon.jpg';
                    break;
                case 1:

                    path = 'images/ml_qunIcon.jpg';
                    break;
                case 3:

                    path = 'images/head_gbh.png';
                    break;
                case 4:

                    path = 'images/head_gbh.png';
                    break;
                default:

                    path = 'images/ml_qunIcon.jpg';
                    break;
            }


            str += '<li diaId="' + dialogId + '" typeinfo="' + dialogType + '" index="' + i + '" userId="'+curdata.userUniId+'"><img imagepath="' + photoResId + '" src="' + path + '" class="ml_icon20" /><div>' + name + '</div></li>';

        }



        //if(addNewmember==true){//打开某个群聊天记录中的某个人的聊天信息
        //    $('.mlL_nameList .mlL_lList ').prepend(str);
        //    $('.mlL_lList li').removeClass('ml_bg');
        //    $('.mlL_lList li[diaId="' + datalist[0].userUniId + '"]')
        //}else {
        //    $('.mlL_nameList .mlL_lList ').append(str);
        //}


        $('.mlL_nameList .mlL_lList ').prepend(str);
        $('.mlL_nameList .mlL_lList li').removeClass('ml_bg')
        $('.mlL_nameList .mlL_lList li:first').addClass('ml_bg')
        _this.Scrollleft.refresh();

        //点击左侧消息记录列表，添加背景颜色,别切换到对应的内容
        for (var i = 0; i < datalist.length; i++) {

            var curdata = datalist[i],
                dialogid = curdata.dialogId;


            if(curdata.userUniId){
                dialogid=curdata.userUniId
            }

            $('.mlL_lList li[diaId="' + dialogid + '"]').click(function () {
                $(".mlL_lList li").removeClass("ml_bg");
                $(this).addClass("ml_bg");
                var diaId = $(this).attr('diaId'),
                    type = $(this).attr('typeinfo');

                if (_this.dialogId == diaId) {

                    return;
                } else {
                    _this.dialogId = diaId;
                    _this.userUniId = '';
                    _this.QueryChatlog(diaId, type);
                }


            }).dblclick(function () {//双击进入所属的该群
                var diaId = $(this).attr('diaId'),
                    type = parseInt($(this).attr('typeinfo'));

                var id = $(this).children('img').attr('imagepath');
                var name = $(this).children('div').html();


                try {
                    var parm = {dialogId: diaId, name: name, dialogType: type, photoResId: id};

                    window.lxpc.exebusinessaction('ChatRecord', 'OpenDialogWnd', '0', JSON.stringify(parm), 0, null)


                } catch (e) {
                    console.log(e.message)
                }

            });
            //上下键
            //_this.keyDown($('.mlL_lList li'),'ml_bg',function(index){
            //    //index=index-1
            //   //console.log($('.mlL_lList li:eq('+index+')').length)
            //    _this.Scrollleft.refresh();
            //    _this.Scrollleft.scrollToElement('.mlL_lList li[index="'+index+'"]',300)
            //})

        }
        ;


        //获取头像

        $('.mlL_nameList img').each(function (index, ele) {
            $ele = $(ele);

            var resiD = $ele.attr('imagepath')
            if (resiD != '' && typeof(resiD) != 'undefined' && typeof(resiD) != null) {

                _this.imageId = _this.imageId + 1;
                var imgstr = $ele.attr('imagepath');
                $ele.attr('imageId', _this.imageId);
                var parm = {resourceList: [{photoResId: imgstr}]};

                downresource(parm, _this.imageId, function (result, targ) {
                    $('.mlL_lList  img[imageId=' + targ + ']').attr('src', result);
                    _this.Scrollright.refresh();
                })

            }


        });


    },
    addnewleftinfo: function (data) {
        var _this = this;
        var path = 'images/defuser.png', str = '';

        var curdata = data;
        var name = curdata.name,
            dialogId = curdata.dialogId,
            dialogType = curdata.dialogType,
            photoResId = curdata.photoResId,
            userUniId = curdata.userUniId;

        switch (dialogType) {

            case 0://1：群发会话 //3：广播号会话//4：订阅号会话

                path = 'images/ml_qunIcon.jpg';
                break;
            case 2://2：私信会话
                path = 'images/ml_headIcon.jpg';
                break;
            case 1:

                path = 'images/ml_qunIcon.jpg';
                break;
            case 3:

                path = 'images/ml_qunIcon.jpg';
                break;
            case 4:

                path = 'images/ml_qunIcon.jpg';
                break;
            default:

                path = 'images/ml_qunIcon.jpg';
                break;
        }

        str += '<li diaId="' + dialogId + '" type="' + dialogType + '" ><img imagepath="' + photoResId + '" src="' + path + '" class="ml_icon20" /><div>' + name + '</div></li>';


        $('.mlL_nameList .mlL_lList ').prepend(str);
        $('.mlL_lList li').removeClass('ml_bg');
        $('.mlL_lList li:eq(0)').addClass('ml_bg');

        //$('.mlL_nameList .mlL_lList ').append(str);
        _this.Scrollleft.refresh();

        //点击左侧消息记录列表，添加背景颜色,别切换到对应的内容

        dialogid = data.dialogId;

        $('.mlL_lList li[diaId="' + dialogid + '"]').click(function () {
            $(".mlL_lList li").removeClass("ml_bg");
            $(this).addClass("ml_bg");
            var diaId = $(this).attr('diaId'),
                type = $(this).attr('type');

            _this.QueryChatlog(diaId, type);
        }).dblclick(function () {//双击进入所属的该群
            var diaId = $(this).attr('diaId'),
                type = parseInt($(this).attr('type'));

            var id = $(this).children('img').attr('imagepath');
            var name = $(this).children('div').html();


            try {
                var parm = {dialogId: diaId, name: name, dialogType: type, photoResId: id};

                window.lxpc.exebusinessaction('ChatRecord', 'OpenDialogWnd', '0', JSON.stringify(parm), 0, null)


            } catch (e) {
                console.log(e.message)
            }

        });


        //获取头像

        $('.mlL_nameList img').each(function (index, ele) {
            $ele = $(ele);

            if ($ele.attr('imagepath') != '') {
                _this.imageId = _this.imageId + 1;
                var imgstr = $ele.attr('imagepath');
                $ele.attr('imageId', _this.imageId);
                var parm = {resourceList: [{photoResId: imgstr}]};

                downresource(parm, _this.imageId, function (result, targ) {

                    $('.mlL_lList  img[imageId=' + targ + ']').attr('src', result);
                    _this.Scrollright.refresh();
                })

            }


        })
    },
    seachReasult: function (search) {
        $('.mlL_secFNull').hide();
        $('.mlL_lFList').empty();
        var _this = this;

        if (search.trim() == '') {
            $(".mlL_lList").show();
            $(".mlL_lFList").hide();
            var diaId = $('.mlL_lList .ml_bg').attr('diaId');
            var diaType = $('.mlL_lList .ml_bg').attr('typeinfo')
            _this.QueryChatlog(diaId, diaType)
            return;
        }
        ;

        $(".mlL_lList").hide();

        $(".mlL_lFList").show();

        var strRes = search.trim();
        try {
            var parm = {searchKeyWord: strRes};
            _this.searchId = _this.searchId + 1;
            window.lxpc.exebusinessaction('ChatRecord', 'SearchRecord', '0', JSON.stringify(parm), _this.searchId, function (status, data, targ) {
                if (_this.searchId == targ) {

                    $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(0).empty();
                    $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(1).empty();
                    $('.mlR_msgList .mlR_Con  ').eq(2).empty()
                    if (status == 0) {

                        var datalist = JSON.parse(data);


                        if (datalist.length == 0) {
                            $('.mlL_secFNull').show();

                            $('.mlR_secFNull').remove();

                            return;
                        }

                        $('.mlL_lFList').empty();

                        var str = '<h4 class="mlL_title">聊天记录</h4>'

                        var Group = [],
                            MeIDlist = [];

                        for (var i = 0; i < datalist.length; i++) {
                            var curData = datalist[i],
                                Sender = curData.Sender,
                                DialogID = curData.DialogID,
                                Senderlist = [];

                            if (DialogID.indexOf('Qun') > -1) {//群聊按DialogID分组
                                for (var k = 0; k < datalist.length; k++) {
                                    var tempdata = datalist[k];

                                    if (DialogID == tempdata.DialogID) {
                                        Senderlist.push(tempdata);
                                        datalist.splice(k, 1)
                                        k--;
                                    }
                                }
                                i--

                                Group.push(Senderlist);

                            } else {//私聊或是公众号 按senderID分组

                                for (var j = 0; j < datalist.length; j++) {
                                    var tempdata = datalist[j];

                                    if (Sender == tempdata.Sender) {
                                        Senderlist.push(tempdata);
                                        datalist.splice(j, 1)
                                        j--;
                                    }
                                }
                                i--

                                Group.push(Senderlist);

                            }

                        }


                        for (var i = 0; i < Group.length; i++) {
                            var GroupInfo = Group[i][0];
                            Name = GroupInfo.Name;

                            var name = '';

                            str += '<h5 class="mlL_titleH5"><div>' + Name + '</div><span class="mlL_titleH5_sum"><i>' + Group[i].length + '</i><em></em></span></h5>'

                            var datalist = Group[i];

                            str += '<ul class="mlL_listLi mlL_lLi2">'
                            for (var j = 0; j < datalist.length; j++) {

                                var SubData = datalist[j],
                                    DialogID = SubData.DialogID,
                                    Message = SubData.Message.trim(),
                                    MsgID = SubData.MsgID,
                                    Sender = SubData.Sender,
                                    ContentType = SubData.ContentType,
                                    MimeType = SubData.MimeType,
                                    Name = SubData.Name;

                                var dialogType = 0
                                if (DialogID.indexOf('Qun') > -1) {//是群聊记录
                                    dialogType = 0
                                } else {
                                    dialogType = 2
                                }

                                if (MeIDlist.indexOf(MsgID) == -1) {//去重
                                    MeIDlist.push(MsgID)
                                } else {

                                    datalist.splice(j, 1);
                                    j--;
                                    continue;
                                }

                                var searchText = _this.search.trim()
                                var reg = new RegExp(searchText)

                                if (ContentType == 1) {
                                    if (MimeType.indexOf('application') > -1 || MimeType.indexOf('text') > -1) {//附件是文件
                                        var AttachmentName = SubData.AttachmentName;
                                        Message = AttachmentName.split(',')[0];
                                    }

                                }


                                if (Message != '') {
                                    var resultary = reg.exec(Message),
                                        index = resultary.index,
                                        result = '';


                                    if (Message.length <= 18) {
                                        result = Message;
                                    } else if (Message.substring(0, index + 1).length <= 18) {
                                        //result = Message.substring(0, index + 1);
                                        result = Message.substring(0, 19);
                                    } else {
                                        result = Message.substring(index - 5)
                                    }

                                    var newMessage = result.replace(reg, function () {
                                        return '<span class="sec_link">' + arguments[0] + '</span>'
                                    })
                                    //将选中的字符高亮
                                    str += '<li class="locationL_1" DialogID="' + DialogID + '" MsgID="' + MsgID + '" dialogType="' + dialogType + '"><div><img src="images/ml_fileIcon.png" class="ml_fileIcon" />' + newMessage + '</div></li>'
                                }

                            }

                            str += '</ul>'

                        }


                        $('.mlL_lFList').append(str);
                        _this.Scrollleft.refresh();

                        //重新计算个数
                        $('.mlL_titleH5').each(function (index, ele) {
                            var $ele = $(ele);

                            var curdata = $ele.find('i').text();

                            var count = Group[index].length,
                                curcount = parseInt(curdata);

                            if (curcount != count) {

                                $ele.find('i').text(count)
                            }

                        })


                        var tb = -1;
                        ////搜索结果 聊天记录一个人有多条消息，点击右侧数字可以显示/隐藏

                        $(".mlL_titleH5 .mlL_titleH5_sum").click(function () {
                            $li = $(this).parents(".mlL_titleH5").next(".mlL_lLi2")
                            if ($li.hasClass('disN')) {
                                $li.removeClass('disN')
                            } else {
                                $li.addClass('disN')
                            }
                            _this.Scrollleft.refresh();

                        });


                        //初始化
                        var initData = Group[0][0];
                        var dialogType = 0
                        if (initData.DialogID.indexOf('Qun') > -1) {//是群聊记录
                            dialogType = 0
                        } else {
                            dialogType = 2
                        }

                        _this.dialogId = initData.DialogID;
                        $(".mlL_lFList li:first").addClass("ml_bg");
                        _this.QueryChatlog_search(initData.DialogID, dialogType, MsgID)

                        //点击左侧消息记录列表，添加背景颜色-搜索结果
                        $('.mlL_lFList li').click(function () {
                            _this.bindeventSearchLeft($(this))


                        })


                    }

                } else {

                    console.log(status)
                }


            })


        } catch (e) {
            console.log(e.message)
        }


    },
    QueryChatlog_search: function (dialogId, dialogType, MsgID) {
        var _this = this;

        var _this = this;

        initchat();

        //$('.mlR_msgList .mlR_Con .mlR_CMsg').eq(0).empty();
        //$('.mlR_msgList .mlR_Con .mlR_CMsg').eq(1).empty();
        //$('.mlR_msgList .mlR_Con  ').eq(2).empty()

        try {
            var parm = null;

            parm = {dialogId: dialogId};
            window.lxpc.exebusinessaction('ChatRecord', 'QueryRecord', '0', JSON.stringify(parm), 0, function (status, data, targ) {

                if (status == 0) {
                    var datalist = JSON.parse(data)

                    var str = '';
                    var strpic = '';
                    var strfile = '';

                    $('.mlR_secFNull').remove();

                    if (datalist.length == 0) {
                        _this.showNochatlog();

                        return;
                    }

                    _this.datalist = datalist = datalist.sort(function (a, b) {
                        //return a.userMessage.sendTime - b.userMessage.sendTime;

                        var sendTimeA,
                            sendTimeB;
                        if (typeof(a.userMessage) == 'undefined') {
                            sendTimeA = a.sendTime
                        } else {
                            sendTimeA = a.userMessage.sendTime
                        }
                        if (typeof(b.userMessage) == 'undefined') {
                            sendTimeB = b.sendTime
                        } else {
                            sendTimeB = b.userMessage.sendTime
                        }

                        return sendTimeA - sendTimeB;

                    })

                    _this.QueryChatlog_searchBind(datalist, dialogType, MsgID)

                } else {
                    console.log(status)
                }
            })

        } catch (e) {
            console.log(e.message)
        }
    },
    QueryChatlog_searchBind: function (datalist, dialogType, MsgID, isloadMore) {
        //str = ''
        var _this = this;
        var str = '';
        var strpic = '';
        var strfile = '';
        var filelist = [];
        for (var i = 0; i < datalist.length; i++) {
            var curData;
            if (typeof(datalist[i]['userMessage']) == 'undefined') {
                curData = datalist[i];
            } else {
                curData = datalist[i]['userMessage'];
            }


            var types = curData['contentType'];
            var message = curData['message'];

            var name = '';
            var sendTime = FormatTime(curData['sendTime'], 'mm-dd hh:mm');

            var MesageId = curData.id

            var result = ''
            if (message != '') {
                result = Base64.decode(message);
            }

            var urllist = getUrl(result);

            if (urllist.length == 0) {
                result = result;
            } else {
                result = _this.resetResult(result);
            }

            //高亮显示查询的结果
            var reg = new RegExp(_this.search, 'g')
            var newResult = '';
            if (result != '') {
                newResult = result.replace(reg, function (content, index, str) {

                    return '<mark class="sec_link">' + arguments[0] + '</>'
                })
            }


            switch (types) {
                case 0:
                    str += '<li class="mlR_CMsg_li" MsgID="' + MesageId + '" ><h5 class="mlR_CMsg_title"  userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div><p class="mlR_CMsg_font">' + newResult + '</p></div></li>';
                    break;
                case 1:

                    if (curData['mimeType'].indexOf('image') > -1) {

                        var imagelist = curData['extraContent'];
                        if (typeof(imagelist) == 'undefined' || imagelist == '') {
                            //一个图片
                            //_this.Dataimagelist.push(curData);
                            //str += '<li  class="mlR_CMsg_li" ><h5 class="mlR_CMsg_title">' + name + '<em>' + sendTime + '</em></h5><div><p class="mlR_CMsg_font">' + result + '</p> <ul><li><img src="images/defpicture.png" resourceId="' + curData['attachmentResId'] + '"</ul>/></li>'

                            str += '<li class="mlR_CMsg_li" MsgID="' + MesageId + '"><h5 class="mlR_CMsg_title"  userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div><p class="mlR_CMsg_font">' + newResult + '</p><ul class=" mlR_CMsg_img mlR_img1"> <li issingle="true" ><img src="images/defpicture.png"  resourceId="' + curData['attachmentResId'] + '"/></li></ul></li>'
                            //
                            //strpic += '<li class="mlR_CMsg_li" ><h5 class="mlR_CMsg_title">' + sendTime + '</h5><ul class="mlR_CImg"> <li ><img src="images/defpicture.png" ispicTab="true" resourceId="' + curData['attachmentResId'] + '"/></li></ul></li>';
                            strpic += '<li class="mlR_CMsg_li" ><h5 class="mlR_CMsg_title">' + sendTime + '</h5><ul class="mlR_CImg"> <li style="background-image: url(images/defpicture.png)" resourceId="' + curData['attachmentResId'] + '" ispicTab="true"></li></ul></li>'


                            //图片页

                        } else {//多个图片
                            str += ' <li class="mlR_CMsg_li" MsgID="' + MesageId + '" ><h5 class="mlR_CMsg_title"  userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em> <div> <p class="mlR_CMsg_font">' + newResult + '</p> ';

                            strpic += '<li class="mlR_CMsg_li"><h5 class="mlR_CMsg_title">' + sendTime + '</h5><ul class="mlR_CImg">'

                            strpic += ''
                            imagelist = JSON.parse(imagelist);

                            if (imagelist.length == 4) {//四宫格
                                str += '<ul class="mlR_CMsg_img mlR_img4">'

                            } else {//九宫格
                                str += '<ul class="mlR_CMsg_img">'
                            }

                            for (var j = 0, ln = imagelist.length; j < ln; j++) {

                                var oimg = imagelist[j];

                                str += '<li style="background-image: url(images/defpicture.png)" resourceId="' + oimg.resourceId + '"></li>';
                                strpic += '<li style="background-image: url(images/defpicture.png)" resourceId="' + oimg.resourceId + '" ispicTab="true"></li>';
                                //strpic += '<li><img src="images/defpicture.png" resourceId="' + oimg.resourceId + '" ispicTab="true" /></li>'
                            }
                            str += '</ul></div></li>'
                            strpic += '</ul></li>'
                        }
                    } else if (curData['mimeType'].indexOf('application') > -1) {//文档
                        filelist.push(curData)
                        var attachmentInfo = curData['attachmentName'].split(','),
                            attachmentResId = curData['attachmentResId'];
                        var filename = attachmentInfo[0]
                        var filesize = attachmentInfo[1]
                        var time = sendTime.split(':')[0] + '月';
                        var filepath = '';

                        var reg = new RegExp(_this.search, 'g')
                        var newfilename = ''
                        if (filename != '') {
                            newfilename = filename.replace(reg, function () {

                                return '<span class="sec_link">' + arguments[0] + '</span>'
                            })
                        }

                        if (curData['mimeType'] == 'application/zip') {

                            filepath = 'images/ml_file_zip.png'


                        } else if (curData['mimeType'] == 'application/pdf') {
                            filepath = 'images/ml_file_pdf.png'

                        } else {
                            filepath = 'images/ml_file_default.png'
                        }

                        str += ' <li class="mlR_CMsg_li locationR_1" MsgID="' + MesageId + '"><h5 class="mlR_CMsg_title"  userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div><p>'+newResult+'</p><div class="mlR_CMsg_file" ResId="' + attachmentResId + '" filename="' + filename + '"> <img src="' + filepath + '" class="mlR_CMsg_Ficon" /> <div class="mlR_CMsg_fileR"> <h4><p >' + newfilename + '</p><em>' + time + '</em></h4> <div class="mlR_CMsg_fileNews"><em>' + filesize + '</em><p><a href="javascript:;" class="aV_a">下载</a><a href="javascript:;" class="aV_a">另存为</a></p></div></div></div></div></li>';

                        strfile += ' <tr> <td><div class="mlR_table_file" ResId="' + attachmentResId + '"> <img src="' + filepath + '" /> <div> <h4>' + filename + '</h4> <p>' + name + '<span>' + filesize + '</span></p> </div> </div> </td> <td>' + sendTime + '</td> <td><a href="javascript:;" class="aV_a">下载</a><a href="javascript:;" class="aV_a">转发</a></td> </tr>';

                    }

                    break;

                case 19://蓝名片

                    var extraContent=JSON.parse(curData.extraContent)

                    str+=`<li class="mlR_CMsg_li">
                            <h5 class="mlR_CMsg_title" userid="${curData.sender}"></h5><em>${sendTime}</em>
                            <div class="mlR_CMsg_box mlR_CMsg_card" >
                               <span>用户名片</span>
                                <hr>
                                <div class="card_det" >
                                    <img src="images/defuser.png" alt="" resId="${extraContent.photoResId}">
                                    <span>${extraContent.name}</span>
                                    <span>${extraContent.branchPath}</span>
                                </div>

                            </div>
                        </li>`;
                    break;

                case 3://卡片信息

                    str+=`<li class="mlR_CMsg_li">
                            <h5 class="mlR_CMsg_title" userid="${curData.sender}"></h5><em>${sendTime}</em>
                            <div class="mlR_CMsg_box mlR_CMsg_ManuCard" onclick="openUrl(\'${result}\')" >
                               <span>链接</span>
                                <hr>
                                <div class="card_det" >
                                    <img src="images/micro_card.png" alt="" >
                                    <span>${newResult}</span>
                                  </div>
                            </div>
                        </li>`

                    break;
                default :
                    break;
            }

        }

        $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(0).prepend(str);

        _this.Scrollright.refresh();
        $('.mlR_Con:eq(0)').scrollTop(6)
        //_this.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + MsgID + '"]', 300)

        var result = ''
        if (strfile != '') {

            result = `<table class="mlR_table">
                    	<tr>
                        	<th>名称</th>
                        	<th>时间</th>
                        	<th>操作</th>
                        </tr>` + strfile + `
                        </table>`;

            $('.mlR_msgList .mlR_Con').eq(2).append(result);

        } else {
            result = '<li><div class="mlR_secFNull" style="margin-top: 150px"><img src="images/ml_bubbleNull.png" /><p>没有文件信息</p></div></li>';
            $('.mlR_msgList .mlR_Con:eq(2)').prepend(result);
        }

        if (strpic != '') {
            $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(1).append(strpic);

        } else {
            result = '<div class="mlR_secFNull" style="margin-top: 150px"><img src="images/ml_bubbleNull.png" /><p>没有图片信息</p></div>';
            $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(1).prepend(result);
        }


        //文件操作

        _this.bindFile(filelist);

        //获取sender信息
        _this.getSenderInfo(dialogType, MsgID);

        //获取图片

        $('.mlR_CMsg_li  li').each(function (index, ele) {

            var imgstr = '';
            _this.imageId = _this.imageId + 1;

            if ($(this).attr('issingle')) {
                var oimg = $(ele).children('img');
                imgstr = oimg.attr('resourceId');
                oimg.attr('imageId', _this.imageId);
            } else {
                imgstr = $(ele).attr('resourceId');
                $(ele).attr('imageId', _this.imageId);
            }
            var parm = {resourceList: [{photoResId: imgstr}]};
            _this.getContentImgePath(parm, _this.imageId, function (result, targ) {
                if ($('.mlR_CMsg_li  li[imageId="' + targ + '"]').length == 0) {

                    $('.mlR_CMsg_li  li img[imageId="' + targ + '"]').attr('src', result).load(function () {
                        _this.Scrollright.refresh();
                        if (isloadMore) {
                            $('.mlR_Con:eq(0)').scrollTop(6)
                        } else {
                            var localMsID = $('.mlL_lFList .ml_bg').attr('MsgID');
                            _this.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + localMsID + '"]', 300)
                        }

                    });

                    var oimg = $('.mlR_CMsg_li  li img[imageId="' + targ + '"]')

                    oimg.on('click', function () {

                        var parm = {picturePath: result};
                        try {
                            window.lxpc.exebusinessaction('ChatRecord', 'ViewSrcPicture', '0', JSON.stringify(parm), 0, null)
                        }
                        catch (e) {

                            console.log(e.message);
                        }
                    })


                } else {
                    $('.mlR_CMsg_li  li[imageId="' + targ + '"]').css('background-image', 'url("' + result + '")');
                    _this.Scrollright.refresh();
                    $('.mlR_CMsg_li  li[imageId="' + targ + '"]').on('click', function () {
                        var parm = {picturePath: result};
                        try {
                            window.lxpc.exebusinessaction('ChatRecord', 'ViewSrcPicture', '0', JSON.stringify(parm), 0, null)
                        }
                        catch (e) {

                            console.log(e.message);
                        }
                    })
                }
                if (targ == _this.imageId) {
                    _this.Scrollright.refresh();
                    //_this.Scrollright.refresh();
                    $('.mlR_Con:eq(0)').scrollTop(6)
                    //_this.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + MsgID + '"]', 300)

                }

            })

        })
        if (isloadMore) {

            $('.mlR_Con:eq(0)').scrollTop(6)
        }

        //_this.Scrollright.refresh();
        ////_this.Scrollright.refresh();
        //_this.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + MsgID + '"]', 300)
    },
    getSenderInfo: function (dialogType, MsgID) {
        var _this = this;

        $('.mlR_msgList .mlR_Con:eq(0) .mlR_CMsg_title').each(function (index, ele) {

            var $ele = $(ele),
                userid = $ele.attr('userid'),
                MsgID = $($ele.parent()).attr('MsgID');

            if (userid == 'system') {
                $ele.html('系统信息');
                if (MsgID) {
                    _this.Scrollright.refresh();
                    //_this.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + MsgID + '"]', 300)
                }
            } else {

                var index = _this.userUniIdList.indexOf(userid);

                if (index == -1) {

                    _this.SenderId = _this.SenderId + 1;
                    _this.userUniIdList.push(userid)
                    _this.userName.push('');
                    $ele.attr('targ', _this.SenderId);

                    var parm = {userUniId: userid, dialogType: dialogType};

                    _this.QuerySenderInfo(parm, _this.SenderId, function (result, targ) {

                        var res = JSON.parse(result);
                        //if (res[0].name == '') {
                        //    res[0].name = '系统信息'
                        //}
                        //if(res==''){
                        //    return;
                        //}

                        $('.mlR_msgList .mlR_Con:eq(0) .mlR_CMsg_title[targ="' + targ + '"] ').html(res[0].name);

                        var useID = $('.mlR_msgList .mlR_Con:eq(0) .mlR_CMsg_title[targ="' + targ + '"] ').attr('userid');

                        var index = _this.userUniIdList.indexOf(useID);
                        _this.userName[index] = res[0].name;

                        $('.mlR_msgList .mlR_Con:eq(0) .mlR_CMsg_title[userid="' + useID + '"] ').html(res[0].name);

                        if (MsgID) {
                            if (targ == _this.SenderId) {
                                _this.Scrollright.refresh();
                                //_this.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + MsgID + '"]', 300)
                            }
                        }


                    })

                } else {

                    $('.mlR_msgList .mlR_Con:eq(0) .mlR_CMsg_title[userid="' + userid + '"] ').html(_this.userName[index]);
                    if (MsgID) {
                        _this.Scrollright.refresh();
                        //_this.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + MsgID + '"]', 300)
                    }

                }
            }


        })
    },
    bindfiledown: function ($down, $saveAs, filename, resId, $filebox, isTransform) {
        var _this = this;

        if ($down.hasClass('openfile')) {//下载完成之后打开文件

            var parm = {filePath: $down.data('path')};

            try {
                window.lxpc.exebusinessaction('ChatRecord', 'OpenFile', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                })

            } catch (e) {
                console.log(e.message)
            }


        } else {//下载文件
            var str = '<img src="images/ajax-loader_smail.gif" alt="" class="mlr_Downfile">';
            //console.log($filebox)
            $filebox.append(str);
            var parm = {resourceList: [{resourceType: 'res_file', fileName: filename, photoResId: resId}]}

            try {
                window.lxpc.exebusinessaction('DownloadResource', 'Noticefile', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                    if (status == 0) {

                        if (result.indexOf(filename) > -1) {

                            my_layer({
                                title: '蓝信',
                                icon: '/images/ic_tip1.png',
                                message: '文件下载成功'
                            }, 'success', function () {

                                if (!isTransform) {

                                    if ($saveAs != null) {
                                        $saveAs.html('打开文件夹');
                                        $saveAs.addClass('openfileDir');
                                        $saveAs.data('path', result);
                                    }
                                }
                                $down.html('打开');
                                $down.addClass('openfile');
                                $down.data('path', result);


                                $('.mlr_Downfile').remove();
                            })

                        }

                    } else {
                        var $box = $('.mlR_CMsg_fileR', $filebox)
                        //$box.append(str);
                        _this.showErrorforDownfile($box)
                    }
                })

            } catch (e) {
                var $box = $('.mlR_CMsg_fileR', $filebox)
                _this.showErrorforDownfile($box)
            }

        }
    },
    bindfilesaveAS: function ($down, $saveAs, filename, resId, $filebox) {
        var _this = this;

        if ($saveAs.hasClass('openfileDir')) {//另存为后打开文件

            var parm = {filePath: $saveAs.data('path')}

            try {
                window.lxpc.exebusinessaction('ChatRecord', 'OpenFileDir', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                })

            } catch (e) {
                console.log(e.message)
            }

        } else {//另存为

            var parm = {fileName: filename}
            try {
                window.lxpc.exebusinessaction('ChatRecord', 'OpenSaveAsWnd', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                    if (status == 0) {
                        var str = '<img src="./images/ajax-loader_smail.gif" alt="" class="mlr_Downfile">';
                        $filebox.append(str);
                        var data = JSON.parse(result),
                            filePath = data.filePath;

                        var index = filePath.lastIndexOf('\\'),
                            path = filePath.substring(0, index)

                        var parm = {
                            resourceList: [{
                                resourceType: 'res_file',
                                fileName: filename,
                                photoResId: resId,
                                filePath: path
                            }]
                        }

                        try {
                            window.lxpc.exebusinessaction('DownloadResource', 'Noticefile', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                                if (status == 0) {

                                    if (result.indexOf(filename) > -1) {

                                        my_layer({
                                            title: '蓝信',
                                            icon: '/images/ic_tip1.png',
                                            message: '另存为成功'
                                        }, 'success', function () {

                                            $saveAs.html('打开文件夹')
                                            $saveAs.addClass('openfileDir');
                                            $saveAs.data('path', filePath);
                                        })

                                        if ($down != null) {
                                            $down.html('打开');
                                            $down.addClass('openfile');
                                            $down.data('path', filePath);
                                        }
                                        $('.mlr_Downfile').remove();

                                    }

                                } else {

                                    var $box = $('.mlR_CMsg_fileR', $filebox)
                                    //$box.append(str);
                                    _this.showErrorforDownfile($box)
                                }
                            })

                        } catch (e) {
                            console.log(e.message);
                            var $box = $('.mlR_CMsg_fileR', $filebox)
                            //$box.append(str);
                            _this.showErrorforDownfile($box)
                        }


                    } else {
                        console.log(status)
                    }

                })


            } catch (e) {
                console.log(e.message)
            }

        }
    },
    showErrorforDownfile: function ($box) {
        $('.mlr_Downfile').remove();
        var str = '<div style="position: absolute;top: 70px;left: 43px;margin-top: -19px;"><span  class="er_fdown error ">下载失败</span></div>';
        $box.append(str)

    },
    keyDown: function keyDown(datalist, hightclass, cb) {
        var keyIndex = 0,
            total = datalist.length;
        document.onkeydown = function (event) {
            var curIndex
            if (total == 0 || total == 1) {
                return;
            }
            if (event.keyCode == 38)//上
            {

                if (keyIndex == 0) {
                    curIndex = total - 1;
                } else {
                    curIndex = keyIndex - 1;
                }
                clickTr(curIndex)
            }
            if (event.keyCode == 40)//下
            {

                if (keyIndex == total - 1) {
                    curIndex = 0;
                } else {
                    curIndex = keyIndex + 1;
                }
                clickTr(curIndex)
            }

            function clickTr(currTrIndex) {
                if (currTrIndex > -1) {

                    datalist.eq(currTrIndex).addClass(hightclass);
                    if (Object.prototype.toString.call(cb) == '[object Function]') {

                        cb(currTrIndex);
                    }
                }
                datalist.eq(keyIndex).removeClass(hightclass);
                keyIndex = currTrIndex;


            }
        }
    },
    loadMorechartlog: function (parm, diaType, isSearch) {
        //var _this=this;
        //var parm = {dialogID: _this.dialogId, userMsgID: lastinfo.id, count: 5};

        var _this = this;
        this.loadMore = false;
        try {
            window.lxpc.exebusinessaction('ChatRecord', 'QueryHistoryMessage', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {
                    _this.loadMore = true;

                    var data = JSON.parse(jsondata);
                    var $ele = $('.mlR_Cload');
                    $ele.find('img').hide();

                    if (data.length == 0) {

                        $ele.data('targ', 1);
                        var $span = $ele.find('span')
                        $span.html('没有更多消息');
                        $span.css('color', '#ccc')

                        return;
                    }


                    data = data.sort(function (a, b) {
                        return a.sendTime - b.sendTime;
                    })


                    if (isSearch) {//搜索加载更多
                        var MsgID = $('.mlL_lFList .ml_bg').attr('MsgID');

                        _this.datalist = data.concat(_this.datalist);
                        _this.QueryChatlog_searchBind(data, diaType, MsgID, _this.search.trim(), true);
                        _this.bindleftforLoad(data, diaType);
                        _this.Scrollleft.refresh();

                    } else {//正常

                        _this.QueryChatlog_bind(data, diaType);
                        _this.datalist = data.concat(_this.datalist);
                    }

                    //$('.mlR_Con:eq(0)').scrollTop(6)

                } else {
                    my_layer({message: '调用接口出错，错误码' + status}, 'error')
                    console.log(status)
                }
            })
        } catch (e) {
            my_layer({message: '调用接口出错，错误码' + e.message}, 'error')
            console.log(e.message)
        }


    },
    bindleftforLoad: function (data, dialogType) {
        var _this = this;

        //将选中的字符高亮
        var curData;
        var messList = data.sort(function (a, b) {
            return a.sendTime - b.sendTime

        })

        var strleftinfo = '',
            count = 0;
        for (var i = 0, ln = messList.length; i < ln; i++) {
            curData = messList[i];

            var message = curData.message;
            if (message != '') {
                message = Base64.decode(message);
                var reg1 = new RegExp(_this.search.trim());

                if (reg1.test(message)) {
                    count++;
                    var resultdata = reg1.exec(message)
                    var result = '';
                    var index = resultdata.index;
                    if (message.length <= 18) {
                        result = message;
                    } else if (message.substring(0, index + 1).length <= 18) {
                        result = message.substring(0, 19);
                    } else {

                        result = message.substring(index - 5)
                    }

                    var searchText = _this.search.trim()

                    var reg = new RegExp(searchText)
                    var newMessage = result.replace(reg, function () {
                        return '<span class="sec_link">' + arguments[0] + '</span>'
                    })

                    strleftinfo += '<li class="locationL_1" DialogID="' + _this.dialogId + '" MsgID="' + curData.id + '" dialogType="' + dialogType + '" onclick=""><div><img src="images/ml_fileIcon.png" class="ml_fileIcon" />' + newMessage + '</div></li>'
                }

            }
        }

        var $matchedP = $('.mlL_lLi2 li[DialogID="' + _this.dialogId + '"]').parents('.mlL_lLi2');
        _this.Scrollleft.refresh();

        $matchedP.prepend(strleftinfo);
        var $count = $matchedP.prev().find('i');
        $count.html(parseInt($count.html()) + count);

        for (var i = 0, ln = messList.length; i < ln; i++) {
            var curData = messList[i];
            $('.mlL_lLi2 li[MsgID="' + curData.id + '"]').on('click', function () {
                _this.bindeventSearchLeft($(this));
            })
        }

    },
    //点击搜索页面的左侧消息记录列表，添加背景颜色-搜索结果
    bindeventSearchLeft: function (ele) {
        var _this = this;
        var $ele = $(ele);

        $(".mlL_lFList li").removeClass("ml_bg");
        $ele.addClass("ml_bg");
        $('.mlR_secFNull').remove();

        var DialogID = $ele.attr('DialogID'),
            MsgID = $ele.attr('MsgID');

        if (DialogID.indexOf('Qun') > -1) {//是群聊记录
            var dialogType = 0
        } else {
            var dialogType = 2
        }

        if (_this.dialogId == DialogID) {

            _this.Scrollright.refresh();
            _this.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + MsgID + '"]', 300)

            return;
        } else {

            _this.dialogId = DialogID;
            _this.QueryChatlog_search(DialogID, dialogType, MsgID, _this.search.trim())
        }
    },
    bindFile: function (filelist) {
        var _this = this;

        for (var j = filelist.length - 1; j > -1; j--) {

            var $ele = $('.mlR_CMsg_file:eq(' + j + ')');
            var resId = filelist[j].attachmentResId,
                filename = filelist[j].attachmentName;

            //初始化文件状态

            var parm = {fileResId: resId};

            _this.FileId = _this.FileId + 1;
            $ele.attr('targ', _this.FileId)

            var $Tabele = $('.mlR_msgList .mlR_Con:eq(2) .mlR_table_file:eq(' + j + ')');
            $Tabele.attr('targ', _this.FileId)
            try {
                window.lxpc.exebusinessaction('ChatRecord', 'CheckResource', '0', JSON.stringify(parm), _this.FileId, function (status, result, targ) {
                    if (status == 0) {

                        var $eleTem = $('.mlR_CMsg_file[targ="' + targ + '"] ')
                        var filename = $eleTem.attr('filename'),
                            resId = $eleTem.attr('ResId');

                        var $down = $eleTem.find('.aV_a').eq(0),
                            $saveAs = $eleTem.find('.aV_a').eq(1),
                            $fileBox = $eleTem;

                        var data = JSON.parse(result);

                        if (data.filePath) {

                            $down.html('打开');
                            $saveAs.html('打开文件夹');
                            $down.data('path', data.filePath);
                            $saveAs.data('path', data.filePath);
                            $down.addClass('openfile');
                            $saveAs.addClass('openfileDir');
                        }

                        var resId = $('.mlR_CMsg_file[targ="' + targ + '"] ').attr('ResId');

                        var $Tabfiles = $('.mlR_msgList .mlR_Con:eq(2) .mlR_table_file[ResId="' + resId + '"]  '),
                            $FilesTab_a = $Tabfiles.parents('tr').find('.aV_a'),
                            $down_fileTab = $FilesTab_a.eq(0),
                            $saveAs_tileTab = $FilesTab_a.eq(1),
                            $fileBoxTab = $down_fileTab.parents('td');

                        if (data.filePath) {

                            $down_fileTab.html('打开');
                            $saveAs_tileTab.html('转发');
                            $down_fileTab.data('path', data.filePath);
                            $saveAs_tileTab.data('path', data.filePath);
                            $down_fileTab.addClass('openfile');
                            $saveAs_tileTab.addClass('forward');
                        }

                        _this.Scrollright.refresh();

                        $down.click(function () {

                            _this.bindfiledown($(this), $saveAs, filename, resId, $fileBox);
                        })

                        $saveAs.click(function () {

                            _this.bindfilesaveAS($down, $(this), filename, resId, $fileBox);
                        })
                        $down_fileTab.click(function () {

                            _this.bindfiledown($(this), $saveAs_tileTab, filename, resId, $fileBoxTab, true);
                        })


                        $saveAs_tileTab.click(function () {
                            my_layer({message: '暂不支持'}, 'warn')

                        })


                    } else {
                        console.log(status)
                    }


                })

            } catch (e) {
                console.log(e.message)
            }


        }
    },
    //绑定语音信息
    bindVoice: function () {

        $('.mlR_CMsg_voice').each(function(){
            var $ele=$(this);
            var resId=$ele.attr('resId')

            if(resId!=''&&resId!=null&&typeof(resId)!='undefined'){
                var res_parm = {resourceList: [{resourceType: 'res_file', photoResId: resId, fileName: resId}]};
                //获取音频时长
                var path = '';
                var size;
                getVoiceLength(res_parm, function (result) {

                    size = result.size;
                    var time = ReSizeforTime(size);
                    path = result.filePath;
                    $('.voice_time').html(time);
                    $ele.data('info',result);

                })

            }

        })





    },
    //绑定聊天记录的数据


};

function initchat() {

    $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(0).empty();
    $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(1).empty();
    $('.mlR_msgList .mlR_Con  ').eq(2).empty();

    var $loadMore = $('.mlR_Cload');

    $loadMore.data('targ', 0);
    $loadMore.find('span').html('查看更多消息');
    $loadMore.find('span').css('color', '#067CEB')
    $loadMore.find('img').hide();

}

//打开连接
function openUrl(surl) {
    var map_parm = {url: surl}
    openMap(map_parm, 'chat')

}

//播放音频
var timer=null;
var timer_play=null;
function playOrStopVoice(ele,resId){

    var $ele=$(ele)
    var info=$ele.data('info');
    var $play=$ele.find('.voice_play')


    if (timer) {

        clearInterval(timer);
        timer = null;
        $play.css('backgroundPositionX', '-32px');
        stopVoice();
        clearTimeout(timer_play);
        timer_play=null;

    }else {

        //音频播放动画
        timer = setInterval(function () {
            var back = parseFloat($play.css('backgroundPositionX'))
            if(back+16==0){
                back=0
            }
            back = (back + 16) + 'px';

            $play.css('backgroundPosition', back);

        }, 200)
        var play_parm = {filePath: info.filePath}
        playVoice(play_parm, function () {
            timer_play = setTimeout(function () {

                clearInterval(timer);
                timer = null;
                $play.css('backgroundPosition', '-32px');
            }, info.size)

        })
    }


}