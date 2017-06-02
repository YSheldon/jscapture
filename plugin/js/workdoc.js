function Doc() {
    this.mainScroll = null;
    this.fileId = 0;
    this.delUrl = null;
    this.searchUrl = null;
    this.searchUrlfromfoler = null;
    this.searchId = 0;
    this.loadDownId = 0
    this.lev = 1;
}
Doc.prototype = {
    constructor: Doc,
    loadScroll: function loadScroll() {

        var option = {
            probeType: 2,
            scrollbars: "custom",
            mouseWheel: true,
            bounce: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale'
        };
        this.mainScroll = new IScroll('#wrapper', option);
    },
    setFileInitStatus: function (resId, fileId, cb) {

        var parm = {fileResId: resId};

        try {
            window.lxpc.exebusinessaction('ChatRecord', 'CheckResource', '0', JSON.stringify(parm), fileId, function (status, result, targ) {
                if (status == 0) {

                    var data = JSON.parse(result);

                    if (Object.prototype.toString.call(cb) == '[object Function]') {
                        cb(data, targ)
                    }


                } else {
                    console.log(status)
                }


            })

        } catch (e) {
            console.log(e.message)
        }


    },
    //下载文件
    loadDownFile: function (parm, size, $tr, $box) {

        //var parm = {resourceList: [{resourceType: 'res_file', fileName: filename, photoResId: resId}]}
        var _this = this;
        var total = 0;

        size = DeFormatSize(size);


        $tr.find('.docR_downL_c').show()
        $tr.find('.docR_time').hide();
        $tr.find('.aV_a').hide();
        $tr.find('.downTip').show();

        $tr.find('.reAction').hide()
        $tr.data('isCancle', false)
        var index = $tr.index()


        try {
            window.lxpc.exebusinessaction('DownloadResource', 'Workdoc', '0', JSON.stringify(parm), index, function (status, result, targ) {

                var $tr = $box.find('tbody tr:eq(' + targ + ')');
                if (status == 0) {

                    var $progress = $tr.find('.progress')
                    var fileSize = $tr.data('size');
                    var progress = ''

                    var resId = $tr.data('value')

                    if (result.indexOf('\\') > -1) {

                        $tr.data('path', result);
                        var $down = $tr.find('.docR_downL_btn');
                        var $save = $tr.find('.docR_saveAsL_btn')
                        $down.html('打开')
                        $down.data('action', 'open')

                        $save.html('打开文件夹')
                        $save.data('action', 'openfolder')


                        $progress.css('width', '100%')
                        $tr.find('.docR_downL_c').hide();
                        $tr.find('.docR_time').show();

                        $tr.find('.aV_a').show();
                        $tr.find('.downTip').hide();
                        $tr.find('.reAction').hide();

                    } else {

                        var data = JSON.parse(result);
                        if (Object.prototype.toString.call(data) == '[object Array]') {

                            $tr.data('stoptarg', data[0][resId])

                        } else {
                            var total = $tr.data('total') || 0
                            total += parseFloat(result)
                            $tr.data('total', total)

                            var fileSize = DeFormatSize(fileSize) || size

                            progress = (total / fileSize) * 100 + '%'
                            $progress.css('width', progress)
                        }


                    }

                } else {

                    if (!$tr.data('isCancle')) {//不是由于手动取消引起的下载错误
                        $tr.find('.aV_a').hide()
                        $tr.find('.reAction').show();
                        $tr.find('.downTip').html('下载失败').show().css('color', 'red').data('action', '');
                        $tr.find('.reAction').data('action', 'down')
                    }


                }
            })
        } catch (e) {
            console.log(e.message)
        }

    },
    //右键菜单
    RightClickSmart: function ($ele) {

        var _this = this;
        var docR_default = [
            [{
                text: "删除",
                func: delWorkDoc
            }]
        ];

        $ele.smartMenu(docR_default, {
            name: "del"
        });

        function openfile() {

            var $tr = $(this)
            var $button = $tr.find('.aV_a')
            var action = $button.data('action')


            if (action == 'open') {
                var parm = {filePath: $tr.data('path')}

                _this.openfile(parm)
            } else if (action == 'down') {

                var name = $tr.data('name')
                var resId = $tr.data('value')
                var size = $tr.data('size')

                $tr.find('.docR_downL_c').show()
                var parm = {resourceList: [{resourceType: 'res_file', fileName: name, photoResId: resId}]}

                new Promise(function (resolve, reject) {

                    _this.loadDownFile(parm, size, $tr)
                    resolve()

                }).then(function () {

                    var parm = {filePath: $tr.data('path')};

                    _this.openfile(parm)
                })


            }


        }

        function delWorkDoc() {

            var $tr = $(this)
            var fileId = $tr.data('fileid');
            var request = _this.delUrl + '&' + 'fileId=' + fileId;

            var path = $tr.data('path')

            var parm = {deleteWorkDocFileUrl: request, deleteWorkDocPath: path}
            _this.DeleteWorkDocFile(parm, function (data) {

                $tr.remove();

            })


        }


    },
    //打开文件
    openfile: function (parm) {

        //var parm=  {filePath:$down.data('path')};

        try {
            window.lxpc.exebusinessaction('ChatRecord', 'OpenFile', '0', JSON.stringify(parm), 0, function (status, result, targ) {

            })

        } catch (e) {
            console.log(e.message)
        }


    },
    //打开文件夹
    openFoder: function (parm) {
        //var parm = {filePath: $saveAs.data('path')}

        try {
            window.lxpc.exebusinessaction('ChatRecord', 'OpenFileDir', '0', JSON.stringify(parm), 0, function (status, result, targ) {

            })

        } catch (e) {
            console.log(e.message)
        }
    },
    //文件另存为
    savaAs: function ($tr, $box) {

        var _this = this;

        var index = $tr.index()
        var name = $tr.data('name')

        var openparm = {fileName: name}
        try {
            window.lxpc.exebusinessaction('ChatRecord', 'OpenSaveAsWnd', '0', JSON.stringify(openparm), index, function (status, result, targ) {

                if (status == 0) {

                    var data = JSON.parse(result),
                        filePath = data.filePath;

                    var index = filePath.lastIndexOf('\\'),
                        path = filePath.substring(0, index)

                    $tr.data('path', path);

                    var name = $tr.data('name')
                    var resId = $tr.data('value')
                    var size = $tr.data('size');

                    var parm = {
                        resourceList: [{
                            resourceType: 'res_file',
                            fileName: name,
                            photoResId: resId,
                            filePath: path
                        }]
                    }

                    _this.loadDownFile(parm, size, $tr, $box)


                } else {
                    console.log(status)
                }

            })


        } catch (e) {
            console.log(e.message)
        }

    },
    //停止下载
    StopDownloadReource: function (parm, $tr) {
        //var parm={stopResMark:[{ 'ec006816-8f3d-4309-be04-3dc3ed61ab7b':45645}]}
        try {
            window.lxpc.exebusinessaction('DownloadResource', 'StopDownloadReource', '0', JSON.stringify(parm), 0, function (status, result, targ) {

            })

        } catch (e) {
            console.log(e.message)
        }
    },
    //停止上传
    StopUploadReource: function (parm) {
        //var parm={stopResMark:[{ 'ec006816-8f3d-4309-be04-3dc3ed61ab7b':45645}]}
        try {
            window.lxpc.exebusinessaction('UploadResource', 'StopUploadReource', '0', JSON.stringify(parm), 0, function (status, result, targ) {

            })

        } catch (e) {
            console.log(e.message)
        }
    }


}

