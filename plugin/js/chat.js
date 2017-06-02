function Chat() {

    this.Scrollleft = null;
    this.Scrollright = null;
    this.search = '';
    this.searchId = 0;
    this.dialogId = null;
    this.userUniId = null;//用于在群聊中打开某个人的聊天记录
    this.imageId = -1;
    this.SenderId = 0;
    this.FileId = 0;
    this.VoiceId = 0;
    this.datalist = [];
    this.Picturecount = 0;
    this.userUniIdList = [];
    this.selectId = 0;
    this.userName = [];
    this.loadMore = true;
    this.initInfo = null;
    this.viewImglist = [];
    this.viewImgId = -1;
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
                $('.mlL_secFNull').hide();

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
            $('.mlL_secFNull').hide();
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

        })


        //支持上下键
        document.onkeydown = function (event) {
            if ($('#secText').val().trim() == '') {
                //keyDown($('.mlL_listLi'), 'ml_bg', _this.Scrollleft, function (seledli) {
                //    var diaId = seledli.attr('diaId'),
                //        type = seledli.attr('typeinfo');
                //
                //    if (_this.dialogId == diaId) {
                //
                //        return;
                //    } else {
                //        _this.dialogId = diaId;
                //        _this.userUniId = '';
                //        _this.QueryChatlog(diaId, type);
                //    }
                //
                //},keyUpAndDown)

                keyDown($('.mlL_listLi'), 'ml_bg', _this.Scrollleft, keyUpAndDown)

            } else {
                keyDown($('.mlL_lFList'), 'ml_bg', _this.Scrollleft, function (seledli) {
                    _this.bindeventSearchLeft(seledli)

                })
            }


            function keyUpAndDown(ele) {

                var diaId = $(ele).attr('diaId'),
                    type = $(ele).attr('typeinfo');

                if (_this.dialogId == diaId) {

                    return;
                } else {
                    _this.dialogId = diaId;
                    _this.userUniId = '';
                    _this.QueryChatlog(diaId, type);
                }
            }


        }

        function keyDown($box, hightclass, mainScroll, okcb) {

            var children = $box.find('li'),
                total = children.length;
            var olist = Array.from(children);

            var seledli = $box.find('.' + hightclass)
            var check = seledli.find('.aV_check')
            var keyIndex = olist.findIndex(function (item, index, arr) {
                return item.classList.contains(hightclass)
            });

            var curIndex = keyIndex;


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
            //if (event.keyCode == 13) {//确认键
            //
            //    if (Object.prototype.toString.call(okcb) == '[object Function]') {
            //
            //        okcb(seledli)
            //    }
            //
            //}

            function clickTr(currTrIndex) {


                if (currTrIndex > -1) {

                    var oitem = olist[currTrIndex];
                    oitem.classList.add(hightclass)
                    var beforeitem = olist[keyIndex]
                    var step = parseFloat(oitem.offsetTop) - parseFloat(beforeitem.offsetTop)

                    if (event.keyCode == 38) {//向上
                        if (currTrIndex == total - 1) {
                            mainScroll.scrollTo(0, mainScroll.maxScrollY)
                        } else {


                            if ((oitem.offsetTop) < Math.abs(mainScroll.y)) {
                                if (mainScroll.y > step) {
                                    mainScroll.scrollTo(0, 0)
                                } else {
                                    mainScroll.scrollBy(0, Math.abs(step))
                                }


                            } else if ((oitem.offsetTop) == Math.abs(mainScroll.y)) {
                                mainScroll.scrollTo(0, 0)
                            }
                        }

                        if (Object.prototype.toString.call(okcb) == '[object Function]') {

                            okcb(oitem)
                        }

                    } else if (event.keyCode == 40) {//向下
                        if (currTrIndex == 0) {
                            mainScroll.scrollTo(0, 0)
                        } else {


                            if ((oitem.offsetTop + step) >= mainScroll.wrapperHeight) {

                                if (Math.abs(mainScroll.maxScrollY - mainScroll.y) > step) {
                                    mainScroll.scrollBy(0, -step)
                                } else {
                                    mainScroll.scrollTo(0, mainScroll.maxScrollY)
                                }

                            }
                        }
                        if (Object.prototype.toString.call(okcb) == '[object Function]') {

                            okcb(oitem)
                        }
                    }


                }

                olist[keyIndex].classList.remove(hightclass);

                keyIndex = currTrIndex;
            }

        }


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
                    $('.mlR_Cload').show()
                }
            } else if (this.directionY == 0) {
                if (this.directionX == -1) {
                    isLoad = true;
                    $('.mlR_Cload').show()
                }
            }

            if (isLoad) {

                var $ele = $('.mlR_Cload');
                var lastinfo = _this.datalist[0]
                if (typeof(lastinfo) != 'undefined') {
                    if (typeof(lastinfo.userMessage) != 'undefined') {
                        lastinfo = lastinfo.userMessage;
                    }
                }

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

                    if (lastinfo) {
                        var parm = {dialogID: _this.dialogId, userMsgID: lastinfo.id, count: 5};
                    } else {
                        var parm = {dialogID: _this.dialogId, count: 5};
                    }


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

                    _this.initInfo = data
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
                                    _this.dialogId = dialogId;
                                    _this.reorderleftInfo(data);
                                    _this.QueryChatlog(dialogId, dialogType, userUniId);
                                    //_this.reorderleftInfo(data);
                                    //$('.per_chat ').animate({left: 0}, 2000)//显示此人信息
                                }
                            } else {

                                _this.userUniId = null;
                            }


                        } else {

                            //dialogId已经发生变化需要重新刷新页面
                            _this.dialogId = dialogId;

                            if (typeof(userUniId) != 'undefined' && userUniId != '') {//入口是在一个群里查看此人发言

                                _this.userUniId = userUniId;
                                _this.dialogId = dialogId;
                                //_this.reorderleftInfo(data);
                                //$('.per_chat ').animate({left: 0}, 2000)//显示此人信息

                            } else {

                                _this.userUniId = null;


                            }
                            _this.reorderleftInfo(data);
                            _this.QueryChatlog(dialogId, dialogType, userUniId);

                        }

                    } else {//第一次进入给全局变量dialogId赋值

                        if (typeof(userUniId) != 'undefined' && userUniId != '' && userUniId != null) {

                            _this.userUniId = userUniId
                            //_this.reorderleftInfo(data);
                            //$('.per_chat ').animate({left: 0}, 2000)//显示此人信息

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
            $('.loading').show()
            window.lxpc.exebusinessaction('ChatRecord', 'QueryRecord', '0', JSON.stringify(parm), 0, function (status, data, targ) {

                if (status == 0) {
                    var datalist = JSON.parse(data)

                    $('.loading').hide()
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

                    _this.Picturecount = 0;
                    _this.QueryChatlog_bind(datalist, dialogType);
                    $('.loading').hide();
                } else {
                    console.log(status)
                }
            })

        } catch (e) {
            console.log(e.message)
        }
    },
    //绑定聊天记录的数据信息
    QueryChatlog_bind: function (datalist, dialogType,isloadMore) {

        var _this = this;
        _this.Scrollright.refresh();

        var olist = _this.bindChatlogData(datalist,isloadMore)

        //获取sender的信息
        _this.getSenderInfo(dialogType);

        //音频操作

        for (var i = 0; i < olist.length; i++) {
            var oli = olist[i];
            var $li = $(oli);

            if ($li.find('.mlR_CMsg_voice').length > 0) {

                var $ele = $li.find('.mlR_CMsg_voice');
                var resId = $ele.attr('resId')

                if (resId != '' && resId != null && typeof(resId) != 'undefined') {
                    var res_parm = {resourceList: [{resourceType: 'res_file', photoResId: resId, fileName: resId}]};
                    //获取音频时长
                    var path = '';
                    var size;
                    _this.VoiceId += 1;

                    $ele.attr('voiceId', _this.VoiceId)
                    getVoiceLength(res_parm, function (result, targ) {

                        var $ele = $('.mlR_CMsg_voice[voiceId="' + targ + '"]');
                        size = result.size;
                        var time = ReSizeforTime(size);
                        path = result.filePath;
                        $('.voice_time', $ele).html(time);
                        $ele.data('info', result);

                    }, _this.VoiceId)

                }
            } else if ($li.find('.mlR_CMsg_file').length > 0) {
                var $ele = $li.find('.mlR_CMsg_file')

                var resId = $ele.attr('ResId');

                //初始化文件状态

                var parm = {fileResId: resId};
                _this.FileId += 1;
                $ele.attr('targ', _this.FileId)

                //var $Tabele = $('.mlR_msgList .mlR_Con:eq(2) .mlR_table_file tr[ResId="'+resId+'"]');
                var $Tabele = $('.mlR_msgList .con_file tr[ResId="' + resId + '"]  ')

                $Tabele.attr('targ', _this.FileId)
                _this.CheckResource(parm)

            }


        }

        //_this.bindVoice(olist)


    },
    getAllChatinfo: function () {
        var _this = this;
        try {
            var parm = {};
            window.lxpc.exebusinessaction('ChatRecord', 'QueryAllDialog', '0', JSON.stringify(parm), 0, function (status, data, targ) {
                if (status == 0) {
                    var datalist = JSON.parse(data);

                    var fined = null;
                    for (var i = 0; i < datalist.length; i++) {
                        var item = datalist[i];
                        if (item.dialogId == _this.initInfo.dialogId) {
                            fined = datalist.splice(i, 1)[0];
                            break;
                        }
                    }

                    if (fined == null) {//打开的某人的聊天记录不存在左侧的导航中，需要添加新联系人
                        if (_this.initInfo.userUniId) {
                            fined = {};
                            fined.dialogId = _this.initInfo.userUniId;
                            fined.dialogType = 2;
                            fined.name = _this.initInfo.username;
                            fined.photoResId = _this.initInfo.userphotoResId
                            datalist.unshift(fined)
                        } else {
                            datalist.unshift(_this.initInfo)
                        }
                        datalist.unshift(_this.initInfo)

                    } else {
                        datalist.unshift(fined)
                    }
                    //datalist.unshift(_this.initInfo)
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

        var str = '<div class="mlR_secFNull" style="margin-top: 150px"><img src="images/ml_bubbleNull.png" /><p>无消息记录</p></div>';
        $('.ml_R .con_info').prepend(str);


            str = '<li><div class="mlR_secFNull mlR_NF" style="margin-top: 150px"><img src="images/ml_bubbleNull.png" /><p>没有文件信息</p></div></li>';
            $('.mlR_msgList .con_file table').prepend(str);
             str = '<div class="mlR_secFNull mlR_NP" style="margin-top: 150px"><img src="images/ml_bubbleNull.png" /><p>没有图片信息</p></div>';
        $('.mlR_msgList .con_Picture ').append(str);



    },
    getContentImgePath: function (parm, starg, callback) {

        try {
            window.lxpc.exebusinessaction('DownloadResource', 'contentImage', '0', JSON.stringify(parm), parseInt(starg), function (status, result, targ) {

                if (status == 0) {

                    if (Object.prototype.toString.call(callback) === '[object Function]') {
                        if (result.indexOf('\\') > -1) {
                            callback(result, targ);
                        }

                    }

                } else {

                    console.log(status)

                    //callback(result, targ);


                    //my_layer({message: '调用接口出错，错误码' + status}, 'error')

                }
            })
        } catch (e) {
            console.log(e.message)

            my_layer({message: '调用接口出错，错误码' + e.message}, 'error')
        }

    },
    resetResult: function resetResult(str_url, reg) {


        //var strRegex = /(http|ftp|https)?:?\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
        //var strRegex=reg=/((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
        //var strRegex=reg=/((http|ftp|https):\/\/)|(www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
        var strRegex = /(((http|ftp|https):\/\/)|(www\.))[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
//

        var newstr = str_url.replace(strRegex, function () {
            var cururl = arguments[0];

            var newresult = cururl.replace(reg, function (content, index, str) {

                return '<span class="sec_link">' + arguments[0] + '</span>'
            })

            return '<a href="javascript:;" class="aV_a"  onclick="openUrl(\'' + cururl + '\')">' + newresult + '</a>'
        })

        return newstr

    },
    reorderleftInfo: function (data) {

        var dialogId = data['dialogId'],
            userUniId = data['userUniId'],
            queryInfo = '';

        queryInfo = dialogId;

        var $li = $('.mlL_nameList .mlL_lList li[diaId="' + queryInfo + '"]')

        if ($li.length > 0) {

            $('.mlL_nameList .mlL_lList ').prepend($li);

            $('.mlL_nameList .mlL_lList li').removeClass('ml_bg');
            $('.mlL_nameList .mlL_lList li:eq(0)').addClass('ml_bg')
        } else {//新加的成员没有在左侧信息里面所以需要重新加进去

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


            str += '<li diaId="' + dialogId + '" typeinfo="' + dialogType + '" index="' + i + '" userId="' + curdata.userUniId + '"><img imagepath="' + photoResId + '" src="' + path + '" class="ml_icon20" /><div>' + XssToString(name) + '</div></li>';

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


            if (curdata.userUniId) {
                dialogid = curdata.userUniId
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
                var parm = {resourceList: [{photoResId: imgstr}], size: 96};

                downresource(parm, _this.imageId, function (result, targ) {
                    $('.mlL_lList  img[imageId=' + targ + ']').attr('src', result);
                    _this.Scrollright.refresh();
                })

            }


        });


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

                            if (curData.ContentType == 2) {
                                datalist.splice(i, 1);
                                i--;
                                continue;
                            }

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

                            //if(GroupInfo.ContentType==2){
                            //    continue;
                            //}

                            str += '<h5 class="mlL_titleH5"><div>' + Name + '</div><span class="mlL_titleH5_sum"><i>' + Group[i].length + '</i><em></em></span></h5>'

                            var datalist = Group[i];

                            str += '<ul class="mlL_listLi mlL_lLi2">'
                            for (var j = 0; j < datalist.length; j++) {

                                var SubData = datalist[j],
                                    DialogID = SubData.DialogID,
                                    Message = XssToString(SubData.Message.trim()),
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
                                var reg = new RegExp(searchText, 'i')

                                if (ContentType == 1) {
                                    if (MimeType.indexOf('application') > -1 || MimeType.indexOf('text') > -1) {//附件是文件
                                        var AttachmentName = SubData.AttachmentName;
                                        Message = AttachmentName.split(',')[0];
                                    }

                                }


                                if (Message != '') {
                                    var resultary = reg.exec(Message);
                                    if (!resultary || resultary.length == 0) {
                                        continue;
                                    }

                                    var index = resultary.index,
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
                            var $li = $(this).parents(".mlL_titleH5").next(".mlL_lLi2")
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
                        //_this.QueryChatlog(initData.DialogID, dialogType, MsgID)
                        //_this.QueryChatlog_bind(initData.DialogID, dialogType, MsgID)

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
        $('.loading').show()
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

                    _this.QueryChatlog_bind(datalist, dialogType)
                    $('.loading').hide()
                } else {
                    console.log(status)
                }
            })

        } catch (e) {
            console.log(e.message)
        }
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

                        $('.mlR_msgList .mlR_Con:eq(0) .mlR_CMsg_title[targ="' + targ + '"] ').html(XssToString(res[0].name));

                        var useID = $('.mlR_msgList .mlR_Con:eq(0) .mlR_CMsg_title[targ="' + targ + '"] ').attr('userid');

                        var index = _this.userUniIdList.indexOf(useID);
                        _this.userName[index] = res[0].name;

                        $('.mlR_msgList .mlR_Con:eq(0) .mlR_CMsg_title[userid="' + useID + '"] ').html(XssToString(res[0].name));

                        if (MsgID) {
                            if (targ == _this.SenderId) {
                                _this.Scrollright.refresh();
                                //_this.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + MsgID + '"]', 300)
                            }
                        }


                    })

                } else {

                    $('.mlR_msgList .mlR_Con:eq(0) .mlR_CMsg_title[userid="' + userid + '"] ').html(XssToString(_this.userName[index]));
                    if (MsgID) {
                        _this.Scrollright.refresh();
                        //_this.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + MsgID + '"]', 300)
                    }

                }
            }


        })
    },
    showErrorforDownfile: function ($box) {
        $('.mlr_Downfile').remove();
        var str = '<div style="position: absolute;top: 70px;left: 43px;margin-top: -19px;"><span  class="er_fdown error ">下载失败</span></div>';
        $box.append(str)

    },
    loadMorechartlog: function (parm, diaType, isSearch) {

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
                        _this.QueryChatlog_bind(data, diaType,true);
                        _this.bindleftforLoad(data, diaType);
                        _this.Scrollleft.refresh();

                    } else {//正常

                        _this.QueryChatlog_bind(data, diaType,true);
                        _this.datalist = data.concat(_this.datalist);
                    }

                    $('.mlR_Con:eq(0)').scrollTop(6)

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
                message =XssToString(Base64.decode(message)) ;
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
            //_this.QueryChatlog_bind(DialogID, dialogType, MsgID)
        }
    },
    //绑定语音信息
    bindVoice: function (olist) {

        $('.mlR_CMsg_voice', $(olist)).each(function () {
            var $ele = $(this);
            var resId = $ele.attr('resId')

            if (resId != '' && resId != null && typeof(resId) != 'undefined') {
                var res_parm = {resourceList: [{resourceType: 'res_file', photoResId: resId, fileName: resId}]};
                //获取音频时长
                var path = '';
                var size;
                getVoiceLength(res_parm, function (result) {

                    size = result.size;
                    var time = ReSizeforTime(size);
                    path = result.filePath;
                    $('.voice_time').html(time);
                    $ele.data('info', result);

                })

            }

        })


    },
    //绑定聊天记录的数据
    bindChatlogData: function (datalist) {

        var _this = this;
        var newlist=[];

        var ofragment = document.createDocumentFragment();


        var str = '', strpic = '', strfile = '';
        var olist = []
        for (var i = 0; i < datalist.length; i++) {
            var curData;


            str = '';
            if (typeof(datalist[i]['userMessage']) == 'undefined') {
                curData = datalist[i]
            } else {
                curData = datalist[i]['userMessage'];
            }


//帅选从群里查看某个人的聊天记录
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
            var MesageId = curData.id


            //高亮显示查询的结果

            //
            //result=result.replace("\"",'\'')
            //
            //var options = {
            //    whiteList: {
            //        a: ['href', 'title', 'target', 'src','border','width','height','bgcolor','list-style','text-align','iframe','http','onerror']
            //    },
            //    allowCommentTag:true
            //};
            //
            //
            //result=filterXSS(result,options)
            result=XssToString(result)

            var newresult = ''
            if ($('#secText').val().trim() != '') {
                var reg = new RegExp(_this.search, 'gi')
                var newResult = '';
                if (result != '') {

                    //链接
                    var urllist = getUrl(result);
                    if (urllist.length == 0) {
                        //newresult = result;
                        newresult = result.replace(reg, function (content, index, str) {

                            return '<span class="sec_link">' + arguments[0] + '</span>'
                        })

                    } else {
                        newresult = _this.resetResult(result, reg);
                    }

                }
            } else {
                //newresult=result;
                //链接
                var urllist = getUrl(result);
                if (urllist.length == 0) {
                    //地图
                    var reg = /\{([^}|]*)\|(\d{1,3}\.\d+,\d{1,3}\.\d+)\}/g

                    if(reg.test(result)){

                        newresult = result.replace(reg, function () {

                            var item = arguments[0].split('|')[0].replace('{', '');
                            return '<em style="background: url(images/locationfill.png)" class="att_map"></em><a href="javascript:;" class="att_map_con"  data-locat="' + arguments[2] + '" onclick="openAddress(this)" >' + item + '</a>'
                        })
                    }else{


                        newresult=result

                    }


                } else {
                    newresult = _this.resetResult(result);
                }
            }

            var targ;

            var oli = document.createElement('li');
            oli.className = 'mlR_CMsg_li'

            oli.setAttribute('MsgID', MesageId);



            switch (types) {
                case 0:

                    str = '<h5 class="mlR_CMsg_title" userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div><p class="mlR_CMsg_font">' + newresult + '</p></div>';

                    break;
                case 1:
                case 10:
                    if (curData['mimeType'].indexOf('image') > -1) {

                        _this.Picturecount = _this.Picturecount + 1;
                        var imagelist = curData['extraContent'];
                        if (typeof(imagelist) == 'undefined' || imagelist == '') {
                            //一个图片

                            newlist.push({resId: curData['attachmentResId'], mineType: curData['mimeType']})
                            _this.viewImgId += 1


                            var datainfo = JSON.stringify({
                                issingle: true,
                                resId: curData['attachmentResId'],
                                targ: _this.viewImgId,
                                mimetype: curData['mimeType']
                            })

                            //str = '<h5 class="mlR_CMsg_title" userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div><p class="mlR_CMsg_font">' + newresult + '</p><ul class=" mlR_CMsg_img mlR_img1" > <li  issingle="true" resId="' + curData['attachmentResId'] + '" targ="' + _this.viewImgId + '" data-mimetype="'+curData['mimeType']+'" ><img src="images/defpicture.png" onload="getImg(this)"/></li></ul>'
                            str = '<h5 class="mlR_CMsg_title" userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div><p class="mlR_CMsg_font">' + newresult + '</p><ul class=" mlR_CMsg_img mlR_img1" > <li data-info=\'' + datainfo + '\' targ="' + _this.viewImgId + '" ><img src="images/defpicture.png" onload="getImg(this)"/></li></ul>'

                            //str = '<h5 class="mlR_CMsg_title" userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div><p class="mlR_CMsg_font">' + newresult + '</p><ul class=" mlR_CMsg_img mlR_img1"> <li  data-info="'+datainfo+'" '+'"><img src="images/defpicture.png" onload="getImg(this)" /></li></ul>'


                            strpic += '<li class="mlR_CMsg_li" ><h5 class="mlR_CMsg_title">' + sendTime + '</h5><ul class="mlR_CImg"> <li style="background-image: url(images/defpicture.png)"  targ="' + _this.viewImgId + '" ispicTab="true"></li></ul></li>'


                            //图片页

                        } else {//多个图片
                            str = ' <h5 class="mlR_CMsg_title" userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em> <div> <p class="mlR_CMsg_font">' + newresult + '</p> ';

                            strpic += '<li class="mlR_CMsg_li"><h5 class="mlR_CMsg_title">' + sendTime + '</h5><ul class="mlR_CImg">'

                            strpic += ''
                            imagelist = JSON.parse(imagelist);

                            if (imagelist.length == 1) {
                                str += '<ul class="mlR_CMsg_img mlR_img1">'
                            }
                            else if (imagelist.length <= 4) {//四宫格
                                str += '<ul class="mlR_CMsg_img mlR_img4">'

                            } else {//九宫格
                                str += '<ul class="mlR_CMsg_img">'
                            }

                            for (var j = 0, ln = imagelist.length; j < ln; j++) {

                                var oimg = imagelist[j];
                                _this.viewImgId += 1
                                newlist.push({resId: oimg.resourceId, mineType: oimg['mimeType']})
                                var issingle
                                if (imagelist.length == 1) {
                                    issingle = true
                                } else {
                                    issingle = false;
                                }

                                var datainfo = JSON.stringify({
                                    issingle: issingle,
                                    resId: oimg.resourceId,
                                    targ: _this.viewImgId,
                                    mimetype: oimg['mimeType']
                                })
                                //str += '<li style="background-image: url(images/defpicture.png)" resId="' + oimg.resourceId + '" targ="' + _this.imageId + '" ></li>';
                                //str += '<li  resId="' + oimg.resourceId + '" data-mimetype="'+oimg['mimeType']+'" targ="'+_this.viewImgId+'"><img src="images/defpicture.png" /></li>';
                                str += '<li  data-info=\'' + datainfo + '\' targ="' + _this.viewImgId + '"><img src="images/defpicture.png" onload="getImg(this)"/></li>';
                                strpic += '<li style="background-image: url(images/defpicture.png)"  ispicTab="true" targ="' + _this.viewImgId + '" ></li>';

                            }
                            str += '</ul></div>'
                            strpic += '</ul></li>'


                        }
                    } else if (curData['mimeType'].indexOf('application') > -1) {//文档

                        //mm-dd hh:mm
                        var attachmentInfo = curData['attachmentName'].split(','),
                            attachmentResId = curData['attachmentResId']
                        var filename = XssToString(attachmentInfo[0])
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

                        str = '<h5 class="mlR_CMsg_title" userid="' + curData['sender'] + '">' + name + '</h5><em>' + sendTime + '</em><div> <p>' + newresult + '</p><div class="mlR_CMsg_file" ResId="' + attachmentResId + '" filename="' + filename + '"> <img src="' + filepath + '" class="mlR_CMsg_Ficon" /> <div class="mlR_CMsg_fileR"> <h4><p class="filename">' + filename + '</p><em>' + time + '</em></h4> <div class="mlR_CMsg_fileNews"><em>' + filesize + '</em><p><a href="javascript:;" class="aV_a" onclick="loadFile(this)">下载</a><a href="javascript:;" class="aV_a" onclick="saveAs(this)">另存为</a></p></div></div></div></div>';

                        strfile += ' <tr ResId="' + attachmentResId + '" filename="' + filename + '"> <td><div class="mlR_table_file" > <img src="' + filepath + '" /> <div> <h4>' + filename + '</h4> <p>' + name + '<span>' + filesize + '</span></p> </div> </div> </td> <td>' + sendTime + '</td> <td><a href="javascript:;" class="aV_a" onclick="loadFile(this)" >下载</a><a href="javascript:;" class="aV_a" onclick="saveAs(this)">另存为</a></td> </tr>';

                    } else if (curData['mimeType'].indexOf('voice') > -1)//绑定语音信息
                    {

                        str = `<h5 class="mlR_CMsg_title" userid="${curData.sender}"><em>${sendTime}</em></h5>
                            <div>
                                <div class="mlR_CMsg_voice" resId="${curData.attachmentResId}" onclick="playOrStopVoice(this,\'${curData.attachmentResId}\')">
                                    <img src="images/message_voice_bg.png" alt="">
                                    <span class="voice_play"></span>
                                    <span class="voice_time">0"</span>
                                </div>

                            </div>`

                    }

                    break;
                case 19://蓝名片

                    var extraContent = JSON.parse(curData.extraContent)

                    var strorgName = extraContent.orgName || extraContent.branchPath || ''

                    str = `
                            <h5 class="mlR_CMsg_title" userid="${curData.sender}"></h5><em>${sendTime}</em>
                            <div class="mlR_CMsg_box mlR_CMsg_card" >
                               <span>用户名片</span>
                                <hr>
                                <div class="card_det" >
                                    <img src="images/defuser.png" alt="" resId="${extraContent.photoResId}" onload="getCardimg(this)">
                                    <span>${extraContent.name}</span>
                                    <span>${strorgName}</span>
                                </div>

                            </div>
                        `;
                    break;

                case 3://卡片信息

                    str = `
                            <h5 class="mlR_CMsg_title" userid="${curData.sender}"></h5><em>${sendTime}</em>
                            <div class="mlR_CMsg_box mlR_CMsg_ManuCard" >
                               <span>链接</span>
                                <hr>
                                <div class="card_det" >
                                    <img src="images/micro_card.png" alt="" >
                                    <span class="manu_url">${newresult}</span>
                                  </div>
                            </div>`


                    break;


                default :
                    break;
            }


            oli.innerHTML = str;
            olist.push(oli)
            ofragment.appendChild(oli);




        }
        _this.viewImglist=newlist.concat(_this.viewImglist);
        var ocn = document.getElementsByClassName('con_info')[0]
        var oul = ocn.getElementsByTagName('ul')[0]

        utils.prependChild(ofragment, oul);


        _this.Scrollright.refresh();
        $('.mlR_Con:eq(0)').scrollTop(6);


        $('.mlR_NF').remove();
        $('.mlR_NP').remove();

        var result = ''
        if (strfile != '') {

            if ($('.mlR_table tr').length == 0) {
                result = `>
                    	<tr>
                        	<th>名称</th>
                        	<th>时间</th>
                        	<th>操作</th>
                        </tr>` + strfile + `
                        `;

                $('.mlR_msgList .con_file table  ').append(result);
            } else {
                $('.mlR_msgList .con_file table ').find('tr:first').after(strfile);
            }

        } else {

            if ($('.mlR_table tr').length == 0) {
                result = '<li><div class="mlR_secFNull mlR_NF" style="margin-top: 150px"><img src="images/ml_bubbleNull.png" /><p>没有文件信息</p></div></li>';
                $('.mlR_msgList .con_file table').prepend(result);
            }

        }
        //_this.Scrollright.refresh();
        if (strpic != '') {

            $('.mlR_msgList .con_Picture .mlR_CMsg ').prepend(strpic);
            //_this.Scrollright.refresh();

        } else {
            if ($('.mlR_msgList .con_Picture  li').length == 0) {
                result = '<div class="mlR_secFNull mlR_NP" style="margin-top: 150px"><img src="images/ml_bubbleNull.png" /><p>没有图片信息</p></div>';
                $('.mlR_msgList .con_Picture ').append(result);
            }

        }


        return olist

    },
    //打开文件
    OpenFile: function (parm) {
        try {
            window.lxpc.exebusinessaction('ChatRecord', 'OpenFile', '0', JSON.stringify(parm), 0, function (status, result, targ) {

            })

        } catch (e) {
            console.log(e.message)
        }
    },
    //下载文件
    loadFile: function (parm, $filebox) {
        var _this = this
        var str = '<img src="images/ajax-loader_smail.gif" alt="" class="mlr_Downfile">';
        //console.log($filebox)

        $filebox.append(str);
        var targ = _this.FileId = _this.FileId + 1;
        $filebox.attr('targ', targ)

        try {
            window.lxpc.exebusinessaction('DownloadResource', 'Noticefile', '0', JSON.stringify(parm), targ, function (status, result, targ) {

                var $filebox = $('.mlR_CMsg_file[targ="' + targ + '"]');
                if ($filebox.length == 0) {
                    $filebox = $('.mlR_table tr[targ="' + targ + '"]')
                }

                if (status == 0) {

                    if (result.indexOf('\\') > -1) {

                        showtips('文件下载成功')

                        var $down = $filebox.find('.aV_a').eq(0),
                            $saveAs = $filebox.find('.aV_a').eq(1)

                        $saveAs.html('打开文件夹');
                        $saveAs.addClass('openfileDir');
                        $saveAs.data('path', result);

                        $down.html('打开');
                        $down.addClass('openfile');
                        $down.data('path', result);


                        $('.mlr_Downfile').remove();


                    }

                } else {
                    var $box = $('.mlR_CMsg_fileR', $filebox)
                    //$box.append(str);
                    chat.showErrorforDownfile($box)
                }
            })

        } catch (e) {
            var $box = $('.mlR_CMsg_fileR', $filebox)
            chat.showErrorforDownfile($box)
        }
    },
    //打开文件夹
    OpenFileDir: function (parm) {
        try {
            window.lxpc.exebusinessaction('ChatRecord', 'OpenFileDir', '0', JSON.stringify(parm), 0, function (status, result, targ) {

            })

        } catch (e) {
            console.log(e.message)
        }
    },
    //另存为
    OpenSaveAsWnd: function (parm, $filebox) {
        var _this = this;

        try {
            window.lxpc.exebusinessaction('ChatRecord', 'OpenSaveAsWnd', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                if (status == 0) {

                    var data = JSON.parse(result),
                        filePath = data.filePath;

                    var index = filePath.lastIndexOf('\\'),
                        path = filePath.substring(0, index)

                    var filename = $filebox.attr('filename'),
                        resId = $filebox.attr('ResId');
                    var parm = {
                        resourceList: [{
                            resourceType: 'res_file',
                            fileName: filename,
                            photoResId: resId,
                            filePath: path
                        }]
                    }

                    _this.loadFile(parm, $filebox)

                } else {
                    console.log(status)
                }

            })


        } catch (e) {
            console.log(e.message)
        }

    },
    //检查文件是不是已经下载
    CheckResource: function (parm) {
        var _this = this;
        //var parm = {fileResId: resId};

        try {
            window.lxpc.exebusinessaction('ChatRecord', 'CheckResource', '0', JSON.stringify(parm), _this.FileId, function (status, result, targ) {
                if (status == 0) {

                    var data = JSON.parse(result);

                    if (data.filePath) {
                        var $eleTem = $('.mlR_CMsg_file[targ="' + targ + '"] ')
                        var filename = $eleTem.attr('filename'),
                            resId = $eleTem.attr('ResId');

                        var $down = $eleTem.find('.aV_a').eq(0),
                            $saveAs = $eleTem.find('.aV_a').eq(1),
                            $fileBox = $eleTem;

                        $down.html('打开');
                        $saveAs.html('打开文件夹');
                        $down.data('path', data.filePath);
                        $saveAs.data('path', data.filePath);
                        $down.addClass('openfile');
                        $saveAs.addClass('openfileDir');

                        var $Tabfiles = $('.mlR_msgList .con_file tr[targ="' + targ + '"]  '),
                            $FilesTab_a = $Tabfiles.find('.aV_a'),
                            $down_fileTab = $FilesTab_a.eq(0),
                            $saveAs_tileTab = $FilesTab_a.eq(1);

                        $down_fileTab.html('打开');
                        $saveAs_tileTab.html('打开文件夹');
                        $down_fileTab.data('path', data.filePath);
                        $saveAs_tileTab.data('path', data.filePath);
                        $down_fileTab.addClass('openfile');
                        $saveAs_tileTab.addClass('forward');


                    } else {

                    }

                } else {
                    console.log(status)
                }
            })
        } catch (e) {
            console.log(e.message)
        }


    },
    htmlEncode: function htmlEncode(str) {

        if (str == '' || typeof(str) == 'undefined' || str == null) {
            return ''
        }
        str = str.replace(/\?*/g, '');
        str = str.replace(/\\u0007/g, '');
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));

        return div.innerHTML;

        //var temp = document.createElement("div");
        //temp.innerHTML = str;
        //var output = temp.innerText || temp.textContent;
        //temp = null;
        //return output;

    },

};

