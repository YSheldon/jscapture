function Card() {

    //this.option = jQuery.extend(defopt, opt);
    this.myscroll = null;
    this.cardInfo = null;
    this.curUserId = null;
    this.dialogId = null;
    this.initInfo = null;
    this.blue = null;
    //this.type=type||0//1是群 0 是个人
    this.extraContent = null;//记录蓝名片信息用来
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
        $('.open_Email').click(function () {

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
                    my_layer({message: '转发第' + targ + '个蓝名片失败'}, 'warn')
                }

            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')


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

                    if (Object.prototype.toString.call(callback) == '[object Function]') {

                        callback(result, targ);
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

            this.innerHTML = this.getAttribute('content')

        }).focusout(function () {

            var maxwidth = 28;//设置最多显示的字数
            var text = this.innerHTML;
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

}

function PersonCard() {
    this.init_bindevent();
    this.init();
}

PersonCard.prototype = new Card();
PersonCard.prototype.getData = function (parm) {
    var _this = this;
    try {

        window.lxpc.exebusinessaction('PersonCard', 'GetCardDetail', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {
                _this.blue = jsondata
                _this.binData(jsondata)
                _this.bindEvent();
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

                var ocardlist = document.getElementsByClassName('card_scroll_c')[0];
                ocardlist.innerHTML = ''
                var ocardsend = document.getElementsByClassName('card_sendLX')[0];
                ocardsend.innerHTML = ''

                var data = JSON.parse(jsondata),
                    dialogId = data.dialogId;
                _this.initInfo = data;
                var parm = {userUniId: dialogId}
                _this.curUserId = data.curUserUniID;
                _this.dialogId = dialogId;
                _this.isSendMsg()

                _this.getData(parm);
                _this.ReceiveSelectPeople('PersonCard', function (data) {

                    var userlist = data.userlist;
                    var TransmitCardId = 0
                    for (var i = 0; i < userlist.length; i++) {

                        var curUserId = userlist[i];

                        TransmitCardId += 1;
                        _this.transmitCard(curUserId, TransmitCardId)

                    }
                });


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
    var data = JSON.parse(jsondata)

    var userCard = data.blueCardDetail.userCard,
        Member = data.blueCardDetail.orgMemberList[0],
        strName = Member.name,
        path = Member.path,
        strcompany = Member.company,
        branch = '',
        sex = userCard.sex,
        resID = _this.initInfo.photoResId;
    _this.initInfo.name = strName
    //判断可见性

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
        registered: Member.registered

    }


    var visibleFlag = Member.visibleFlag;

    switch (visibleFlag) {
        case 0://全部属性可见

            break;
        case 2://联系方式不可见
            break;
        case 1000://全部属性不可见
            return;
            break;
        case 2000://隐藏手机号码
            break;

    }


    //判断是自己的蓝名片还是别人的蓝名片
    var isMyself = false;
    if (_this.curUserId == _this.dialogId) {
        isMyself = true;
    }
    //显示头像

    if (resID != '' && resID != null && typeof(resID) != 'undefined') {

        var photo = {resourceList: [{photoResId: resID}]}

        _this.showPhoto(photo, 'HeaderImage', 0, function (result, targ) {

            $('.card_icon img').attr('src', result);

        });
    } else {
        $('.card_icon img').attr('src', 'images/persion.png');
    }
    //自己可以更改否则不能更改头像
    var oicon = document.getElementsByClassName('card_icon_edit')[0];
    if (isMyself) {

        oicon.style.display = 'block';
    } else {
        oicon.style.display = 'none';
    }


    if (path.split('-').length == 1) {
        branch = '';
    } else {
        branch = Member.path.substr(strcompany.length + 1).replace('-', ' ')
    }

    var str = `<h4><span title="${userCard.name}" class="card_i_name">${strName}</span>`;

    if (sex == 1) {
        str += `<em class="card_iR_sex card_iR_sexMan"></em>`
    } else if (sex == 2) {
        str += `<em class="card_iR_sex "></em>`
    }

    str += `<span class="card_iR_card"><em></em><div class="card_iR_cSend"><a href="javascript:;">发送该名片</a></div></span></h4>
                        <p title="${strcompany}">${strcompany}</p>
                    <p title="产品部 设计">${branch}</p>
                    `
    var titlebox = document.getElementsByClassName('card_i_r')[0]
    titlebox.innerHTML = str;
    _this.myscroll.refresh();

    var strContent = '',
        sign = userCard.sign,
        mobile = userCard.mobile,
        telephone = Member.telephone,
        email = Member.email,
        serialNumber = Member.serialNumber,//公号
        SecondPosition = Member.SecondPosition;
    var BusiTags;
    BusiTags = Member.BusiTags
    if (BusiTags != '' && BusiTags != null && BusiTags != 'undefined' && BusiTags.length > 0) {
        BusiTags = BusiTags.join(',')
    }

    var birthday;
    if (Member.birthday) {
        birthday = FormatTime(Member.birthday, 'yyyy年mm月dd日')
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

                telphonelist.push({name: '电话1', value: telephone})

                for (var k = 0; k < telephones.length; k++) {

                    var item = {name: '电话' + (k + 2), value: telephones[k]};

                    telphonelist.push(item);
                }
            } else {
                telphonelist.push({name: '电话', value: telephone})
            }
        }
        if (visibleFlag == 1 || visibleFlag == 7000) {
            ary1 = [{name: '签名', value: sign, isEdit: true, attr: 'sign'}, {name: '手机', value: ''}, {
                name: '电话',
                value: ''
            }, {name: '邮箱', value: email}];
        } else if (visibleFlag == 1000) {
            ary1 = [{name: '签名', value: sign}, {name: '手机', value: ''}].concat(telphonelist).concat({
                name: '邮箱',
                value: email
            });
        }
        else if (visibleFlag == 2000) {
            if (telphonelist.length > 1) {

                ary1 = [{name: '签名', value: sign}, {name: '手机', value: mobile}, {
                    name: '电话',
                    value: telephones[1]
                }, {name: '邮箱', value: email}];
            } else {
                ary1 = [{name: '签名', value: sign}, {name: '手机', value: mobile}, {name: '邮箱', value: email}];
            }

        } else if (visibleFlag == 3000) {
            if (telphonelist.length > 1) {

                ary1 = [{name: '签名', value: sign}, {name: '手机', value: ''}, {
                    name: '电话',
                    value: telephones[1]
                }, {name: '邮箱', value: email}];
            } else {
                ary1 = [{name: '签名', value: sign}, {name: '手机', value: ''}, {name: '邮箱', value: email}];
            }

        } else if (visibleFlag == 4000) {

            ary1 = [{name: '签名', value: sign}, {name: '手机', value: mobile}, {
                name: '电话',
                value: telphonelist[0]
            }, {name: '邮箱', value: email}];

        } else if (visibleFlag == 5000) {
            if (telphonelist.length > 1) {
                ary1 = [{name: '签名', value: sign}, {name: '手机', value: ''}, {
                    name: '电话',
                    value: telphonelist[0]
                }, {name: '邮箱', value: email}];
            } else {
                ary1 = [{name: '签名', value: sign}, {name: '手机', value: ''}, {name: '邮箱', value: email}];
            }
        } else if (visibleFlag == 6000) {

            ary1 = [{name: '签名', value: sign}, {name: '手机', value: ''}, {name: '邮箱', value: email}];

        } else {
            ary1 = [{name: '签名', value: sign}, {name: '手机', value: mobile}].concat(telphonelist).concat({
                name: '邮箱',
                value: email
            });
        }
        return ary1;
    }

    var ary2 = [
        {name: '工号', value: serialNumber, attr: ''},
        {name: '职称', value: SecondPosition},
        {name: '生日', value: birthday},
        {name: '民族', value: Member.nation},
        {name: '政治面貌', value: Member.politicsStatus},
        {name: '组织标签', value: BusiTags},
        {name: '备注', value: data.blueCardDetail.remarkName, isEdit: true, attr: 'remarkName'},
        {name: '描述', value: data.blueCardDetail.remarkDescr, isEdit: true, attr: 'remarkDescr'}]

    this.cardInfo = {
        id: userCard.id,
        resId: resID,
        name: strName,
        sign: sign,
        remarkDescr: data.blueCardDetail.remarkDescr,
        remarkName: data.blueCardDetail.remarkName
    }

    strContent += '<ul class="card_list">'
    if (visibleFlag == 2) {

        for (var i = 0, ln = ary1.length; i < ln; i++) {
            var obj = ary1[i];
            strContent += `<li><label class="card_l_leb">${obj.name}</label>
                                <div class="card_l_r"><p></p></div></li>
                               `;
        }


    } else {

        for (var i = 0, ln = ary1.length; i < ln; i++) {
            var obj = ary1[i]

            if (obj.value == '' || obj.value == null || typeof(obj.value) == 'undefined') {
                if (obj.name == '签名') {
                    obj.value = '暂无';
                } else {
                    obj.value = '';
                }
            }
            strContent += `<li><label class="card_l_leb">${obj.name}</label>
                                <div class="card_l_r">
                               `;


            if (obj.name == '签名') {

                if (isMyself) {
                    strContent += ` <p class="card_edit card_sign"><span class="caname" >${obj.value}</span><em class="card_edit_sign" id="${obj.attr}"></em></p>`
                } else {
                    strContent += ` <p class="card_edit card_sign"><span class="caname">${obj.value}</span></p>`
                }

            } else if (obj.name == '邮箱') {
                strContent += `<p><a href="javascript:;" class="aV_a open_Email">${obj.value}</a></p>`
            } else if (obj.name == '手机') {

                if (visibleFlag == 2000 || visibleFlag == 3000) {
                    strContent += `<p></p>`
                } else {
                    strContent += `<p>${obj.value}</p>`
                }
            } else {
                strContent += `<p>${obj.value}</p>`
            }
            strContent += '</div></li>'

        }
        strContent = strContent + '</ul>'

        var strContent2 = '', count = 0;
        strContent2 += '<ul class="card_list">'

        for (var j = 0, ln = ary2.length; j < ln; j++) {
            var obj = ary2[j];

            if (obj.value == null || typeof(obj.value) == 'undefined') {
                obj.value = ''
            }

            if (obj.name == '备注' || obj.name == '描述') {

                if (!isMyself) {


                    var maxwidth = 28;//设置最多显示的字数
                    var text = obj.value;
                    if (text.length > maxwidth) {
                        text = text.substring(0, maxwidth) + '...'
                    }
                    ;


                    strContent2 += `<li>
    <label class="card_l_leb">${obj.name}</label>
                                <div class="card_l_r "> <p class="card_edit card_sign remark"  content="${obj.value}" ><span class="caname" >${text}</span><em class="card_edit_sign ${obj.attr}" id=''></em></p></div></li>`
                    count++;

                }

            } else {
                if (obj.value != '' && obj.value != null && typeof(obj.value) != 'undefined') {

                    strContent2 += `<li>
    <label class="card_l_leb">${obj.name}</label>
                                <div class="card_l_r"> <p>${obj.value}</p></div></li>`
                    count++;
                }
            }

        }
        strContent2 += '</ul>'


        strContent = strContent + strContent2;


    }

    var ocardlist = document.getElementsByClassName('card_scroll_c')[0];
    ocardlist.innerHTML = strContent;

    //_this.blurforModifyCard();

    _this.myscroll.refresh();


};
//支持发送蓝信
PersonCard.prototype.isSendMsg = function () {

    var _this = this;
    var $con = $('.card_con')[0]
    if (_this.curUserId != _this.dialogId) {//好有名片支持发送信息

        $con.style.height = (280 - 60) + 'px'
        $('.card_sendLX').append('<a href="javascript:;">发蓝信</a>')
    } else {
        $con.style.height = 280 + 'px'
    }

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
PersonCard.prototype.seftBindEvent = function () {
    var _this = this;
    //发送蓝信
    $('.card_sendLX a ').click(function () {

        var parm = {
            dialogId: _this.initInfo.dialogId,
            name: _this.initInfo.name,
            dialogType: 2,
            photoResId: _this.initInfo.photoResId
        };

        _this.sendMessage(parm)
        _this.stopDefault();
    })
    //鼠标滑过显示发送名片控件
    $('.card_iR_card').hover(function () {

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
        //var txt = sSign.text();


        _this.Editinfo($(this), sSign, '', 28)
        //var sSign = $(this).siblings(".caname");
        //var txt = sSign.text();
        //
        //if (txt == '暂无') {
        //    txt = ''
        //} else {
        //    txt = _this.cardInfo.sign
        //}
        //
        //$(this).parents(".card_edit").append('<div contenteditable="true" class="card_sign_focus">' + txt + '</div>');
        //
        //var input = $(".card_sign_focus");
        //
        //$(this).parents(".card_edit").css("display", "block")
        //input.click(function () {
        //    return false;
        //});
        //input.trigger("focus");
        //input.blur(function () {
        //    var newtxt = $(this).text();
        //    input.remove();
        //
        //    if (newtxt == '') {
        //        sSign.html("暂无");
        //        sSign.css("color", "#bbb")
        //
        //        $(".card_edit").css("display", "inline-block")
        //    }
        //    else {
        //        sSign.html(newtxt);
        //        sSign.css("color", "#222")
        //
        //        $(".card_edit").css("display", "inline-block");
        //
        //        wordNum();
        //    }
        //
        //    if (_this.cardInfo.sign == newtxt) {
        //
        //    } else {
        //        var parm = {
        //            card: {
        //                userUniId: _this.dialogId,
        //                sign: newtxt,
        //                id: _this.cardInfo.id,
        //                photoResId: _this.cardInfo.resId,
        //                name: _this.cardInfo.name,
        //
        //            }
        //        }
        //        _this.ModifyCard(parm)
        //        _this.cardInfo.sign = newtxt;
        //    }
        //
        //});
    });

    //限制字数，超出显示省略号
    var wordNum = function () {
        $(".caname").each(function () {
            var maxwidth = 28;//设置最多显示的字数
            var text = $(this).text();
            if ($(this).text().length > maxwidth) {
                $(this).text($(this).text().substring(0, maxwidth));
                $(this).html($(this).html() + "...");

            }
            ;
        })
    }
    wordNum();

}
PersonCard.prototype.init_bindevent = function () {

    var _this = this;

    $('.card_icon').click(function () {

        if (_this.curUserId == _this.dialogId) {//好有名片支持发送信息

            _this.ModifyHeadIcon('PersonCard');
        } else {
            var path = $(this).find('img').attr('src')
            var parm = {picturePath: path}
            _this.viewPictures(parm)
        }
        _this.stopDefault();
    })


}
PersonCard.prototype.Editinfo = function ($ele, $updated, attr, maxlength) {






    var _this = this;
    //var sSign = $ele.siblings(".caname");
    var txt = $updated.text();

    if (txt == '暂无') {
        txt = ''
    } else {
        txt = _this.cardInfo.sign
    }
var $card_edit=$ele.parents(".card_edit")
    var content=$card_edit.attr('content')

    $card_edit.append('<textarea  style="resize:none;width:100%;z-index: 100" maxlength=' + maxlength + ' rows="3" type="text" value="' + txt + '" class="card_sign_focus syscroll" />');

    var input = $(".card_sign_focus");

    $ele.parents(".card_edit").css("display", "block")
    input.click(function () {

        return false;
    });
    input.trigger("focus");
    input.val(content)

    input.blur(function () {
        var newtxt = $(this).text();


        input.remove();

        if (newtxt == '') {
            $updated.html(content);
            $updated.css("color", "#bbb")

            $(".card_edit").css("display", "inline-block")
        }
        else {
            $updated.html(newtxt);
            $updated.css("color", "#222")

            $(".card_edit").css("display", "inline-block");

            //wordNum();
        }

        //if (_this.cardInfo.sign == newtxt) {
        //
        //} else {
        //    var parm = {
        //        card: {
        //            userUniId: _this.dialogId,
        //            sign: newtxt,
        //            id: _this.cardInfo.id,
        //            photoResId: _this.cardInfo.resId,
        //            name: _this.cardInfo.name,
        //
        //        }
        //    }
        //    _this.ModifyCard(parm)
        //    _this.cardInfo.sign = newtxt;
        //}


        var attr=''
        if($ele.hasClass('remarkName')){

           var remarkName= $('.remarkName').html()
           var remarkDescr= $('.remarkDescr').html()
            attr='remarkName'
            var parm = {userUniId: _this.dialogId, remarkName: newtxt, remarkDescr: remarkDescr}
            _this.ModifyRemark(parm)
        }else if($ele.hasClass('remarkName')){


        }


    });

}


//群名片

function QunCard() {
    this.Assistlist = [];
    this.qunId = '';
    this.role = 0;//0普通群成员 ，1群主 2群管理员
    this.init();
}
QunCard.prototype = new Card();

QunCard.prototype.init = function () {
    var _this = this;
    var parm = {};

    _this.init_event();
    window.lxpc.exebusinessaction('QunCard', 'InitFinished', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

        if (status == 0) {

            $('.cardA_list_aid dl:not(".cardA_list_Mqz")').remove();

            var data = JSON.parse(jsondata),
                dialogId = data.dialogId;
            _this.initInfo = data;
            var parm = {dialogId: dialogId, selfUniId: data.curUserUniID}
            _this.curUserId = data.curUserUniID;
            _this.dialogId = dialogId;

            //显示群头像
            var resID = data.photoResId

            if (resID != '' && resID != null && typeof(resID) != 'undefined') {

                var photo = {resourceList: [{photoResId: resID}]}
                _this.showPhoto(photo, 'HeaderImage', 0, function (result, targ) {

                    $('.card_icon img').attr('src', result);

                });
            } else {
                $('.card_icon img').attr('src', 'images/head_group.png');
            }

            _this.getData(parm);
            //置顶标志更改回调
            _this.ReceiveModifyTopFlag();
            ////回调用来转让群
            //_this.ReceiveSelectPeople('QunCard',function(data){
            //
            // var parm={dialogId:_this.dialogId,userUniId:data.userlist[0]}//查询用户的ID（如果不传此字段，就返回这个群的所有用户信息）”｝
            //
            //
            //        _this.getQunMemberInfo(parm, 0, function (jsonresult,targ) {
            //
            //            var data=JSON.parse(jsonresult)
            //            $('#Qun_AName').html(data[0].name)
            //
            //            var photo = {resourceList: [{photoResId: data[0].photoResId}]}
            //
            //            _this.showPhoto(photo, 'HeaderImage', 0, function (result, targ) {
            //
            //                $('#Qun_AImg').attr('src',result)
            //            })
            //
            //
            //        })
            //
            //
            //
            //})

        } else {

            my_layer({message: '网络异常'}, 'warn')
        }

    })
    _this.scroll();
    _this._bindEvent();
}
QunCard.prototype.getData = function (parm) {
    var _this = this;
    try {

        window.lxpc.exebusinessaction('QunCard', 'GetCardDetail', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {
                _this.blue = JSON.stringify(JSON.parse(jsondata)[0])

                _this.binData(jsondata)
                _this.bindEvent();
                _this._bindEvent();

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
    var EditClassname
    _this.qunId = data.id

    if (data.creatorUniId == _this.initInfo.curUserUniID) {//说明自己是群主
        isAdmin = true;
        EditClassname = 'card_edit_qunN'
        $('.cardA_list_Mqz').show();

    } else {
        isAdmin = false;
        EditClassname = '';
        $('.cardA_list_Mqz').hide();
    }

    var str = `<h4 class="card_qunC"><span title="PC蓝信开发组" class="card_i_name caname">${data.name}</span><em class="${EditClassname}"></em><span class="card_iR_card"><em></em><div class="card_iR_cSend"><a href="javascript:;">发送该名片</a></div></span></h4>
        	<p>${data.memberCount}人</p>`
    oQuntitle.innerHTML = str;

//确定头像是不是可编辑
    var oicon = document.getElementsByClassName('card_icon_edit')[0];
    if (isAdmin) {
        oicon.style.display = 'block';
    } else {
        oicon.style.display = 'none';
    }
    //获取群主的头像
    document.getElementById('Qun_AName').innerHTML = data.creatorName

    //获取所有群主的信息


    var parm = {dialogId: _this.initInfo.dialogId, userUniId: data.creatorUniId}

    _this.getQunMemberInfo(parm, 0, function (jsonresult) {

    })

    //获取群简介信息
    var introduction = data.introduction ? data.introduction : '暂无';
    document.getElementById('cardA_intro').innerHTML = introduction

    _this.myscroll.refresh()

    //初始化设置状态
    _this.SetInitStatus(data, isAdmin);

};
QunCard.prototype.init_event = function () {
    //、、切换tab页
    $(".cardA_tab a").each(function (index) {
        $(this).click(function () {
            $(".cardA_Con").addClass("disN")
            $(".cardA_Con:eq(" + index + ")").removeClass("disN")
            $(".cardA_tab a").removeClass("cardA_tabLink")
            $(this).addClass("cardA_tabLink")
        })
    })

    var _this = this;

    //更改头像或是预览头像
    $('.card_icon').click(function () {

        _this.ModifyHeadIcon('QunCard');

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
            _this.ModifyQunData(parm)


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
        }

        if ($ele.hasClass('cardA_checkEd')) {
            newvalue = 0
        } else {
            newvalue = 1
        }

        var quninfo = JSON.parse(_this.blue)

        quninfo[attr] = newvalue;
        _this.blue = JSON.stringify(quninfo)

        _this.ModifyQun()
    }

    $('#cardA_dissolveQ').click(function () {

        var $ele = $(this)
        var isAdmin = $ele.data('Admin')
        var quninfo = JSON.parse(_this.blue)

        if (isAdmin == 'true') {

            var parm = {qunId: quninfo.id}

            _this.DismissQun(parm)
        } else {
            var parm = {qunId: quninfo.id, recordDomain: quninfo.recordDomain}

            _this.ExitQun(parm)
        }

    })

    //更改群主

    $('#transmitQunA').click(function () {


        try {
            var code = _this.initInfo.code;
            var parm = {fromCode: code, dialogId: _this.initInfo.dialogId}
            window.lxpc.exebusinessaction('Transmit', 'TransmitQunAdmi', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
                if (status == 0) {


                } else {

                    my_layer({message: '网络异常'}, 'warn')
                }

            })


        } catch (e) {
            my_layer({message: '调用接口错误，错误码' + e.message})
        }

        //回调用来转让群
        _this.ReceiveSelectPeople('QunCard', function (data) {


            var parm = {dialogId: _this.dialogId, userUniId: data.userlist[0]}//查询用户的ID（如果不传此字段，就返回这个群的所有用户信息）”｝

//获取新群主的信息
            _this.getQunMemberInfo(parm, 0, function (jsonresult, targ) {

                var data = JSON.parse(jsonresult)
                $('#Qun_AName').html(data[0].name)

                var photo = {resourceList: [{photoResId: data[0].photoResId}]}

                _this.showPhoto(photo, 'HeaderImage', 0, function (result, targ) {

                    $('#Qun_AImg').attr('src', result)
                })


            })

            //调取转让群主的接口
            var parm = {dialogId: _this.dialogId, qunId: _this.qunId, newOwnerUserUniId: data.userlist[0]}

            _this.TransferQunOwner(parm)

//加入群助理里面有该成员的话就把他从群助理里面去掉
            $('.cardA_list_aid dl').each(function () {
                var $ele = $(this)
                if ($ele.attr('userUniId') == data.userlist[0]) {
                    $ele.remove();
                    _this.Assistlist.splice(_this.Assistlist.indexOf(data.userlist[0]))
                }

            })


        })

    })

    //添加群助理
    $('#addQunAdmi').click(function () {
        try {
            var code = _this.initInfo.code;
            var parm = {fromCode: code, dialogId: _this.initInfo.dialogId}
            window.lxpc.exebusinessaction('Transmit', 'AddQunManager', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
                if (status == 0) {


                } else {

                    my_layer({message: '网络异常'}, 'warn')
                }

            })


        } catch (e) {
            my_layer({message: '调用接口错误，错误码' + e.message})
        }

        //回调用来转让群
        _this.ReceiveSelectPeople('QunCard', function (data) {

            var userlist = data.userlist

            for (var j = 0; j < userlist.length; j++) {

                var item = userlist[j]
                if (_this.Assistlist.indexOf(item) == -1) {
                    _this.Assistlist.push(item)
                }
            }

            _this.SetAssistQunOwner(function(jsondata){

                var parm = {dialogId: _this.dialogId}//查询用户的ID（如果不传此字段，就返回这个群的所有用户信息）”｝

//获取新群主的信息
                _this.getQunMemberInfo(parm, 0, function (jsonresult, targ) {

                    var data = JSON.parse(jsonresult)

                    var str = '';
                    for (var i = 0; i < data.length; i++) {
                        var curItem = data[i]
                        if (userlist.indexOf(curItem.userUniId) > -1) {

                            str += `<dl userUniId="${curItem.userUniId}">
                        	<dt><img src="images/card_icon.png" resId="${curItem.photoResId}" /><em class="cardA_list_del" ></em></dt>
                            <dd>${curItem.name}</dd>
                        </dl>
                    	`


                        }

                    }


                    $('#addQunAdmi').before(str)

                    _this.myscroll.refresh();

                    $('.cardA_list_aid img').each(function (index, ele) {
                        var $ele = $(this)
                        _this.imgId = _this.imgId + 1
                        $ele.attr('targ', _this.imgId)
                        var resId = $ele.attr('resId')
                        var parm = {resourceList: [{photoResId: resId}]};

                        _this.showPhoto(parm, 'AmImage', _this.imgId, function (result, targ) {

                            $('.cardA_list_aid img[targ="' + targ + '"]').attr('src', result)

                        })


                    })

                    //绑定事件删除
                    $('.cardA_list_del').click(function () {
                        var $li = $(this).parents('dl')
                        var usetid = $li.attr('userUniId');
                        $li.remove();
                        _this.Assistlist.splice(_this.Assistlist.indexOf(usetid), 1)

                        _this.SetAssistQunOwner(function(jsondata){


                        })

                    })

                })
            })



        })


    })

};
QunCard.prototype._bindEvent = function () {
    var _this = this;
    //编辑群名片的名字

    $(".card_edit_qunN").click(function (e) {

        var sSign = $(this).siblings(".caname");
        var txt = sSign.text();
        $(this).parents(".card_qunC").append('<input type="text" value="' + txt + '" class="card_sign_focus2" />');

        var input = $(".card_sign_focus2");
        input.click(function () {
            return false;
        });
        input.trigger("focus");
        input.blur(function () {

            input.remove();
            var newtxt = $(this).val();
            if (newtxt == '') {
                sSign.html(newtxt);
            }
            else {
                sSign.html(newtxt);
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
        var txt = canameF.text();

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
            var newtxt = $(this).text();
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


                    $('.cardA_list_aid img').each(function (index, ele) {
                        var $ele = $(this)
                        _this.imgId = _this.imgId + 1
                        $ele.attr('targ', _this.imgId)
                        var resId = $ele.attr('resId')
                        var parm = {resourceList: [{photoResId: resId}]};

                        _this.showPhoto(parm, 'AmImage', _this.imgId, function (result, targ) {

                            $('.cardA_list_aid img[targ="' + targ + '"]').attr('src', result)

                        })


                    })

                    //绑定事件删除
                    $('.cardA_list_del').click(function () {
                        var $li = $(this).parents('dl')
                        var usetid = $li.attr('userUniId');

                        _this.Assistlist.splice(_this.Assistlist.indexOf(usetid), 1)
                        _this.SetAssistQunOwner(function(jsondata){
                            $li.remove();

                        })

                    })

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

//QunCard.prototype.TransferQunOwner = function () {
//    window.lxpc.exebusinessaction('QunCard', 'TransferQunOwner', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
//
//        if (status == 0) {
//
//        } else {
//
//        }
//    })
//
//
//}
//设置初始化状态
QunCard.prototype.SetInitStatus = function (data, isAdmin) {
    var _this = this;
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
    }
    else {
        $('#openFlag').removeClass('cardA_checkEd')
    }

    if (isAdmin) {
        $(".cardA_setting").removeClass('cardA_nonAdmin').addClass('cardA_Admin')
        $('.cardA_dissolveQ').html('解散退出该群')
        $('.cardA_dissolveQ').data('Admin', 'true')
        $('#introduction').addClass('card_edit_sign')

        $('#transmitQunA').show()
        $('#addQunAdmi').show()

    } else {

        $(".cardA_setting").removeClass('cardA_Admin').addClass('cardA_nonAdmin')
        $('.cardA_dissolveQ').html('退出该群')
        $('.cardA_dissolveQ').data('Admin', 'false')
        $('#introduction').removeClass('card_edit_sign')
        $('#addQunAdmi').remove()
        $('#transmitQunA').hide()
        $('#addQunAdmi').hide()
    }


    var parm = {dialogId: _this.initInfo.dialogId, userUniId: _this.initInfo.curUserUniID}

    _this.getQunMemberInfo(parm, 1, function (jsonresult, Memberid) {

        var result = JSON.parse(jsonresult)[0]

        if (Memberid == 0) {
            var resId = result.photoResId;
            var parm = {resourceList: [{photoResId: resId}]};
            _this.imgId = _this.imgId + 1;

            _this.showPhoto(parm, 'MemberImage', _this.imgId, function (result, targ) {

                document.getElementById('Qun_AImg').src = result

            })
        } else {

            if (result.forbidSmsDown == 1) {//是否是消息免打扰的开关0的是关闭1是打开
                $('#forbidSmsDown').addClass('cardA_checkEd')
            } else {
                $('#forbidSmsDown').removeClass('cardA_checkEd')
            }
        }


    })

    //是否置顶
    _this.GetUserDialog()


}
//获取置顶标志:
QunCard.prototype.GetUserDialog = function () {
    var _this = this;
    try {
        //var parm={dialogId:'23123'}//查询用户的ID（如果不传此字段，就返回这个群的所有用户信息）”｝
        var parm = {dialogId: _this.initInfo.dialogId}

        window.lxpc.exebusinessaction('QunCard', 'GetUserDialog', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

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


}
//注册置顶标志更改回调
QunCard.prototype.ReceiveModifyTopFlag = function () {
    var _this = this;
    try {
        //var parm={dialogId:'23123'}//查询用户的ID（如果不传此字段，就返回这个群的所有用户信息）”｝
        var parm = {dialogId: _this.initInfo.dialogId}

        window.lxpc.exebusinessaction('QunCard', 'ReceiveModifyTopFlag', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

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

}
//手动设置消息免打扰
QunCard.prototype.ModifyQunData = function (parm) {


    try {


        window.lxpc.exebusinessaction('QunCard', 'ModifyQunData', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

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

//手动消息置顶
QunCard.prototype.SetTopDialog = function (parm) {

    var _this = this;
    try {

        window.lxpc.exebusinessaction('QunCard', 'SetTopDialog', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

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
        //var parm={qunId:'23123',recordDomain:''}


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
                my_layer({message: '网络异常'}, 'warn')
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
//QunCard.prototype.delQunAssist=function(userUniId,ele,obj){
//
//    var _this=this;
//
//    $(ele).parents('dl').remove();
//
//    _this.Assistlist.splice(_this.Assistlist.indexOf(userUniId),1)
//
//}
//QunCard.prototype.updateQunAssist=function(user){
//
//
//
//
//
//}

function delQunAssist() {
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
}