function Workdoc() {

    //this.init();
}
Workdoc.prototype = new Doc();
//获取数据
Workdoc.prototype.init = function () {
    this.loadScroll();
    this.bindEvent();
    this.bindInitData();
}

Workdoc.prototype.bindEvent = function () {
    var secText = "搜索";
    var _this = this;
    var timer = null;
    var $search = $("#secText");
    var $del = $(".sec_del")
    var $scroll = $('.scroll')
    var curposition;
    var strSearch = ''

    $search.focusin(function () {
        curposition = $scroll.css('left')

        if ($(this).val() == '' || $(this).val() == secText) {
            $(this).addClass("ipt")
            $(this).val('')
            $('.lev_Seach').remove()
        } else {
            strSearch = $(this).val()
        }
        $(this).parents(".doc_secIpt").addClass("doc_secIpt2")

        timer = setInterval(search, 500)


    }).focusout(function () {
        clearInterval(timer);
        $(this).parents(".doc_secIpt").removeClass("doc_secIpt2")
        if ($(this).val() == '') {
            $(this).removeClass("ipt")
            $('.lev_Seach').remove();
            $(this).val(secText)
        }
    });
    $search.each(function () {
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
        $(this).parents(".doc_secIpt").removeClass("doc_secIpt2")
        $(this).css({"visibility": "hidden"})
        $(this).siblings("#secText").removeClass("ipt")
        $scroll.css('left', curposition)
        strSearch = ''
        $('.lev_Seach').remove();
        $('.lev1').removeClass('aV_a')
        $('.lev1').css('cursor', 'default')
    })


    function search() {

        var txt = '';
        txt = $('#secText').val().trim()

        if (txt == '' || txt == secText) {

            $del.hide();

            $scroll.css('left', curposition)
            $('.lev_Seach').remove()
            //$('.docR_search').hide();
            //$('.docR_search').empty();
            strSearch = ''
            return;

        } else {

            $del.show();
            //$scroll.css('left', '-200%')

        }
        if (strSearch == txt) {
            //$('.Contact_load').hide()

            return;
        } else {

            strSearch = txt;
            $scroll.css('left', '-200%');
            //var search=$("#secText").val()
            var strTop = `<span class="lev_Seach"><em></em>搜索" ${XssToString(txt)} "的结果</span>`;
            $('.lev_Seach').remove()
            $('.docR_nav').append(strTop)
            _this.SearchWorkDocFile()
        }

    }


    $('.docR_level1 tr').click(function () {
        var docRW = $('.docR_msgList')[0].offsetWidth;
        $('.scroll').animate({left: '-100%'}, 500)
        $('#secText').blur();

    })

//返回上一级
    $('.lev1').click(function () {
        _this.lev = 1;
        $('.scroll').animate({left: '0'}, 500);
        _this.mainScroll.refresh();
        $('.lev2').remove();
        $('.lev_Seach').remove()
        $('.lev1').removeClass('aV_a')
        $('.lev1').css('cursor', 'default')
        $('#secText').val('')
        strSearch = ''
        $('#secText').blur();

    })


}
//获取初始化数据---root层文件夹信息
Workdoc.prototype.bindInitData = function () {
    var _this = this;
    try {
        var parm = {};

        window.lxpc.exebusinessaction('WorkDoc', 'InitFinished', '0', JSON.stringify(parm), 0, function (status, result, targ) {
            if (status == 0) {

                var data = JSON.parse(result),
                    surl = data.url;

                var parm1 = {workDocUrl: surl};
                window.lxpc.exebusinessaction('WorkDoc', 'GetWorkDocInfo', '0', JSON.stringify(parm1), 0, function (status, result, targ) {
                    if (status == 0) {


                        var data = JSON.parse(result),
                            contentlist = data.content;
                        _this.searchUrl = contentlist[0].headerView.actions[0].action

                        var str = '';
                        for (var i = 0, ln = contentlist.length; i < ln; i++) {

                            var curitem = contentlist[i],
                                cells = curitem['cells'],
                                FileListUrl = curitem.actions[0].action;

                            _this.bindFolderdata(cells, $('.docR_level1'), FileListUrl)


                        }


                    } else {

                        my_layer({message: '请求数据发生错误'}, 'error', function () {

                        })
                    }
                    $('.loading').hide()


                })

            } else {
                my_layer({message: '请求数据发生错误'}, 'error', function () {

                })
            }
        })
    }
    catch (e) {
        my_layer({message: '请求数据发生错误'}, 'error', function () {

        })
    }


}
//获取文件夹下的文件列表
Workdoc.prototype.QueryWorkDocFileList = function (request) {
    var _this = this;

    var parm = {queryWorkDocFileListUrl: request};

    try {
        window.lxpc.exebusinessaction('WorkDoc', 'QueryWorkDocFileList', '0', JSON.stringify(parm), 0, function (status, result, targ) {

            if (status == 0) {
                $('.loading').hide();
                $('.scroll').animate({left: '-100%'}, 500);
                //var strTop=`<span class="lev2">蓝信资料<em></em></span>`;
                //$('.lev1').addClass('opc4')
                //$('.docR_nav').append(strTop)

                var data = JSON.parse(result),
                    contentlist = data.content;

                _this.bindFiledata(contentlist[0].cells, $('.docR_level2'))
                _this.mainScroll.refresh();

                $('.lev1').css('cursor', 'pointer')
//返回上一级


                //获取接口

                var actions = contentlist[0].actions
                var del_url = ''
                for (var i = 0; i < actions.length; i++) {

                    var action = actions[i];
                    if (action.actionType == 'delete') {
                        del_url = action.action
                    }
                }

                var search_url = contentlist[0].headerView.actions[0].action;

                _this.delUrl = del_url;
                _this.searchUrlfromfoler = search_url;

            } else {
                my_layer({message: '请求数据发生错误'}, 'error')
                $('.loading').hide();
            }

        })
    } catch (e) {
        my_layer({message: e.message}, 'error')
        $('.loading').hide();

    }

}
//删除工作文档
Workdoc.prototype.DeleteWorkDocFile = function (parm, cb) {

    try {
        window.lxpc.exebusinessaction('WorkDoc', 'DeleteWorkDocFile', '0', JSON.stringify(parm), 0, function (status, result, targ) {

            if (status == 0) {

                var data = JSON.parse(result).response;
                if (data.state == 'Failed') {

                    my_layer({message: '文件已经发布，不能删除！'}, 'warn')

                } else {
                    if (Object.prototype.toString.call(cb) == '[object Function]') {
                        cb(result)
                    }

                }


            }
        })
    } catch (e) {
        console.log(e.message)
    }


};
//搜索工作文档
Workdoc.prototype.SearchWorkDocFile = function (parm) {
    var _this = this;
    var search = $('#secText').val();

    if (search.trim() == '') {
        return;
    }
    var request;

    if (_this.lev == 1) {
        request = _this.searchUrl + '&' + 'searchKey=' + search.trim()
    } else if (_this.lev == 2) {
        request = _this.searchUrlfromfoler + '&' + 'searchKey=' + search.trim()
    }

    var parm = {searchWorkDocFileUrl: request}
    _this.searchId += 1

    $('.docR_search ').empty()

    $('.loading ').show()

    try {
        window.lxpc.exebusinessaction('WorkDoc', 'SearchWorkDocFile', '0', JSON.stringify(parm), _this.searchId, function (status, result, targ) {

            if (status == 0) {

                if (targ != _this.searchId) {
                    return;
                }

                var cells = JSON.parse(result).cells;

                //var search=$("#secText").val()
                //var strTop = `<span class="lev_Seach">搜索" ${search} "的结果<em></em></span>`;

                $('.lev1').addClass('aV_a')
                $('.lev1').css('cursor', 'pointer')
                //$('.lev_Seach').remove()
                //$('.docR_nav').append(strTop)

                if (cells.length > 0) {

                    _this.bindFiledata(cells, $('.docR_search'))


                } else {

                    $('.docR_search').append('<div class="search_null">无搜索结果</div>')
                }
                $('.loading ').hide()


            }else{
                $('.loading ').hide()
                $('.docR_search').append('<div class="search_null">无搜索结果</div>')
            }
        })
    } catch (e) {
        console.log(e.message)
    }


};
//绑定文件夹的内容
Workdoc.prototype.bindFolderdata = function bindFolderdata(cells, $box, FileListUrl) {

    var _this = this;
    var str = ''
    for (var j = 0; j < cells.length; j++) {
        var curcell = cells[j];
        str += `<tr folderid="${curcell.id}" data-title="${curcell.title}">
                            <td>
                                <div class="docR_table_folder">
                                    <img src="images/folder.png" />
                                    <div>
                                        <h4 >${curcell.title}</h4>
                                        <p >${curcell.subTitle}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>`

    }

    $('tbody', $box)
    $('tbody', $box).append(str)

    _this.mainScroll.refresh();

    //点击进入下一级

    if (FileListUrl) {
        $('tbody tr', $box).click(function () {
            _this.lev = 2;
            $('.loading').show();
            $('#secText').blur();
            var title = $(this).data('title')
            var strTop = `<span class="lev2"><em></em>${title}</span>`;

            $('.lev1').addClass('aV_a')
            $('.docR_nav').append(strTop)

            var $ele = $(this),
                folderid = $ele.attr('folderid'),
                request = FileListUrl + '&' + 'folderId=' + folderid;

            $('.docR_level2').empty();
            _this.QueryWorkDocFileList(request)
        })
    }

}
//绑定文件的内容
Workdoc.prototype.bindFiledata = function bindFiledata(cells, $box) {
    var _this = this;
    var str = '';

    str += `  <table class="docR_table docR_tableS">
                        <thead class="Freezing">
                        <tr>
                            <th>名称</th>
                            <th>时间</th>
                            <th>大小</th>
                            <th class="miW90">操作</th>
                        </tr>
                        </thead>
                        <tbody>`

    for (var j = 0, ln1 = cells.length; j < ln1; j++) {

        var curcell = cells[j],
            fileType = curcell.fileType,
            status = curcell.status,
            subTitle = curcell.subTitle,
            titleArry = subTitle.split(','),
            size = titleArry[0],
            time = titleArry[1],
            action = '',
            fileStatus = ''


        var newTime = resetTime(time);

        if (status == 'false') {

            fileStatus = curcell.subTitle.split(',')[2];
            action = 'docR_audit'
        } else {

            fileStatus = `<a href="javascript:;" class="aV_a docR_downL_btn " data-action="down" onclick="loadDownFile(this)" >下载</a><a href="javascript:;" class="aV_a docR_saveAsL_btn " data-action="saveas" onclick="savaAsOrOpenFoder(this)">另存为</a><a class="aV_a downTip  disN" data-action="stopDown" onclick="StopDownloadReource(this) ">取消下载</a>`;
            action = 'docR_download'//docR_open
        }


        var path = ''

        switch (fileType) {
            case 'pptx':
            case 'ppt':
            case 'pps':
            case 'pot':
                path = './images/ppt.png'
                break;
            case 'audio':
                path = './images/audio.png'
                break;
            case 'doc':
            case 'docx':
            case 'dot':
                path = './images/doc.png'
                break;
            case 'pdf':
                path = './images/audio.png'
                break;
            case 'html':
            case 'htm':
                path = './images/html.png'
                break;
            case 'zip':
                path = './images/zip.png'
                break;
            case 'js':
                path = './images/js.png'
                break;
            case 'mov':
                path = './images/mov.png'
                break;
            case 'xls':
            case 'xlsx':
                path = './images/xls.png'
                break;
            default:
                path = curcell.icon;
                break;

        }

        var strName = curcell.title + '.' + curcell.fileType

        str += ` <tr class="${action}" data-name="${strName}" data-value="${curcell.value}" data-size="${curcell.fileSize}" data-fileid="${curcell.id}" ondblclick="loadDownFile(this)">
                            <td>
                                <div class="docR_table_file" title="${curcell.title}">
                                    <img src="${path}" />
                                    <div title="${curcell.title}">${curcell.title}</div>
                                </div>
                            </td>
                            <td ><span class="docR_time">${newTime}</span><div class="docR_downL_c disN">
                                        <div class="docR_downL_cL">
                                            <p><span class="progress" style="width:0;"></span></p>
                                        </div>
                                    </div></td>
                            <td>${size}</td>
                            <td>${fileStatus}</td>
                        </tr>
                        `


    }
    $box.append(str);

    //初始化文件状态
    _this.loadDownId = 0;
    for (var j = 0, ln1 = cells.length; j < ln1; j++) {

        var curcell = cells[j];

        _this.setFileInitStatus(curcell.value, j, function (data, targ) {

            var $tr = $(' tbody tr:eq(' + targ + ') ', $box);
            var $down = $tr.find('.docR_downL_btn');
            var $save = $tr.find('.docR_saveAsL_btn')

            if (data.filePath) {
                $tr.addClass('docR_download')
                $down.html('打开')
                $down.data('action', 'open')

                $save.html('打开文件夹')
                $save.data('action', 'openfolder')
                $tr.data('path', data.filePath);
            }

        })
        //}


    }


    //添加右键功能
    _this.RightClickSmart($('tr ', $box), _this.delUrl)
    //提示
    $('.docR_table_file', $box).showTitle()

};