function initchat() {

    $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(0).empty();
    $('.mlR_msgList .mlR_Con .mlR_CMsg').eq(1).empty();
    $('.mlR_msgList .mlR_Con table ').empty();

    var $loadMore = $('.mlR_Cload');

    $loadMore.data('targ', 0);
    $loadMore.find('span').html('查看更多消息');
    $loadMore.find('span').css('color', '#067CEB')
    $loadMore.find('img').hide();
    //$('.per_chat ').css('left', '100%')


}

//打开连接
function openUrl(surl) {
    var map_parm = {url: surl}
    openMap(map_parm, 'chat')

}


var chat
$(function () {

    TitleTools();

    chat = new Chat();

})
//        播放音频
var timer_play = null;

function playOrStopVoice(ele, resId) {
    stopVoice();
    var $ele = $(ele)
    var info = $ele.data('info');
    var $play = $ele.find('.voice_play')

    $('.mlR_CMsg_voice').each(function(){

        var $item=$(this);
        if($item.attr('resId')==$ele.attr('resId')){

        }else{
            if(this.timer){
                clearInterval(this.timer);
                this.timer = null;
                var $play = $item.find('.voice_play')
                $play.css('backgroundPositionX', '-32px');
            }
        }


    })

    if (ele.timer) {

        clearInterval(ele.timer);
        ele.timer = null;

        $play.css('backgroundPositionX', '-32px');
        stopVoice();
        clearTimeout(timer_play);
        timer_play = null;

    } else {

        //音频播放动画
        ele.timer = setInterval(function () {
            var back = parseFloat($play.css('backgroundPositionX'))

            if (back + 16 == 0) {
                back = 0
            }
            back = (back + 16) + 'px';

            $play.css('backgroundPositionX', back);


        }, 200)
        var play_parm = {filePath: info.filePath}

        playVoice(play_parm, function () {
            timer_play = setTimeout(function () {
                clearInterval(ele.timer);
                ele.timer = null;
                $play.css('backgroundPositionX', '-32px');
            }, info.size)

        })
    }


}


