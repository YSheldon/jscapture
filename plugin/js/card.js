function Card() {

    //this.option = jQuery.extend(defopt, opt);
    this.myscroll = null;
    this.cardInfo = null;
    this.curUserId = null;
    this.dialogId = null;
    this.initInfo = null;
    this.blue = null;

    //this.type=type||0//1是群 0 是个人
    this.extraContent = null;//记录蓝名片信息用来转发蓝名片
    this.imgId = 0;
    //this.init();

}
Card.prototype = {
    constructor: Card,

    bindcloseWIn: function () {
        var _this = this;
        var oClose = document.getElementsByClassName('card_close')[0];
        oClose.onclick = function (e) {
            var ev = e || window.event;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }

            try {

                window.lxpc.closewnd();

            }
            catch (e) {
                console.log(e.message)
            }
        }
    },
    bindEvent: function () {
//编辑签名
        var _this = this;


        //发送邮件
        $('#email').click(function () {

            var parm = {email: this.innerHTML};
            _this.sendEmail(parm)

        })


    },
    sendEmail: function (parm) {//发送邮件

        var _this = this;
        try {
            //var parm = {};

            window.lxpc.exebusinessaction('PersonCard', 'SendEmail', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {

                } else {
                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }
    },
    //转发蓝名片
    transmitCard: function (userId, targ) {

        var _this = this;
        var type = 1

        if (userId.indexOf('qun') > -1 || userId.indexOf('Qun') > -1) {
            type = 2
        }

        var parm = {
            userMessage: {
                contentType: 19,
                direction: 1,
                sendingState: 1,
                extraContent: JSON.stringify(_this.extraContent),
                sender: _this.initInfo.curUserUniID,
                dialogId: userId,
                messageType: type

            }
        };

        try {

            window.lxpc.exebusinessaction('PersonCard', 'TransmitCard', '0', JSON.stringify(parm), targ, function (status, jsondata, targ) {

                if (status == 0) {

                } else {
                    //my_layer({message: '转发第' + targ + '个蓝名片失败'}, 'warn')
                }

            })
        }
        catch (e) {
            //my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }

    },
    //修改蓝名片
    ModifyCard: function (parm) {

        var _this = this;
        try {

            window.lxpc.exebusinessaction('PersonCard', 'ModifyCard', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {

                } else {

                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }
    },

    scroll: function () {
        var _this = this;
        var option = {
            probeType: 2,
            scrollbars: "custom",
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            preventDefault: false
        };

        _this.myscroll = new IScroll('#wrapper', option);


    },
    stopDefault: function (e) {
        var ev = e || window.event;
        if (ev.stopPropagation) {
            ev.stopPropagation();
        } else {
            ev.cancelBubble = true;
        }
    },
    showPhoto: function (parm, handle, targ, callback) {

        try {

            window.lxpc.exebusinessaction('DownloadResource', handle, '0', JSON.stringify(parm), targ, function (status, result, targ) {

                if (status == 0) {

                    if (result.indexOf('\\') > -1) {
                        if (Object.prototype.toString.call(callback) == '[object Function]') {

                            callback(result, targ);
                        }
                    }


                } else {


                    callback(result, targ);


                    console.log(status)
                }

            })
        }
        catch (e) {
            my_layer({message: '调用接口出错，错误码' + e.message}, 'error')
            console.log(e.message)
        }


    },
    blurforModifyCard(){
        var _this = this;

        $('.remark').focusin(function () {

            this.innerHTML = XssToString(this.getAttribute('content'))

        }).focusout(function () {

            var maxwidth = 28;//设置最多显示的字数
            var text = XssToString(this.innerHTML);
            this.setAttribute('content', this.innerHTML);
            if (text.length > maxwidth) {
                this.innerHTML = text.substring(0, maxwidth) + '...'
            }
            ;

            var remarkName = '',
                remarkDescr = '';
            $('.remark').each(function (index, ele) {
                var oparent = this.parentNode.parentNode;
                var olab = oparent.getElementsByTagName('label')[0];
                if (olab.innerHTML == '备注') {
                    remarkName = ele.getAttribute('content')
                } else {
                    remarkDescr = ele.getAttribute('content')
                }
            })

            if (_this.cardInfo.remarkName != remarkName || _this.cardInfo.remarkDescr != remarkDescr) {
                _this.cardInfo.remarkName = remarkName;
                _this.cardInfo.remarkDescr = remarkDescr;
                var parm = {userUniId: _this.dialogId, remarkName: remarkName, remarkDescr: remarkDescr}
                _this.ModifyRemark(parm)
            }

        })


    },
    //修改备注
    ModifyRemark: function (parm) {
        var _this = this;
        try {

            window.lxpc.exebusinessaction('PersonCard', 'ModifyRemark', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {
                    _this.myscroll.refresh();
                } else {

                    my_layer({message: '网络异常'}, 'warn')
                }

            })

        } catch (e) {
            my_layer({message: '调用接口异常，错误码' + e.message}, 'error')
        }


    },
//接受转发联系人
    ReceiveSelectPeople: function (handle, cb) {
        var _this = this;

        try {
            var parm = {}

            window.lxpc.exebusinessaction(handle, 'ReceiveSelectPeople', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {

                    var data = JSON.parse(jsondata)

                    if (Object.prototype.toString.call(cb) == '[object Function]') {

                        cb(data)
                    }


                } else {

                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        } catch (e) {
            my_layer({message: '调用接口异常，错误码' + e.message}, 'error')
        }


    },
    //更换头像
    ModifyHeadIcon: function (strType) {
        var _this = this;
        try {

            window.lxpc.exebusinessaction(strType, 'OpenHeadIconSettingWindow', '0', _this.blue, 0, function (status, jsondata, targ) {

                if (status == 0) {

                } else {
                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }
    },
    //查看大图片
    viewPictures: function (parm) {
        //var parm = {picturePath: result};
        try {
            window.lxpc.exebusinessaction('ChatRecord', 'ViewSrcPicture', '0', JSON.stringify(parm), 0, null)
        }
        catch (e) {
            console.log(e.message);
        }
    },

    //手动设置消息免打扰
    ModifyQunData: function (handel, parm) {


        try {


            window.lxpc.exebusinessaction(handel, 'ModifyQunData', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {


                } else {
                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }

    },
    //手动给公号设置消息免打扰
    SetDialogAttr: function (handel, parm) {
        try {

//var parm={dialogId:'',attributeData:{muteType:1}} //1-关闭，2-开启
            window.lxpc.exebusinessaction(handel, 'SetDialogAttr', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {

                } else {
                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }

    },
//手动消息置顶
    SetTopDialog: function (parm) {

        var _this = this;
        try {

            window.lxpc.exebusinessaction('QunCard', 'SetTopDialog', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {


                } else {
                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }
    },
//获取置顶标志:
    GetUserDialog: function () {
        var _this = this;
        try {
            //var parm={dialogId:'23123'}//查询用户的ID（如果不传此字段，就返回这个群的所有用户信息）”｝
            var parm = {dialogId: _this.initInfo.dialogId}
            window.lxpc.exebusinessaction('QunCard', 'GetUserDialog', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {

                    var data = JSON.parse(jsondata);

                    if (data.topFlag == 1) {
                        $('#topFlag').addClass('cardA_checkEd')
                    } else {
                        $('#topFlag').removeClass('cardA_checkEd')
                    }


                } else {
                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }


    },
    //注册置顶标志更改回调
    ReceiveModifyTopFlag: function (handel) {
        var _this = this;
        try {

            window.lxpc.exebusinessaction(handel, 'ReceiveModifyTopFlag', '0', JSON.stringify({}), 0, function (status, jsondata, targ) {

                if (status == 0) {

                    var data = JSON.parse(jsondata)

                    if (data.topFlag == 1) {
                        $('#topFlag').addClass('cardA_checkEd')
                    } else {
                        $('#topFlag').removeClass('cardA_checkEd')
                    }


                } else {
                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }

    },
    //注册回调用于更新公号消息免打扰
    ReceiveModifyDialogAttr: function () {
        var _this = this;
        try {

            var parm = {dialogId: _this.initInfo.dialogId}

            window.lxpc.exebusinessaction('PersonCard', 'ReceiveModifyDialogAttr', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {

                    var data = JSON.parse(jsondata)

                    if (data[0].userDialog.muteFlag == 2) {
                        $('#muteFlag').addClass('cardA_checkEd')
                    } else {
                        $('#muteFlag').removeClass('cardA_checkEd')
                    }


                } else {
                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }

    },
    //ReceiveModifyHeadIcon
    ReceiveModifyHeadIcon: function (strType) {
        try {

            window.lxpc.exebusinessaction(strType, 'ReceiveModifyHeadIcon', '0', JSON.stringify({}), 0, function (status, jsondata, targ) {

                if (status == 0) {
                    var path = JSON.parse(jsondata).path;

                    $('.card_icon img').attr('src', path)

                } else {
                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')

        }
    }
}

function PersonCard() {
    this.init_bindevent();
    this.template = null;
    this.init();
}

PersonCard.prototype = new Card();
PersonCard.prototype.getData = function (parm) {
    var _this = this;
    try {

        window.lxpc.exebusinessaction('PersonCard', 'GetCardDetail', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {

                _this.blue = jsondata
                var data = JSON.parse(jsondata)
                var iserror = false
                if (jsondata) {
                    if (data.blueCardDetail) {
                        if (data.blueCardDetail.userCard) {
                            _this.binData(jsondata)
                            _this.bindEvent();
                        } else {
                            iserror = true;
                        }
                    } else {
                        iserror = true;
                    }

                } else {
                    iserror = true;
                }
                if (iserror) {
                    $('.card_Per .card_list').append(_this.template.children())
                }
                _this.seftBindEvent();


            } else {
                my_layer({message: '网络异常'}, 'warn')
            }

        })
    }
    catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


    }
};
PersonCard.prototype.init = function () {
    var _this = this;
    try {
        var parm = {};


        window.lxpc.exebusinessaction('PersonCard', 'InitFinished', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {

                var data = JSON.parse(jsondata),
                    dialogId = data.dialogId;


                if (!_this.template) {
                    _this.template = $('.card_Per .card_list').clone()
                }


                if (_this.dialogId == dialogId) {
                    return
                } else {
                    _this.dialogId = dialogId;
                }
                _this.initInfo = data;
                $('.content').html('');
                var ocardsend = document.getElementsByClassName('card_sendLX')[0];
                ocardsend.innerHTML = ''

                _this.curUserId = data.curUserUniID;

                if (data.dialogType == 3) {//工号蓝名片

                    $('.card_icon img').attr('src', 'images/card_theNo.png');
                    $('.sendCard').hide()//不可转发蓝名片
                    _this.QuerySpokespersonInfo()//获取公号的详情信息

                    //判断免打扰的状态
                    if (data.muteFlag == 0 || data.muteFlag == 1) {//免打扰关闭
                        $('#muteFlag').removeClass('cardA_checkEd')

                    } else {//免打扰打开
                        $('#muteFlag').addClass('cardA_checkEd')
                    }

                    _this.GetUserDialog();//获取置顶
                    _this.ReceiveModifyTopFlag('PersonCard');//注册回调来更新置顶信息
                    _this.ReceiveModifyDialogAttr();//注册回调用于更新公号消息免打扰


                } else {

                    $('.card_Per').show();
                    $('.card_No').hide();
                    $('.sendCard').show()//可转发蓝名片

                    $('.card_Per .card_list').empty();

                    var parm = {userUniId: dialogId}


                    $('.card_icon img').attr('src', 'images/card_icon.png');
                    _this.initSetting()
                    _this.getData(parm);
                    //注册回调 获取转发给蓝名片的联系人
                    _this.ReceiveSelectPeople('PersonCard', function (data) {

                        var userlist = data.userlist;
                        var TransmitCardId = 0
                        for (var i = 0; i < userlist.length; i++) {

                            var curUserId = userlist[i];

                            TransmitCardId += 1;
                            _this.transmitCard(curUserId, TransmitCardId)

                        }
                    });
                    //注册回调用来更改头像
                    _this.ReceiveModifyHeadIcon('PersonCard');
                }

                //显示头像
                var resID = _this.initInfo.photoResId;
                if (resID != '' && resID != null && typeof(resID) != 'undefined') {

                    var photo = {resourceList: [{photoResId: resID}], size: 96}
                    $('.card_icon img').data('view', false)
                    $('.card_icon img').data('resid', resID)

                    _this.showPhoto(photo, 'HeaderImage', 0, function (result, targ) {
                        if (result.indexOf('\\') > -1) {

                            var $img = $('.card_icon img').attr('src', result);
                            $img[0].onerror = function () {
                                this.src = 'images/defuser.png'
                            }
                            $('.card_icon img').data('view', true)
                        }

                    });


                } else {

                    $('.card_icon img').data('view', false)
                }
                if (data.name) {
                    document.getElementById('name').innerHTML = XssToString(data.name)
                }


            } else {

                my_layer({message: '网络异常'}, 'warn')
            }

        })
        _this.scroll();

    }
    catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


    }
};
PersonCard.prototype.binData = function (jsondata) {

    var _this = this;
    var data = JSON.parse(jsondata);

    if (data.blueCardDetail == null) {//不同组织的个人蓝名片
        if (_this.initInfo.curUserUniID.split('@')[1] != _this.initInfo.dialogId.split('@')[1]) {
            $('.card_sendLX a').html('添加联系人').data('type', 'addContact')

            var str = '<h4><span  class="card_i_name">' + XssToString(_this.initInfo.name) + '</span><span class="card_iR_card"><em></em><div class="card_iR_cSend"><a href="javascript:;">发送该名片</a></div></span></h4>'
            var titlebox = document.getElementsByClassName('card_i_r')[0]
            titlebox.innerHTML = str;


            _this.extraContent = {
                //id: userCard.id,
                //orgId: userCard.orgId,
                //orgMemberId: Member.id,
                //userId: userCard.userId,
                orgName: '',
                userUniId: _this.initInfo.dialogId,
                name: _this.initInfo.name,
                //position: _this.initInfo.position,
                //branchPath: Member.path,
                photoResId: _this.initInfo.photoResId,
                //registered: Member.registered

            }


            return;
        } else {

            $('.card_sendLX a').html('发蓝信').data('type', 'sendMessage')


        }


    } else {


        var userCard = data.blueCardDetail.userCard,
            Member = data.blueCardDetail.orgMemberList[0],
            visibleFlag = Member ? Member.visibleFlag : 0,
            sendPrivateMessage = Member ? Member.sendPrivateMessage : 1;


        if (visibleFlag == 1 || visibleFlag == 2) {//1：隐藏蓝名片，2：成员隐藏
            $('.card_sendLX a').html('添加联系人').data('type', 'addContact')
        } else {
            if (sendPrivateMessage == 0) {
                $('.card_sendLX a').html('发蓝信').css({background: '#ccc', cursor: 'default'}).data('type', '')
            } else {
                $('.card_sendLX a').html('发蓝信').data('type', 'sendMessage')
            }
        }

    }

    var userCard = data.blueCardDetail.userCard,
        Member = data.blueCardDetail.orgMemberList[0],
        branch = '',
        sex = userCard.sex,
        resID = _this.initInfo.photoResId,

        visibleFlag = Member ? Member.visibleFlag : 0;

    //if(Member){//#30729没有组织成员蓝名片
    if (!Member) {
        Member = userCard
    }

    var strName = XssToString(Member.name),
        path = XssToString(Member.path),
        strcompany = XssToString(Member.company);


    _this.extraContent = {
        id: userCard.id,
        orgId: userCard.orgId,
        orgMemberId: Member.id,
        userId: userCard.userId,
        orgName: '',
        userUniId: data.blueCardDetail.userUniId,
        name: userCard.name,
        position: Member.position,
        branchPath: Member.path,
        photoResId: userCard.photoResId,
        registered: userCard.registered

    }

    //}


    _this.initInfo.name = strName
    //判断可见性


    //判断是自己的蓝名片还是别人的蓝名片
    var isMyself = false;
    if (_this.curUserId == _this.dialogId) {
        isMyself = true;
    }

    //自己可以更改否则不能更改头像
    var oicon = document.getElementsByClassName('card_icon_edit')[0];
    if (isMyself) {

        oicon.style.display = 'block';
    } else {
        oicon.style.display = 'none';
    }


    if (!path) {
        branch = ''
    } else if (path.indexOf('-') > -1 && path.split('-').length == 1) {
        branch = '';
    } else if (path.indexOf('-') > -1 && path.split('-').length > 1) {
        branch = Member.path.substr(strcompany.length + 1).replace('-', ' ')
    } else {
        branch = path;
    }


    if (sex == 1) {
        $('.card_iR_sex').show()
        $('.card_iR_sex').addClass('card_iR_sexMan')
    } else if (sex == 2) {
        $('.card_iR_sex').show()
        $('.card_iR_sex').removeClass('card_iR_sexMan')
    } else {
        $('.card_iR_sex').hide()
    }

    if (strcompany) {

        document.getElementById('company').innerHTML = strcompany
    }

    if (branch) {

        document.getElementById('branch').innerHTML = branch
    }


    _this.myscroll.refresh();


    var strContent = '',
        sign = XssToString(userCard.sign),
        mobile = userCard.mobile,
        telephone = Member.telephone,
        email = Member.email,
        serialNumber = Member.serialNumber,//公号
        secondPosition = XssToString(Member.secondPosition),
        birthday = Member.birthday;
    var busiTags;
    busiTags = Member.busiTags
    if (busiTags != '' && busiTags != null && busiTags != 'undefined' && busiTags.length > 0) {
        busiTags = busiTags.join(',')
    }

    var birthday;
    if (Member.birthday) {
        birthday = FormatTime(Member.birthday, 'yyyy年mm月dd日')
    }

    var visibleType = 0
    if (visibleFlag / 1000 >= 1) {//可见标识 0：全部属性可见,1：隐藏蓝名片，2：成员隐藏
        visibleType = visibleFlag;
        visibleFlag = visibleFlag / 1000
    }
    else {
        visibleType = visibleFlag
    }

    var ary1 = [];
    ary1 = setShowcontent();

    function setShowcontent() {
        var ary1 = []
        var telphonelist = [],
            telephones = [];
        if (Member.contactExs) {

            telephones = Member.contactExs;
            var insert = 2;

            if (telephones.length > 0) {

                if (telephone == '') {

                    if (telephones.length == 1) {
                        var item = {name: '电话', value: telephones[0]};

                        telphonelist.push(item);
                    } else {
                        for (var k = 0; k < telephones.length; k++) {

                            var item = {name: '电话' + (k + 1), value: telephones[k]};

                            telphonelist.push(item);
                        }
                    }

                } else {
                    telphonelist.push({name: '电话1', value: telephone})

                    for (var k = 0; k < telephones.length; k++) {

                        var item = {name: '电话' + (k + 2), value: telephones[k]};

                        telphonelist.push(item);
                    }
                }


            } else {
                telphonelist.push({name: '电话', value: telephone})
            }
        } else {
            telphonelist.push({name: '电话', value: telephone})
        }
        //var  ary=[]

        if (visibleType == 1 || visibleType == 2) {

            ary1.unshift({name: '签名', value: '隐藏', attr: 'sign'})

        } else {
            if (isMyself) {
                ary1.unshift({name: '签名', value: sign, attr: 'sign', need: true})
            } else {
                ary1.unshift({name: '签名', value: sign, attr: 'sign'})
            }
        }


        if ((visibleFlag & 1) == 1 || visibleType == 1 || visibleType == 2) {
            ary1.push({name: '手机', value: '隐藏'})
        } else {

            ary1.push({name: '手机', value: mobile})
        }


        if ((visibleFlag & 2) == 2 || visibleType == 1 || visibleType == 2) {
            if (telphonelist.length > 1) {
                ary1.push({name: '电话1', value: '隐藏'})
            } else {
                ary1.push({name: '电话', value: '隐藏'})
            }

        } else {

            if (telphonelist.length > 1) {
                ary1.push(telphonelist[0])
            } else {
                ary1.push(telphonelist[0])
            }

        }

        if ((visibleFlag & 4) == 4 || visibleType == 1 || visibleType == 2) {
            if (telphonelist.length > 1) {
                ary1.push({name: '电话2', value: '隐藏'})
            }
        }
        else {
            if (telphonelist.length > 1) {
                ary1.push(telphonelist[1])
            }
        }

        if ((visibleFlag & 8) == 8 || visibleType == 1 || visibleType == 2) {
            ary1.push({name: '邮箱', value: '隐藏', attr: 'email', hide: true})
        } else {
            ary1.push({name: '邮箱', value: email, attr: 'email'})
        }


        return ary1;
    }


    var posiTags = ''
    if (Member.posiTags && Member.posiTags.length > 0) {
        posiTags = Member.posiTags.join('+')
    } else {
        posiTags = ''
    }

    var busiTags = ''
    if (Member.busiTags && Member.busiTags.length > 0) {
        busiTags = Member.busiTags.join(',')
    } else {
        busiTags = ''
    }


    var ary2 = [
        {name: '工号', value: serialNumber, attr: 'serialNumber'},
        {name: '职称', value: XssToString(Member.position), attr: 'position'},
        {name: '职务', value: XssToString(Member.secondPosition), attr: 'secondPosition'},
        {name: '生日', value: birthday, attr: 'birthday'},
        {name: '民族', value: Member.nation, attr: 'nation'},
        {name: '政治面貌', value: Member.politicsStatus, attr: 'politicsStatus'},
        {name: '党务职称', value: Member.partyCommitteeDuty, attr: 'partyCommitteeDuty'},
        {name: '岗位类别', value: posiTags, attr: 'posiTags'},
        {name: '业务类别', value: busiTags, attr: 'busiTags'},

    ]

    if (isMyself) {
        ary2.push({name: '备注', value: XssToString(data.blueCardDetail.remarkName), isEdit: true, attr: 'remarkName'})
    } else {
        ary2.push({
            name: '备注',
            value: XssToString(data.blueCardDetail.remarkName),
            isEdit: true,
            attr: 'remarkName',
            need: true
        })
    }

    var str = '';

    for (var i = 0; i < ary1.length; i++) {
        var item = ary1[i];

        var attr = item.attr ? item.attr : ''
        str += `<li class="${attr}">
                        <label class="card_l_leb">${item.name}</label>
                        <div class="card_l_r">`

        var content = XssToString(item.value) || '暂无'

        if (item.need) {

            str += ` <p class="card_edit"><span class="caname content" id="${item.attr}" content="${item.value}"></span><em class="card_edit_sign"></em></p>
                       `

        } else {
            if (item.attr == 'email') {
                if (item.hide) {
                    str += ` <p  class="content">${content}</p>`
                } else {
                    if (item.value != '') {
                        str += ` <p  ><a href="javascript:;" class="aV_a content" id="${item.attr}">${content}</a></p>`
                    } else {
                        str += ` <p id="${item.attr}" class="content">${content}</p>`
                    }

                }


            } else {
                str += ` <p id="${item.attr}" class="content">${content}</p>`
            }

        }

        str += ' </div></li>'
    }



    if (visibleType != 1 && visibleType != 2 && visibleType != 15000 && visibleType != 14000) {
        for (var i = 0; i < ary2.length; i++) {
            var item = ary2[i]
            if (!item.value && !item.need) {
                continue
            }
            var content = XssToString(item.value) || '暂无'

            str += `<li class="${item.attr}" ><label class="card_l_leb">${item.name}</label><div class="card_l_r">`
            if (item.need == true) {

                str += ` <p class="card_edit"><span class="caname content" id="${item.attr}" content="${item.value}"></span><em class="card_edit_sign"></em></p>
                       `

            } else {
                str += `<p id="${item.attr}" class="content">${item.value}</p>`
            }

            str += ` </div></li>`
        }
    }



    $(' .card_Per .card_list').append(str)


    $('.card_Per .card_list .caname').each(function(index,item){
        var $ele=$(item)
        var content =$ele.attr('content')
        console.log(content)
        console.log('KKKKKKKKKKKKK------------------')
        if(content==''){
            $ele.html('暂无')
        }else{

            str ="--!><img src='x' onerror='document.domain'>"
            $ele.html(XssToString(str))
        }

    })


    this.cardInfo = {
        id: userCard.id,
        resId: resID,
        name: strName,
        sign: sign,
        remarkDescr: data.blueCardDetail.remarkDescr,
        remarkName: data.blueCardDetail.remarkName
    }

    _this.myscroll.refresh();


};
//打开蓝信聊天窗口
PersonCard.prototype.sendMessage = function (parm) {

    try {

        window.lxpc.exebusinessaction('PersonCard', 'OpenDialogWnd', '0', JSON.stringify(parm), 0, null)
        try {

            window.lxpc.closewnd();

        }
        catch (e) {
            console.log(e.message)
        }

    } catch (e) {
        console.log(e.message)
    }

}
//绑定事件
PersonCard.prototype.seftBindEvent = function () {
    var _this = this;
    //发送蓝信
    $('.card_sendLX a ').click(function () {

        if ($(this).data('type') == 'addContact') {//添加联系人
            _this.AddContactByUserUniID();

        } else if ($(this).data('type') == '') {

        } else {
            var parm = {
                dialogId: _this.initInfo.dialogId,
                name: _this.initInfo.name,
                dialogType: 2,
                photoResId: _this.initInfo.photoResId
            };

            _this.sendMessage(parm)//发送蓝信
        }

        _this.stopDefault();
    })
    //鼠标滑过显示发送名片控件
    $('.sendCard').hover(function () {

        var width = document.getElementsByClassName('card_i_name')[0].offsetWidth;
        var ocard_Send = document.getElementsByClassName('card_iR_cSend')[0]

        if (width > 64) {
            ocard_Send.style.top = '-32px';
            ocard_Send.style.left = '-75px';
        } else {
            ocard_Send.style.top = '18px';
            ocard_Send.style.left = '7px';
        }
        ocard_Send.style.display = 'block';
    }, function () {

        var ocard_Send = document.getElementsByClassName('card_iR_cSend')[0];
        ocard_Send.style.display = 'none';
    })

    //转发蓝名片

    $('.card_iR_card em').click(function (e) {
        var ocard_Send = document.getElementsByClassName('card_iR_cSend')[0];
        ocard_Send.style.display = 'none';
        try {
            var code = _this.initInfo.code;
            var parm = {fromCode: code}
            window.lxpc.exebusinessaction('Transmit', 'SelectPeople', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
                if (status == 0) {


                } else {

                    my_layer({message: '网络异常'}, 'warn')
                }

            })


        } catch (e) {
            my_layer({message: '调用接口错误，错误码' + e.message})
        }


    })
//编辑签名

    $(".card_edit_sign").click(function () {
        var sSign = $(this).siblings(".caname");

        _this.Editinfo($(this), sSign, '', 28)

    });


}
PersonCard.prototype.init_bindevent = function () {

    var _this = this;

    $('.card_icon ').click(function () {
        var $img = $(this).find('img');

        if (_this.curUserId == _this.dialogId) {//好有名片支持发送信息

            _this.ModifyHeadIcon('PersonCard');
        } else {

            var path = $img.attr('src');
            var resId = $img.data('resid')

            var parm = {picturePath: path, resIdAry: [{resId: resId, mineType: 'image/png'}], index: 0};

            if ($img.data('view')) {
                _this.viewPictures(parm)
            }

        }
        _this.stopDefault();
    })


}
//编辑信息
PersonCard.prototype.Editinfo = function ($ele, $updated, attr, maxlength) {

    var $li = $ele.parents('li');
    if ($li.hasClass('sign')) {
        maxlength = 140

    } else if ($li.hasClass('remarkName')) {
        maxlength = 15
    }


    var _this = this;
    var $updated = $ele.siblings(".caname");
    var txt = XssToString($updated.html());

    if (txt == '暂无') {
        txt = ''
    } else {
        txt = XssToString(_this.cardInfo.sign)
    }
    var $card_edit = $ele.parents(".card_edit")
    var content = $updated.attr('content')

    $card_edit.append('<textarea  style="resize:none;width:100%;z-index: 100;overflow: auto" maxlength=' + maxlength + ' rows="2" type="text"  class="card_sign_focus  " />');

    var input = $(".card_sign_focus");
    input.val(txt)
    //_this.myscroll.refresh();
    $ele.parents(".card_edit").css("display", "block")
    input.click(function () {

        return false;
    });

    input.trigger("focus");

    if (content == '暂无' || content == null || content == 'undefined' || typeof(content ) == 'undefined') {
        content = ''
    }

    input.val(content)

    input.blur(function () {


        var newtxt = $(this).val();

        if (newtxt == '') {
            $updated.html('暂无');
            $(".card_edit").css("display", "inline-block");
            $updated.css("color", "#222")

        }
        else {
            //console.log(XssToString(newtxt))
            $updated.html(XssToString(newtxt));
            $updated.css("color", "#222")

            $(".card_edit").css("display", "inline-block");

            //wordNum();
        }

        input.remove();

        //if (newtxt == '') {
        //
        //
        //    $updated.html('暂无');
        //    $(".card_edit").css("display", "inline-block");
        //    $updated.css("color", "#222")
        //
        //}
        //else {
        //    $updated.html(newtxt);
        //    $updated.css("color", "#222")
        //
        //    $(".card_edit").css("display", "inline-block");
        //
        //    wordNum();
        //}

        _this.myscroll.refresh();
        var attr = ''

        if ($li.hasClass('sign')) {//修改签名

            if (_this.cardInfo.sign == newtxt) {
                return;
            }

            var parm = {
                card: {
                    userUniId: _this.dialogId,
                    sign: newtxt,
                    id: _this.cardInfo.id,
                    photoResId: _this.cardInfo.resId,
                    name: _this.cardInfo.name,

                }
            }
            _this.ModifyCard(parm)
            _this.cardInfo.sign = newtxt;
            $updated.attr('content', newtxt)
        }
        else if ($li.hasClass('remarkName')) {

            var remarkName = $('.remarkName').html()
            var remarkDescr = $('.remarkDescr').html()
            attr = 'remarkName'
            var parm = {userUniId: _this.dialogId, remarkName: newtxt, remarkDescr: remarkDescr}
            _this.ModifyRemark(parm)
            $updated.attr('content', newtxt)

        } else if ($li.hasClass('remarkDescr')) {


            var parm = {userUniId: _this.dialogId, remarkName: newtxt, remarkDescr: remarkDescr}
            $updated.attr('content', newtxt)
            _this.ModifyRemark(parm)
        }


    });

    //限制字数，超出显示省略号
    var wordNum = function () {
        $(".caname").each(function () {
            var maxwidth = 28;//设置最多显示的字数
            var text = $(this).text();
            if ($(this).text().length > maxwidth) {
                $(this).text(XssToString($(this).text()).substring(0, maxwidth));
                $(this).html(XssToString($(this).html()) + "...");

            }
            ;
        })
    }
    //wordNum();


}

//初始化设置
PersonCard.prototype.initSetting = function () {
    //支持发送蓝信

    var _this = this;
    var ismySelf = false;
    if (_this.curUserId == _this.dialogId) {//TRUE 个人名片 FALSE 好友名片
        ismySelf = true;
    }

    var $con = $('.card_con')[0];
    var $editlist = $('.card_edit_sign')

    if (!ismySelf) {//好有名片支持发送信息

        $con.style.height = (280 - 60) + 'px'
        $('.card_sendLX').append('<a href="javascript:;">发蓝信</a>')


        $editlist.each(function (index, ele) {
            var $edit = $(ele)
            var parent = $edit.parents('li')
            if (parent.hasClass('sign')) {
                $edit.hide()
            } else if (parent.hasClass('remarkName')) {
                $edit.show()
            }
        })

        $('.remarkName').show()
    } else {
        $con.style.height = 280 + 'px'
        $('.remarkName').find('em').show()
        $editlist.each(function (index, ele) {
            var $edit = $(ele)
            var parent = $edit.parents('li')
            if (parent.hasClass('remarkName')) {
                $edit.hide()
            } else if (parent.hasClass('sign')) {
                $edit.show()
            }
        })

        $('.remarkName').hide()

    }

    if (_this.initInfo.type == 'lxCard') {

        if (_this.initInfo.branchPath) {
            var spath = XssToString(_this.initInfo.branchPath);
            var branch = ''

            if (spath.split('-').length == 1) {
                branch = '';
            } else {
                branch = spath.substr(spath.length + 1).replace('-', ' ')
            }
            document.getElementById('company').innerHTML = branch
        }

    }


    //if(_this.initInfo.photoResId){

    //}


}
//将不同组织的人添加联系人
PersonCard.prototype.AddContactByUserUniID = function () {
    var _this = this;
    var parm = {userUniId: _this.initInfo.dialogId, name: _this.initInfo.name, photoResId: _this.initInfo.photoResId}
    $(this).data('type', '')
    try {
        window.lxpc.exebusinessaction('PersonCard', 'AddContactByUserUniID', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
            if (status == 0) {

                showtips('发送申请成功')
            } else {
                if (status == 1104) {
                    my_layer({message: '该联系人已经被邀请过, 请等待联系人验证...'}, 'warn')
                } else {
                    //my_layer({message: '申请发送失败'}, 'error')
                    showtips('申请发送失败')

                }
            }


        })
    } catch (e) {

    }

}
//绑定公号信息
PersonCard.prototype.QuerySpokespersonInfo = function () {
    var _this = this

    var parm = {userUniId: _this.initInfo.dialogId}
    var $con = $('.card_con')[0];
    $con.style.height = 280 + 'px'
    $('.card_Per').hide();

    $('.card_No').show();
    //$('.card_No.card_scroll_c').empty()


    try {
        window.lxpc.exebusinessaction('PersonCard', 'QuerySpokespersonInfo', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {

                var data = _this.blue = JSON.parse(jsondata)

                if (data.description) {
                    document.getElementById('card_NoName').innerHTML = XssToString(data.description)
                } else {
                    document.getElementById('card_NoName').innerHTML = '暂无'
                }


            } else {
                my_layer({message: '网络异常'}, 'warn')
            }

        })

    } catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')
    }

    //绑定事件
//免打扰
    $('.forbidSmsDown').click(function () {
        var $check = $(this).find('a')
        //$check.toggleClass('cardA_checkEd')
        var check = 0;
        if ($check.hasClass('cardA_checkEd')) {
            $check.removeClass('cardA_checkEd')
            check = 1
        } else {
            $check.addClass('cardA_checkEd')
            check = 2
        }


        var parm = {dialogId: _this.initInfo.dialogId, attributeData: {muteFlag: check}} //1-关闭，2-开启

        _this.SetDialogAttr('PersonCard', parm)


    })

    //消息置顶
    $('.topFlag').click(function () {
        var $check = $(this).find('a')
        //$check.toggleClass('cardA_checkEd')
        var check = 0;
        if ($check.hasClass('cardA_checkEd')) {
            $check.removeClass('cardA_checkEd')
            check = 0
        } else {
            $check.addClass('cardA_checkEd')
            check = 1
        }
        var parm = {dialogId: _this.initInfo.dialogId, SetTop: check}

        _this.SetTopDialog(parm)


    })


}


//群名片

function QunCard() {
    this.Assistlist = [];
    this.qunId = '';
    this.creatorUniId = '';
    this.role = 0;//0普通群成员 ，1群主 2群管理员
    this.maintainType = 0;
    this.myscroll = null;
    this.loadscroll();
    this.init_event()
    this.init();
}
QunCard.prototype = new Card();

QunCard.prototype.init = function () {
    var _this = this;
    var parm = {};


    window.lxpc.exebusinessaction('QunCard', 'InitFinished', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

        if (status == 0) {


            var data = JSON.parse(jsondata),
                dialogId = data.dialogId;


            if (_this.dialogId == dialogId) {

                if (data.type == 'setting') {//从设置窗口打开
                    if ($('.cardA_Con:eq(1)').hasClass('disN')) {
                        $('.cardA_Con').toggleClass('disN');
                        $('.cardA_tab a').toggleClass('cardA_tabLink')
                    }

                }
                return;
            } else {

                _this.dialogId = dialogId;
                $('.cardA_list_aid dl:not(".cardA_list_Mqz")').remove();

            }


            if (data.type == 'setting') {//从设置窗口打开
                $('.cardA_Con').toggleClass('disN');
                $('.cardA_tab a').toggleClass('cardA_tabLink')
            }


            _this.initInfo = data;
            var parm = {dialogId: dialogId, selfUniId: data.curUserUniID}
            _this.curUserId = data.curUserUniID;


            //显示群头像
            var resID = data.photoResId

            if (resID != '' && resID != null && typeof(resID) != 'undefined') {

                var photo = {resourceList: [{photoResId: resID}], size: 96}
                $('.card_icon img').data('view', false)
                _this.showPhoto(photo, 'HeaderImage', 0, function (result, targ) {
                    if (result.indexOf('\\') > -1) {
                        $('.card_icon img').attr('src', result);
                        $('.card_icon img').data('view', true)
                    }

                });
            } else {
                $('.card_icon img').attr('src', 'images/head_group.png');
                $('.card_icon img').data('view', false)
            }

            _this.getData(parm);
            //置顶标志更改回调
            _this.ReceiveModifyTopFlag('QunCard');
            //注册回调用来更改头像
            _this.ReceiveModifyHeadIcon('QunCard');

        } else {

            my_layer({message: '网络异常'}, 'warn')
        }

    })
    _this.loadscroll();
    _this._bindEvent();
}
QunCard.prototype.getData = function (parm) {
    var _this = this;
    try {

        window.lxpc.exebusinessaction('QunCard', 'GetCardDetail', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {

                _this.blue = JSON.stringify(JSON.parse(jsondata)[0])

                var data = JSON.parse(jsondata)[0]
                _this.creatorUniId = data.creatorUniId;
                if (data.creatorUniId == _this.initInfo.curUserUniID) {
                    _this.role = 1
                }

                _this.binData(jsondata)
                _this.bindEvent();
                _this._bindEvent();

                //回调用来转让群
                _this.ReceiveSelectPeople('QunCard', function (data) {

                    _this.SelectPeople(data);


                })

            } else {
                my_layer({message: '网络异常'}, 'warn')
            }

        })
    }
    catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


    }

    //获取群助理

    _this.GetAssistInfo()

}
QunCard.prototype.binData = function (jsondata) {

    var _this = this;
    var data = JSON.parse(jsondata)[0]
    var oQuntitle = document.getElementById('card_i_r')
    oQuntitle.innerHTML = '';
    var oQuntitle = document.getElementById('card_i_r')
    oQuntitle.innerHTML = '';
    var isAdmin = false;

    _this.qunId = data.id
    _this.maintainType = data.maintainType

    var name = XssToString(data.name)

    var str = `<h4 class="card_qunC"><span title="" class="card_i_name caname">${name}</span><em class="" id="edit_qunName"></em><span class="card_iR_card"><div class="card_iR_cSend"><a href="javascript:;">发送该名片</a></div></span></h4>
        	<p id="memberCount">${data.memberCount}人</p>`
    oQuntitle.innerHTML = str;

   $('.card_i_name').attr('title',data.name)


    //获取群主的头像
    document.getElementById('Qun_AName').innerHTML = XssToString(data.creatorName)

    ////获取所有群成员信息的信息
    //
    //
    //var parm = {dialogId: _this.initInfo.dialogId}
    //
    //_this.getQunMemberInfo(parm, 0, function (jsonresult) {
    //
    //})

    //获取群简介信息
    var introduction = data.introduction ? data.introduction : '暂无';
    document.getElementById('cardA_intro').innerHTML = XssToString(introduction)

    _this.myscroll.refresh()

    //初始化设置状态
    _this.SetInitStatus(data, isAdmin);


    _this.extraContent = {
        id: data.id,
        orgId: data.orgId,
        orgMemberId: data.id,
        userId: data.userId,
        //orgName: '',
        dialogId: data.dialogId,
        creatorUniId: data.creatorUniId,
        name: data.name,
        //position: data,
        //branchPath: data,
        photoResId: data.photoResId,
        //registered: data
        recordDomain: data.recordDomain

    }


};
QunCard.prototype.init_event = function () {
    var _this = this;
    //、、切换tab页
    $(".cardA_tab a").each(function (index) {
        $(this).click(function () {
            $(".cardA_Con").addClass("disN")
            $(".cardA_Con:eq(" + index + ")").removeClass("disN")
            $(".cardA_tab a").removeClass("cardA_tabLink")
            $(this).addClass("cardA_tabLink")
            _this.myscroll.refresh();
        })
    })

    var _this = this;

    //更改头像或是预览头像
    $('.card_icon ').click(function () {

        if (_this.role == 1 || _this.role == 2 || (_this.role == 0 && _this.maintainType == 0)) {
            _this.ModifyHeadIcon('QunCard');
        } else {

            if ($(this).data('view')) {
                var path = $(this).attr('src');
                var resId = $(this).data('resid')
                //var parm = {picturePath: path,index:0,resId:''}
                //{resId:curData['attachmentResId'],mineType:curData['mimeType']}
                var parm = {picturePath: path, resIdAry: [{resId: resId, mineType: 'image/png'}], index: 0};

                _this.viewPictures(parm)
            }
        }


        _this.stopDefault();

    })

    //G更改选中状态

    ////自定义多选按钮，点击改变背景图片

    $(".cardA_Admin .cardA_check").click(function () {

        if ($(this).parents('.cardA_Admin').length == 0) {
            return;
        }
        var $check = $(this)
        var $li = $(this).parents('li')
        modifyCard($li, $check)


        $(this).toggleClass("cardA_checkEd");
    })

    $(".cardA_Admin .cardA_opt_chb label").click(function () {
        if ($(this).parents('.cardA_Admin').length == 0) {
            return
        }

        var $li = $(this).parents('li')

        var $check = $(this).parents(".cardA_opt_chb").find(".cardA_check")
        modifyCard($li, $check)

        $check.toggleClass("cardA_checkEd");


    })


    function modifyCard($li, $ele) {

        var quninfo = JSON.parse(_this.blue)

        var attr = ''
        var newvalue = 0;


        if ($li.hasClass('forbidSmsDown')) {//修改消息免打扰
            if ($ele.hasClass('cardA_checkEd')) {
                newvalue = 0
            } else {
                newvalue = 1
            }


            var dataItemList = [{itemName: 'mute', itemValue: newvalue}]
            var parm = {recordDomain: quninfo.recordDomain, qunId: quninfo.id, dataItemList: dataItemList}
            //dataItemList=[{mute:1}]取值打开免打扰（1）或关闭免打扰（0）
            //var parm={}
            _this.ModifyQunData('QunCard', parm)


            return
        }
        if ($li.hasClass('topFlag')) {//消息置顶

            if ($ele.hasClass('cardA_checkEd')) {
                newvalue = 0
            } else {
                newvalue = 1
            }
            var parm = {dialogId: quninfo.dialogId, SetTop: newvalue}

            _this.SetTopDialog(parm)

            return
        }


        //修改群名片的基本信息
        if ($li.hasClass('maintainType')) {//管理群设置
            attr = 'maintainType'

        } else if ($li.hasClass('privacyFlag')) {//隐藏成员号码
            attr = 'privacyFlag'

        } else if ($li.hasClass('openFlag')) {//本群允许被搜索

            attr = 'openFlag'
            if ($ele.hasClass('cardA_checkEd')) {
                $('.cardA_addQuntype').hide();

                quninfo['confirmFlag'] = 0;
            } else {
                $('.cardA_addQuntype').show();
                quninfo['confirmFlag'] = 1;

            }

            _this.myscroll.refresh();
            _this.myscroll.scrollTo(0, _this.myscroll.maxScrollY)

        } else if ($li.hasClass('confirmFlag')) {

            attr = 'confirmFlag'
        }

        if ($ele.hasClass('cardA_checkEd')) {
            newvalue = 0
        } else {
            newvalue = 1
        }

        //var quninfo = JSON.parse(_this.blue)

        quninfo[attr] = newvalue;
        _this.blue = JSON.stringify(quninfo)

        _this.ModifyQun()
    }

//退出群
    $('#cardA_dissolveQ').click(function () {

        var $ele = $(this)
        var isAdmin = $ele.data('Admin')
        var quninfo = JSON.parse(_this.blue)

        if (isAdmin == 'true') {

            my_layer({message: '你确定要解散该群'}, 'confirm', function () {
                var parm = {qunId: quninfo.id}
                _this.DismissQun(parm)
            }, function () {
                return;
            })


        } else {

            my_layer({message: '你确定要退出该群'}, 'confirm', function () {
                var parm = {qunId: quninfo.id, recordDomain: quninfo.recordDomain}

                _this.ExitQun(parm)
            }, function () {
                return;
            })

        }

    })

    //更改群主

    $('#transmitQunA').click(function () {


        try {
            var code = _this.initInfo.code;
            var parm = {fromCode: code, dialogId: _this.initInfo.dialogId, creatorUniId: _this.creatorUniId}
            window.lxpc.exebusinessaction('Transmit', 'TransmitQunAdmi', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
                if (status == 0) {


                } else {

                    my_layer({message: '网络异常'}, 'warn')
                }

            })


        } catch (e) {
            my_layer({message: '调用接口错误，错误码' + e.message})
        }


    })

    //添加群助理
    $('#addQunAdmi').click(function () {
        try {
            var code = _this.initInfo.code;
            var parm = {
                fromCode: code,
                dialogId: _this.initInfo.dialogId,
                Assistlist: _this.Assistlist,
                creatorUniId: _this.creatorUniId
            }
            window.lxpc.exebusinessaction('Transmit', 'AddQunManager', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
                if (status == 0) {


                } else {

                    my_layer({message: '网络异常'}, 'warn')
                }

            })


        } catch (e) {
            my_layer({message: '调用接口错误，错误码' + e.message})
        }


    })

};
QunCard.prototype._bindEvent = function () {
    var _this = this;
    //编辑群名片的名字

    $("#edit_qunName").click(function (e) {

        var sSign = $(this).siblings(".caname");

        //console.log('HHHHHHHHHH---------------')
        //console.log(sSign[0].outerHTML)
        var txt = sSign.attr('title');
        //console.log(txt)
        //txt=`--!><img src="x"onerror="document.domain">`
        $(this).parents(".card_qunC").append('<input type="text" maxlength="30" value="" class="card_sign_focus2" />');


        var input = $(".card_sign_focus2");
        input.val(txt)
        input.click(function () {
            return false;
        });
        input.trigger("focus");

        input[0].select()
        input.blur(function () {

            input.remove();
            var newtxt = $(this).val();
            if (newtxt == '') {
                sSign.html(txt);
            }
            else {
                sSign.html(XssToString(newtxt));
                sSign.attr('title',newtxt)
            }

            ModifyCard('name', newtxt)

            _this.stopDefault()
        });

        input.keydown(function (e) {

            if (e.keyCode == 13) {
                input.trigger("blur");
            }
        })
        e.preventDefault();
        _this.stopDefault()
    });

////编辑群简介

    $(".card_edit_sign").click(function () {
        var canameF = $(".card_sign").find(".caname");
        var txt = XssToString(canameF.text());

        if (txt == '暂无简介') {
            var input = $('<div contenteditable="true" class="card_sign_focus3"></div>');
        }
        else {
            var input = $('<div contenteditable="true" class="card_sign_focus3">' + txt + '</div>');
        }

        canameF.html(input);

        input.click(function () {
            return false;
        });
        input.trigger("focus");
        input.blur(function () {
            input.remove();
            var newtxt = XssToString($(this).text());
            if (newtxt == '') {
                canameF.html("暂无简介");
                canameF.css("color", "#bbb")

            }
            else {
                canameF.html(newtxt);
                canameF.css("color", "#222")
            }

            ModifyCard('introduction', newtxt)


        });
    });


    function ModifyCard(attr, newvalue) {
        var quninfo = JSON.parse(_this.blue)

        if (quninfo[attr] == newvalue) {

        } else {
            if (newvalue == '') {

            } else {

                quninfo[attr] = newvalue;
                _this.blue = JSON.stringify(quninfo)

                _this.ModifyQun()
            }
        }

    }

};
//获取群成员信息
QunCard.prototype.getQunMemberInfo = function (parm, targ, cb) {
    var _this = this;
    try {
        //var parm={dialogId:'23123',userUniId:'12131232'}//查询用户的ID（如果不传此字段，就返回这个群的所有用户信息）”｝

        window.lxpc.exebusinessaction('QunCard', 'GetQunMemberInfo', '0', JSON.stringify(parm), targ, function (status, jsondata, targ) {

            if (status == 0) {
                if (Object.prototype.toString.call(cb) == '[object Function]') {

                    cb(jsondata, targ)
                }
            } else {
                my_layer({message: '网络异常'}, 'warn')
            }

        })
    }
    catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


    }
};
//获取群助理
QunCard.prototype.GetAssistInfo = function () {
    var _this = this;

    var parm = {dialogId: _this.initInfo.dialogId}

    try {
        //var parm={dialogId:'23123'}//查询用户的ID（如果不传此字段，就返回这个群的所有用户信息）”｝

        window.lxpc.exebusinessaction('QunCard', 'GetAssistQunOwnerInfo', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {

                var data = JSON.parse(jsondata)
                if (data.length == 0) {


                    return;
                } else {
                    var str = '';
                    for (var i = 0; i < data.length; i++) {

                        var curItem = data[i]

                        str += `<dl userUniId="${curItem.userUniId}">
                        	<dt><img src="images/card_icon.png" resId="${curItem.photoResId}" /><em class="cardA_list_del" ></em></dt>
                            <dd>${curItem.name}</dd>
                        </dl>
                    	`
                        _this.Assistlist.push(curItem.userUniId)
                    }
//var oadd=document.getElementById('cardA_list_Mqz')

                    $('.cardA_list_aid').prepend(str)
                    _this.myscroll.refresh()

                    $('.cardA_list_aid img').each(function (index, ele) {
                        var $ele = $(this)
                        _this.imgId = _this.imgId + 1
                        $ele.attr('targ', _this.imgId)
                        var resId = $ele.attr('resId')
                        var parm = {resourceList: [{photoResId: resId}], size: 96};

                        _this.showPhoto(parm, 'AmImage', _this.imgId, function (result, targ) {
                            if (result.indexOf('\\') > -1) {
                                $('.cardA_list_aid img[targ="' + targ + '"]').attr('src', result)
                            }


                        })


                    })

                    //绑定事件删除
                    $('.cardA_list_del').click(function () {
                        var $li = $(this).parents('dl')
                        var usetid = $li.attr('userUniId');

                        _this.Assistlist.splice(_this.Assistlist.indexOf(usetid), 1)
                        _this.SetAssistQunOwner(function (jsondata) {
                            $li.remove();

                        })

                    })

                    if (_this.role == 1) {//群主
                        $('.cardA_list_aid dl').hover(function () {

                            $(this).find('.cardA_list_del').css('display', 'block')
                        }, function () {

                            $(this).find('.cardA_list_del').css('display', 'none')
                        })

                    } else {
                        $(this).find('.cardA_list_del').css('display', 'none')
                    }


                }


            } else {
                my_layer({message: '网络异常'}, 'warn')
            }

        })
    }
    catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


    }

};

//设置初始化状态
QunCard.prototype.SetInitStatus = function (data, isAdmin) {
    var _this = this;


    new Promise(function (resolve, reject) {

        try {
            //var parm={dialogId:'23123',userUniId:'12131232'}//查询用户的ID（如果不传此字段，就返回这个群的所有用户信息）”｝
            var parm = {dialogId: _this.initInfo.dialogId}
            window.lxpc.exebusinessaction('QunCard', 'GetQunMemberInfo', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {

                    resolve(jsondata)

                } else {
                    my_layer({message: '网络异常'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


        }

    }).then(function (jsonresult) {

        var result = JSON.parse(jsonresult)
        document.getElementById('memberCount').innerHTML = result.length + '人';

        for (var i = 0; i < result.length; i++) {
            var item = result[i];
            var resId = item.photoResId;

            if (item.userUniId == _this.initInfo.curUserUniID) {

                if (item.roleCode == 'QUN-MEMBER') {
                    _this.role = 0
                } else if (item.roleCode == 'QUN-CREATOR') {
                    _this.role = 1
                } else if (item.roleCode == 'QUN-MANAGER') {
                    _this.role = 2
                }

                if (item.forbidSmsDown == 1) {//是否是消息免打扰的开关0的是关闭1是打开
                    $('#forbidSmsDown').addClass('cardA_checkEd')
                } else {
                    $('#forbidSmsDown').removeClass('cardA_checkEd')
                }
                if (item.userUniId == _this.creatorUniId) {

                    setphone(resId)

                }
            } else if (item.userUniId == _this.creatorUniId) {

                setphone(resId)
            }

        }
        if (data.maintainType == 1) {//管理权限
            $('#maintainType').addClass('cardA_checkEd')
        }
        else {
            $('#maintainType').removeClass('cardA_checkEd')
        }

        if (data.privacyFlag == 1) {//隐藏号码

            $('#privacyFlag').addClass('cardA_checkEd')
        }
        else {
            $('#privacyFlag').removeClass('cardA_checkEd')
        }

        if (data.openFlag == 1) {//是否公开本群

            $('#openFlag').addClass('cardA_checkEd')

            $('.cardA_addQuntype').show();

            if (data.confirmFlag == 1) {
                $('#confirmFlag').addClass('cardA_checkEd')
            } else {
                $('#confirmFlag').removeClass('cardA_checkEd')
            }


        }
        else {
            $('#openFlag').removeClass('cardA_checkEd')
            $('.cardA_addQuntype').hide()
        }
        var oicon = document.getElementsByClassName('card_icon_edit')[0];
        if (_this.role == 1) {
            $(".cardA_setting").removeClass('cardA_nonAdmin').addClass('cardA_Admin')
            $('.cardA_dissolveQ').html('解散退出该群')
            $('.cardA_dissolveQ').data('Admin', 'true')
            $('#introduction').addClass('card_edit_sign')

            $('#transmitQunA').show()
            $('#addQunAdmi').show()

//确定头像是不是可编辑

            if (_this.role == 1 || _this.role == 2 || (_this.role == 0 && data.maintainType == 0)) {
                oicon.style.display = 'block';
            } else {
                oicon.style.display = 'none';
            }

            $('#edit_qunName').addClass('card_edit_qunN')

        } else {

            if (_this.role == 2) {
                $('#introduction').addClass('card_edit_sign')
                $('#edit_qunName').addClass('card_edit_qunN')


                if (_this.role == 1 || _this.role == 2 || (_this.role == 0 && data.maintainType == 0)) {
                    oicon.style.display = 'block';
                } else {
                    oicon.style.display = 'none';
                }

            } else {
                if (data.maintainType == 0) {
                    $('#introduction').addClass('card_edit_sign')
                    $('#edit_qunName').addClass('card_edit_qunN')

                    if (_this.role == 1 || _this.role == 2 || (_this.role == 0 && data.maintainType == 0)) {
                        oicon.style.display = 'block';
                    } else {
                        oicon.style.display = 'none';
                    }
                } else {
                    $('#introduction').removeClass('card_edit_sign')
                    $('#edit_qunName').removeClass('card_edit_qunN')
                }
            }

            $(".cardA_setting").removeClass('cardA_Admin').addClass('cardA_nonAdmin')
            $('.cardA_dissolveQ').html('退出该群')
            $('.cardA_dissolveQ').data('Admin', 'false')

            //$('#addQunAdmi').remove()
            $('#transmitQunA').hide()
            $('#addQunAdmi').hide()


        }
        _this.myscroll.refresh()

    })


    function setphone(resId) {
        //var resId = item.photoResId;

        if (resId) {
            var parm = {resourceList: [{photoResId: resId}], size: 96};

            _this.imgId = _this.imgId + 1;

            _this.showPhoto(parm, 'MemberImage', _this.imgId, function (result, targ) {
                if (result.indexOf('\\') > -1) {
                    document.getElementById('Qun_AImg').src = result
                }


            })
        }
    }


    //是否置顶
    _this.GetUserDialog()


}

//解散群（群主调用）
QunCard.prototype.DismissQun = function (parm) {

    var _this = this;
    try {

        window.lxpc.exebusinessaction('QunCard', 'DismissQun', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {
                try {

                    window.lxpc.closewnd();

                }
                catch (e) {
                    console.log(e.message)
                }


            } else {
                my_layer({message: '网络异常'}, 'warn')
            }

        })
    }
    catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


    }
}
//解散群（群主调用）
QunCard.prototype.ExitQun = function (parm) {

    var _this = this;
    try {
        //var parm={qunId:'23123',recordDomain:''}

        window.lxpc.exebusinessaction('QunCard', 'ExitQun', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {

                try {

                    window.lxpc.closewnd();

                }
                catch (e) {
                    console.log(e.message)
                }


            } else {
                my_layer({message: '网络异常'}, 'warn')
            }

        })
    }
    catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


    }
}

//更改群基本信息
QunCard.prototype.ModifyQun = function () {
    var _this = this

    var _this = this;
    try {

        window.lxpc.exebusinessaction('QunCard', 'ModifyQun', '0', _this.blue, 0, function (status, jsondata, targ) {

            if (status == 0) {

                var data = JSON.parse(jsondata)


            } else {
                my_layer({message: '网络异常'}, 'warn')
            }

        })
    }
    catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


    }


}
//转让群主
QunCard.prototype.TransferQunOwner = function (parm) {

    var _this = this;
    try {
        //var parm={dialogId:'23123',qunId:'',newOwnerUserUniId:''}


        window.lxpc.exebusinessaction('QunCard', 'TransferQunOwner', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {

            } else {

                if (status == 2042) {
                    my_layer({message: '跨组织不能转让群主'}, 'warn')
                }

            }

        })
    }
    catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


    }


}
//2.	设置助理群主（添加和取消）
QunCard.prototype.SetAssistQunOwner = function (cb) {
    var _this = this;

    try {

        var parm = {dialogId: _this.initInfo.dialogId, qunId: _this.qunId, userUniIdList: _this.Assistlist}

        window.lxpc.exebusinessaction('QunCard', 'SetAssistQunOwner', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {

                if (Object.prototype.toString.call(cb) == '[object Function]') {
                    cb(jsondata)
                }


            } else {
                my_layer({message: '网络异常'}, 'warn')
            }

        })
    }
    catch (e) {
        my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


    }
}
//接受选择联系人
QunCard.prototype.SelectPeople = function (data) {
    var _this = this;
    if (data.code == 'transmit_qun_admi') {  //回调用来转让群

        //infolist.push({userUniId:usermemberlist[index],path:imgpath,name:name})

        var parm = {dialogId: _this.dialogId, userUniId: data.userlist[0].userUniId}//查询用户的ID（如果不传此字段，就返回这个群的所有用户信息）”｝

//获取新群主的信息
        $('#Qun_AImg').attr('src', data.userlist[0].path)
        $('#Qun_AName').html(XssToString(data.userlist[0].name))

        //调取转让群主的接口
        var parm = {dialogId: _this.dialogId, qunId: _this.qunId, newOwnerUserUniId: data.userlist[0].userUniId}

        _this.TransferQunOwner(parm)

//加入群助理里面有该成员的话就把他从群助理里面去掉
        $('.cardA_list_aid dl').each(function () {
            var $ele = $(this)
            if ($ele.attr('userUniId') == data.userlist[0]) {
                $ele.remove();
                _this.Assistlist.splice(_this.Assistlist.indexOf(data.userlist[0]))
            }

        })


    } else if (data.code == 'add_qun_manager') {//添加群助理


        var userlist = data.userlist

        for (var j = 0; j < userlist.length; j++) {

            var item = userlist[j].userUniId
            if (_this.Assistlist.indexOf(item) == -1) {
                _this.Assistlist.push(item)
            } else {
                userlist.splice(j, 1)
            }
        }

        _this.SetAssistQunOwner(function (jsondata) {

//获取新群主的信息

            var str = ''
            for (var j = 0; j < userlist.length; j++) {

                var curItem = userlist[j];
                str += `<dl userUniId="${curItem.userUniId}">
                        	<dt><img src="${curItem.path}"  /><em class="cardA_list_del" ></em></dt>
                            <dd>${curItem.name}</dd>
                        </dl>
                    	`
            }

            $('#addQunAdmi').before(str)

            _this.myscroll.refresh();

            //绑定事件删除
            $('.cardA_list_del').click(function () {
                var $li = $(this).parents('dl')
                var usetid = $li.attr('userUniId');
                $li.remove();
                _this.Assistlist.splice(_this.Assistlist.indexOf(usetid), 1)
                _this.SetAssistQunOwner(function (jsondata) {

                })

            })


            $('.cardA_list_aid dl').hover(function () {

                $(this).find('.cardA_list_del').css('display', 'block')
            }, function () {

                $(this).find('.cardA_list_del').css('display', 'none')
            })


        })

    }


}

QunCard.prototype.loadscroll = function () {

    var option = scrollSetings();
    this.myscroll = new IScroll('#wrapper3', option);

}

