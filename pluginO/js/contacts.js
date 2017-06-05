function Contacts(strId, option, existeduserlist) {
    this.zTree = null;
    //this.PersonScroll = null;
    //this.StructScroll = null;
    this.existeduserlist = existeduserlist;
    this.ScrollRight = null;
    this.Scrollleft = null;
    this.Scrollsearch = null;
    this.searchId = 0;
    this.imageId = 0;
    this.search = '';
    this.memberList = [];
    this.ContactPerson = null;
    this.imageId = 0;
    this.option = {};
    //this.userrID=userrID;
    this.init(strId, option, existeduserlist);
}
Contacts.prototype = {
    constructor: Contacts,
    init: function (strId, option, existeduserlist) {
        $(strId).empty();
        var _this = this;


        var option = option || {};

        _this.option = {
            title: '选人',
            logoicon: '',
            tool: {
                isclose: true,
                ismax: false,
                ismin: false,
            }

        };
        _this.option = jQuery.extend(_this.option, option);

        if ($(".selec_title", strId).length == 0) {
            var shtml = `<div class="contact_title">
              <span id="ct_logo">` + _this.option['title'] + `</span>
              <ul class="tool">
            <li class="Winmin" ></li>
            <li class="Winmax"></li>
            <li class="Winclose" ></li>
        </ul>
              </div>
              <div class="contacts_left">
              <div style="height: 38px;line-height: 38px; text-align: center;padding:0 5px ;position: relative" class="Ct_seach">
              <em></em><input  type="text" class="search" placeholder="" value="搜索"><em style="display: block"></em>
              </div>
               <div class="contacts_leftContent" style="display: block">
               <ul class="contact_tab">
                   <li class="contact_type contact_Select ">联系人</li>
                   <li class="contact_type ">组织</li>
               </ul>
               <div class="contactcontent " id="contact_scroll_left" style="overflow: hidden;width: 100%;border-top:1px solid #D9DCE2;position:relative">
                   <div>
                       <div class="contacts_person_scroll contacts_type" id="contacts_person_scroll" style="display: block;">

                       </div>
                       <div class="contacts_strut_scroll contacts_type" id="contacts_strut_scroll" style="display: block;" >
                           <div class="zTreeDemoBackground left" id="zTreeDemoBackground">
                               <ul id="treeDemo" class="ztree"></ul>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
             <div class="contactcontent contacts_search_scroll" id="contacts_search_scroll" style="overflow: hidden;width: 100%;border-top:1px solid #D9DCE2;display: none;">
             <div>
              <div class="contacts_search_con">

             </div>
             <div class="noSearch" style="position: absolute;top: 150px;text-align: center;width: 100%;display: none">
                <span>没有搜索结果</span>
             </div>
             </div>

              </div>
              <div style="top: 40%; text-align: center;position: absolute;width: 100%;display:none" class="Contact_load">
                  <img src="./images/ajax-loader_smail.gif" alt="">
            </div>
               </div>
              <div class="contacts_right" >
              <h5>已选<span class="per_count">0</span> 个人|已选<span class="org_count"> 0 </span>个部门</h5>
              <div id="contacts_right_scroll" class="contacts_right_scroll" style="overflow: hidden;position: relative">
              <ul class="SelecedContact" style="padding-left: 13px" >


              </ul>
              </div>
<div style="width: 100%;text-align: center" class="btn_container">
                    <button class="btnCancel" id="btnCancel">取消</button>
                    <button class="btnOK" id="btnOk">确认</button>
                </div>
              </div>`;


            $(strId).append(shtml);

            var option = scrollSetings();

            _this.ScrollRight = new IScroll('#contacts_right_scroll', option);
            _this.Scrollleft = new IScroll('#contact_scroll_left', option);
            _this.Scrollsearch = new IScroll('#contacts_search_scroll', option);
            _this.ScrollRight.refresh();
            _this.bindEvent(strId);
            _this.showContactPerson(strId);

            _this._init(strId, existeduserlist);

            if ($(".SelecedContact li").length == 0) {
                //$('.contacts_right h5').html('');
            } else {

                //$('.contacts_right h5').html('已选取' + $('.SelecedContact li').length + '人')

            }


            $(window).resize(function () {
                var boxH = $(strId)[0].clientHeight;
                $('.contactcontent', strId).each(function (index, ele) {

                    ele.style.height = (boxH - 113 - 1) + 'px'
                });

                $('.contacts_right', strId)[0].style.height = (boxH - 32) + 'px';
                var scrollRH = (boxH - 32) - $('.contacts_right h5')[0].offsetHeight - $('.btn_container')[0].offsetHeight;
                var scrollserch = (boxH - 70 - 1) + 'px'
                $('.contacts_right_scroll', strId).css({height: scrollRH + 'px'})
                $('.contacts_search_scroll', strId).css('height', scrollserch);
            });


        } else {
            $(strId).show();
        }


    },

    _init: function (strId, existeduserlist) {
        var _this = this;
        var boxH = $(strId)[0].clientHeight;
        $('.contactcontent', strId).each(function (index, ele) {
            ele.style.height = (boxH - 113 - 1) + 'px'
        });


        $('.contacts_right', strId)[0].style.height = (boxH - 32) + 'px';

        var scrollRH = (boxH - 32) - $('.contacts_right h5')[0].clientHeight - $('.btn_container', strId)[0].offsetHeight;
        var scrollserch = (boxH - 70 - 1) + 'px'
        $('.contacts_right_scroll', strId).css({height: scrollRH + 'px'})
        $('.contacts_search_scroll', strId).css('height', scrollserch);


        if ($(".SelecedContact li").length == 0) {
            //$('.contacts_right h5').html('');
        } else {

            //$('.contacts_right h5').html('已选取' + $('.SelecedContact li').length + '人')

        }

        if (this.option['logoicon'] != '') {

            var ologo = document.getElementById('ct_logo');
            ologo.style.paddingLeft = 22 + 'px';
            $(ologo).css('background-image', 'url("' + this.option['logoicon'] + '")');
            $(ologo).css('background-repeat', 'no-repeat')
        }

        if (!this.option.tool.isclose) {

            $('.Winclose', strId).hide();
        }
        if (!this.option.tool.ismax) {
            $('.Winmax', strId).hide();
        }
        if (!this.option.tool.ismin) {
            $('.Winmin', strId).hide();
        }

        if (typeof(existeduserlist) != 'undefined' && existeduserlist.length > 0) {
            var str = ''
            for (var i = 0, ln = existeduserlist.length; i < ln; i++) {

                var curuserinfo = existeduserlist[i];
                var name = curuserinfo.name;
                if (typeof(name) == 'undefined') {
                    name = ''
                }

                str += '<li  userUniId="' + curuserinfo.userUniId + '" ><img src="./images/defuser.png" alt="" photoResId="' + curuserinfo.ImgePath + '" ><span>' + name + '</span></li>';
            }
            $('.contacts_right_scroll .SelecedContact').append(str);
            //$('.contacts_right h5').html('已选取' + $('.SelecedContact li').length + '人');
            _this.updataCount();
            _this.memberList.push(curuserinfo.userUniId)

            $('.SelecedContact img').each(function (index, ele) {
                _this.imageId = _this.imageId + 1;
                var imgstr = $(ele).attr('photoResId');

                if (imgstr != '') {
                    $(ele).attr('imageId', _this.imageId);
                    var parm = {resourceList: [{photoResId: imgstr}]};
                    defaultPerImg(parm, _this.imageId, function (result, targ) {
                        $('.SelecedContact img[imageId="' + targ + '"]').attr('src', result)
                    })
                }
            })

            function defaultPerImg(parm, starg, cb) {
                try {
                    window.lxpc.exebusinessaction('DownloadResource', 'DefaultImage', '0', JSON.stringify(parm), parseInt(starg), function (status, result, targ) {

                        if (status == 0) {

                            if (Object.prototype.toString.call(cb) === '[object Function]') {
                                cb(result, targ);
                            }

                        } else {
                        }
                    })
                } catch (e) {
                    console.log(e.message)
                }
            }


        }

    },

    bindEvent: function (strId) {
        var _this = this;
        //实现点击切换

        $('.contact_tab li').on('click', function () {
            var $ele = $(this);

            $ele.addClass("contact_Select").siblings().removeClass('contact_Select');

            var $parent = $('.contact_tab')//用来记录滚动条的位置
            $($(".contacts_left .contactcontent .contacts_type")[$(this).index()]).show().siblings().hide();

            if ($ele.index() == 0) {

                $parent.data('per', {x: _this.Scrollleft.x, y: _this.Scrollleft.y})
                var scrollinfo = $parent.data('str')

                if (scrollinfo) {
                    _this.Scrollleft.scrollTo(scrollinfo.x, scrollinfo.y)
                }

                _this.showContactPerson(strId);
            } else {

                $parent.data('str', {x: _this.Scrollleft.x, y: _this.Scrollleft.y})
                var scrollinfo = $parent.data('per')

                if (scrollinfo) {
                    _this.Scrollleft.scrollTo(scrollinfo.x, scrollinfo.y)
                }
                _this.showContactStruct();
            }
            _this.Scrollleft.refresh();
        })

        $('.Winclose', strId).on('click', function () {

            $(strId).hide();
            $('.contacts_right .btnOK', strId).off();
            $(this).off();
        });

        $('.btnCancel', strId).on('click', function () {

            $(strId).hide();
            $('.contacts_right .btnOK', strId).off();
            $(this).off();
        });

        //实现搜索联系人
        var timer = null;
        var init_search = '搜索';
        $('.contacts_left .search').focusin(function (e) {


            if ($(this).val() == init_search) {
                $(this).val('');
            }

            if ($(this).val().trim() == '') {
                $('.contacts_search_scroll .contacts_search_con').empty();
                //$('.Ct_seach em', strId).eq(0).hide();
                $('.Ct_seach em', strId).eq(1).hide();
                $('.contacts_leftContent', strId).show();
                _this.Scrollleft.refresh();
                $('.contacts_search_scroll', strId).hide();

            } else {

                //$('.contacts_leftContent',strId).hide();
                //$('.contacts_search_scroll',strId).show();
            }

            timer = setInterval(serach3, 500);
            _this.Scrollsearch.refresh();
            _this.mystopPropagation(e);


        }).focusout(function () {
            clearInterval(timer)
            if ($(this).val() == '') {
                $(this).val(init_search);
            }


            if ($(this).val().trim() == '') {
                //$('.Ct_seach em', strId).eq(0).show();
                //$('.Ct_seach em', strId).eq(1).show();
                $('.Ct_seach em', strId).eq(1).hide();
            } else {
                $('.Ct_seach em', strId).eq(1).show();
                $('.Ct_seach em', strId).eq(1).show();

            }
            _this.search = '';
        });
        $('.Ct_seach em', strId).eq(1).on('click', function () {
            $('.contacts_left .search').val('');
            //$('.Ct_seach em', strId).eq(0).show();
            $('.contacts_leftContent', strId).show();
            _this.Scrollleft.refresh();
            $('.contacts_search_scroll', strId).hide();
        })


        var text = '';


        var serach = ''

        function serach3(ev) {
            var _that = this;

            if ($('.contacts_left .search').val().trim() == '') {
                //$('.Ct_seach em', strId).eq(0).hide();
                $('.Ct_seach em', strId).eq(1).hide();
                $('.contacts_leftContent', strId).show();
                _this.Scrollleft.refresh();
                $('.contacts_search_scroll', strId).hide();

            } else {

                $('.Ct_seach em', strId).eq(1).show();
                $('.contacts_leftContent', strId).hide();
                $('.contacts_search_scroll', strId).show();

            }
            if (_this.search == $('.contacts_left .search').val().trim()) {
                return;
            }
            ;


            _this.search = $('.contacts_left .search').val().trim()
            _this.SearchContact(_this.search);

        }


        $('.contacts_right', strId).on('click', function () {

            var $search = $('.contacts_left .search', strId);
            $search.blur();
            var str = $search.val().trim();
            if (str == '') {
                $('.contacts_leftContent', strId).show();
                _this.Scrollleft.refresh();
                $('.contacts_search_scroll', strId).hide();
                return;
            } else {

            }
        })
        $('.contact_title', strId).on('click', function () {
            var $search = $('.contacts_left .search', strId);
            $search.blur();
            var str = $('.contacts_left .search', strId).val().trim();
            if (str == '') {
                $('.contacts_leftContent', strId).show();
                _this.Scrollleft.refresh();
                $('.contacts_search_scroll', strId).hide();
                return;
            } else {

            }
        })


    },
    getstruct: function getstruct(parentNode, parm) {

        var _this = this;
        var oparm = parm['parm'];
        var pId = parm['pId'];

        try {

            window.lxpc.exebusinessaction('notice', 'QueryStructAndMember', '0', JSON.stringify(oparm), 0, function (status, datalist, targ) {

                if (status == 0) {
                    $('.Contact_load').hide();
                    var img = [];
                    new Promise(function (resolve, reject) {

                        var data = JSON.parse(datalist);
                        var orgMemberList = data['orgMemberList'];
                        var orgStructList = data['orgStructList'];
                        var type, name;
                        var zNodes = [];

                        var MemberList = [], orgList = [], newStructList = [];

                        for (var i = 0; i < orgStructList.length; i++) {
                            var curorgStruct = orgStructList[i];

                            if (parentNode == null) {
                                if (curorgStruct['type'] == 1) {//成员
                                    MemberList.push(curorgStruct);
                                }
                                else {
                                    orgList.push(curorgStruct);
                                }

                            } else {
                                var orgid = parentNode['orgid'];
                                if (orgid != curorgStruct['id']) {

                                    if (curorgStruct['type'] == 1) {//成员
                                        MemberList.push(curorgStruct);
                                    }
                                    else {
                                        orgList.push(curorgStruct);
                                    }
                                }

                            }

                        }

                        MemberList = MemberList.sort(function (a, b) {
                            return a['name'] - b['name'];
                        });
                        orgList = orgList.sort(function (a, b) {
                            return a['name'] - b['name'];
                        });

                        newStructList = MemberList.concat(orgList);

                        _this.createzNodes(newStructList, orgList, orgMemberList, zNodes, pId).then(function (zNodes) {

                            resolve(zNodes);

                        }, function (error) {

                        });


                    }).then(function (zNodes) {

                        if (_this.zTree == null) {
                            _this.createTree(zNodes)
                        } else {
                            _this.zTree.addNodes(parentNode, zNodes);
                            _this.zTree.updateNode(parentNode)
                            _this.zTree.refresh();
                            _this.Scrollleft.refresh();
                            var childlist = parentNode.children;

                            for (var i = 0; i < childlist.length; i++) {
                                var curNode = childlist[i];

                                if (curNode.isParent == false) {

                                    var parm = {resourceList: [{photoResId: curNode['imagpath']}]};

                                    _this.imageId = _this.imageId + 1;

                                    curNode['imageId'] = _this.imageId;

                                    if (curNode['imagpath']) {

                                        _this.getImgePath(parm, _this.imageId, function (result, targ) {
                                            var curNode = _this.zTree.getNodesByParam('imageId', targ)[0];
                                            curNode.icon = result;
                                            _this.zTree.updateNode(curNode);
                                        })
                                    }
                                }
                            }
                        }

                    }, function (error) {

                        alert(error)
                    })


                } else {

                    alert(status);
                }
            });
        } catch (e) {

            console.log(e.message)
        }
    },
    createTree: function (zNodes) {

        var _this = this;
        this.Scrollleft.refresh();
        var setting = {
            view: {
                showLine: false,
                fontCss: {color: '#222'},
                showIcon: showIconForTree
            },

            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onCollapse: zTreeOnCollapse,
                onExpand: zTreeOnExpand,
                onCheck: zTreeOnCheck,
                onClick: zTreeOnClick,
            }
        };

        $.fn.zTree.init($("#treeDemo"), setting, zNodes);


        _this.zTree = $.fn.zTree.getZTreeObj("treeDemo");
        _this.zTree.setting.check.chkboxType = {"Y": "ps", "N": "ps"};


        function zTreeOnCollapse(event, treeId, treeNode) {

            _this.Scrollleft.refresh();
        }

        function zTreeOnExpand(event, treeId, treeNode) {

            if (treeNode.isParent == true) {

                if (typeof (treeNode.children) == 'undefined') {
                    $('.Contact_load').show();
                    var parm = {parm: {structId: treeNode['orgid']}, pId: treeNode['id']};

                    _this.getstruct(treeNode, parm);
                } else {
                    $('.Contact_load').hide();
                }

            }

            _this.Scrollleft.refresh();
        }

        function zTreeOnCheck(event, treeId, treeNode) {

            var id = treeNode['id'];
            var orgid = treeNode['orgid'];


            if (treeNode.isParent == false) {
                addContacts(treeNode);
                _this.Scrollleft.refresh();

            } else {

                addContacts(treeNode);

            }

            _this.updataCount()


        }

        function zTreeOnClick(event, treeId, treeNode) {

            if (treeNode.isParent == false) {

                if (treeNode.checked == false) {

                    _this.zTree.checkNode(treeNode, true, true, false);
                    _this.zTree.updateNode(treeNode);

                    addContacts(treeNode)
                } else if (treeNode.checked == true) {
                    _this.zTree.checkNode(treeNode, false, true, false)
                    _this.zTree.updateNode(treeNode)
                    treeNode.checked = false;
                    addContacts(treeNode)
                }

            } else {
                if (treeNode.checked == false) {
                    _this.zTree.checkNode(treeNode, true, true, false)
                    _this.zTree.updateNode(treeNode)

                    addContacts(treeNode)
                } else if (treeNode.checked == true) {
                    _this.zTree.checkNode(treeNode, false, true, false)
                    _this.zTree.updateNode(treeNode)
                    addContacts(treeNode)

                }

            }

            _this.updataCount()

        };

        function addContacts(treeNode) {
            var userId
            if (treeNode.isParent) {
                userId = treeNode['orgid']
            } else {
                userId = treeNode['userUniId']
            }

            if (typeof(_this.existeduserlist) != 'undefined' && _this.existeduserlist.length > 0) {
                if (_this.existeduserlist[0].userUniId == userId) {
                    return;
                }
            }


            var id = treeNode['id'];

            var tid = treeNode['tId']

            var oparentNode = treeNode.getParentNode();
            var isAllOrg = false;

            if (oparentNode == null || typeof(oparentNode) == 'undefined') {
                isAllOrg = false;//某个组织全选
            } else {
                var half = oparentNode.getCheckStatus().half
                if (half == false) {
                    isAllOrg = true;//某个组织全选
                }
            }

            if (treeNode.checked == true) {

                if (isAllOrg) {

                    var seledlis = $('.SelecedContact li[pId="' + oparentNode['id'] + '"]');
                    seledlis.each(function (index, ele) {
                        var $ele = $(ele);
                        $ele.remove();
                        _this.memberList.splice(_this.memberList.indexOf($ele.attr('userUniId')), 1)

                    })
                    bindselected(oparentNode)


                } else {

                    bindselected(treeNode)
                }

            } else {

                if (treeNode.isParent) {
                    var childlist = $('.SelecedContact li[pId="' + treeNode.id + '"]');
                    childlist.each(function (index, ele) {
                        var $ele = $(ele);
                        $ele.remove();
                        _this.memberList.splice(_this.memberList.indexOf($ele.attr('userUniId')), 1)

                    })
                }

                var $sel = $('.SelecedContact li[nodeid="' + id + '"]');
                $sel.remove();
                _this.memberList.splice(_this.memberList.indexOf($sel.attr('userUniId')), 1)

                var oparentNode = treeNode.getParentNode();
                if (oparentNode != null && typeof(oparentNode) != 'undefined') {

                    if (!isAllOrg) {

                        var pNodeId = oparentNode['id'];
                        var $sel = $('.SelecedContact li[nodeid="' + pNodeId + '"]');
                        $sel.remove();

                        var childs = oparentNode.children
                        for (var i = 0, ln = childs.length; i < ln; i++) {
                            var childNode = childs[i];

                            if (_this.memberList.length == 0) {
                                if (childNode.id != id) {
                                    bindselected(childNode)
                                }
                            } else {
                                if (childNode.id != id && _this.memberList.indexOf(childNode.userUniId) == -1 && childNode.checked) {
                                    bindselected(childNode)
                                }
                            }

                        }


                    }
                }


            }

        };

        function showIconForTree(treeId, treeNode) {
            return !treeNode.isParent;
        };
        function bindselected(treeNode) {

            var strName = treeNode['name'];
            var strImgePath = treeNode['icon'];
            var id = treeNode['id'];

            var tid = treeNode['tId']
            var str = '';
            var userId = ''
            if (treeNode.isParent) {
                userId = treeNode['orgid']
            } else {
                userId = treeNode['userUniId']
            }

            if (_this.memberList.indexOf(userId) > -1) {
                return;
            } else {
                _this.memberList.push(userId)
            }


            if (treeNode.isParent) {
                str += '<li nodeid="' + id + '" orgid="' + treeNode['orgid'] + '" userUniId="' + treeNode['orgid'] + '" tId="' + tid + '" isstruct="true" pId="' + treeNode.pId + '"><img src="./images/list_ic_org.png" alt="" ><span>' + strName + '</span><em></em></li>'
            } else {
                str += '<li nodeid="' + id + '" orgid="' + treeNode['orgid'] + '" userUniId="' + treeNode['userUniId'] + '" tId="' + tid + '"  name="' + strName + '" pId="' + treeNode.pId + '"><img src="' + strImgePath + '" alt="" ><span>' + strName + '</span><em></em></li>'
            }


            $('.SelecedContact').append(str);
            _this.ScrollRight.refresh();


            $('em', '.SelecedContact li[nodeid="' + id + '"]').click(function () {
                var sTreeId = $(this).parent().attr('tId');
                var node = _this.zTree.getNodeByTId(sTreeId);

                _this.zTree.checkNode(node, false, true, false)
                _this.zTree.updateNode(node)

                var $parent = $(this).parent();
                $parent.remove();

                _this.updataCount()
                _this.memberList.splice(_this.memberList.indexOf($parent.attr('userUniId')), 1)
            });


        }

    },
    createzNodes: function (newStructList, orgList, orgMemberList, zNodes, pId) {
        var _this = this;
        return new Promise(function (resolve) {

            for (var i = 0; i < newStructList.length; i++) {
                var Nodeid = parseInt(pId.toString() + (i + 1).toString());
                var curorgStruct = newStructList[i];
                var curNode;
                var orgid = curorgStruct['id'];
                if (curorgStruct['type'] == 1) { //成员
                    for (var j = 0; j < orgMemberList.length; j++) {
                        var curorgMember = orgMemberList[j];
                        if (curorgMember['id'] == curorgStruct['orgMemberId']) {
                            var imagpath = curorgMember['photoResId'];
                            var userUniId = curorgMember['userUniId'];
                            var status = ''

                            if (_this.memberList.indexOf(userUniId) > -1) {

                                status = true;
                            } else {
                                status = false;
                            }

                            curNode = {
                                id: Nodeid,
                                pId: parseInt(pId),
                                name: curorgStruct['name'],
                                icon: './images/defuser.png',
                                orgid: orgid,
                                userUniId: userUniId,
                                imagpath: imagpath,
                                imageId: 0,
                                checked: status
                            };
                            zNodes.push(curNode);
                            break;
                        }
                    }
                }

                else {//组织结构
                    //orgList.push(curorgStruct);
                    var orgid = curorgStruct['id'];

                    var userUniId = curorgStruct['userUniId'];

                    if (_this.memberList.indexOf(orgid) > -1) {

                        status = true;
                    } else {
                        status = false;
                    }

                    curNode = {
                        id: Nodeid,
                        pId: parseInt(pId),
                        name: curorgStruct['name'],
                        //iconSkin: 'diy01',
                        orgid: orgid,
                        isParent: true,
                        userUniId: userUniId,
                        checked: status
                    };

                    zNodes.push(curNode)
                }
            }

            resolve(zNodes)
        })
    },
    //确认所选的联系人
    ConfirmContact: function (strId, callback) {
        var _this = this;

        $('.contacts_right .btnOK').click(function () {
            var Contactlist = [];

            $(".SelecedContact li", strId).each(function (index, ele) {

                var $ele = $(this);

                var userUniId = $(this).attr('userUniId');

                var tId = $ele.attr('tId');
                var strImgePath = $ele.children().eq(0).attr('src');
                var strName = $ele.children().eq(1).html();
                var obj = null;
                if ($ele.attr('isstruct')) {
                    obj = {userUniId: userUniId, tId: tId, ImgePath: strImgePath, name: strName, isstruct: true}
                    Contactlist.push(obj)

                } else {
                    obj = {userUniId: userUniId, tId: tId, ImgePath: strImgePath, name: strName, isstruct: false}
                    Contactlist.push(obj)
                }

            });

            if (Contactlist.length == 0) {

                my_layer({message: '请选择联系人或是组织来创建群聊'}, 'warn', function () {

                });
                return;
            }


            if (Object.prototype.toString.call(callback) === '[object Function]') {

                callback(Contactlist);
            }
            //$(this).off();
        })


    },
    Closecontacts: function (strId, callback) {

        $('.Winclose', strId).on('click', function () {

            $(strId).hide();
            $('.contacts_right .btnOK', strId).off();
            $(this).off();
            if (Object.prototype.toString.call(callback) === '[object Function]') {
                callback();
            }

        });

    },
    Cancelcontacts: function (strId, callback) {

        $('.btnCancel', strId).on('click', function () {
            $(strId).hide();
            $('.contacts_right .btnOK', strId).off();
            $(this).off();
            if (Object.prototype.toString.call(callback) === '[object Function]') {
                callback();
            }

        });
    },
    showContactPerson: function (strId) {

        if (this.ContactPerson == null) {
            $('.Contact_load', strId).show();
            var _this = this;
            var parm = [];

            try {
                window.lxpc.exebusinessaction('notice', 'QueryContact', '0', JSON.stringify(parm), 0, function (status, datalist, targ) {
                    $('.Contact_load', strId).hide();
                    if (status == 0) {

                        var data = JSON.parse(datalist)
                        if (data.length == 0) {

                            var str = ' <span style="display: block;text-align: center;font-size:14px ;line-height: 40px;height: 40px;">暂无联系人</span>'

                            if ($('#contacts_person_scroll').children().length == 0) {
                                $('#contacts_person_scroll').append(str);

                                return;
                            }

                        }
                        _this.ContactPerson = JSON.parse(datalist).sort(function (a, b) {
                            return a.Abbreviation.localeCompare(b.Abbreviation)
                        });

                        var arry = _this.ContactPerson.slice(0);
                        var list = [];
                        for (var i = 0; i < arry.length; i++) {

                            var curtem = arry[i];

                            var Firstchart = curtem.Abbreviation.charAt(0);
                            var nameGrouplist = [];
                            nameGrouplist.push(curtem);
                            for (var j = i + 1; j < arry.length; j++) {
                                var compareditem = arry[j];
                                var comparedName = compareditem.Abbreviation.charAt(0);
                                if (Firstchart == comparedName) {
                                    nameGrouplist.push(compareditem);
                                    arry.splice(j, 1);
                                    j--;
                                }
                            }
                            list.push(nameGrouplist)
                        }

                        arry = null;
                        var str = '<div>';

                        for (var m = 0; m < list.length; m++) {

                            str += '<h6 class="contactType">' + (list[m][0].Abbreviation.charAt(0)).toUpperCase() + '</h6><ul>';
                            var curgroup = list[m];

                            for (var n = 0; n < curgroup.length; n++) {
                                var curPerson = curgroup[n];
                                var sName = '',
                                    branch = curPerson.branchPath;
                                if (branch == '' || typeof (branch) == 'undefined' || branch == null) {
                                    branch = ''
                                }

                                if (curPerson.name == '' || curPerson.name == null || typeof(curPerson.name) == 'undefined') {
                                    sName = '未知'
                                }
                                else if (curPerson.contactDomain == curPerson.recordDomain) {
                                    sName = curPerson.name
                                } else {
                                    sName = curPerson.name + '<i class="contact_info">外</i>'
                                }

                                var status = ''

                                if (typeof(_this.existeduserlist) != 'undefined' && _this.existeduserlist[0].userUniId == curPerson.contactUniId) {
                                    status = 'checked'
                                } else {
                                    status = 'unchecked'
                                }

                                str += '<li userUniId="' + curPerson.contactUniId + '"><em class="' + status + '" ></em><img photoResId="' + curPerson.photoResId + '" src="./images/persion.png" alt=""><span >' + sName + '</span><span title="' + branch + '">' + branch + '</span></li>'
                            }
                            str += '</ul>'
                        }
                        str += '</div>';


                        $('#contacts_person_scroll').append(str);
                        _this.Scrollleft.refresh();

                        //获取头像

                        _this.getHeadImg($('.contacts_person_scroll img'))
                        //$('.contacts_person_scroll img').each(function (index, ele) {
                        //
                        //    _this.imageId = _this.imageId + 1;
                        //    var imgstr = $(ele).attr('photoResId');
                        //    $(ele).attr('imageId', _this.imageId);
                        //    var parm = {resourceList: [{photoResId: imgstr}]};
                        //    _this.getImgePath(parm, _this.imageId, function (result, targ) {
                        //
                        //        $('.contacts_person_scroll img[imageId="' + targ + '"]').attr('src', result)
                        //
                        //    })
                        //})


                        $('#contacts_person_scroll em').on('click', function (e) {

                            var that = this;

                            var $li = $($(this).parent())
                            var userId = $li.attr('userUniId');
                            var imgpath = $li.children('img').attr('src');
                            var name = $li[0].getElementsByTagName('span')[0].innerHTML;

                            if ($(this).hasClass('unchecked')) {
                                $(this).removeClass('unchecked').addClass('checked');

                                var str = '';

                                if (_this.existeduserlist && _this.existeduserlist[0].userUniId == userId) {
                                    return;
                                }

                                if (_this.memberList.indexOf(userId) > -1) {
                                    return;//有相同userUniID的不再加进去
                                } else {
                                    _this.memberList.push(userId);
                                }

                                str += '<li  userUniId="' + userId + '" ><img src="' + imgpath + '" alt="" ><span>' + name + '</span><em></em></li>';

                                $('.contacts_right_scroll .SelecedContact').append(str);


                                _this.updataCount()

                                $('em', '.SelecedContact li[userUniId="' + userId + '"]').click(function () {
                                    $(that).removeClass('checked').addClass('unchecked');
                                    $(this).parent().remove();

                                    _this.updataCount()
                                })
                            } else {
                                $(this).removeClass('checked').addClass('unchecked');
                                if (_this.existeduserlist && _this.existeduserlist[0].userUniId == userId) {
                                    return;
                                }
                                $('.contacts_right_scroll .SelecedContact li[userUniId="' + userId + '"]').remove()


                                _this.updataCount()
                                var index = _this.memberList.indexOf(userId);
                                _this.memberList.splice(index, 1);

                            }

                            _this.mystopPropagation(e);

                        });
                        $('#contacts_person_scroll li').on('click', function () {

                            var that = this;
                            var $li = $(this);
                            var $em = $li.children('em')
                            var userId = $li.attr('userUniId');
                            var imgpath = $li.children('img').attr('src');
                            var name = $li[0].getElementsByTagName('span')[0].innerHTML;


                            if ($em.hasClass('unchecked')) {
                                $em.removeClass('unchecked').addClass('checked');

                                var str = '';
                                if (_this.existeduserlist && _this.existeduserlist[0].userUniId == userId) {
                                    return;
                                }

                                if (_this.memberList.indexOf(userId) > -1) {
                                    return;//有相同userUniID的不再加进去
                                } else {
                                    _this.memberList.push(userId);
                                }

                                str += '<li  userUniId="' + userId + '" ><img src="' + imgpath + '" alt="" ><span>' + name + '</span><em></em></li>';

                                $('.contacts_right_scroll .SelecedContact').append(str);

                                _this.updataCount()
                                $('em', '.SelecedContact li[userUniId="' + userId + '"]').click(function () {

                                    $em.removeClass('checked').addClass('unchecked');
                                    $(this).parent().remove();

                                    _this.updataCount()
                                })

                            } else {
                                $em.removeClass('checked').addClass('unchecked');
                                if (_this.existeduserlist && _this.existeduserlist[0].userUniId == userId) {
                                    return;
                                }
                                $('.contacts_right_scroll .SelecedContact li[userUniId="' + userId + '"]').remove()

                                _this.updataCount()

                                var index = _this.memberList.indexOf(userId);
                                _this.memberList.splice(index, 1);
                            }


                        });

                    } else {
                        console.log(status)
                    }
                })
            }
            catch (e) {
                console.log(e.message)
            }
        } else {


            this.Scrollleft.refresh();
        }


    },
    showContactStruct: function () {
        //获取数据

        if (this.zTree == null) {


            var option = scrollSetings();
            if (this.Scrollleft == null) {
                this.Scrollleft = new IScroll('#scroll', option);
            } else {
                this.Scrollleft.refresh();
            }
            var parm = {parm: {structId: 0}, pId: 0};
            this.getstruct(null, parm);

        } else {

        }
    },
    SearchContact: function (search) {
        var _this = this;


        $('.noSearch').hide()
        $('#contacts_search_scroll .contacts_search_con').empty();
        var str = search.trim();
        if (str == '' || str == null) {
            return;
        }

        try {
            var parm = {searchKeyWord: str};

            var PersonContacts = [], StructContacts = [];
            _this.serachId = _this.serachId + 1;
            var itarg = _this.searchId;

            window.lxpc.exebusinessaction('Notice', 'SearchContact', '0', JSON.stringify(parm), itarg, function (status, datalist, targ) {

                if (status == 0) {


                    if (targ != _this.searchId) {
                        return;
                    }
                    $('#contacts_search_scroll .contacts_search_con').empty();

                    var data = JSON.parse(datalist);

                    for (var i = 0; i < data.length; i++) {
                        var curData = data[i];

                        var resultlist = curData['resultList'];
                        if (curData['dataType'] == 1) {//联系人

                            for (var k = 0; k < resultlist.length; k++) {
                                PersonContacts.push(resultlist[k])
                            }

                        } else if (curData['dataType'] == 0) {//组织通讯录
                            for (var p = 0; p < resultlist.length; p++) {
                                StructContacts.push(resultlist[p])
                            }
                        }

                    }

                    if (PersonContacts.length == 0 && StructContacts.length == 0) {

                        $('.noSearch').show();
                        return;
                    }

                    var str = ''

                    if (PersonContacts.length > 0) {
                        str += '<h6 class="contactType">联系人</h6><ul>';
                        for (var m = 0; m < PersonContacts.length; m++) {
                            var aperson = PersonContacts[m];

                            var sName = '',
                                branch = aperson.branchPath;

                            if (branch == '' || branch == null || typeof(branch) == 'undefined') {
                                branch = ''
                            }

                            if (aperson.contactDomain == aperson.recordDomain) {
                                sName = aperson.name
                            } else {
                                sName = aperson.name + '<i class="contact_info">外</i>'
                            }
                            var checkstatus = ''
                            if (_this.memberList.indexOf(aperson['contactUniId']) > -1) {

                                checkstatus = 'checked'

                            } else {
                                checkstatus = 'unchecked'
                            }

                            str += '<li userUniId="' + aperson['contactUniId'] + '"><em class="' + checkstatus + '" ></em><img photoResId="' + aperson.photoResId + '" src="./images/persion.png" alt=""><span >' + sName + '</span><span>' + aperson.branchPath + '</span></li>'
                        }
                        str += '</ul>'

                    }
                    if (StructContacts.length > 0) {
                        str += '<h6 class="contactType">组织联系人</h6><ul>';
                        for (var m = 0; m < StructContacts.length; m++) {
                            var astruct = StructContacts[m];


                            var checkstatus = ''
                            if (_this.memberList.indexOf(astruct['contactUniId']) > -1) {

                                checkstatus = 'checked'

                            } else {
                                checkstatus = 'unchecked'
                            }


                            str += '<li userUniId="' + astruct['userUniId'] + '"><em class="' + checkstatus + '" ></em><img photoResId="' + astruct.photoResId + '" src="./images/persion.png" alt=""><span >' + astruct.name + '</span><span>' + astruct.path + '</span></li>'

                        }
                        str += '</ul>'
                    }
                    //str+='</ul>'

                    //str += '';

                    $('.contacts_search_scroll .contacts_search_con').append(str);
                    _this.Scrollleft.refresh();
                    _this.Scrollsearch.refresh();

                    //获取头像

                    _this.getHeadImg($('.contacts_search_scroll img'))

                    //绑定事件用于选择新的联系人
                    $('.contacts_search_scroll em').on('click', function (e) {
                        var that = this;

                        var $li = $($(this).parent())
                        var userId = $li.attr('userUniId');
                        var imgpath = $li.children('img').attr('src');
                        var name = $li[0].getElementsByTagName('span')[0].innerHTML;

                        if ($(this).hasClass('unchecked')) {
                            $(this).removeClass('unchecked').addClass('checked');
                            var str = '';

                            if (_this.memberList.indexOf(userId) > -1) {
                                return;//有相同userUniID的不再加进去
                            } else {
                                _this.memberList.push(userId);
                            }

                            str += '<li  userUniId="' + userId + '" ><img src="' + imgpath + '" alt="" ><span>' + name + '</span><em></em></li>';
                            $('.contacts_right_scroll .SelecedContact').append(str);


                            _this.updataCount();

                            $('.SelecedContact li:last em').click(function () {

                                var $ele = $(this),
                                    index = $('.SelecedContact li em').index($ele);

                                $('.contacts_search_con li[userUniId="' + _this.memberList[index] + '"] em ').removeClass('checked').addClass('unchecked');

                                $(this).parent().remove();
                                _this.memberList.splice(index, 1);

                                _this.updataCount()
                            })


                        } else {
                            $(this).removeClass('checked').addClass('unchecked');
                            $('.contacts_right_scroll .SelecedContact li[userUniId="' + userId + '"]').remove()

                            _this.updataCount()
                            var index = _this.memberList.indexOf(userId);
                            _this.memberList.splice(index, 1);
                        }

                        _this.mystopPropagation(e)

                    });

                    $('.contacts_search_scroll li').on('click', function () {
                        var that = this;

                        var $li = $(this);
                        var $em = $li.children('em');
                        var userId = $li.attr('userUniId');
                        var imgpath = $li.children('img').attr('src');
                        var name = $li[0].getElementsByTagName('span')[0].innerHTML;

                        if ($em.hasClass('unchecked')) {
                            $em.removeClass('unchecked').addClass('checked');
                            var str = '';

                            if (_this.memberList.indexOf(userId) > -1) {
                                return;//有相同userUniID的不再加进去
                            } else {
                                _this.memberList.push(userId);
                            }

                            str += '<li  userUniId="' + userId + '" ><img src="' + imgpath + '" alt="" ><span>' + name + '</span><em></em></li>';
                            $('.contacts_right_scroll .SelecedContact').append(str);
                            //$('.contacts_right h5').html('已选取' + $('.SelecedContact li').length + '人');
                            _this.ScrollRight.refresh();

                            $('.SelecedContact li:last em').click(function () {

                                var $ele = $(this),
                                    index = $('.SelecedContact li em').index($ele);

                                $('.contacts_search_con li[userUniId="' + _this.memberList[index] + '"] em ').removeClass('checked').addClass('unchecked');

                                $(this).parent().remove();
                                _this.memberList.splice(index, 1);

                                _this.updataCount()

                            })


                        } else {
                            $em.removeClass('checked').addClass('unchecked');
                            $('.contacts_right_scroll .SelecedContact li[userUniId="' + userId + '"]').remove()

                            _this.updataCount()
                            _this.ScrollRight.refresh();
                            var index = _this.memberList.indexOf(userId);
                            _this.memberList.splice(index, 1);
                        }

                        _this.updataCount()

                    });


                } else {
                    console.log(status)
                }
            })

        } catch (e) {
            console.log(e.message)
        }

    },
    getImgePath: function getImgePath(parm, starg, callback) {
        try {
            window.lxpc.exebusinessaction('DownloadResource', 'HeaderImage', '0', JSON.stringify(parm), parseInt(starg), function (status, result, targ) {

                if (status == 0) {

                    if (Object.prototype.toString.call(callback) === '[object Function]') {
                        callback(result, targ);
                    }

                } else {
                }
            })
        } catch (e) {
            console.log(e.message)
        }

    },
    mystopPropagation: function mystopPropagation(e) {
        var ev = e || window.event;
        if (ev.stopPropagation) {
            ev.stopPropagation();
        } else {
            ev.cancelBubble = true;
        }
    },
    getHeadImg: function ($imgs) {
        var _this = this;
        $imgs.each(function (index, ele) {

            _this.imageId = _this.imageId + 1;
            var imgstr = $(ele).attr('photoResId');
            $(ele).attr('imageId', _this.imageId);
            var parm = {resourceList: [{photoResId: imgstr}]};
            _this.getImgePath(parm, _this.imageId, function (result, targ) {

                $imgs.filter('[imageId="' + targ + '"]').attr('src', result)

            })
        })
    },
    updataCount: function () {
        var _this = this;
        var org_count = $('.SelecedContact li[isstruct="true"]').length;
        var allcount = $('.SelecedContact li').length

        $('.org_count').html(org_count)
        $('.per_count').html(allcount - org_count);
        _this.ScrollRight.refresh();
    }

};