//获取内容图片
function getImg(ele) {

    var $ele = $(ele)
    var $li = $ele.parents('li');

    var data = $li.data('info')

    var issingle = data['issingle']
    var resId = data['resId']
    var targ = data['targ']
    var mimetype = data['mimetype']

    if (resId) {

        if (issingle) {
            if (mimetype.indexOf('gif') > -1) {

                var parm = {resourceList: [{photoResId: resId}], size: 0};
            } else {
                var parm = {resourceList: [{photoResId: resId}], size: 300};
            }

        } else {

            if (mimetype.indexOf('gif') > -1) {

                var parm = {resourceList: [{photoResId: resId}], size: 0};
            } else {
                var parm = {resourceList: [{photoResId: resId}], size: 96};
            }
            //var parm = {resourceList: [{photoResId: resId}], size: 96};
        }


        Chat.prototype.getContentImgePath(parm, targ, function (result, targ) {


            var oli = $('.con_info .mlR_CMsg_li  li[targ="' + targ + '"]')
            var img = oli.find('img')

            if (img.length > 0) {
                img.attr('src', result)

                img[0].onload = function () {
                    $(this).autoIMG();
                    chat.Scrollright.refresh();
                    if (targ == chat.viewImgId) {

                        if ($('#secText').val().trim() != '') {
                            var localMsID = $('.mlL_lFList .ml_bg').attr('MsgID');
                            chat.Scrollright.scrollToElement('.mlR_msgList .mlR_Con .mlR_CMsg li[MsgID="' + localMsID + '"]', 300)
                        }

                    }
                    img[0].onload = null;
                }


            }

            var oPic_tab = $('.con_Picture .mlR_CMsg_li  li[targ="' + targ + '"]')
            oPic_tab.css('background-image', 'url(' + result + ')')
            oli.click(function () {

                view(this)
            })

            oPic_tab.click(function () {
                view(this)
            })

            function view(ele) {

               var targ=$(ele).attr('targ')
               var index= chat.viewImglist.findIndex(function(value, index, arr) {

                    return result.indexOf(value.resId) >-1;
                }) // 2



                //var parm = {picturePath: result,resIdAry:[{resId:'',mineType:""},{}],index:''};
                var parm = {picturePath: result, resIdAry: chat.viewImglist, index: parseInt(index)};
                //var parm = {picturePath: path, resIdAry: [{resId: resId, mineType: 'image/png'}], index: 0};

                try {
                    window.lxpc.exebusinessaction('ChatRecord', 'ViewSrcPicture', '0', JSON.stringify(parm), 0, null)
                }
                catch (e) {

                    console.log(e.message);
                }
            }

        })


    }

}
//获取蓝名片的头像
function getCardimg(ele) {
    //获取蓝名片的头像

    var $ele = $(ele)
    var resId = $ele.attr('resId')
    var targ = chat.imageId = chat.imageId + 1;
    $ele.attr('imageId', targ);
    var parm = {resourceList: [{photoResId: resId}], size: 96}

    try {
        window.lxpc.exebusinessaction('DownloadResource', 'cardImage', '0', JSON.stringify(parm), parseInt(targ), function (status, result, targ) {

            if (status == 0) {
                if (result.indexOf('\\') > -1) {
                    var oimg = $('.mlR_CMsg_card img[imageId="' + targ + '"]')
                    oimg[0].onload = null;
                    oimg.attr('src', result)

                    $('.mlR_CMsg_card img[imageId="' + targ + '"]').length
                }

            } else {

                console.log(status)

            }
        })
    } catch (e) {

        my_layer({message: '调用接口出错，错误码' + e.message}, 'error')
    }


}
//下载或打开文件
function loadFile(ele) {
    var $ele = $(ele);
    var $filebox = $ele.parents('.mlR_CMsg_file')
    if ($filebox.length == 0) {
        $filebox = $ele.parents('tr')
    }

    if ($ele.hasClass('openfile')) {//下载完成之后打开文件

        var parm = {filePath: $ele.data('path')};
        chat.OpenFile(parm);

    } else {//下载文件

        var filename = $filebox.attr('filename'),
            resId = $filebox.attr('ResId');
        var parm = {resourceList: [{resourceType: 'res_file', fileName: filename, photoResId: resId}]}
        chat.loadFile(parm, $filebox)

    }
}
//另存为或打开文件夹
function saveAs(ele) {
    var $ele = $(ele);
    var $filebox = $ele.parents('.mlR_CMsg_file')
    if ($filebox.length == 0) {
        $filebox = $ele.parents('tr')
    }
    if ($ele.hasClass('openfileDir')) {//另存为后打开文件

        var parm = {filePath: $ele.data('path')}

        chat.OpenFileDir(parm)

    } else {//另存为
        var filename = $filebox.attr('filename');
        var parm = {fileName: filename}

        chat.OpenSaveAsWnd(parm, $filebox)
    }
}
//打开连接
function openAddress(ele) {

    var local = ele.dataset.locat
    var map_parm = {url: 'http://ditu.so.com/?q=' + local}

    openMap(map_parm, null)

}