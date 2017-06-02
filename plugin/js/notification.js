function Notification() {

    this.userDomain = '';
    this.scroll_Re_L = null;
    this.scroll_Re_R = null;
    this.scroll_Se_L = null;
    this.scroll_Se_R = null;
    this.scroll_send = null;
    this.scroll_Que = null;
    this.typeInfo = 1;
    this.LoadFinished = 1;
    this.DataList = [];
    this.DataListSend = [];
    this.Contactlist = [];
    this.imageId = -1;
    this.FileId = 0;
    this.QuestId = 0;
    this.Contacts = null;
    this.curNoticeId = '';
    this.curNoticeSendId = '';
    this.maxFileSize;
    this.temquestion = null;
    this.imageList=[];

    this.init();

}
Notification.prototype = {
    constructor: Notification,
    init: function () {
        var _this = this;

        var bottomH;
        var clientH = document.documentElement.clientHeight || document.body.clientHeight;
        $(".content ")[0].style.height = (clientH - 32 - 2) + 'px';
        $('.nav')[0].style.height = (clientH - 32 - 2) + 'px';

        $('.content_right >div')[0].style.height = (clientH - 50 - 32 - 2) + 'px';

        $('.add')[0].disabled = true;

        //$('.tool').hover(function () {
        //    $(this).css('margin-right',0)
        //}, function () {
        //    $(this).css('margin-right','12px')
        //})


        try {
            var parm = {};
            window.lxpc.exebusinessaction('notice', 'InitFinished', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
                if (status == 0) {

                    var data = JSON.parse(jsondata);
                    _this.maxFileSize = data.resourceMaxSize

                } else {
                    my_layer({message: '调取接口出错，错误码' + status}, 'error')
                }
            })
        } catch (e) {
            my_layer({message: '调取接口出错，错误码' + e.message}, 'error')
        }


        this.getdata();

        this.bindEvent();//绑定事件
        //var option= scrollSetings()
        //_this.scroll_Que=new IScroll('#Win_con', option)

    },
    //绑定页面的基本事件
    bindEvent: function () {
        var _this = this;

        //tittle 事件 关闭 最大 最小 恢复
        $('.tool li').on('click', function () {
            _this.mystopPropagation();
            //关闭
            if ($(this).hasClass('Winclose')) {
                try {

                    window.lxpc.closewnd();
                }
                catch (e) {
                    console.log(e.message)
                }


            } else if ($(this).hasClass('Winmax')) {  //最大

                $(this).removeClass('Winmax').addClass('Winreback');
                try {

                    window.lxpc.maxwnd();
                }
                catch (e) {
                    console.log(e.message)
                }


            } else if ($(this).hasClass('Winmin')) {//最小

                try {

                    window.lxpc.minwnd();
                }
                catch (e) {
                    console.log(e.message)
                }


            } else if ($(this).hasClass('Winreback')) {//恢复

                $(this).removeClass('Winreback').addClass('Winmax');

                try {

                    window.lxpc.restorewnd();
                }
                catch (e) {

                }

            }

        });
        //绑定左侧导航栏
        $('.nav a').on('click', function (e) {

            var _that = this;
            if (_this.LoadFinished != 0 || $(this).hasClass('unlink')) {
                return;
            }
            _this.typeInfo = $(this).attr('typeInfo');

            $('.content >div').each(function (index, Ele) {
                if ($(Ele).attr('typeInfo') == $(_that).attr('typeInfo')) {
                    $(this).show();
                } else {
                    $(this).hide()
                }
            });

            $(this).parent().addClass('high');
            $(this).parent().siblings().removeClass('high');
            var option = scrollSetings();

            if (_this.typeInfo == '2') {
                if (_this.DataListSend.length == 0) {

                    _this.bindData_Send(_this.DataListSend)
                } else if ($('.content_Se .detail').length == 0) {

                    _this.bindData_Send(_this.DataListSend)
                }
                if (_this.scroll_Se_L == null) {
                    _this.scroll_Se_L = new IScroll('#wrapper_send', option);
                    _this.scroll_Se_R = new IScroll('#wrapperR_send', option);
                } else {
                    _this.scroll_Se_L.refresh();
                    _this.scroll_Se_R.refresh();
                }

            } else if (_this.typeInfo == '1') {


                if (_this.scroll_Re_L == null) {

                    _this.scroll_Re_L = new IScroll('#wrapper', option);
                    _this.scroll_Re_R = new IScroll('#wrapperR', option);

                } else {

                    _this.scroll_Re_L.refresh();
                    _this.scroll_Re_R.refresh();

                }
                if (_this.DataList.length == 0) {
                    _this.showNoNotice();

                    return;
                }

            }


            _this.refrashIscroll();
            _this.mystopPropagation(e);

        });

        //写通知
        $(".nav .add").on('click', function () {


            _this.typeInfo = 2;
            var highEle = $('.nav li a[typeinfo="' + _this.typeInfo + '"]');
            highEle.parent().addClass('high');
            highEle.parent().siblings().removeClass('high');
            $('.attach').removeClass('click_N');
            $('.attach').data('targ', false);

            $(".sendTo li:not('.addPerson')").remove();

            if ($('#scroll3 .detail').length == 0) {
                _this.bindData_Send(_this.DataListSend)
            }

            $('.withoutContent').hide();
            $('.mark').show();
            $('.send_container').show();

            _this.refrashIscroll();

            $('.send_content input').val("");
            $('.send_content textarea').val('');

            //$('#send_Scroll')[0].style.height = ($('.send_container')[0].offsetHeight - 40 - 64) + 'px';

            $(' .send_content .attachInfo').remove();


            var option = scrollSetings();


            var myscroll = new IScroll('#send_Scroll', option);
            _this.scroll_send = myscroll;

            myscroll.refresh();

            _this.reComputesize();

            $('.contacts_right h5').html('');
            //_this.zTree=null;
            //添加联系人
            $('.send_container .send_content .sendTo .addPerson').on('click', function () {

                _this.addContct();
            })

            //关闭发送通知页面
            $('.send_title span').eq(1).on('click', function () {

                $('.mark').hide();
                $('.send_container').hide();
                $(this).off();


                $('.send_container .send_content .sendTo .addPerson').off();
                $('.btn_send button').off();
                _this.Contacts = null;
                if (_this.typeInfo == 1) {
                    if (_this.DataList.length > 0) {
                        $('#content_Re').show();
                        _this.scroll_Re_R.refresh();
                        _this.scroll_Re_L.refresh();
                    } else {
                        $('.withoutContent').show();
                    }

                } else if (_this.typeInfo == 2) {

                    if (_this.DataListSend.length > 0) {
                        $('#content_Se').show();
                        _this.scroll_Se_L.refresh();
                        _this.scroll_Se_R.refresh();
                    } else {
                        $('.withoutContent').show();
                    }
                }
                if (_this.temquestion) {
                    $('.add_vote').remove();
                }
                $('.quest').off();
                $('.quest').addClass('color_h ').removeClass('questionstatus').html('添加问卷')
                $('.attach').removeClass('click_N');
                $('.attach').data('targ', false);
            });


            //添加问卷

            $('.quest').click(function () {
                //创建调查问卷
                var $ele = $(this);

                if ($ele.hasClass('questionstatus')) {
                    return;
                }

                $ele.addClass('questionstatus').removeClass('color_h').html('已添加的问卷')

                if (_this.temquestion) {

                    var tem = _this.temquestion.cloneNode(true)
                    $ele.after(tem)
                    myscroll.refresh();
                } else {

                    $('.add_vote').show();
                    myscroll.refresh();
                    setTimeout(function () {
                        myscroll.refresh()
                    }, 1000)
                    _this.temquestion = $('.add_vote')[0].cloneNode(true);
                }


                var questionnaire = new Questionnaire(myscroll);

                //$('.quest').off();
            })


            //发送通知
            $('.btn_send button').on('click', function () {

                var that = this;
                var stheme = $('#NoticeTheme').val();
                var smainContent = $('#NoticeContent').val();
                var content = {Title: stheme, MainContent: smainContent};
                var record = $('.content_Re .detail').attr('record')

                if (smainContent == '') {

                    my_layer({message: '请填写通知正文'}, 'warn')
                    return;
                }

                //获取通知实体的信息
                var resId = $('.send_content .attachInfo').attr('guid');
                var residname = $('.send_content .attachInfo #AttName ').html();

                //判断是不是有问卷
                var isQuestion = false;
                if ($('.quest').hasClass('questionstatus')) {
                    isQuestion = true;
                }

                var topicList = [];


                var sendtype = 0;
                if (isQuestion) {


                    var stype = $('.aV_btn .aV_radioEd').parents('.aV_qOptionType').next().html();

                    if (stype == '实名') {
                        sendtype = 1;
                    } else {
                        sendtype == 0;
                    }

                    var lilist = $('.aV_question >li')
                    for (var i = 0; i < lilist.length; i++) {

                        var $ele = $(lilist[i]);

                        var optionList = [],
                            content = '',
                            type = '',
                            voteLimit = 0,

                            resourceName = '';


                        if ($ele.hasClass('queCon_Q')) {//简答题
                            content = $ele.find('.aV_issue_title').html();
                            if (content == '请填写问答题标题') {
                                my_layer({message: '请完善简答题'}, 'error')
                                return;
                            }


                            type = 0;
                            var obj = {content: content, type: type};
                            topicList.push(obj)

                        } else if ($ele.hasClass('queCon_R')) {//单选题

                            content = $ele.find('.T_edit').html();

                            if (content == '请填写单选题标题') {
                                my_layer({message: '请完善单选题标题'}, 'error')
                                return;
                            }

                            type = 1;
                            voteLimit = 1;

                            var optlist = $ele.find('li');

                            for (var j = 0; j < optlist.length; j++) {
                                var $item = $(optlist[j]);

                                var optlabel = $item.find('.T_edit'),
                                    optTitle = optlabel.html(),
                                    optdefault = optlabel.attr('opt'),
                                    optresId = $item.attr('resId');

                                if (optTitle == optdefault) {

                                    my_layer({message: '请完善单选题可选项信息'}, 'error')
                                    return;
                                }
                                //optTitle = $('.aV_queTitle').html();
                                if (typeof(optresId) == 'undefined' || optresId == '') {

                                    optionList.push({content: optTitle});
                                } else {
                                    optionList.push({content: optTitle, resId: optresId});
                                }


                            }


                            topicList.push({
                                content: content,
                                type: type,
                                voteLimit: voteLimit,
                                optionList: optionList
                            });


                        } else {//多选题
                            content = $ele.find('.T_edit').html();
                            if (content == '请填写多选题标题') {
                                my_layer({message: '请完善多选题标题'}, 'error')
                                return;
                            }

                            type = 1;
                            voteLimit = $('.operationNum option:selected').val().replace(/\D+/g, '');
                            ;

                            var optlist = $ele.find('li');

                            for (var k = 0; k < optlist.length; k++) {
                                var $item = $(optlist[k]);

                                var optlabel = $item.find('.T_edit'),
                                    optTitle = optlabel.html(),
                                    optdefault = optlabel.attr('opt'),
                                    optresId = $item.attr('resId');

                                if (optTitle == optdefault) {
                                    my_layer({message: '请完善多选题可选项信息'}, 'error')
                                    return;
                                }

                                if (typeof(optresId) == 'undefined' || optresId == '') {

                                    optionList.push({content: optTitle});
                                } else {
                                    optionList.push({content: optTitle, resId: optresId});
                                }

                            }

                            topicList.push({
                                content: content,
                                type: type,
                                voteLimit: voteLimit,
                                optionList: optionList
                            });

                        }


                    }


                }

                var noticeEntity = {
                    "recordDomain": _this.userDomain,
                    "uuid": "",
                    "title": stheme,
                    "content": smainContent,
                    "resId": resId,
                    "creatorUniId": "",
                    "expiresDate": 0,
                    "appType": 0,
                    "sendType": 0,
                    "forbidForward": 0,
                    "forbidCopy": 0,
                    "monitorScreen": 0,
                    "expiresType": 0,
                    "createTime": 0,
                    "modifyTime": 0,
                    "lastReplyTime": 0,
                    "lastConfirmTime": 0,
                    "sortedTime": 0,
                    "status": 0,
                    "realName": sendtype,
                    "topicCount": 0,
                    "receiverMemberCount": 0,
                    "confirmCount": 0,
                    "replyCount": 0,
                    "readReplyCount": 0,
                    "topicList": topicList,
                };


                var userUniIdList = [], invitedGroups = [];

                if ($('.sendTo li:not(".addPerson") ').length > 0) {

                    $('.sendTo li:not(".addPerson") ').each(function (index, ele) {

                        var $ele = $(ele);
                        var obj = {};
                        var userId = $ele.attr('userid')
                        if ($ele.attr('isstruct') == 'true') {
                            obj = {
                                "id": 0,
                                "qunId": 0,
                                "groupId": userId,
                                "name": "",
                                "type": 2,
                                "orgType": 0,

                            }
                            invitedGroups.push(obj)
                        } else {
                            userUniIdList.push(userId)
                        }

                    });
                } else {

                    my_layer({message: '请选择联系人'}, 'warn');
                    return
                }


                var parm = {invitedGroups: invitedGroups, noticeEntity: noticeEntity, userUniIdList: userUniIdList};

                try {
                    window.lxpc.exebusinessaction('notice', 'SendNotice', '0', JSON.stringify(parm), 0, function (status, Notice, targ) {
                        if (status == 0) {

                            Notice = JSON.parse(Notice);
                            Notice.isNewCreate = true;
                            _this.DataListSend.push(Notice);
                            $('.mark').hide();

                            if (_this.temquestion) {
                                $('.add_vote').remove();
                            }
                            $('.quest').off();
                            $('.quest').addClass('color_h ').removeClass('questionstatus').html('添加问卷')

                            $('.send_container').hide();
                            $(".sendTo li:not('.addPerson')").remove();
                            $('.content_Re').hide();
                            $('.content_Se').show();


                            _this.typeInfo = 2;

                            var time = FormatTime(Notice['noticeEntity']['createTime']);
                            var title = XssToString(Notice['noticeEntity']['title']);
                            if (typeof(title) == 'undefined' || title == '') {
                                title = '通知'
                            }
//状态

                            var dstatus = Notice['selfMember']['status'];
                            var status = dstatus == '0' ? "未确认" : (dstatus == '99' ? "已删除" : '已确认');

                            //HTML内容转换

                            var content = Notice['noticeEntity']['content'];
                            //content = _this.htmlEncode(content);
                            content=XssToString(content)
                            var str = '';
                            var replyCount = Notice['noticeEntity']['replyCount'];

                            str += '<div class="detail unclicked" NoticeId="' + Notice['noticeEntity'].id + '" replycount="' + replyCount + '" record="' + Notice['noticeEntity'].recordDomain + '">'


                            str += '<h6>' + title + '<span>' + time + '</span></h6>'
                            str += '<p>' + content + '</p>';

                            var receiveCount = Notice['noticeEntity']['receiverMemberCount'];
                            var confirmCount = Notice['noticeEntity']['confirmCount'];

                            var status;
                            if (receiveCount > confirmCount) {
                                var unreply = receiveCount - confirmCount
                                status = "未确认 " + unreply.toString();
                                str += '<span  class="Fonthigh">' + status + '</span>' + '<span><em class="reply_count"></em>回复</span>&nbsp;<span class="replycount">' + replyCount + '</span></div>';
                            } else {
                                status = "已全部确认";
                                str += '<span class="repCount">' + status + '</span>' + '<span><em class="reply_count"></em>回复</span>&nbsp;<span class="replycount">' + replyCount + '</span></div>';
                            }

                            $('#scroll3').prepend(str);


                            if (_this.scroll_Se_L == null) {


                                var option = scrollSetings();


                                _this.scroll_Se_L = new IScroll('#wrapper_send', option);
                                _this.scroll_Se_R = new IScroll('#wrapperR_send', option);
                                _this.scroll_Se_L.refresh()

                            } else {

                                _this.scroll_Se_L.refresh();

                            }

                            $('#content_Se .content_left .detail[NoticeId="' + Notice['noticeEntity'].id + '"]').on('click', function () {
                                var $ele = $(this);
                                var sNoticeId = $ele.attr('NoticeId'),
                                    record = $ele.attr('record');
                                $ele.toggleClass('clicked');
                                $ele.siblings().removeClass('clicked').addClass('unclicked')
                                var isnewCreate = true;
                                if (_this.curNoticeSendId == sNoticeId) {
                                    return;
                                } else {
                                    _this.curNoticeSendId = sNoticeId
                                    _this.bindSendRight(Notice, sNoticeId, record, isnewCreate);
                                }

                            });


                            //如果是自己发给自己的

                            if (Notice['creatorMember']['receiver']) {
                                var arry = [];
                                arry.push(Notice)
                                _this.DataList.push(Notice);
                                var isself = true
                                _this.bindData_Receive(arry, true, isself);
                                var record = Notice['noticeEntity'].recordDomain
                                if (_this.DataList.length == 1) {


                                    if (_this.curNoticeId == Notice['noticeEntity'].id) {
                                        return;
                                    } else {
                                        _this.curNoticeId = Notice['noticeEntity'].id
                                        _this.bindReviceRight(_this.DataList, Notice['noticeEntity'].id, record, true)
                                    }


                                }
                                arry = null;

                            }

                            _this.Contacts = null;
                            $('.send_container .send_content .sendTo .addPerson').off();

                        } else {

                            my_layer({message: '调用接口出错，状态码' + status}, 'error');
                        }
                    });
                    $(that).off();

                } catch (e) {
                    console.log(e.message)
                }

            });

        });

        //添加附件
        $(".send_content .attach").on("click", function () {

            var _that = this;
            if ($(_that).data('targ') == true) {
                return;
            }

            new Promise(function (resolve, reject) {
                try {

                    var parm = {};
                    window.lxpc.exebusinessaction('Notice', 'OpenFileDialog', '0', JSON.stringify(parm), 0, function (status, data, targ) {
                        if (status == 0) {

                            //在添加附件之前不可发送通知
                            //$('.send_content .btn_send').addClass('noclick');
                            //$('.attach').css({color: '#067CEB', cursor: 'pointer'});


                            data = JSON.parse(data);
                            var Filepath = data["filePath"]
                            var FileName = Filepath.substring(Filepath.lastIndexOf('\\') + 1);

                            var FileSize = data['fileSize'];

                            var max = RsetFileSize(_this.maxFileSize)

                            if (FileSize > _this.maxFileSize) {
                                $(_that).data('targ', false);
                                my_layer({message: '文件大小不能超过' + max}, 'warn')
                                return;
                            }
                            if (FileSize == 0) {
                                $(_that).data('targ', false);
                                my_layer({message: '不能上传空文件'}, 'warn')
                                return;
                            }


                            var str = '<div class="attachInfo"><span id="AttName">' + XssToString(FileName) + ' ' + '</span><span id="AttSize">' + FormatSize(FileSize) + '</span><span id="AttDel" onclick="delAttanch()" style="color: #C6CAD2;cursor: default">取消</span><span id="AttSpeed"></span></div>';

                            $('.send_content .attach').after(str);
                            var file = {};
                            file.path = Filepath;
                            file.size = FileSize;

                            $('.attach').addClass('click_N');

                            resolve(file)
                        } else {

                            my_layer({message: '调用接口出错，状态码' + status}, 'error')
                        }
                    });


                } catch (e) {
                    console.log(e.message)
                }

            }).then(function (file) {


                var totalSize = 0;
                var FileID = createGuid();

                var parm = {resourceList: [{fileNamePath: file['path'], fileResId: FileID, fileSize: file['size']}]};
                $(' .send_content .attachInfo').attr('guid', FileID);

                try {
                    window.lxpc.exebusinessaction('UploadResource', 'Attachment', '0', JSON.stringify(parm), 1, function (status, data, targ) {
                        if (status == 0) {

                            data=JSON.parse(data)
                            if(Object.prototype.toString.call(data)=='[object Array]'){

                            }else{
                                totalSize += parseFloat(data);

                                var size = FormatSize(totalSize) + '/' + FormatSize(file['size']);
                                if (totalSize >= file['size']) {
                                    $('.send_content .btn_send').removeClass('noclick');
                                    $(' .send_content #AttSpeed').html(FormatSize(file['size']) + '/' + FormatSize(file['size']));
                                    $('.send_content #AttDel').css({color: '#067CEB', cursor: 'pointer'});
                                    $(_that).data('targ', true);
                                    $('.attach').addClass('click_N');
                                } else {
                                    $(' .send_content #AttSpeed').html(size);
                                }

                                $('.send_content .btn_send').removeClass('noclick');
                            }




                        } else {
                            console.log(status);
                        }
                    });


                } catch (e) {
                    console.log(e.message)
                }


            });


        })

        //改变屏幕尺寸的时候刷新滚动条
        $(window).resize(function () {
            var desW = 850,
                winW = document.documentElement.clientWidth;
            document.documentElement.style.fontSize = winW / desW * 100 + "px";
            _this.refrashIscroll();
            _this.reComputesize();

        });

        //删除指定的通知
        $('#content_Re .content_right .del').on('click', function () {

            var sNoticeId = $('#content_Re .content_right .detail').attr('NoticeId'),
                record = $('#content_Re .content_right .detail').attr('record');
            var status = $('#content_Re .content_right .detail').attr('status');
            if (status == 0) {
                return;
            }

            try {
                var parm = {recordDomain: record};
                window.lxpc.exebusinessaction('notice', 'DeleteNotice', sNoticeId.toString(), JSON.stringify(parm), 0, function (status, error, targ) {
                    if (status == '0') {

                        for (var j = 0; j < _this.DataList.length; j++) {
                            var tempNotice = _this.DataList[j];
                            if (tempNotice['noticeDetail']) {
                                tempNotice = tempNotice['noticeDetail'];
                            }
                            var NoticeId = tempNotice['noticeEntity']['id'];

                            if (sNoticeId == NoticeId) {
                                var myID = tempNotice['selfMember']['userUniId'];
                                if (tempNotice['creatorMember']['userUniId'] == myID) {

                                    my_layer({
                                        title: '蓝信',
                                        icon: '/images/ic_tip1.png',
                                        message: '您是这条通知的创建者不能删除此通知，请到我发送通知版面删除'
                                    }, 'warn', function () {

                                        return;
                                    })

                                }

                                _this.DataList.splice(j, 1);

                                break;
                            }

                        }

                        if (_this.DataList.length == 0) {

                            if ($('.withoutContent').length > 0) {
                                $('.withoutContent').show();
                                $('.content_Re').hide();
                            } else {
                                _this.showNoNotice();
                            }

                            return;
                        }
                        var unRplyCount = parseInt($(".nav .count").html());

                        if (unRplyCount == 1) {
                            $(".nav .count").html('');
                            $('.receive span').removeClass('receive_left_17')

                        } else {
                            $(".nav .count").html(unRplyCount - 1);

                            //$('.receive i').addClass('receive_left');
                            if (unRplyCount < 10) {
                                $('.receive span').removeClass('receive_left').addClass('receive_left_17')
                            } else {
                                $('.receive span').removeClass('receive_left_17').addClass('receive_left')
                            }

                        }

                        $('#content_Re .content_left .detail').each(function (index, ele) {

                            if ($(this).attr('NoticeId') == sNoticeId) {
                                $(this).remove();
                                var NoticeId = $('#content_Re .content_left .detail:eq(0)').attr('NoticeId'),
                                    record = $('#content_Re .content_left .detail:eq(0)').attr('record')


                                if (_this.curNoticeId == NoticeId) {
                                    return;
                                } else {
                                    _this.curNoticeId = NoticeId
                                    _this.bindReviceRight(_this.DataList, NoticeId.toString(), record);
                                }


                            }
                        })

                    } else {

                        my_layer({
                            title: '蓝信',
                            icon: '/images/ic_tip1.png',
                            message: '您是这条通知的创建者不能删除此通知，请到我发送通知版面删除'
                        }, 'warn', function () {
                            return;
                        })


                    }
                })
            }
            catch (e) {

                console.log(e.message);
            }

        });

        //回复所有收到通知中的中的指定通知
        $('#content_Re .content_right .reply_input ').keydown(function (event) {
            if (event.keyCode == 13) {

                var sReplyContent = $('#content_Re .content_right .reply_content .reply_input').val();

                if (sReplyContent.trim() == '') {
                    my_layer({message: '回复的内容不能为空'}, 'warn')
                    return;
                }

                var sReplyType = $('#content_Re .content_right .reply ')[0].selectedIndex;

                var curDetail = $('#content_Re .content_right .detail'),
                    sNoticeId = curDetail.attr('NoticeId'),
                    record = curDetail.attr('record');
                var dreplaycount = $('#content_Re .content_right .detail').attr('replaycount');
                var parm = {content: sReplyContent, replytype: sReplyType, recordDomain: record};

                _this.ReplyNotice(sNoticeId, parm);
                if (_this.scroll_Re_R != null) {
                    _this.scroll_Re_R.refresh();
                }

            }
        })

        //确认收到通知
        $('#btnOk').on('click', function () {

            var _that = this;
            var sNoticeId = $('#content_Re .content_right .detail').attr('NoticeId'),
                record = $('#content_Re .content_right .detail').attr('record'),
                isQuestion = $('#content_Re .content_right .detail').attr('isQuestion');


            if ($('.content_Re .btnOK ').hasClass('btn_unclick')) {
                return;
            }

            if (parseFloat(isQuestion) > 0) {
                _this.JoinNotice();
                return;
            }

            if ($('.content_Re .btnOK ').hasClass('btn_unclick')) {
                return;
            }
            var parm = {recordDomain: record};

            try {
                window.lxpc.exebusinessaction('notice', 'ConfirmNotice', sNoticeId.toString(), JSON.stringify(parm), 0, function (status, error, targ) {
                    if (status == '0') {

                        $(_that).hide();
                        $(".reply_content").show();
                        var sNoticeId = $('#content_Re .content_right .detail').attr('NoticeId');
                        _this.confirmNotice(sNoticeId);

                    } else {


                        my_layer({message: '调用接口出错，状态码' + status}, 'error')
                    }
                })
            }
            catch (e) {

                console.log(e.message);
            }


        });

        //撤销并删除通知
        $('#content_Se .content_right .title .back').on('click', function () {


            var sNoticeId = $('#content_Se .content_right .detail').attr('NoticeId'),
                record = $('#content_Re .content_right .detail').attr('record');
            try {
                var parm = {recordDomain: record};
                window.lxpc.exebusinessaction('notice', 'RevokeAndDeleteNotice', sNoticeId.toString(), JSON.stringify(parm), 0, function (status, error, targ) {

                    if (status == '0') {
                        _this.backoutAnddelNotice(sNoticeId);

                    } else {

                        my_layer({message: '调用接口出错，状态码' + status}, 'error')
                    }
                })
            } catch (e) {
                console.log(e.message);
            }

        })

        //回复发出通知中的中的指定通知
        $('#content_Se .content_right .reply_input ').keydown(function (event) {

            if (event.keyCode == 13) {

                var sReplyContent = $('#content_Se .content_right .reply_content .reply_input').val();
                //var sReplyType = $('#content_Se .content_right .reply ')[0].selectedIndex;
                var curdetail = $('#content_Se .content_right .detail')
                sNoticeId = curdetail.attr('NoticeId'),
                    record = curdetail.attr('record');

                var parm = {content: sReplyContent, replytype: 0, recordDomain: record};

                if (sReplyContent.trim() == '') {
                    my_layer({message: '回复的内容不能为空'}, 'warn')
                    return;
                }

                _this.ReplyNotice(sNoticeId, parm);
                if (_this.scroll_Se_R != null) {
                    _this.scroll_Se_R.refresh();
                }
            }

        })

        $('#content_Se .content_right .re_con ').on('click', function (event) {

            replyNotice(true);


        })
        $('#content_Re .content_right .re_con ').on('click', function (event) {

            replyNotice();


        })
        function replyNotice(issend) {

            if (issend) {
                var sReplyContent = $('#content_Se .content_right .reply_content .reply_input').val();
                //var sReplyType = $('#content_Se .content_right .reply ')[0].selectedIndex;
                var curdetail = $('#content_Se .content_right .detail'),
                    sNoticeId = curdetail.attr('NoticeId'),
                    record = curdetail.attr('record');
            } else {
                var sReplyContent = $('#content_Re .content_right .reply_content .reply_input').val();
                //var sReplyType = $('#content_Se .content_right .reply ')[0].selectedIndex;
                var curdetail = $('#content_Re .content_right .detail'),
                    sNoticeId = curdetail.attr('NoticeId'),
                    record = curdetail.attr('record');
            }


            var parm = {content: sReplyContent, replytype: 0, recordDomain: record};

            if (sReplyContent.trim() == '') {
                my_layer({message: '回复的内容不能为空'}, 'warn')
                return;
            }

            _this.ReplyNotice(sNoticeId, parm);
            if (_this.scroll_Se_R != null) {
                _this.scroll_Se_R.refresh();
            }

        }

        $('.addcontacts .contacts_left .search').keyup(function () {

        });

        $('#btnContacts').on('click', function () {

        });

        $('.reply').change(function () {

            var selecttype = this.selectedOptions[0].innerHTML;
            var $ele = $(this);
            var oreply = document.getElementsByClassName('re_con')[0];
            var $btn = $ele.next()
            $btn.html(selecttype)

        })

    },
    //重新计算页面的宽度和高度，并且刷新滚动条
    refrashIscroll: function () {

        var bottomH;
        var clientH = document.documentElement.clientHeight || document.body.clientHeight;
        $(".content ")[0].style.height = (clientH - 32 - 2) + 'px';
        $('.nav')[0].style.height = (clientH - 32 - 2) + 'px';
        $('#content_Re .content_right >div')[0].style.height = (clientH - 50 - 32 - 2) + 'px';
        $('#content_Se .content_right >div')[0].style.height = (clientH - 50 - 32 - 2) + 'px';

        switch (parseInt(this.typeInfo)) {
            case 1:

                if (this.scroll_Re_L != null) {
                    this.scroll_Re_L.refresh();
                }
                if (this.scroll_Re_R != null) {
                    this.scroll_Re_R.refresh();
                }

                break;
            case 2:

                if (this.scroll_Se_R != null) {

                    this.scroll_Se_R.refresh();

                }
                if (this.scroll_Se_L != null) {
                    this.scroll_Se_L.refresh();

                }
                break;
            case 3:

                break;
            case 4:

                break;
            default:
        }


    },
    //重新计算创建新通知页面的宽和高
    reComputesize: function () {
        var oAdd_container = document.getElementsByClassName('send_container')[0];
        var oAdd_concact = document.getElementsByClassName('addcontacts')[0];
        var winW = document.documentElement.clientWidth,
            winH = document.documentElement.clientHeight,
            boxW = oAdd_container.offsetWidth,
            boxH = oAdd_container.offsetHeight;
        oAdd_container.style.left = (winW - boxW) / 2 + "px";
        oAdd_container.style.top = (winH - boxH) / 2 + "px";
        oAdd_concact.style.left = (winW - boxW) / 2 + "px";
        oAdd_concact.style.top = (winH - boxH) / 2 + "px";


    },

    //阻止冒泡
    mystopPropagation: function stopPropagation(e) {
        var ev = e || window.event;
        if (ev.stopPropagation) {
            ev.stopPropagation();
        } else {
            ev.cancelBubble = true;
        }
    },

    getdata: function () {
        var _this = this;

        try {
            window.lxpc.exebusinessaction('notice', 'syncnotice', '0', '', 0, function (status, datalist, targ) {

                if (status == 0) {

                    $('#load').hide();
                    $('.add')[0].disabled = false;
                    _this.LoadFinished = 0;
                    $('#content_Re').show();

                    datalist = JSON.parse(datalist);

                    var datalistwithoutDel = [];
                    var datalist_send = [];
                    //
                    for (var i = 0; i < datalist.length; i++) {


                        if (typeof (datalist[i]['action']) == 'undefined' || datalist[i]['action'] == '') {
                            datalist[i]['action'] = 0;
                        }

                        if (datalist[i]['action'] != 1) {
                            var myID = datalist[i]['noticeDetail']['selfMember']['userUniId'];

                            if (datalist[i]['noticeDetail']['creatorMember']['userUniId'] == myID) {
                                datalist_send.push(datalist[i]);
                                if (datalist[i]['noticeDetail']['creatorMember']['receiver']) {
                                    datalistwithoutDel.push(datalist[i])
                                }

                            } else {

                                datalistwithoutDel.push(datalist[i])
                            }
                        }
                    }
                    var datalistByTime = datalistwithoutDel.sort(function (a, b) {
                        return b["noticeDetail"]['noticeEntity']['createTime'] - a["noticeDetail"]['noticeEntity']['createTime'];
                    });

                    datalist_send = datalist_send.sort(function (a, b) {
                        return b["noticeDetail"]['noticeEntity']['createTime'] - a["noticeDetail"]['noticeEntity']['createTime'];
                    })

                    _this.DataList = datalistByTime;
                    _this.DataListSend = datalist_send;

                    _this.bindData_Receive(datalistByTime);
                    _this.Revicecallback();

                } else {
                    $('#load').hide();
                    my_layer({message: '调用接口出错，错误码' + status}, 'error');
                }
            });
        }
        catch (e) {
            console.log(e.message);
            $('#load').hide();
            $('.add')[0].disabled = false;
            _this.LoadFinished = 0;
            $('#content_Re').show();


        }

    },
    //绑定我接受到的通知信息
    bindData_Receive: function (datalist, isNewReviceNotice, isself) {

        var _this = this;
        var str = '';
        var MyunConfirmCount = 0;

        if (datalist.length == 0) {
            _this.showNoNotice();
            return;
        }

        for (var i = 0; i < datalist.length; i++) {
            var curNotice = null;
            if (isself) {
                curNotice = datalist[i];
            } else {
                curNotice = datalist[i]["noticeDetail"];
            }

            var recordDomain = curNotice['noticeEntity']['recordDomain'];//记录域信息跨平台问题

            var time = FormatTime(curNotice['noticeEntity']['createTime']);
            var title = curNotice['noticeEntity']['title'];

            title=XssToString(title)
            if (typeof(title) == 'undefined' || title == '' || title == null) {
                title = '通知'
            }
//状态

            var dstatus = curNotice['selfMember']['status'];
            if (_this.userDomain == '') {
                _this.userDomain = curNotice['selfMember']['userDomain']
            }
            var status = dstatus == '0' ? "未确认" : (dstatus == '99' ? "已删除" : '已确认');

            //HTML内容转换


            var content = curNotice['noticeEntity']['content'],
                resMT = curNotice['noticeEntity']['resourceMimeType'];


            //var content = curNotice['noticeEntity']['content'];
            //content = _this.htmlEncode(content);
            content=XssToString(content)

            if (content == '' || content == null || typeof(content) == 'undefined') {
                content = '';
            }


            var iSmap = mapAddress(content);
            //var maplist=[];
            if (iSmap) {
                var str_map = '';
                //var reg = /\{[^{]+\|\d+(\.\d+),\d+(\.\d+)\}/g;
                var reg = /\{([^}|]*)\|(\d{1,3}\.\d+,\d{1,3}\.\d+)\}/g;
                content = content.replace(reg, function () {

                    var location = arguments[2];
                    //maplist.push(location);
                    var item = arguments[0].split('|')[0].replace('{', '');
                    return item

                })

            }


            //判断通知不试试自己发给自己的
            var IsselfToself = false;
            if (curNotice['selfMember']['userUniId'] == curNotice['creatorMember']['userUniId']) {
                IsselfToself = true;
            }


            str += '<div class="detail unclicked" NoticeId="' + curNotice['noticeEntity'].id + '"  IsselfToself="' + IsselfToself + '" replycount="' + curNotice['noticeEntity']['replyCount'] + '" record="' + recordDomain + '">';

            if (dstatus == '0') {
                MyunConfirmCount++;
                str += '<i class="Uncon" alt=""></i>';
            } else {
                str += '<i alt=""></i>';
            }

            str += '<h6>' + title + '<span>' + time + '</span></h6>';
            str += '<p class="content" >' + content + '</p>';


            if (dstatus == '0') {
                str += '<span class="status_L  Fonthigh" status="' + dstatus + '">' + status + '</span>' + '<span><em class="reply_count"></em>回复</span>&nbsp;<span class="replycount">' + curNotice['noticeEntity']['replyCount'] + '</span></div>';

            } else {
                str += '<span class="status_L  repCount">' + status + '</span>' + '<span><em class="reply_count"></em>回复</span>&nbsp;<span class="replycount">' + curNotice['noticeEntity']['replyCount'] + '</span></div>';
            }


        }

        if (typeof(isNewReviceNotice) == 'undefined' || isNewReviceNotice == '') {
            $('#scroll').append(str);
        } else {
            $('#scroll').prepend(str);
        }
        //
        //$('#scroll .detail p').each(function(){
        //
        //    var $item=$(this);
        //    $item.html(XssToString($item.html()))
        //
        //})