function MyDoc() {
    this.initData = null;

}
MyDoc.prototype = new Doc();
MyDoc.prototype.init = function () {

    this.loadScroll();
    this.getInitData();
    this.ReceiveCreateMyDocument();//用来接受新的文档
    this.bindEvent();
}
MyDoc.prototype.getInitData = function () {
    var _this = this;

    try {
        var parm = {};

        window.lxpc.exebusinessaction('MyDocument', 'InitFinished', '0', JSON.stringify(parm), 0, function (status, josndata, targ) {
            if (status == 0) {

                var data = JSON.parse(josndata);

                _this.initData = data

                var parm = {documentId: 0, count: 0}

                window.lxpc.exebusinessaction('MyDocument', 'QueryMyDocuments', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
                    if (status == 0) {
                        $('.loading').hide()

                        var data = JSON.parse(jsondata),
                            contentlist = data.documents;

                        if (!contentlist || contentlist.length == 0) {
                            $('.Nofile').show();
                            $('.Freezing').hide();
                            return;
                        }

                        $('.docR_level1 tbody tr').remove();
                        _this.bindFiledata(contentlist, $('.docR_level1'))

                        _this.mainScroll.refresh();
                        $('.lev1').css('cursor', 'pointer')


                    } else {

                        my_layer({message: '请求数据发生错误'}, 'error', function () { })
                    }
                    $('.loading').hide()


                })

            } else {
                my_layer({message: '请求数据发生错误'}, 'error', function () {

                })
                $('.loading').hide()
            }
        })
    }
    catch (e) {
        my_layer({message: '请求数据发生错误'}, 'error', function () {

        })
        $('.loading').hide()
    }


};
//绑定文件的内容
MyDoc.prototype.bindFiledata = function bindFiledata(cells, $box) {
    var _this = this;
    var str = '';


    for (var j = 0, ln1 = cells.length; j < ln1; j++) {

        var curcell = cells[j],
            fileType = curcell.mimeType,

            size = curcell.showSize,
            time = curcell.createTime,
            action = '',
            fileStatus = ''


        var newTime = resetTime(time);


        fileStatus = `<a href="javascript:;" class="aV_a docR_downL_btn " data-action="down" onclick="loadDownFile(this)">下载</a><a href="javascript:;" class="aV_a docR_saveAsL_btn " data-action="saveas" onclick="savaAsOrOpenFoder(this)" >另存为</a><a href="javascript:;" class="aV_a  downTip disN" data-action='stopDown' onclick="StopDownloadReource(this)">取消下载</a><a href="javascript:;" class="aV_a  reAction disN" data-action='down' onclick="loadDownFile(this)">重试</a>`;
        action = 'docR_download'//docR_open


        var path = ''

        var strType = ''

        if (fileType.split('/')[1] == '*') {
            strType = fileType.split('/')[0]
        } else {
            strType = fileType.split('/')[1]
        }
        switch (strType) {
            case 'pptx':
            case 'ppt':
            case 'pps':
            case 'pot':
            case 'vnd.ms-powerpoint':
                path = './images/ppt.png'
                break;
            case 'audio':
            case 'mpeg':
                path = './images/audio.png'
                break;
            case 'doc':
            case 'docx':
            case 'dot':
            case 'msword':
                path = './images/doc.png'
                break;
            case 'pdf':
                path = './images/ml_file_pdf.png'
                break;
            case 'html':
            case 'htm':
                path = './images/html.png'
                break;
            case 'zip':
                path = './images/zip.png'
                break;
            case 'js':
                path = './images/js.png'
                break;
            case 'mov':
            case 'mp4':
                path = './images/mov.png'
                break;
            case 'xls':
            case 'xlsx':
            case 'vnd.ms-excel':
                path = './images/xls.png'
                break;
            case 'png':
            case 'jpg':
            case 'tiff':
            case 'jpeg':
            case 'image':
            case 'gif':
            case 'bmp':


                path = './images/ic_file_jpg@1x.png'
                break;
            default:
                path = curcell.icon || './images/ml_file_default.png';
                break;

        }

        var strName = curcell.title + '.' + curcell.fileType

        str += ` <tr class="${action}" data-name="${curcell.documentName}" data-value="${curcell.resourceId}" data-size="${size}" data-fileid="${curcell.id}" onclick="cliFile(this)" ondblclick="loadDownFile(this)">
                            <td>
                                <div class="docR_table_file" title="${curcell.documentName}">
                                    <img src="${path}" />
                                    <div title="${curcell.documentName}">${curcell.documentName}</div>
                                </div>
                            </td>
                            <td ><span class="docR_time">${newTime}</span><div class="docR_downL_c disN">
                                        <div class="docR_downL_cL">
                                            <p><span class="progress" style="width:0;"></span></p>
                                        </div>
                                    </div></td>
                            <td>${size}</td>
                            <td>${fileStatus}</td>
                        </tr>
                        `


    }
    $('tbody', $box).append(str);


    //初始化文件状态
    _this.loadDownId = 0;
    for (var j = 0, ln1 = cells.length; j < ln1; j++) {

        var curcell = cells[j];

        _this.setFileInitStatus(curcell.resourceId, _this.loadDownId, function (data, targ) {

            var $tr = $(' tbody tr:eq(' + targ + ') ', $box);
            var $down = $tr.find('.docR_downL_btn');
            var $save = $tr.find('.docR_saveAsL_btn')

            if (data.filePath) {
                $tr.addClass('docR_download')
                $down.html('打开')
                $down.data('action', 'open')

                $save.html('打开文件夹')
                $save.data('action', 'openfolder')
                $tr.data('path', data.filePath);
            }
            //_this.bindFileAction($tr, $('.docR_level1'))

        })
        //}
        _this.loadDownId += 1;

        //提示

    }

    //添加右键功能
    _this.RightClickSmart($('tr', $box))
    //提示
    $('.docR_table_file').showTitle()


}

