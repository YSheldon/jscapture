function Workdoc(){
    this.mainScroll=null;
    this.init();
}
Workdoc.prototype={
    constructor: Workdoc,
    init:function(){
        this.loadScroll();
        this.bindEvent();
        this.bindInitData();
    },
    bindEvent:function(){
        //var secText = "搜索";
        $("#secText").focusin(function() {
            if($(this).val() == '') {
                $(this).addClass("ipt")
            }
            $(this).parents(".doc_secIpt").addClass("doc_secIpt2")

        }).focusout(function(){
            $(this).parents(".doc_secIpt").removeClass("doc_secIpt2")
            if($(this).val() == ''){
                $(this).removeClass("ipt")

            }
        });
        $("#secText").each(function(){
            $(this).keyup(function(){
                if($(this).val() != secText && $(this).val() != ''){
                    $(".sec_del").css({"visibility":"visible"})
                }
                else{
                    $(".sec_del").css({"visibility":"hidden"})
                }
            })
        })

        //点击删除按钮时，删除按钮隐藏，文本框文字为“搜索”
        $(".sec_del").on("click",function(){
            $("#secText").val(secText);
            $(this).parents(".doc_secIpt").removeClass("doc_secIpt2")
            $(this).css({"visibility":"hidden"})
            $(this).siblings("#secText").removeClass("ipt")
        })


        $('.docR_level1 tr').click(function(){
            var docRW=$('.docR_msgList')[0].offsetWidth;
            $('.scroll').animate({left: '-100%'},500)

        })


    },
    loadScroll:function loadScroll(){

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
    bindInitData:function(){
        var _this = this;
        try {
            var parm = {};

            window.lxpc.exebusinessaction('WorkDoc', 'InitFinished', '0', JSON.stringify(parm), 0, function (status, result, targ) {
                if (status == 0) {

                   var data=JSON.parse(result),
                    surl=data.url;

                    var parm1={workDocUrl:surl};
                    window.lxpc.exebusinessaction('WorkDoc', 'GetWorkDocInfo', '0', JSON.stringify(parm1), 0, function (status, result, targ) {
                        if(status==0){

                            $('.loading').hide()
                            var data=JSON.parse(result),
                              contentlist=data.content;

                            var str='';
                            for(var i=0,ln=contentlist.length;i<ln;i++){

                                var curitem=contentlist[i],
                                    cells=curitem['cells'],
                                    FileListUrl=curitem.actions[0].action;


                                for(var j=0; j<cells.length;j++){
                                    var curcell=cells[j];
                                    str+=`<tr folderid="${curcell.id}">
                            <td>
                                <div class="docR_table_folder">
                                    <img src="images/folder.png" />
                                    <div>
                                        <h4 title="蓝信资料">${curcell.title}</h4>
                                        <p title="蓝信工场，IT文档库">${curcell.subTitle}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>`

                                }

                                $('.docR_level1  tbody').append(str)
                                _this.mainScroll.refresh();

                                //点击进入下一级

                                $('.docR_level1  tbody tr').click(function(){
                                    $('.loading').show();
                                    var strTop=`<span class="lev2">蓝信资料<em></em></span>`;
                                    $('.lev1').addClass('opc4')
                                    $('.docR_nav').append(strTop)

                                    var $ele=$(this),
                                        folderid=$ele.attr('folderid'),
                                        request=FileListUrl+'&'+'folderId='+folderid;

                                    $('.docR_level2').empty();
                                        _this.QueryWorkDocFileList(request)
                                })

                            }


                        }else{

                            my_layer({message:'请求数据发生错误'},'error',function(){

                            })
                        }


                    })

                }else{
                    my_layer({message:'请求数据发生错误'},'error',function(){

                    })
                }
            })
        }
        catch(e){
            my_layer({message:'请求数据发生错误'},'error',function(){

            })
        }


    },
    QueryWorkDocFileList:function(request){
        var _this=this;

        var parm={queryWorkDocFileListUrl:request};

        try{
            window.lxpc.exebusinessaction('WorkDoc', 'QueryWorkDocFileList', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                if(status==0){
                    $('.loading').hide();
                    $('.scroll').animate({left: '-100%'},500);
                    //var strTop=`<span class="lev2">蓝信资料<em></em></span>`;
                    //$('.lev1').addClass('opc4')
                    //$('.docR_nav').append(strTop)

                  var data=JSON.parse(result),
                      contentlist=data.content;
                    var str='';

                    str+=`  <table class="docR_table docR_tableS">
                        <thead class="Freezing">
                        <tr>
                            <th>名称</th>
                            <th>时间</th>
                            <th>大小</th>
                            <th class="miW90">操作</th>
                        </tr>
                        </thead>
                        <tbody>`
                    for(var i=0,ln=contentlist.length;i<ln;i++){
                        var curitem=contentlist[i],
                            cells=curitem.cells;

                        if(cells.length==0){
                            return;
                        }


                        for(var j=0,ln1=cells.length;j<ln1;j++){

                            var curcell=cells[j],
                                fileType=curcell.fileType,
                                status=curcell.status,
                                subTitle=curcell.subTitle,
                                titleArry=subTitle.split(','),
                                size=titleArry[0],
                                time=titleArry[1],
                                action='',
                                fileStatus=''



                            var newTime=resetTime(time);

                            switch(status){//-1：待审核 0：有效 1：无效（删除） 2：审核不通过
                                case -1:
                                    fileStatus='审核中';
                                    action='docR_audit'
                                    break;
                                case 2:
                                    fileStatus='审核不通过';
                                    action='docR_audit'
                                    break;
                                default:
                                    fileStatus=`<a href="javascript:;" class="aV_a docR_downL_btn">下载</a>
                                        <div class="docR_downL_c disN">
                                    <div class="docR_downL_cL">
                                    <h4>1.6/3.2MB</h4>
                                    <p><span style="width:50%;"></span></p>
                                    </div>
                                    <a href="javascript:;" class="aV_a docR_cancel">取消</a>
                                    </div>`;
                                    action='docR_download'//docR_open
                                    break;
                            }
                         var path=''

                           switch(fileType){
                               case 'pptx':case 'ppt':case 'pps':case 'pot':
                                   path='./images/ppt.png'
                                   break;
                               case 'audio':
                                   path='./images/audio.png'
                                   break;
                               case 'doc':case 'docx':case 'dot':
                                   path='./images/doc.png'
                                   break;
                               case 'pdf':
                                   path='./images/audio.png'
                                   break;
                               case 'html':case 'htm':
                                    path='./images/html.png'
                                   break;
                               case 'zip':
                                   path='./images/zip.png'
                                   break;
                               case 'js':
                                   path='./images/js.png'
                                   break;
                               case 'mov':
                                   path='./images/mov.png'
                                   break;
                               case 'xls':case 'xlsx':
                                  path='./images/xls.png'
                                   break;
                               default:
                                   path=curcell.icon;
                                   break;

                           }

                               str+=` <tr class="${action}">
                            <td>
                                <div class="docR_table_file">
                                    <img src="${path}" />
                                    <div title="${curcell.title}">${curcell.title}</div>
                                </div>
                            </td>
                            <td>${newTime}</td>
                            <td>${size}</td>
                            <td>${fileStatus}</td>
                        </tr>
                        `
                        }
                    }

                      str+=`</tbody></table>`
                    $('.docR_level2').append(str);
            _this.mainScroll.refresh();
                    $('.lev1').css('cursor','pointer')


                    $('.lev1').click(function(){

                        $('.scroll').animate({left: '0'},500);
                        $('.lev2').remove();
                        $('.lev1').removeClass('opc4')
                        $('.lev1').css('cursor','default')

                    })


                }else{
                    my_layer({message:'请求数据发生错误'},'error')
                }

            })
        }catch(e){
            my_layer({message:e.message},'error')
        }

    },
    

}