//语音信息


        //我收到的通知数


        if (typeof(isNewReviceNotice) == 'undefined' || isNewReviceNotice == '') {

            if (MyunConfirmCount == 0) {

                $('.receive span').removeClass('receive_left_17');
            } else {

                if (MyunConfirmCount < 10) {

                    $('.receive span').addClass('receive_left_17')
                } else {

                    $('.receive span').addClass('receive_left')
                }

                $(".nav .count").html(MyunConfirmCount);
            }
        } else {

            var unRplyCount = 0

            if ($('.nav .count').html() == '') {
                unRplyCount = 0
            } else {
                unRplyCount = parseInt($('.nav .count').html())
            }

            unRplyCount = unRplyCount + 1;

            if (unRplyCount == 0) {
                $('.receive span').removeClass('receive_left_17');
            } else {

                if (unRplyCount < 10) {
                    $('.receive span').removeClass('receive_left').addClass('receive_left_17')
                } else {
                    $('.receive span').removeClass('receive_left_17').addClass('receive_left')
                }
                $(".nav .count").html(unRplyCount);
            }
        }

        if (typeof(isNewReviceNotice) == 'undefined' || typeof(isNewReviceNotice) == '') {
            var record = datalist[0]["noticeDetail"]['noticeEntity'].recordDomain;


            if (_this.curNoticeId == datalist[0]["noticeDetail"]['noticeEntity'].id) {
                return;
            } else {
                _this.curNoticeId = datalist[0]["noticeDetail"]['noticeEntity'].id
                _this.bindReviceRight(datalist, datalist[0]["noticeDetail"]['noticeEntity'].id, record);
            }

        }

        var option = scrollSetings();
        if (_this.scroll_Re_L == null) {
            _this.scroll_Re_L = new IScroll('#wrapper', option);
            _this.scroll_Re_R = new IScroll('#wrapperR', option);
        }
        else {
            _this.scroll_Re_L.refresh();
            _this.scroll_Re_R.refresh();
        }


        for (var i = 0; i < datalist.length; i++) {

            if (isself) {
                var curdata = datalist[i];
                $('#content_Re .content_left .detail[NoticeId="' + curdata['noticeEntity'].id + '"]').on('click', function () {

                    $(this).toggleClass('clicked');
                    $(this).siblings().removeClass('clicked').addClass('unclicked')
                    var sNoticeId = $(this).attr('NoticeId'),
                        record = $(this).attr('record');
                    if (_this.curNoticeId == sNoticeId) {
                        return;
                    } else {
                        _this.bindReviceRight(datalist, sNoticeId.toString(), record, true);
                    }

                });
            } else {
                var curdata = datalist[i]["noticeDetail"];
                $('#content_Re .content_left .detail[NoticeId="' + curdata['noticeEntity'].id + '"]').on('click', function () {

                    $(this).toggleClass('clicked');
                    $(this).siblings().removeClass('clicked').addClass('unclicked')
                    var sNoticeId = $(this).attr('NoticeId'),
                        record = $(this).attr('record');
                    if (_this.curNoticeId == sNoticeId) {
                        return;
                    } else {
                        _this.curNoticeId = sNoticeId
                        _this.bindReviceRight(datalist, sNoticeId.toString(), record);
                    }


                });
            }

        }

    },
    //查看我接受到的某个通知的详情信息
    bindReviceRight: function bindReviceRight(datalist, sNoticeId, record, isself) {

        var _this = this;
        $("#content_Re .content_right #scroll2 .detail").remove();
        $("#content_Re .content_right #scroll2 .quest_area").remove();
        $("#content_Re .content_right #scroll2 .reply_area").remove();


        for (var i = 0; i < datalist.length; i++) {

            var curNotice = null;

            if (isself) {
                curNotice = datalist[i]
            } else {
                curNotice = datalist[i]["noticeDetail"]
            }


            var id = curNotice['noticeEntity']['id'],
                recordDomain = curNotice['noticeEntity']['recordDomain'];
            if (id == sNoticeId) {
                curNotice = curNotice;

                break;
            }

        }


        var isQuestion = curNotice['noticeEntity']['topicCount']

        //时间
        var time = FormatTime(curNotice['noticeEntity']['createTime']);
        var title = curNotice['noticeEntity']['title'];
        title=XssToString(title)
        if (typeof(title) == 'undefined' || title == '' || title == null) {
            title = '通知'
        }
        var content = curNotice['noticeEntity']['content'],
            resMT = curNotice['noticeEntity']['resourceMimeType'];

        content=XssToString(content)

        if (content == '' && resMT == 'voice') {
            content = ''
        } else {

        }


        //单位

        var branch = XssToString(curNotice['creatorMember']['branchPath']);

        if (typeof (branch) == 'undefined') {
            if (typeof(curNotice.noticeEntity.spokesPersonSendName) != 'undefined' && curNotice.noticeEntity.spokesPersonSendName != null) {
                branch = XssToString(curNotice.noticeEntity.spokesPersonSendName)
            } else {
                branch = '';
            }

        } else {
            var arry = branch.split('-');
            if (arry.length > 1) {
                arry.shift();
                branch = arry.join(' ');
            }

        }

        var sName = XssToString(curNotice['creatorMember']['name'])
        if (typeof(sName) == 'undefined' || sName == null) {
            sName = ''
        }

        var strR = '';
        var dtatus = curNotice['selfMember']['status'];
        var status = dtatus == '0' ? "未确认" : (dtatus == '99' ? "已删除" : '已确认');

        strR += '<div class="detail"' + 'NoticeId="' + curNotice['noticeEntity'].id + '" status="' + dtatus + '" record="' + record + '" isQuestion="' + isQuestion + '"><div style="height: 40px;">';
        strR += '<img  class="photoRes" src="./images/defuser.png" alt="">';
        strR += '<span class="name">' + sName + '</span>';
        strR += '<span>' + time + '</span><br>';
        strR += '<span class="branch">' + branch + '</span></div>';
        strR += '<h5>' + title + '</h5>';
        strR += '<p>' + content + '</p>';


        strR += '<span class="status">' + status + '</span></div>';

        var replycount = curNotice['noticeEntity']['replyCount'];

        strR += '<div class="reply_area"><h6><span>回复(' + replycount + ')</span></h6><div class="replay_list"></div></div>';

        $("#content_Re .content_right #scroll2 .title").after(strR);

        //_this.scroll_Re_R.refresh();
        //获取头像
        var imgstr = curNotice['creatorMember']['photoResId'];


        if (typeof (imgstr) != 'undefined' || imgstr != '') {

            var parm = {resourceList: [{photoResId: imgstr}], type: "Sender", size: 96};

            _this.imageId = _this.imageId + 1;
            $('#content_Re .content_right .detail .photoRes').attr('imageId', _this.imageId);
            var mineType=curNotice['creatorMember'].mineType
            mineType=mineType?mineType:'image/png'
            _this.imageList.push({resId: imgstr, mineType:mineType})


            try {

                window.lxpc.exebusinessaction('DownloadResource', 'HeaderImage', sNoticeId.toString(), JSON.stringify(parm), _this.imageId, function (status, result, targ) {

                    if (status == '0') {

                        if (result.indexOf('\\') > -1) {
                            $('#content_Re .content_right .detail .photoRes[imageId="' + targ + '"]').attr('src', result);
                        }

                    }

                });

            } catch (e) {
                console.log(e.message)
            }
        }


        //是不是显示确认通知控件

        if (dtatus == 0) {
            $('#content_Re .btn_container').show();
            $('#content_Re .btn_container .btnOK').show();
            $('#content_Re .reply_content').hide();

        } else {
            $('#content_Re .btn_container').hide();
            $('#content_Re .reply_content').show();
        }

        //把 未确认的通知置灰
        if (dtatus == 99) {
            $('#content_Re .del').css('background', '#EAEAEA');

        }

        //自己给自己发送通知
        //
        //if (curNotice['creatorMember']['receiver']) {
        //    $('#content_Re .del').css-2('background', '#EAEAEA');
        //}


        //地图

        content=XssToString(content)

        var iSmap = mapAddress(content);

        if (iSmap) {
            _this.showmap(content, false)

        } else {
            $('#content_Re .content_right .detail p').html(content);
        }
//语音信息

        //if(curNotice.noticeEntity.content==''){

        var resId = curNotice['noticeEntity']['resId'];
        var attachtype = curNotice['noticeEntity']['attachmentType'];

        if (attachtype != 0 && (typeof (resId) == 'undefined' || resId == '' || resId == null)) {

            try {
                var parm = {noticeId: id, recordDomain: recordDomain};
                window.lxpc.exebusinessaction('Notice', 'QueryNoticeDetail', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
                    if (status == 0) {
                        var data = JSON.parse(jsondata);

                        _this.bindAttachment(curNotice, data)

                    } else {
                        my_layer({message: '调用接口出错，状态码' + status}, 'warn');
                    }

                })
            } catch (e) {
                my_layer({message: '调用接口出错，状态码' + e.message}, 'warn');
            }
        } else {

            _this.bindAttachment(curNotice)

        }

        //未确认的通知不能删出即把标签置灰
        var $del = $('.content_Re .content_right .del');
        if (dtatus == 0) {

            $del.css('background-position', '-105px')
            $del.hover(function () {
                $(this).css('background-position', '-105px')
            }, function () {
                $(this).css('background-position', '-105px')
            })
        } else {
            $del.css('background-position', '0px');

            $del.hover(function () {
                $(this).css('background-position', '-35px')
            }, function () {
                $(this).css('background-position', '0px')
            })
        }

        if (isQuestion > 0) {
            //$('.content_Re .btnOK ').removeClass('btn_active').addClass('btn_unclick');
            //var strquestion = '<div style="text-align: center;margin-top: 30px">暂不支持调查问卷</div>    '
            //
            //$('#content_Re .content_right .detail p').append(strquestion)

            var NoticeStatus = curNotice['noticeEntity']['status']

            if (NoticeStatus == 2) {//该通知已经终止
                $('#btnOk').removeClass('btn_active').addClass('btn_unclick');
                ShowQuest.call(_this, curNotice, false, this.scroll_Que)
            } else {
                if (dtatus == 0) {
                    WriteQuest.call(_this, curNotice, function () {
                        _this.scroll_Re_R.refresh();
                    })


                } else {

                    ShowQuest.call(_this, curNotice, false, this.scroll_Que)
                }
            }


        } else {
            $('.content_Re .btnOK ').removeClass('btn_unclick').addClass('btn_active')
        }

        //绑定回复某个通知的详情列表
        _this.bindReplylist(curNotice, sNoticeId, record);
    },
    //绑定我发出到的通知信息
    bindData_Send: function (datalist, iscallback) {
        //我收到的通知

        var _this = this;

        //我发送的通知
        if (datalist.length == 0) {

            _this.showNoNotice();
            return;
        }
        if (typeof(iscallback) == 'undefined' || iscallback == '') {
            $('#scroll3 .detail').remove();
        }

        var str_send = '';
        for (var i = 0; i < datalist.length; i++) {

            if (datalist[i].isNewCreate) {
                curNotice = datalist[i];
            } else {
                var curNotice = datalist[i]['noticeDetail'];
            }

            //时间
            var time = FormatTime(curNotice['noticeEntity']['createTime']);
            //主题
            var title = curNotice['noticeEntity']['title'];
            title=XssToString(title)
            if (typeof(title) == 'undefined' || title == '' || title == null) {

                title = '通知'
            }
            //HTML内容转换

            var content = curNotice['noticeEntity']['content'];
            content=XssToString(content)

            if (content == '' || content == null || typeof(content) == 'undefined') {
                content = '';
            } else {
                //content = _this.htmlEncode(content);
            }

            var iSmap = mapAddress(content);

            if (iSmap) {

                var reg = /\{([^}|]*)\|(\d{1,3}\.\d+,\d{1,3}\.\d+)\}/g;
                content = content.replace(reg, function () {
                    var item = arguments[0].split('|')[0].replace('{', '');
                    return item

                })

            }


            var id = curNotice['noticeEntity'].id,
                record = curNotice['noticeEntity'].recordDomain;
            var replyCount = curNotice['noticeEntity']['replyCount'];
            str_send += '<div class="detail unclicked" NoticeId="' + id + '"  replycount="' + replyCount + '" record="' + record + '">';
            //str_send += '<span>' + curNotice['creatorMember']['name'] + '</span>';

            str_send += '<h6>' + title + '<span>' + time + '</span></h6>';
            str_send += '<p>' + content + '</p>';

            var receiveCount = curNotice['noticeEntity']['receiverMemberCount'];
            var confirmCount = curNotice['noticeEntity']['confirmCount'];

            var status;
            if (receiveCount > confirmCount) {
                var unreply = receiveCount - confirmCount
                status = "未确认 " + unreply.toString();
                str_send += '<span  class="Fonthigh">' + status + '</span>' + '<span><em class="reply_count"></em>回复</span>&nbsp;<span class="replycount">' + replyCount + '</span></div>';
            } else {
                status = "已全部确认";
                str_send += '<span class="repCount">' + status + '</span>' + '<span><em class="reply_count"></em>回复</span>&nbsp;<span class="replycount">' + replyCount + '</span></div>';
            }


        }

        if (typeof(iscallback) == 'undefined' || iscallback == '') {
            $('#scroll3').append(str_send);
        } else {
            $('#scroll3').prepend(str_send);
        }


        var id, record;

        if (datalist[0].isNewCreate) {

            id = datalist[0]['noticeEntity'].id.toString();
            record = datalist[0]['noticeEntity'].recordDomain
        }
        else {

            id = datalist[0]['noticeDetail']['noticeEntity'].id.toString();
            record = datalist[0]['noticeDetail']['noticeEntity'].recordDomain
        }

        _this.bindSendRight(datalist, id.toString(), record);

        var option = scrollSetings();


        if (_this.scroll_Se_L == null) {

            _this.scroll_Se_L = new IScroll('#wrapper_send', option);
            _this.scroll_Se_R = new IScroll('#wrapperR_send', option);

        } else {

            _this.scroll_Se_L.refresh();
            _this.scroll_Se_R.refresh();

        }

        for (var i = 0; i < datalist.length; i++) {
            var curdata = datalist[i];
            $('#content_Se .content_left .detail[NoticeId="' + curdata["noticeDetail"]['noticeEntity'].id + '"]').on('click', function () {
                $(this).toggleClass('clicked');
                $(this).siblings().removeClass('clicked').addClass('unclicked')
                var sNoticeId = $(this).attr('NoticeId'),
                    record = $(this).attr('record');

                if (_this.curNoticeSendId == sNoticeId) {
                    return;
                } else {
                    _this.curNoticeSendId = sNoticeId
                    _this.bindSendRight(datalist, sNoticeId.toString(), record);
                }

            });

        }


    },
    //查看我发出的某个通知的详情信息
    bindSendRight: function bindSendRight(datalist, sNoticeId, record, isnewCreate) {
        var _this = this;

        $("#content_Se .content_right #scroll4 .detail").remove();
        $("#content_Se .content_right #scroll4 .unNotarize").remove();
        $("#content_Se .content_right #scroll4 .reply_area").remove();
        $('.content_Se .content_right .quest_area').remove()

        var curNotice;

        if (typeof (isnewCreate) == 'undefined' || isnewCreate == false) {

            for (var i = 0; i < datalist.length; i++) {

                if (datalist.isNewCreate) {
                    curNotice = datalist[i];
                } else {
                    curNotice = datalist[i]["noticeDetail"];
                }

                var id = curNotice['noticeEntity']['id'];
                if (id == sNoticeId) {
                    curNotice = datalist[i]["noticeDetail"];

                    break;
                }
            }

        } else {
            curNotice = datalist;
        }

        var isQuestion = curNotice['noticeEntity']['topicCount']

        //时间
        var time = FormatTime(curNotice['noticeEntity']['createTime']);
        var title = curNotice['noticeEntity']['title'];
        title=XssToString(title)
        if (typeof(title) == 'undefined' || title == '' || title == null) {

            title = '通知'
        }

        //部门

        var branch = XssToString(curNotice['creatorMember']['branchPath']);

        if (typeof (branch) == 'undefined') {
            if (typeof(curNotice.noticeEntity.spokesPersonSendName) != 'undefined' && curNotice.noticeEntity.spokesPersonSendName != null) {
                branch = curNotice.noticeEntity.spokesPersonSendName
            } else {
                branch = '';
            }

        } else {
            var arry = branch.split('-');
            if (arry.length > 1) {
                arry.shift();
                branch = arry.join(' ');
            }
        }
        var sName = XssToString(curNotice['creatorMember']['name'])
        if (typeof(sName) == 'undefined' || sName == null) {
            sName = ''
        }

        var strR = '';
        strR += '<div class="detail" isQuestion="' + isQuestion + '" ' + 'NoticeId="' + curNotice['noticeEntity'].id + '" replaycount="' + curNotice['noticeEntity']['replyCount'] + '" record="' + curNotice['noticeEntity'].recordDomain + '"><div style="height: 40px;">';
        strR += '<img class="photoRes" src="./images/defuser.png" alt="">';
        strR += '<span class="name">' + sName + '</span>';
        strR += '<span>' + time + '</span><br>';
        strR += '<span class="branch">' + XssToString(branch) + '</span></div>';
        strR += '<h5>' + title + '</h5>';
        strR += '<p></p>';


        var receiveCount = curNotice['noticeEntity']['receiverMemberCount'];
        var confirmCount = curNotice['noticeEntity']['confirmCount'];
        var status;
        var unconfirmCount = receiveCount - confirmCount
        if (receiveCount > confirmCount) {
            status = "未确认 " + unconfirmCount.toString();
        } else {
            status = "已全部确认"
        }

        strR += '<span class="status status_send">' + status + '<em class="show_unReplay"></em></span></div>';

        var replycount = curNotice['noticeEntity']['replyCount'];
        strR += '<div class="reply_area"><h6><span>回复(' + replycount + ')</span></h6><div class="replay_list"></div></div>';

        $("#content_Se .content_right #scroll4 .title").after(strR);

        //HTML内容转换

        var content = curNotice['noticeEntity']['content'],
            resMT = curNotice['noticeEntity']['resourceMimeType'];

        //地图


content=XssToString(content)

        var iSmap = mapAddress(content);

        if (iSmap) {
            _this.showmap(content, true)
        } else {
            $('#content_Se .content_right .detail p').html(content);
        }


//语音信息
        if (resMT == 'voice') {
            var resId = curNotice.noticeEntity.resId;
            _this.showvoice(resId, true);
        }

        //获取头像

        var imgstr = curNotice['creatorMember']['photoResId'];

        if (typeof (imgstr) != 'undefined' || imgstr != '') {

            var parm = {resourceList: [{photoResId: imgstr}], size: 96};

            _this.imageId = _this.imageId + 1;
            $('#content_Se .content_right .detail .photoRes').attr('imageId', _this.imageId);
            var mineType=curNotice['creatorMember'].mineType
            mineType=mineType?mineType:'image/png'
            _this.imageList.push({resId: imgstr, mineType:mineType})

            try {

                window.lxpc.exebusinessaction('DownloadResource', 'SendHeaderImage', sNoticeId.toString(), JSON.stringify(parm), _this.imageId, function (status, result, targ) {

                    if (status == '0') {
                        if (result && result.indexOf('\\') > -1) {
                            $('#content_Se .content_right .detail .photoRes[imageId="' + targ + '"]').attr('src', result);
                        }

                    }

                });

            } catch (e) {
                console.log(e.message)
            }
        }


        var attachtype = curNotice['noticeEntity']['attachmentType'];

        switch (attachtype) {///0 没有附件1 只有文件 2 只有图片附件 3.同时有文件附件和图片附件
            case 0://
                break;
            case 1:
                var strfile = '';
                var resourceType = curNotice['noticeEntity']['resourceMimeType']
                var filename = XssToString(curNotice['noticeEntity']['resourceName']);

                var times = FormatTime(curNotice['noticeEntity']['createTime'], 'dd/mm') + '月';
                var siconpath;
                if (resourceType == 'application/zip') {
                    siconpath = './images/ml_file_zip.png';
                } else if (resourceType == 'application/pdf') {
                    siconpath = './images/ml_file_pdf.png';
                } else {
                    siconpath = './images/ml_file_default.png';
                }

                strfile += '<div style=";" class="att_f"><img src="' + siconpath + '" style=""/><div style="height:72px;;position: relative;margin-top: -50px;margin-left: 70px"><div>';
                strfile += '<p style="width:140px ;overflow: hidden;text-overflow: ellipsis;height: 20px;padding: 0;margin: 0;white-space: nowrap">' + filename + '</p><em style="margin-right:12px;float: right;margin-top: -20px">' + times + '</em></div> <div style="margin-top: 6px">';
                strfile += '<em style=";margin-left: 5px;"></em><a href="javascript:;" class="aV_a">另存为</a><a href="javascript:;" class="aV_a">下载</a></div></div></div>';

                $('#content_Se .content_right .detail').append(strfile);

                break;
            case 2: //内容图片
                //内容图片
                var ImgInContent = curNotice['noticeEntity']['resId'];

                if (typeof (ImgInContent) != 'undefined' && ImgInContent != '') {

                    var img = '<div><img src="./images/defpicture.png" alt=""></div>';
                    $('#content_Se .content_right .detail p').append(img);

                    try {

                        var parm = {resourceList: [{photoResId: ImgInContent}], size: 96};

                        var mimeType=resMT?resMT:'image/png'
                        _this.imageList.push({resId: imgstr, mineType:mimeType})
                        _this.imageId=_this.imageId+1;

                        window.lxpc.exebusinessaction('DownloadResource', 'SendContentImage', sNoticeId.toString(), JSON.stringify(parm), _this.imageId, function (status, result, targ) {

                            if (status == '0') {

                                if (result && result.indexOf('\\') > -1) {
                                    var boxW = parseFloat($('#content_Se .content_right .detail p')[0].clientWidth);
                                    var $img = $('#content_Se .content_right .detail p img');
                                    _this.computeImgSize($img, result, boxW);

                                    $img.attr('src', result)
                                    _this.scroll_Se_R.refresh();
                                    $("#content_Se .content_right .detail p img").click(function (event) {

                                        var parm = {picturePath: result, resIdAry:_this.imageId , index: targ};
                                        try {
                                            window.lxpc.exebusinessaction('notice', 'ViewSrcPicture', '0', JSON.stringify(parm), 0, null)
                                        }
                                        catch (e) {

                                            console.log(e.message);
                                        }
                                        _this.mystopPropagation(event);

                                    })
                                }

                            } else {

                                console.log(status)
                            }
                        })

                    } catch (e) {
                        console.log(e.message)
                    }
                }
                break;
            default:
                break;
        }


        _this.bindConfirmlist();

        _this.bindReplylist_send(curNotice, sNoticeId, record)

        //下载

        if (attachtype == 1) {//有文件
            //初始化文件的状态

            var resId = curNotice['noticeEntity']['resId'],
                filename = XssToString(curNotice['noticeEntity']['resourceName']);

            var parm = {fileResId: resId};
            _this.FileId = _this.FileId + 1;

            $('.att_f').attr('targ', _this.FileId);
            var $down = $('.content_Re .aV_a:eq(1)'),
                $saveas = $('.content_Re .aV_a:eq(0)'),
                $box = $down.parents('.att_f');

            init_File(parm, _this.FileId, $down, $saveas, function () {

            });

            $down.click(function () {
                bindfiledown($down, $saveas, filename, resId, $box)
            })
            $saveas.click(function () {
                bindfilesaveAS($down, $saveas, filename, resId, $box)
            })
        }


        if (isQuestion > 0) {
            ShowQuest.call(_this, curNotice, true, _this.scroll_Que)
        }


    },
    //查看我收到通知的所有回复情况
    bindReplylist: function bindReplylist(curNotice, sNoticeId, record) {

        var _this = this;

        try {
            var parm = {batchSize: 20, queryDirection: 'pre', lastMessageId: '0', recordDomain: record};

            window.lxpc.exebusinessaction('notice', 'QueryNoticeReply', sNoticeId.toString(), JSON.stringify(parm), 0, function (status, datalist, targ) {
                if (status == "0") {
                    var list = JSON.parse(datalist);

                    var replycount = curNotice['noticeEntity']['replyCount'];
                    var str = ''

                    for (var j = 0; j < list.length; j++) {

                        var aReplyContent = list[j];
                        var str_secret = '';
                        if (aReplyContent.replyType == 1) {//私密回复
                            //判断是不是自己私密回复的
                            if (aReplyContent['noticeMember'].userUniId != curNotice['selfMember'].userUniId) {
                                continue;
                            } else {
                                str_secret = '<span style="color: #EC0000;">[私密回复]</span>'
                            }

                        } else {

                        }

                        //头像
                        var name =XssToString(aReplyContent['noticeMember']['name']) ;
                        if (typeof(name) == 'undefined' || name == '') {
                            name = '未知'
                        }

                        var scontent = _this.htmlEncode(aReplyContent['content']);


                        var imagepath = aReplyContent['noticeMember']['photoResId']
                        var mineType = aReplyContent['noticeMember']['mineType']

                        scontent= XssToString(scontent)

                        var imagepath = aReplyContent['noticeMember']['photoResId']
                        var mineType=aReplyContent['noticeMember']['mineType'];
                        str += '<div class="replay_detail"><img imagepath="' + imagepath + '"  data-minetype="'+mineType+'" src="./images/defuser.png" alt="">';
                        var sTime = FormatTime(aReplyContent['createTime']);
                        str += '<span>' + name + '</span><span class="reply_time">' + sTime + '</span>';
                        str += '<p>' + scontent + str_secret + '</p></div>';
                    }

                    //str += '</div></div>';

                    if (_this.typeInfo == '1') {

                        $("#content_Re .content_right #scroll2 .replay_list").append(str);
                        $('#content_Re .content_right .replay_list .replay_detail img').each(function (index, ele) {

                            var _that = this;
                            var imgPath = $(ele).attr('imagepath');

                            if (typeof(imgPath) != 'undefined' && imgPath != '') {
                                var parm = {resourceList: [{photoResId: imgPath}], size: 96};
                                _this.imageId = _this.imageId + 1;
                                $(_that).attr('imageId', _this.imageId);
                                try {

                                    var mineType=$(ele).data('mineType');
                                    mineType=mineType?mineType:'image/png'
                                    _this.imageList.push({resId: imgPath, mineType:mineType})


                                    window.lxpc.exebusinessaction('DownloadResource', 'ReplySendHeaderImage', sNoticeId.toString(), JSON.stringify(parm), _this.imageId, function (status, result, targ) {
                                        if (status == '0') {

                                            if (result && result.indexOf('\\') > -1) {
                                                if ($('#content_Re .content_right .detail .photoRes[imageId="' + targ + '"]').length > 0) {
                                                    $('#content_Re .content_right .detail .photoRes[imageId="' + targ + '"]').attr('src', result);
                                                } else if ($('#content_Re .content_right .replay_list .replay_detail img[imageId="' + targ + '"]').length > 0) {
                                                    $('#content_Re .content_right .replay_list .replay_detail img[imageId="' + targ + '"]').attr('src', result)
                                                }
                                            }

                                        } else {
                                            console.log(status)
                                        }
                                    })

                                } catch (e) {
                                    console.log(e.message)
                                }


                            }


                        });
                        _this.scroll_Re_R.refresh();
                    } else if (_this.typeInfo == '2') {
                        $("#content_Se .content_right #scroll4 .replay_list").append(str);

                        $('#content_Se .content_right .replay_list .replay_detail img').each(function (index, ele) {

                            var imgPath = $(ele).attr('imagepath');

                            if (typeof(imgPath) != 'undefined' && imgPath != '') {
                                var parm = {resourceList: [{photoResId: imgPath}], size: 96};
                                _this.imageId = _this.imageId + 1;
                                $(ele).attr('imageId', _this.imageId);

                                var mineType=$(ele).data('minetype');
                                mineType=mineType?mineType:'image/png'
                                _this.imageList.push({resId: imgPath, mineType:mineType})


                                try {
                                    window.lxpc.exebusinessaction('DownloadResource', 'ReplysendHeaderImage', sNoticeId.toString(), JSON.stringify(parm), _this.imageId, function (status, result, targ) {
                                        if (status == '0') {
                                            if (result && result.indexOf('\\') > -1) {
                                                $('#content_Se .content_right .replay_list .replay_detail img[imageId="' + targ + '"]').attr('src', result)
                                            }


                                        } else {
                                            console.log(status)
                                        }
                                    })

                                } catch (e) {

                                    console.log(e.message)
                                }


                            }

                        });

                        _this.scroll_Se_R.refresh();

                    } else {


                    }

                    //添加头像


                } else {
                    console.log("error")
                }

            })


        }
        catch (e) {
            console.log(e.message)
        }


    },
    bindReplylist_send: function bindReplylist(curNotice, sNoticeId, record) {

        var _this = this;

        try {
            var parm = {batchSize: 20, queryDirection: 'pre', lastMessageId: '0', recordDomain: record};

            window.lxpc.exebusinessaction('notice', 'QueryNoticeReply', sNoticeId.toString(), JSON.stringify(parm), 0, function (status, datalist, targ) {
                if (status == "0") {
                    var list = JSON.parse(datalist);
                    var replycount = curNotice['noticeEntity']['replyCount'];
                    var str = ''
                    for (var j = 0; j < list.length; j++) {
                        var aReplyContent = list[j];
                        //头像
                        var name =XssToString(aReplyContent['noticeMember']['name']) ;
                        if (typeof(name) == 'undefined' || name == '') {
                            name = '未知'
                        }

                        var str_secret = '';

                        if (aReplyContent.replyType == 1) {//私密回复
                            //判断是不是自己私密回复的

                            str_secret = '<span style="color: #EC0000;">[私密回复]</span>'

                        }


                        var scontent = _this.htmlEncode(aReplyContent['content']);
                        var imagepath = aReplyContent['noticeMember']['photoResId']
                        var mineType = aReplyContent['noticeMember']['mineType']

                        scontent=XssToString(result)

                        str += '<div class="replay_detail"><img imagepath="' + imagepath + '" data-minetype="'+mineType+'"  src="./images/defuser.png" alt="">';
                        var sTime = FormatTime(aReplyContent['createTime']);
                        str += '<span>' + name + '</span><span class="reply_time">' + sTime + '</span>';
                        str += '<p>' + scontent + str_secret + '</p></div>';

                    }

                    //str += '</div></div>';

                    $("#content_Se .content_right #scroll4 .replay_list").append(str);

                    $('#content_Se .content_right .replay_list .replay_detail img').each(function (index, ele) {
                        var _that = this;
                        var imgPath = $(ele).attr('imagepath');

                        //
                        if (typeof(imgPath) != 'undefined' && imgPath != '') {
                            var parm = {resourceList: [{photoResId: imgPath}], size: 96};
                            _this.imageId = _this.imageId + 1;
                            $(ele).attr('imageId', _this.imageId);

                            var mineType=$(ele).data('minetype');
                            mineType=mineType?mineType:'image/png'
                            _this.imageList.push({resId: imgPath, mineType:mineType})

                            try {

                                window.lxpc.exebusinessaction('DownloadResource', 'ReplyHeaderImage', sNoticeId.toString(), JSON.stringify(parm), _this.imageId, function (status, result, targ) {
                                    if (status == '0') {
                                        if (result && result.indexOf('\\') > -1) {
                                            $('#content_Se .content_right .replay_list .replay_detail img[imageId="' + targ + '"]').attr('src', result)
                                        }


                                    } else {
                                        console.log(status)

                                    }
                                })

                            } catch (e) {

                                console.log(e.message)
                            }


                        }

                    });

                    if (_this.scroll_Se_R != null) {
                        _this.scroll_Se_R.refresh();
                    }


                    //添加头像


                } else {
                    console.log("error")
                }

            })


        }
        catch (e) {
            console.log(e.message)
        }


    },
    //查看某个通知的确认情况
    bindConfirmlist: function bindConfirmlist() {
        var _this = this;
        $('.content_right .detail .status_send').on('click', function () {
            //获取接受通知的详情
            var sNoticeId = $('#content_Se .content_right .detail').attr('NoticeId'),
                record = $('#content_Se .content_right .detail').attr('record');

            if ($("#content_Se .content_right .unNotarize").length == 0) {
                var parm = {optionId: 0, operationType: 3, batchSize: 20, lastServerRecId: 0, recordDomain: record};
                try {
                    window.lxpc.exebusinessaction('notice', 'QueryNoticeMember', sNoticeId.toString(), JSON.stringify(parm), 0, function (status, datalist, targ) {

                        if (status == '0') {

                            var NoticeMemeber = JSON.parse(datalist)['noticeMemberList'];
                            var confirmList = [],
                                unconfirmList = [];

                            for (var i = 0; i < NoticeMemeber.length; i++) {
                                var curMember = NoticeMemeber[i];
                                var status = curMember["status"];
                                if (status == '2') {
                                    confirmList.push(curMember);//确认
                                } else if (status == '0') {//未确认
                                    unconfirmList.push(curMember);
                                } else {

                                }

                            }

                            var strR = '';
                            strR += '<div class="unNotarize" style="display: block">';

                            if (unconfirmList.length > 0) {

                                strR += '<h6>未确认( ' + unconfirmList.length + ' ) <span class="remind">追一下&gt;</span></h6><ul>';

                                for (var i = 0; i < unconfirmList.length; i++) {

                                    strR += '<li><img imagepath="' + unconfirmList[i]['photoResId'] + '" src="./images/defuser.png" alt=""><span>' + XssToString(unconfirmList[i]['name']) + '</span></li>'
                                }
                                strR += '</ul><div style="clear: both"></div>';
                            }


                            if (confirmList.length > 0) {
                                strR += '<h6>已确认( ' + confirmList.length + ')</h6>';
                                strR += '<ul>';
                                for (var k = 0; k < confirmList.length; k++) {

                                    strR += '<li><img src="./images/defuser.png" alt="" imagepath="' + confirmList[k]['photoResId'] + '" data-minetype="'+confirmList[k]['mineType']+'" ><span>' + XssToString(confirmList[k]['name']) + '</span></li>';
                                }

                                strR += '<li style="clear: both"></li></ul><div style="clear: both"></div>'
                            }

                            strR += '<div class="out"><div class="in"></div></div></div>';

                            $("#content_Se .content_right .detail ").after(strR);


                            $('.unNotarize li img').each(function (index, ele) {

                                //获取头像
                                var $ele = $(ele)
                                var imgstr = $ele.attr('imagepath');

                                if (typeof (imgstr) != 'undefined' && imgstr != '') {

                                    var parm = {resourceList: [{photoResId: imgstr}], size: 96};
                                    _this.imageId = _this.imageId + 1;
                                    $ele.attr('imageId', _this.imageId);

                                    var mineType=$(ele).data('minetype');
                                    mineType=mineType?mineType:'image/png'
                                    _this.imageList.push({resId: imgstr, mineType:mineType})

                                    try {

                                        window.lxpc.exebusinessaction('DownloadResource', 'HeaderImage', sNoticeId.toString(), JSON.stringify(parm), _this.imageId, function (status, result, targ) {
                                            if (status == '0') {

                                                if(result&&result.indexOf('\\')>-1){
                                                    $('.unNotarize li img[imageId="' + targ + '"]').attr('src', result);
                                                    _this.scroll_Se_R.refresh();
                                                }

                                            }

                                        });

                                    } catch (e) {
                                        console.log(e.message)
                                    }
                                }

                            })


                            $('#content_Se  .content_right  .unNotarize .remind').on('click', function () {

                                try {
                                    var curDeatil = $('#content_Se .content_right .detail'),
                                        sNoticeId = curDeatil.attr('NoticeId'),
                                        record = curDeatil.attr('record');

                                    var parm = {appCode: '', recordDomain: record}

                                    window.lxpc.exebusinessaction('notice', 'RemindCall', sNoticeId.toString(), JSON.stringify(parm), 0, function (status, result, targ) {

                                        if (status == '0') {
                                            my_layer({message: '已成功发出电话提醒'}, 'success')
                                        } else {
                                            my_layer({message: '电话提醒未确认通知的人员失败'}, 'success')
                                        }

                                    })

                                } catch (e) {
                                    console.log(e.message)

                                }

                            })


                        } else {
                            my_layer({message: '调用接口出错'}, 'error');
                        }
                    })
                }
                catch (e) {

                    console.log(e.message);
                }


            }

            if ($("em", $(this)).hasClass('show_unReplay')) {
                $("em", $(this)).removeClass('show_unReplay').addClass('close_unReplay');
                $(" .content_right  .reply_area").hide();
                $(".content_right  .unNotarize").show();
            } else {
                $("em", $(this)).removeClass('close_unReplay').addClass('show_unReplay');
                $(" .content_right  .reply_area").show();
                $(".content_right  .unNotarize").hide();
            }

            _this.refrashIscroll();
        });

    },
    //添加联系人
    addContct: function () {
        var _this = this;
        $(".addcontacts").show();


        //$(".sendTo li:not('.addPerson')").remove();

        this.Contacts = new Contacts('#addcontacts');
        this.Contacts.ConfirmContact('#addcontacts', function (Contactslist) {


            if(Contactslist.length==0){

                my_layer({message:'请选择联系人或组织'},'warn');
                return;

            }

            $('#addcontacts').hide();
            _this.Contactlist = [];
            //$('#addcontacts').empty();
            //_this.Contactlist = Contactslist;
            var str = '';

            for (var i = 0; i < Contactslist.length; i++) {

                var curContact = Contactslist[i];
                var userUniId = curContact.userUniId;
                var name = XssToString(curContact.name);
                var ImgePath = curContact.ImgePath;
                var isexisted = false;

                var Perlists = $(".sendTo li:not('.addPerson')");

                for (var j = 0; j < Perlists.length; j++) {
                    var $ele = $(Perlists[j]);
                    if ($ele.attr('userid') == userUniId) {
                        isexisted = true;
                        return;
                    }
                }


                if(curContact.type==1){
                    name=name+'<i class="contact_info">外</i>'
                }

                if (!isexisted) {
                    _this.Contactlist.push(curContact);
                    //var index= _this.Contactlist.length;

                    str += '<li userid="' + curContact.userUniId + '" onclick="delCotants(this)" isstruct="' + curContact.isstruct + '"><img src="' + ImgePath + '" alt=""><span>' + name + '</span></li>'
                }

            }

            $('.sendTo').append(str);

        })
        //this.Contacts.Closecontacts('#addcontacts',function () {
        //    //$('#addcontacts').hide();
        //
        //})

    },
    ReplyNotice: function ReplyNotice(sNoticeId, parm) {
        var _this = this;
        try {

            window.lxpc.exebusinessaction('notice', 'ReplyNotice', sNoticeId.toString(), JSON.stringify(parm), 0, function (status, Notice, targ) {
                if (status == '0') {

                    if (_this.typeInfo == '1') {

                        $('#content_Re .content_right .reply_content .reply_input').val('');

                        for (var i = 0; i < _this.DataList.length; i++) {
                            var data = _this.DataList[i]
                            if (data['noticeDetail']['noticeEntity'].id == sNoticeId) {
                                var reply = data['noticeDetail']['noticeEntity'].replyCount;
                                data['noticeDetail']['noticeEntity'].replyCount = reply + 1;

                                $('#content_Re .content_left .detail').each(function (index, ele) {
                                    if ($(this).attr('NoticeId') == sNoticeId) {

                                        var dreplycount = data['noticeDetail']['noticeEntity'].replyCount;

                                        $(this).find('.replycount').html(dreplycount);

                                        $('#content_Re  .content_right .reply_area h6').html('回复(' + dreplycount + ')')

                                    }
                                });

                                break;
                            }
                        }
                    } else {
                        $('#content_Se .content_right .reply_content .reply_input').val('');
                        for (var i = 0; i < _this.DataListSend.length; i++) {
                            var data1 = _this.DataListSend[i];

                            var noticeDetail = null;

                            if (data1.isNewCreate) {
                                noticeDetail = data1;
                            } else {
                                noticeDetail = data1['noticeDetail'];
                            }

                            if (noticeDetail['noticeEntity'].id == sNoticeId) {
                                var reply = noticeDetail['noticeEntity'].replyCount;
                                noticeDetail['noticeEntity'].replyCount = reply + 1;

                                $('#content_Se .content_left .detail').each(function (index, ele) {
                                    if ($(this).attr('NoticeId') == sNoticeId) {

                                        var dreplycount = noticeDetail['noticeEntity'].replyCount;
                                        $(this).find('.replycount').html('回复 ' + dreplycount);
                                        $('#content_Se  .content_right .reply_area h6').html('回复(' + dreplycount + ')')
                                    }
                                });
                                break;
                            }
                        }
                    }

                    var aReplyContent = JSON.parse(Notice);

                    //str_secret = '<span style="color: #EC0000;">[私密回复]</span>'

                    //头像
                    var name = XssToString(aReplyContent['noticeMember']['name']),
                        replyType = aReplyContent.replyType;
                    if (typeof(name) == 'undefined' || name == '') {
                        name = '未知'
                    }
                    var imgPath = aReplyContent['noticeMember']['photoResId'];

                    var sTime = FormatTime(aReplyContent['createTime']);
                    var scontent = _this.htmlEncode(aReplyContent['content']);

                    scontent=XssToString(scontent)

                    if (replyType == 1) {//私密回复
                        scontent = scontent + '<span style="color: #EC0000;">[私密回复]</span>'
                    }

                    var str = '';
                    str += '<div class="replay_detail"><img imageId="' + _this.imageId + '" src="./images/defuser.png" alt="">';

                    str += '<span>' + name + '</span><span class="reply_time">' + sTime + '</span>';
                    str += '<p>' + scontent + '</p></div>';

                    if (_this.typeInfo == '1') {

                        $('#content_Re .content_right .replay_list').prepend(str);
                    } else if (_this.typeInfo == '2') {

                        $('#content_Se .content_right .replay_list').prepend(str);
                    }


                    var parm = {resourceList: [{photoResId: imgPath}], size: 96};
                    _this.imageId = _this.imageId + 1;

                    var mineType=aReplyContent['noticeMember']['mineType'];;
                    mineType=mineType?mineType:'image/png'
                    _this.imageList.push({resId: imgPath, mineType:mineType})


                    if (typeof(imgPath) != 'undefined' && imgPath != '') {
                        try {

                            window.lxpc.exebusinessaction('DownloadResource', 'HeaderImage', '0', JSON.stringify(parm), _this.imageId, function (status, result, targ) {
                                if (status == '0') {

                                    if(result&&result.indexOf('\\')>-1){
                                        if (_this.typeInfo == '1') {
                                            $('#content_Re .content_right .replay_list .replay_detail img:first').attr('src', result);
                                            _this.scroll_Re_R.refresh();
                                        } else if (_this.typeInfo == '2') {

                                            $('#content_Se .content_right .replay_list .replay_detail img:first').attr('src', result);
                                            _this.scroll_Se_R.refresh();
                                        }
                                    }


                                } else {

                                    console.log(status)
                                }
                            })

                        } catch (e) {
                            console.log(e.message)
                        }
                    } else {
                        _this.scroll_Se_R.refresh();
                    }

                } else {
                    my_layer({message: '调用接口出错，状态码' + status}, 'warn');
                }
            })
        }
        catch (e) {

            console.log(e.message)
        }


    },
    computeImgSize: function computeImgSize($ele, path, boxW) {
        var realWidth;//真实的宽度
        var realHeight;//真实的高度

        //var boxW = parseFloat($('#content_Re .content_right .detail p')[0].clientWidth);
        $("<img/>").attr("src", path).load(function () {
            realWidth = this.width;
            realHeight = this.height;
//如果真实的宽度大于浏览器的宽度就按照100%显示
            if (realWidth >= boxW) {
                realWidth = boxW * 0.6;
                realHeight = (boxW * 0.6 * realHeight) / this.width;
                $ele.css("width", realWidth + 'px').css("height", realHeight + "px");

            }
            else {//如果小于浏览器的宽度按照原尺寸显示
                $ele.css("width", realWidth + 'px').css("height", realHeight + 'px');
            }
        });

    },
    showNoNotice: function () {
        var desigin = '<div class="withoutContent" style="display:block;position: relative"><div style="position: absolute;top:0;left: 0;bottom: 0;right: 0;margin: auto;width: 60px;height: 80px;"><img src="./images/withoutdata.png" alt=""><span style="display: block;font-size: 14px;color: #ccc;">暂无通知</span></div></div>';
        $('.content').append(desigin);
        $('.content_Se').hide();
        $('.content_Re').hide();
    },
    //ConfirmContact: function () {
    //
    //    $('.contacts_right .btnOK').click(function () {
    //
    //        //绑定tree
    //        var str = '';
    //        $(".sendTo li:not('.addPerson')").remove();
    //        $('.SelecedContact li').each(function (index, ele) {
    //            var userid = $(ele).attr('userUniId');
    //            var imgpath = $('img', $(ele)).attr('src');
    //            var name = $('span', $(ele)).html();
    //            str += '<li userid="' + userid + '" onclick="delCotants(\'' + userid + '\')"><img src="' + imgpath + '" alt=""><span>' + name + '</span></li>'
    //
    //        });
    //        $('.addcontacts').hide();
    //        $('.sendTo').append(str);
    //        $(this).off();
    //    });
    //},
    //显示语音
    showvoice: function (resId, isSendNotice) {

        var _this = this;
        var str_voice = '<div class="att_con att_voice"><em></em><span>6' + '"' + '</span></div>'

        var $player = null;
        if (!isSendNotice) {
            $('#content_Re .content_right .detail p').append(str_voice);
            $player = $('#content_Re .att_voice')
        } else {

            $('#content_Se .content_right .detail p').append(str_voice);
            $player = $('#content_Se .att_voice')
        }

        var res_parm = {resourceList: [{resourceType: 'res_file', photoResId: resId, fileName: resId}]};

        //获取音频时长
        var path = '';
        var size;
        getVoiceLength(res_parm, function (result) {

            size = result.size;
            var time = ReSizeforTime(size);
            path = result.filePath;
            $('.att_voice span').html(time)

        })

        var timer = null;
        var timer_play = null;

        $player.click(function () {
            var $ele = $(this).find('em')

            if (timer) {

                clearInterval(timer);
                timer = null;
                $ele.css('backgroundPosition', '-32px');
                stopVoice();
                clearTimeout(timer_play);
                timer_play = null;

            } else {
                //音频播放动画
                timer = setInterval(function () {
                    var back = parseFloat($ele.css('backgroundPositionX'))
                    back = (back + 16) + 'px';
                    $ele.css('backgroundPosition', back);

                }, 200)
                var play_parm = {filePath: path}
                playVoice(play_parm, function () {
                    timer_play = setTimeout(function () {

                        clearInterval(timer);
                        timer = null;
                        $ele.css('backgroundPosition', '-32px');
                    }, size)

                })

            }


        })


    },
    showmap: function (content, isSendNotice) {
        var maplist = [];


        var reg = /\{([^}|]*)\|(\d{1,3}\.\d+,\d{1,3}\.\d+)\}/g
        var resetcontent = content.replace(reg, function () {

            maplist.push(arguments[2]);
            var item = arguments[0].split('|')[0].replace('{', '');
            return '<em style="background: url(./images/locationfill.png)" class="att_map"></em><a href="#" class="att_map_con" >' + item + '</a>'

        })

        var $content,
            $map;
        if (isSendNotice) {
            $content = $('#content_Se .content_right .detail p');
            $content.html(resetcontent);
            $map = $('#content_Se .att_map_con')
        } else {
            $content = $('#content_Re .content_right .detail p');
            $content.html(resetcontent);
            $map = $('#content_Re .att_map_con')
        }


        $map.click(function () {

            var $ele = $(this),
                index = $('.att_map_con').index($ele),
                loaction = maplist[index];

            var map_parm = {url: 'http://ditu.so.com/?q=' + loaction}

            openMap(map_parm, null)


        })

    },

    //注册接收通知回调
    Revicecallback: function () {
        var _this = this;

        try {

            window.lxpc.exebusinessaction('Notice', 'ReceiveNotice', '0', '', 1, function (status, data, targ) {

                var stype;//1：我发出的 2：我收到的我自己发的 3 我收到其他人发的通知
                var datalist = JSON.parse(data);
                if(!data){
                    return;
                }

                var action = datalist[0].action;

                switch (action) {
                    //0：增加 1:删除 2：修改
                    case 0:

                        ReceiveNotice(datalist);
                        break;
                    case 1:

                        backoutAnddelNotice(datalist);
                        break;
                    case 2:
                        EditNotice(datalist);
                        break;
                }
                function ReceiveNotice(datalist) {


                    var curdata;

                    var userId = datalist[0]['noticeDetail']['noticeEntity']['id'];

                    //已经存在所以不能新加
                    for (var i = 0; i < _this.DataList.length; i++) {
                        curdata = _this.DataList[i];
                        if (curdata['noticeDetail']['noticeEntity'].id == userId) {
                            return;
                        }
                    }

                    for (var i = 0; i < _this.DataListSend.length; i++) {
                        curdata = _this.DataListSend[i];
                        if (curdata['noticeDetail']['noticeEntity'].id == userId) {
                            return;

                        }
                    }

                    var myID = datalist[0]['noticeDetail']['selfMember']['userUniId']
                    if (datalist[0]['noticeDetail']['creatorMember']['userUniId'] == myID) {

                        if (datalist[0]['noticeDetail']['creatorMember']['receiver']) {
                            stype = 2;
                        } else {
                            stype = 1;
                        }

                    } else {
                        stype = 3;
                    }

                    var isNewReviceNotice = true;

                    switch (stype) {
                        case 1:
                            if ($('.content_Se .detail').length == 0) {
                                _this.DataListSend = datalist.concat(_this.DataListSend);
                                _this.bindData_Send(_this.DataListSend, isNewReviceNotice);
                            } else {
                                _this.DataListSend = datalist.concat(_this.DataListSend);
                                _this.bindData_Send(datalist, isNewReviceNotice);
                            }

                            break;
                        case 2:
                            if ($('.content_Se .detail').length == 0) {

                                _this.DataListSend = datalist.concat(_this.DataListSend);
                                _this.bindData_Send(_this.DataListSend, isNewReviceNotice);
                            } else {
                                _this.DataListSend = datalist.concat(_this.DataListSend);
                                ;
                                _this.bindData_Send(datalist, isNewReviceNotice);
                            }

                            _this.DataList = datalist.concat(_this.DataList);
                            _this.bindData_Receive(datalist, isNewReviceNotice);

                            break;
                        case 3:
                            _this.DataList = datalist.concat(_this.DataList);
                            _this.bindData_Receive(datalist, isNewReviceNotice);
                            break;

                    }

                }

                function backoutAnddelNotice(datalist) {

                    for (var i = 0; i < datalist.length; i++) {
                        if (typeof(datalist[0]['noticeDetail']['selfMember']) != 'undefined') {//删除别人的通知手机上不能删除别人发出的通知
                            return;
                        } else {//撤销自己发出的通知

                            var Noticeid = datalist[i]['noticeDetail']['noticeEntity'].id;
                            _this.backoutAnddelNotice(Noticeid);

                            if (datalist[i]['noticeDetail']['noticeEntity'].status == 0) {

                                var unRplyCount = parseInt($(".nav .count").html());
                                if (unRplyCount == 1) {

                                    $(".nav .count").html('');
                                    $('.receive span').removeClass('receive_left_17')

                                } else {

                                    $(".nav .count").html(unRplyCount - 1);
                                    if (unRplyCount < 10) {
                                        $('.receive span').removeClass('receive_left').addClass('receive_left_17')
                                    } else {
                                        $('.receive span').removeClass('receive_left_17').addClass('receive_left')
                                    }

                                }

                            }

                        }


                    }

                }

                function EditNotice(datalist) {

                    var sNoticeId = datalist[0]['noticeDetail']['noticeEntity'].id,
                        record = datalist[0]['noticeDetail']['noticeEntity'].recordDomain,
                        confirmCount = datalist[0]['noticeDetail']['noticeEntity'].confirmCount;
                    var curdata = _this.DataList[0];
                    var isSend = false, isReceive = false;

                    var isOtherAction=true;//操作是不是当前用户操作引起的
                    if(datalist[0].selfMember){
                        isOtherAction=false;
                    }

                    for (var i = 0; i < _this.DataList.length; i++) {
                        curdata = _this.DataList[i];

                        if (curdata['noticeDetail']['noticeEntity'].id == sNoticeId) {

                            if (curdata['noticeDetail']['noticeEntity'].confirmCount != confirmCount) {//在别的设备上确认通知

                                _this.confirmNotice(sNoticeId,isOtherAction);

                                if(isOtherAction){
                                   return;
                                }
                                //判断当前的详情页是不是发生变化的

                                if (_this.typeInfo == 1) {

                                    if ($("#content_Re .content_right .detail").attr('NoticeId') == sNoticeId) {
                                        $('#btnOk').hide();
                                        $(".reply_content").show();
                                    }
                                }
                                return;
                            }

                            if (curdata['noticeDetail']['noticeEntity'].replyCount == datalist[0]['noticeDetail']['noticeEntity'].replyCount) {

                                return;//自己当前设备触发的不进行操作
                            }
                            isReceive = true;


                            break;
                        }
                    }

                    var curdata2 = _this.DataListSend[0];
                    for (var i = 0; i < _this.DataListSend.length; i++) {
                        curdata2 = _this.DataListSend[i];
                        if (curdata2['noticeDetail']['noticeEntity'].id == sNoticeId) {
                            if (curdata2['noticeDetail']['noticeEntity'].replyCount == datalist[0]['noticeDetail']['noticeEntity'].replyCount) {
                                return;//自己当前设备触发的不进行操作
                            }
                            isSend = true;
                            if (isReceive = true) {
                                curdata['noticeDetail']['noticeEntity'].replyCount = curdata['noticeDetail']['noticeEntity'].replyCount + 1;
                            } else {
                                curdata2['noticeDetail']['noticeEntity'].replyCount = curdata2['noticeDetail']['noticeEntity'].replyCount + 1;
                            }

                            break;
                        }
                    }


                    var curNoticeId_Se = $('.content_Se .content_right .detail').attr('NoticeId');
                    var curNoticeId_Re = $('.content_Re .content_right .detail').attr('NoticeId');
                    var stype;

                    if (_this.typeInfo == 1) {
                        if (isReceive) {
                            if (curdata['noticeDetail']['noticeEntity'].id == curNoticeId_Re) {//当前处于详情页状态
                                stype = 1;
                            } else {
                                stype = 2
                            }
                        } else {
                            stype = 3
                        }

                    } else if (_this.typeInfo == 2) {
                        if (isSend) {
                            if (curdata2['noticeDetail']['noticeEntity'].id == curNoticeId_Se) {//当前处于详情页状态
                                stype = 4
                            } else {
                                stype = 5
                            }
                        } else {
                            stype = 6
                        }
                    }
                    RelyNotice(datalist[0], stype, sNoticeId, record)

                }

                function RelyNotice(curData, stype, sNoticeId, record) {

                    var dreplycount;
                    if (_this.typeInfo == 1) {
                        $('#content_Re .content_left .detail').each(function (index, ele) {
                            if ($(this).attr('NoticeId') == sNoticeId) {
                                dreplycount = curData['noticeDetail']['noticeEntity'].replyCount;
                                $(this).find('.replycount').html('回复 ' + dreplycount);
                            }
                        });
                    } else if (_this.typeInfo == 2) {
                        $('#content_Se .content_left .detail').each(function (index, ele) {
                            if ($(this).attr('NoticeId') == sNoticeId) {
                                dreplycount = curData['noticeDetail']['noticeEntity'].replyCount;
                                $(this).find('.replycount').html('回复 ' + dreplycount);
                            }
                        });
                    }

                    if (stype == 1) {

                        if (_this.curNoticeId == sNoticeId) {
                            return;
                        } else {
                            _this.curNoticeId = sNoticeId
                            _this.bindReviceRight(_this.DataList, sNoticeId, record);
                        }

                    } else if (stype == 2) {
                        if (_this.curNoticeSendId == sNoticeId) {
                            return;
                        } else {
                            _this.curNoticeSendId = sNoticeId
                            _this.bindSendRight(_this.DataListSend, sNoticeId, record)
                        }

                    }

                }


            })


        } catch (e) {
            console.log(e.message)
        }


    },

    //删除并撤销通知
    backoutAnddelNotice: function (sNoticeId) {
        var _this = this;

        var unRplyCount = parseInt($(".nav .count").html());


        $('#content_Se .content_left .detail').each(function (index, ele) {

            if ($(this).attr('NoticeId') == sNoticeId) {
                $(this).remove();
                _this.scroll_Se_L.refresh();
                var NoticeId = $('#content_Se .content_left .detail:eq(0)').attr('NoticeId'),
                    record = $('#content_Se .content_left .detail:eq(0)').attr('record');
                for (var i = 0; i < _this.DataListSend.length; i++) {
                    var curNotice;

                    if (_this.DataListSend[i].isNewCreate) {
                        curNotice = _this.DataListSend[i];

                        if (sNoticeId == curNotice['noticeEntity'].id) {
                            _this.DataListSend.splice(i, 1);
                            i--;
                            if (_this.DataListSend.length == 0) {
                                _this.showNoNotice();
                            }
                        }
                        else {
                            if (curNotice['noticeEntity'].id == NoticeId) {
                                _this.bindSendRight(_this.DataListSend[i], NoticeId.toString(), record, true);
                            }
                        }

                    } else {
                        curNotice = _this.DataListSend[i]['noticeDetail'];
                        if (curNotice['noticeEntity'].id == sNoticeId) {
                            _this.DataListSend.splice(i, 1);
                            i--;
                            if (_this.DataListSend.length == 0) {
                                _this.showNoNotice();
                            }

                        } else {
                            if (curNotice['noticeEntity'].id == NoticeId) {
                                _this.bindSendRight(_this.DataListSend, NoticeId.toString(), record);

                            }
                        }

                    }

                }
                ;


            }

        });


        for (var j = 0; j < _this.DataList.length; j++) {
            var tempNotice = _this.DataList[j];
            if (tempNotice['noticeDetail']) {
                tempNotice = tempNotice['noticeDetail'];
            }
            var NoticeId = tempNotice['noticeEntity']['id'];

            if (sNoticeId == NoticeId) {

                _this.DataList.splice(j, 1);
                //var unconfirmCount = $(".nav .count").html();
                //$(".nav .count").html(unconfirmCount - 1)
                break;
            }
        }

        $('#content_Re .content_left .detail').each(function (index, ele) {

            if ($(this).attr('NoticeId') == sNoticeId) {
                $(this).remove();

                var NoticeId = $('#content_Re .content_left .detail:eq(0)').attr('NoticeId'),
                    record = $('#content_Re .content_left .detail:eq(0)').attr('record');


                if (_this.curNoticeId == sNoticeId) {
                    return;
                } else {
                    _this.curNoticeId = sNoticeId
                    _this.bindReviceRight(_this.DataList, sNoticeId.toString(), record);
                }

                //$(".nav .count").html($('#content_Se .content_left .detail').length);
            }
        })

    },
    //修改通知（确认）
    confirmNotice: function (sNoticeId,isOtherAction) {

        var _this = this;
        var Noticelist = $('#content_Re .content_left .detail');
        if(!isOtherAction){
            var $del = $('.content_Re .content_right .del');

            $del.css('background-position', '0px');

            $del.hover(function () {
                $(this).css('background-position', '-35px')
            }, function () {
                $(this).css('background-position', '0px')
            })
            $('#content_Re .content_right .detail').attr('status', 2);

        }


        for (var i = 0, ln = Noticelist.length; i < ln; i++) {
            var $ele = $(Noticelist[i]);

            if ($ele.attr('NoticeId') == sNoticeId) {
                 if(!isOtherAction){
                     $('.status_L', $ele).html('已确认').removeClass('Fonthigh').addClass('repCount');
                     $('i', $ele).removeClass('Uncon');
                     $('#content_Re .content_right .detail .status').html('已确认');
                 }


                for (var j = 0; j < _this.DataList.length; j++) {
                    var tempNotice = _this.DataList[j];
                    if (tempNotice['noticeDetail']) {
                        tempNotice = tempNotice['noticeDetail'];
                    }
                    var NoticeId = tempNotice['noticeEntity']['id']

                    if (sNoticeId == NoticeId) {

                        tempNotice['noticeEntity'].confirmCount = tempNotice['noticeEntity'].confirmCount + 1;

                        if(isOtherAction){
                           return;
                        }

                        tempNotice['selfMember']['status'] = 2;

                        var unconfirmCount = parseInt($(".nav .count").html());
                        unconfirmCount = unconfirmCount - 1;

                        $(".nav .count").html(unconfirmCount);

                        if (unconfirmCount == 0) {
                            $(".nav .count").html('');
                            $('.receive span').removeClass('receive_left_17')
                        } else {
                            if (unconfirmCount < 10) {
                                $('.receive span').removeClass('receive_left').addClass('receive_left_17')
                            } else {

                                $('.receive span').removeClass('receive_left_17').addClass('receive_left')
                            }
                        }


                        return;
                    }

                }
                return;
            }

        }


        //Noticelist.each(function (index, ele) {
        //    var $ele = $(ele);
        //
        //    if ($ele.attr('NoticeId') == sNoticeId) {
        //
        //        $('.status_L', $ele).html('已确认');
        //        $('.status_L', $ele).removeClass('Fonthigh').addClass('repCount');
        //        $('i', $ele).removeClass('Uncon');
        //        $('#content_Re .content_right .detail .status').html('已确认');
        //
        //        for (var j = 0; j < _this.DataList.length; j++) {
        //            var tempNotice = _this.DataList[j];
        //            if (tempNotice['noticeDetail']) {
        //                tempNotice = tempNotice['noticeDetail'];
        //            }
        //            var NoticeId = tempNotice['noticeEntity']['id']
        //
        //            if (sNoticeId == NoticeId) {
        //
        //                tempNotice['selfMember']['status'] = 2;
        //
        //                var unconfirmCount = parseInt($(".nav .count").html());
        //                unconfirmCount = unconfirmCount - 1
        //                $(".nav .count").html(unconfirmCount);
        //
        //                if (unconfirmCount == 0) {
        //                    $(".nav .count").html('');
        //                    $('.receive span').removeClass('receive_left_17')
        //                } else {
        //                    if (unconfirmCount < 10) {
        //                        $('.receive span').removeClass('receive_left').addClass('receive_left_17')
        //                    } else {
        //
        //                        $('.receive span').removeClass('receive_left_17').addClass('receive_left')
        //                    }
        //                }
        //
        //
        //                return;
        //            }
        //
        //        }
        //        return false;
        //    }
        //})

    },
    parse: function parse(arg) {
        if (typeof ioNull != 'undefined') {
            return ioNull.emoji.parse(arg);
        }
        return '';
    },
    //HTML转义
    htmlEncode: function htmlEncode(str) {

        if (str == '' || typeof(str) == 'undefined' || str == null) {
            return ''
        }
        str = str.replace(/\?*/g, '');
        str = str.replace(/\\u0007/g, '');
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));

        return div.innerHTML;
    },
    //绑定附件
    bindAttachment: function (curNotice, newNotice) {
        var _this = this;

        newNotice = newNotice || curNotice

        var resId = newNotice['noticeEntity']['resId'];
        var filename = XssToString(newNotice['noticeEntity']['resourceName']);
        var attachtype = newNotice['noticeEntity']['attachmentType'];
        var sNoticeId = newNotice['noticeEntity']['id']
        var resMT = newNotice.noticeEntity.resourceMimeType;


        if (resMT == 'voice') {//音频
            var resId = newNotice.noticeEntity.resId;
            _this.showvoice(resId, false);
            return;
        }

        switch (attachtype) {///0 没有附件1 只有文件 2 只有图片附件 3.同时有文件附件和图片附件
            case 0://
                break;
            case 1:
                var strfile = '';
                var resourceType = newNotice['noticeEntity']['resourceMimeType']

                var times = FormatTime(newNotice['noticeEntity']['createTime'], 'dd/mm') + '月';
                var siconpath;
                if (resourceType == 'application/zip') {
                    siconpath = './images/ml_file_zip.png';
                } else if (resourceType == 'application/pdf') {
                    siconpath = './images/ml_file_pdf.png';
                } else {
                    siconpath = './images/ml_file_default.png';
                }

                strfile += '<div style=";" class="att_f"><img src="' + siconpath + '" style=""/><div style="height:72px;;position: relative;margin-top: -50px;margin-left: 70px"><div>';
                strfile += '<p style="width:140px ;overflow: hidden;text-overflow: ellipsis;height: 20px;padding: 0;margin: 0;white-space: nowrap">' + filename + '</p></div> <div style="margin-top: 6px">';
                strfile += '<em style=";margin-left: 5px;"></em><a href="javascript:;" class="aV_a">另存为</a><a href="javascript:;" class="aV_a">下载</a></div></div></div>';

                $('#content_Re .content_right .detail').append(strfile)
                break;
            case 2: //内容图片
                var ImgInContent = newNotice['noticeEntity']['resId'];


                if (typeof (ImgInContent) != 'undefined' && ImgInContent != '') {

                    var img = '<div><img src="./images/defpicture.png" alt=""></div>';
                    $('#content_Re .content_right .detail p').append(img);

                    try {

                        var parm = {resourceList: [{photoResId: ImgInContent}], size: 300};


                        var resMT=resMT?resMT:'image/png'
                        _this.imageList.push({resId: ImgInContent, mineType:resMT})


                        _this.imageId=_this.imageId+1;
                        window.lxpc.exebusinessaction('DownloadResource', 'ContentImage', sNoticeId.toString(), JSON.stringify(parm), _this.imageId, function (status, result, targ) {

                            if (status == 0) {

                                if(result&&result.indexOf('\\')>-1){
                                    var $img = $('#content_Re .content_right .detail p img');
                                    var boxW = parseFloat($('#content_Re .content_right .detail p')[0].clientWidth);
                                    _this.computeImgSize($img, result, boxW);
                                    $img.attr('src', result);
                                    _this.scroll_Re_R.refresh();


                                    $("#content_Re .content_right .detail p img").click(function (event) {


                                        var parm = {picturePath: result, resIdAry:_this.imageList , index: targ};

                                        try {
                                            window.lxpc.exebusinessaction('notice', 'ViewSrcPicture', '0', JSON.stringify(parm), 0, null)
                                        }
                                        catch (e) {

                                            console.log(e.message);
                                        }
                                        _this.mystopPropagation(event);

                                    })
                                }



                            } else {

                                console.log(status)
                            }
                        })

                    } catch (e) {
                        console.log(e.message)
                    }
                }
                break;
            case 3:
                break;
            default:
                break;
        }


        //下载

        if (attachtype == 1) {//有文件
            //初始化文件的状态

            var parm = {fileResId: resId};
            _this.FileId = _this.FileId + 1;

            $('.att_f').attr('targ', _this.FileId);
            var $down = $('.content_Re .aV_a:eq(1)'),
                $saveas = $('.content_Re .aV_a:eq(0)'),
                $box = $down.parents('.att_f');

            init_File(parm, _this.FileId, $down, $saveas, function () {

            });

            $down.click(function () {

                bindfiledown($down, $saveas, filename, resId, $box)
            })
            $saveas.click(function () {
                bindfilesaveAS($down, $saveas, filename, resId, $box)
            })
        }

    }


};

function delEle(id) {

    $('.SelecedContact  li').each(function (index, ele) {
        if ($(ele).attr('nodeid') == id) {
            $(ele).remove();
            $('.contacts_right h5').html('已选取' + $('.SelecedContact li').length + '人');
            var Nodeid = $(ele).attr('nodeid');


        }

    })

};
var notice
function delCotants(ele, id) {
    $(ele).remove();

};
function delAttanch() {
    $(".send_content .attachInfo").remove();
    $('.attach').removeClass('click_N');
    $(".send_content .attach").data('targ', false);
};

$(function () {

    ~function () {
        var desW = 850,
            winW = document.documentElement.clientWidth;
        document.documentElement.style.fontSize = winW / desW * 100 + "px";
    }();
    notice = new Notification();

});