//右键菜单
MyDoc.prototype.RightClickSmart = function ($ele) {

    var _this = this;
    var docR_default = [
        [{
            text: "删除",
            func: delWorkDoc
        }]
    ];

    $ele.smartMenu(docR_default, {
        name: "del"
    });

    function delWorkDoc() {

        var $tr = $(this)
        var fileId = $tr.data('fileid');

        var parm = {documentId: fileId}

        my_layer({message: '您确定要删除该文件吗？'}, 'confirm', function () {

            _this.DeleteWorkDocFile(parm, function (data) {

                $tr.remove();

            })
        }, function () {
            return;
        })

    }


}
//删除我的文档
MyDoc.prototype.DeleteWorkDocFile = function (parm, cb) {

    //var parm={documentId:''}
    try {
        window.lxpc.exebusinessaction('MyDocument', 'DeleteMyDocument', '0', JSON.stringify(parm), 0, function (status, result, targ) {

            if (status == 0) {

                if (Object.prototype.toString.call(cb) == '[object Function]') {
                    cb()
                }


            }
        })
    } catch (e) {
        console.log(e.message)
    }


}
//创建我的文档
MyDoc.prototype.CreateMyDocument = function (parm, targ, cb, errcb) {
    var _this = this;
    //var parm={resourceId:''，documentName：'',mimeType:'',desc:''}

    try {
        window.lxpc.exebusinessaction('MyDocument', 'CreateMyDocument', '0', JSON.stringify(parm), targ, function (status, jsondata, targ) {

            if (status == 0) {
                if (Object.prototype.toString.call(cb) == '[object Function]') {

                    cb(jsondata, targ)
                }
                //console.log(jsondata)

            } else {
                if (Object.prototype.toString.call(errcb) == '[object Function]') {

                    errcb(jsondata, targ)
                }
                //_this.showtips('创建失败')
            }
        })
    } catch (e) {
        console.log(e.message)
    }


}
//绑定事件
MyDoc.prototype.bindEvent = function () {
    var _this = this;
    //上传文件
    $('.docR_btn').click(function () {

        _this.UploadResource($(this))

    })


//支持上下键
    document.onkeydown = function (event) {

        keyDown($('.docR_table tbody'), 'bg', _this.mainScroll)

    }

    function keyDown($box, hightclass, mainScroll) {

        var children = $box.find('tr'),
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
        if (event.keyCode == 13) {//确认键

            if (check.length > 0) {
//            _this.bindContactPer(seledli)

            }
        }

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
                }


            }

            olist[keyIndex].classList.remove(hightclass);

            keyIndex = currTrIndex;
        }

    }

    //拖拽文件
    var file=null;
    var odrop=document.getElementById('wrapper')

    odrop.ondrop=function(e){

        file = e.dataTransfer.files[0];
        var action = 'upload'
        $('.Nofile').hide();
        $('.Freezing').show();
        file.path=''

        var FileID = createGuid();
        var fileStatus = `<a href="javascript:;" class="aV_a docR_downL_btn disN" data-action="open" >打开</a><a href="javascript:;" class="aV_a docR_saveAsL_btn disN" data-action="openfolder" >打开文件夹</a><a href="javascript:;" class="aV_a  downTip " data-action="stopUpdata" onclick="StopUploadReource(this)">取消上传</a><a href="javascript:;" class="aV_a  reAction disN" data-action="stopUpdata" onclick="UploadMydoc(this)">重试</a>`

        str = `<tr class="${action}" data-name="${file.name}" data-value="${FileID}" data-size="${file.size}" data-path="${file.path}" onclick="cliFile(this)" ondblclick="loadDownFile(this)">
                            <td>
                                <div class="docR_table_file" title="${file.name}">
                                    <img src="./images/ml_file_default.png" />
                                    <div title="${file.name}">${file.name}</div>
                                </div>
                            </td>
                            <td ><span class="docR_time"></span><div class="docR_downL_c">
                                        <div class="docR_downL_cL">
                                            <p><span class="progress" style="width:0;"></span></p>
                                        </div>
                                    </div></td>
                            <td>${FormatSize(file.size)}</td>
                            <td>${fileStatus}</td>
                        </tr>`

        $('.docR_level1 tbody').prepend(str);
        $('.docR_table_file:first').showTitle()
        var $tr = $('.docR_level1 tbody tr:first');
        _this.loadDownId += 1;
        $tr.attr('uploadId', _this.loadDownId)

        //var parm = {resourceList: [{fileNamePath: file['path'], fileResId: FileID, fileSize: file['size']}]};
        //_this.UploadMydoc(parm, _this.loadDownId);


        e.preventDefault();
        mystopPropagation(e)

    }

    odrop.ondragover=function(e){

        e.preventDefault();
        mystopPropagation(e)
    }
   var omain=document.querySelector('.doc_main')
omain.ondrop=function(e){
    e.preventDefault();
    mystopPropagation(e)
}
    omain.ondragover=function(e){

        e.preventDefault();
        mystopPropagation(e)
    }

}

//文件操作打开下载另存为打开文件夹
MyDoc.prototype.bindFileAction = function ($tr, $box) {
    var _this = this;

    var $down = $tr.find('.docR_downL_btn'), $save = $tr.find('.docR_saveAsL_btn'), $cancle = $tr.find('.downTip');

    $down.click(function () {

        var $ele = $(this)
        var $tr = $ele.parents('tr');
        var name = $tr.data('name')
        var resId = $tr.data('value')
        var size = $tr.data('size')

        if ($ele.data('action') == 'down') {

            var parm = {resourceList: [{resourceType: 'res_file', fileName: name, photoResId: resId}]}

            _this.loadDownFile(parm, size, $tr, $box)


        } else if ($ele.data('action') == 'open') {

            var parm = {filePath: $tr.data('path')};

            _this.openfile(parm)
        }

    })

    $save.click(function () {

        var $ele = $(this)
        var $tr = $ele.parents('tr');


        if ($ele.data('action') == 'saveas') {


            //var parm = {resourceList: [{resourceType: 'res_file', fileName: name, photoResId: resId}]}

            _this.savaAs($tr, $box)
            //_this.loadDownFile(parm, size, $tr,$box)


        } else if ($ele.data('action') == 'openfolder') {
            var path = $tr.data('path');
            parm = {filePath: path};

            _this.openFoder(parm)

        }

    })

}
//上传文件
MyDoc.prototype.UploadResource = function ($ele) {
    var _this = this;
    new Promise(function (resolve, reject) {
        try {

            var parm = {selectFileCount: 10};
            window.lxpc.exebusinessaction('MyDocument', 'OpenFileDialog', '0', JSON.stringify(parm), 0, function (status, data, targ) {
                if (status == 0) {

                    if (data == '') {
                        my_layer({message: '选择的路径无效'}, 'warn')
                        return;

                    }
                    var datalist = JSON.parse(data);
                    var filelist = [];

                    if (datalist.length > 10) {

                        my_layer({message: '一次最多支持上传10个文件'}, 'warn')
                        return;
                    }

                    for (var i = 0, ln = datalist.length; i < ln; i++) {

                        var data = datalist[i];
                        var Filepath = data["filePath"]
                        var FileName = Filepath.substring(Filepath.lastIndexOf('\\') + 1);

                        var FileSize = data['fileSize'];

                        var maxSize = _this.initData.resourceMaxSize
                        var max = RsetFileSize(maxSize)

                        if (FileSize > maxSize) {

                            my_layer({message: '文件' + FileName + '大小超过' + max}, 'warn')
                            return;
                        }
                        if (FileSize == 0) {

                            my_layer({message: '文件' + FileName + '是空文件'}, 'warn')
                            return;
                        }


                        var file = {};
                        file.path = Filepath;
                        file.size = FileSize;
                        file.name = FileName
                        filelist.push(file)
                    }


                    resolve(filelist)
                } else {

                    my_layer({message: '调用接口出错，状态码' + status}, 'error')
                }
            });


        } catch (e) {
            console.log(e.message)
        }

    }).then(function (filelist) {

        //var totalSize = 0;
        var action = 'upload'
        $('.Nofile').hide();
        $('.Freezing').show()

        var str = ''

        for (var i = 0; i < filelist.length; i++) {

            var file = filelist[i];
            var FileID = createGuid();
            var fileStatus = `<a href="javascript:;" class="aV_a docR_downL_btn disN" data-action="open" >打开</a><a href="javascript:;" class="aV_a docR_saveAsL_btn disN" data-action="openfolder" >打开文件夹</a><a href="javascript:;" class="aV_a  downTip " data-action="stopUpdata" onclick="StopUploadReource(this)">取消上传</a><a href="javascript:;" class="aV_a  reAction disN" data-action="stopUpdata" onclick="UploadMydoc(this)">重试</a>`

            str = `<tr class="${action}" data-name="${file.name}" data-value="${FileID}" data-size="${file.size}" data-path="${file.path}" onclick="cliFile(this)" ondblclick="loadDownFile(this)">
                            <td>
                                <div class="docR_table_file" title="${file.name}">
                                    <img src="./images/ml_file_default.png" />
                                    <div title="${file.name}">${file.name}</div>
                                </div>
                            </td>
                            <td ><span class="docR_time"></span><div class="docR_downL_c">
                                        <div class="docR_downL_cL">
                                            <p><span class="progress" style="width:0;"></span></p>
                                        </div>
                                    </div></td>
                            <td>${FormatSize(file.size)}</td>
                            <td>${fileStatus}</td>
                        </tr>`

            $('.docR_level1 tbody').prepend(str);
            $('.docR_table_file:first').showTitle()
            var $tr = $('.docR_level1 tbody tr:first');
            _this.loadDownId += 1;
            $tr.attr('uploadId', _this.loadDownId)

            var parm = {resourceList: [{fileNamePath: file['path'], fileResId: FileID, fileSize: file['size']}]};
            _this.UploadMydoc(parm, _this.loadDownId);
        }


        _this.mainScroll.refresh()


    });

}
//上传并创建我的文档

MyDoc.prototype.UploadMydoc = function (parm, targ) {
    var _this = this;

    try {
        window.lxpc.exebusinessaction('UploadResource', 'MyDocument', '0', JSON.stringify(parm), targ, function (status, data, targ) {

            var $tr = $('.docR_level1 tbody tr[uploadId="' + targ + '"]');

            if (status == 0) {

                var result = JSON.parse(data)
                var resid = $tr.data('value');
                var name = $tr.data('name')
                if (Object.prototype.toString.call(result) == '[object Array]') {
                    $tr.data('stoptarg', result[0][resid])
                    return;
                }

                var $progress = $tr.find('.progress')
                var totalSize = $tr.data('total') || 0
                totalSize += parseFloat(data);

                $tr.data('total', totalSize)

                //var size = FormatSize(totalSize) + '/' + FormatSize($tr.data('size'));
                var size = $tr.data('size')

                var progress = (totalSize / size) * 100 + '%';


                if (totalSize >= size) {

                    $progress.css('width', progress);
                    $tr.find('.docR_downL_c').hide();

                    $tr.find('.docR_time').html('刚刚');
                    $tr.find('.aV_a').show();
                    $tr.find('.downTip').hide();
                    $tr.find('.reAction').hide();
                    var parm = {resourceId: resid, documentName: name}

                    _this.CreateMyDocument(parm, targ, function (jsondata, targ) {
                        var $tr = $('.docR_level1 tbody tr[uploadId="' + targ + '"]');
                        var data = JSON.parse(jsondata)
                        $tr.data('fileid', data.document.id)

                        //showtips('上传成功')

                    }, function (jsondata) {
                        $tr.find('.docR_time').html('刚刚');
                        $tr.find('.aV_a').hide();
                        $tr.find('.downTip').show().html('上传失败').css('color', 'red').data('action', '')
                        $tr.find('.reAction').show();


                    });

                    //_this.bindFileAction($tr, $('.docR_level1'))
                    _this.RightClickSmart($tr)

                } else {
                    var targ = $tr.data('stoptarg')
                    $progress.css('width', progress)


                }

            } else {

                $tr.find('.aV_a').hide()
                $tr.find('.reAction').show();
                $tr.find('.downTip').html('上传失败').show().css('color', 'red').data('action', '');

            }
        });


    } catch (e) {
        my_layer({message: '上传失败'}, 'warn')
    }
    _this.loadDownId += 1;
};

//注册回调用来接收新的文档
MyDoc.prototype.ReceiveCreateMyDocument = function () {

    var _this = this;
    try {
        window.lxpc.exebusinessaction('MyDocument', 'ReceiveCreateMyDocument', '0', JSON.stringify({}), 0, function (status, jsondata, targ) {

            if (status == 0) {

                var document = JSON.parse(jsondata).document

                //var time=resetTime(document.createTime)

                var action = 'uploadfromMessage'

                var fileStatus = `<a href="javascript:;" class="aV_a docR_downL_btn " data-action="down" onclick="loadDownFile(this)">下载</a><a href="javascript:;" class="aV_a docR_saveAsL_btn " data-action="saveas" onclick="savaAsOrOpenFoder(this)">打开文件夹</a><a href="javascript:;" class="aV_a  downTip disN" data-action="stopDown" onclick="StopDownloadReource(this)">取消下载</a>`

                var str = `<tr class="${action}" data-name="${document.documentName}" data-value="${document.resourceId}" data-size="${document.showSize}" data-path="" data-fileid="${document.id}" onclick="cliFile(this)" ondblclick="loadDownFile(this)">
                            <td>
                                <div class="docR_table_file">
                                    <img src="./images/ml_file_default.png" />
                                    <div title="${document.documentName}">${document.documentName}</div>
                                </div>
                            </td>
                            <td ><span class="docR_time">刚刚</span><div class="docR_downL_c disN">
                                        <div class="docR_downL_cL">
                                            <p><span class="progress" style="width:0;"></span></p>
                                        </div>
                                    </div></td>
                            <td>${FormatSize(document.showSize)}</td>
                            <td>${fileStatus}</td>
                        </tr>`

                $('.docR_level1 tbody').prepend(str);


                var $tr = $('.docR_level1 tbody tr:first')

                //_this.bindFileAction($tr, $('.docR_level1'))
                _this.RightClickSmart($tr)

            }
        })
    } catch (e) {
        console.log(e.message)
    }
}
//取消上传
function StopUploadReource(ele) {

    var $ele = $(ele)
    var $tr = $ele.parents('tr');
    var stoptarg = $tr.data('stoptarg');

    $tr.remove();
    var parm = {stopResMark: stoptarg}
    Doc.prototype.StopUploadReource(parm)
}
//取消下载
function StopDownloadReource(ele) {

    var $ele = $(ele)
    var $tr = $ele.parents('tr');
    var stoptarg = $tr.data('stoptarg')
    var $down = $tr.find('.docR_downL_btn'), $save = $tr.find('.docR_saveAsL_btn'), $cancle = $tr.find('.downTip');
    var parm = {stopResMark: stoptarg}
    $tr.data('isCancle', true)
    Doc.prototype.StopDownloadReource(parm, $tr)

    $tr.find('.docR_downL_c').hide()
    $tr.find('.docR_time').show();
    $tr.find('.aV_a').show();
    $tr.find('.downTip').hide();
    $tr.find('.reAction').hide();

    $down.html('下载')
    $down.data('action', 'down')
    $save.html('另存为')
    $save.data('action', 'saveas')
    $tr.data('total', 0)
    $tr.data('action', 'cancle');
}
//下载或是打开文件
function loadDownFile(ele) {

    var $ele = $(ele)
    //var $tr = $ele.parents('tr');

    if (ele.tagName == 'TR') {
        var $tr = $ele;
        $ele = $tr.find('.docR_downL_btn')
    } else {
        var $tr = $ele.parents('tr');
    }


    var name = $tr.data('name')
    var resId = $tr.data('value')
    var size = $tr.data('size')

    if ($ele.data('action') == 'down') {
        var parm = {resourceList: [{resourceType: 'res_file', fileName: name, photoResId: resId}]}
        var $box = $tr.parents('table')
        Doc.prototype.loadDownFile(parm, size, $tr, $box)

    } else if ($ele.data('action') == 'open') {

        var parm = {filePath: $tr.data('path')};

        Doc.prototype.openfile(parm)
    }

}
//另存为或是打开文件夹
function savaAsOrOpenFoder(ele) {
    var $ele = $(ele)
    var $tr = $ele.parents('tr');


    if ($ele.data('action') == 'saveas') {


        //var parm = {resourceList: [{resourceType: 'res_file', fileName: name, photoResId: resId}]}
        var $box = $tr.parents('table')
        Doc.prototype.savaAs($tr, $box)

        //_this.loadDownFile(parm, size, $tr,$box)


    } else if ($ele.data('action') == 'openfolder') {
        var path = $tr.data('path');
        var parm = {filePath: path};

        Doc.prototype.openFoder(parm)

    }
}
//上传文档
function UploadMydoc(ele) {

    var $ele = $(ele);
    var $tr = $ele.parents('tr');
    var path = $tr.data('path');
    var resId = $tr.data('value')
    var size = $tr.data('size')
    var parm = {resourceList: [{fileNamePath: path, fileResId: resId, fileSize: size}]};

    MyDoc.prototype.UploadMydoc(parm)
}

function cliFile(ele) {
    var $ele = $(ele);
    $ele.siblings().removeClass('bg')
    $ele.addClass('bg')

}