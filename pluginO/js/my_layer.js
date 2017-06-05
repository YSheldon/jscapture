function my_layer(option,type,cbok,cbcancle){



    var  opt_def={title:'蓝信',icon:'/images/ic_tip1.png',message:'是否关闭当前窗口',tip:false};
    var opt = jQuery.extend(opt_def, option);

    var str='';
    str+=' <div class="layer_box" id="layer_box" ><div class="layer_top">'+opt.title+' <em></em></div>';
    str+='<div class="layer_wrap"><div style="margin-left: 20px;margin-top: 20px;height: 34px;font-size: 0"><img src="'+opt.icon+'" alt="" style="display: inline-block;vertical-align: middle">'
    str+='<span style="font-size:14px;color: #000; ">'+opt.message+'</span></div></div>'
    //str+='<div class="layer_footer"><em class="layer_check"></em><input type="checkbox" name="tip" id="tip"><label for="tip">不再提示</label>';
    str+='<div class="layer_footer">';

   if(opt.tip){

       str+='<em class="layer_check"></em><input type="checkbox" name="tip" id="tip"><label for="tip">不再提示</label>'
   }

    if(type=='confirm'){
        str+='<button id="btn_ok" class="btn_n btn_h">确定</button><button id="btn_qx" class="btn_n">取消</button></div></div>';
    }else{
        str+='<button id="btn_ok" class="btn_n btn_h">确定</button></div></div>';
    }

    $('body').append(str);

    $('#tip').change(function(){
         if(this.checked){
             $('.layer_check').addClass('layer_checked')

         }else{
             $('.layer_check').removeClass('layer_checked')
         }
    });

    $('button').on('click',function(){
        $(this).addClass('btn_h').siblings('button').removeClass('btn_h');
    })



    //类型为alert
    if (type == 'success') {
        $('#layer_box img').attr('src', './images/ic_tip4.png');
        $('#btn_qx').hide();

    }

    if (type == 'error') {
        $('#layer_box img').attr('src', './images/ic_tip3.png');
        $('#btn_qx').hide();
    }

    //类型为confirm
    if (type == 'warn') {
        $('#layer_box img').attr('src', './images/ic_tip2.png');
        $('#btn_qx').hide();
    }

    //类型为confirm
    if (type == 'confirm') {

        $('#layer_box img').attr('src', './images/ic_tip5.png');
    }

$('#btn_ok').on('click',function(){

    $('#layer_box').remove();
    if(Object.prototype.toString.call(cbok)=='[object Function]'){

        cbok();
    }
})

    $('#btn_qx').on('click',function(){
        $('#layer_box').remove();
        if(Object.prototype.toString.call(cbcancle)=='[object Function]'){
            cbcancle();
        }
    })

    $('.layer_top em').click(function(){
        $('#layer_box').remove();

        if(type=='confirm'){
            if(Object.prototype.toString.call(cbcancle)=='[object Function]'){
                cbcancle();
            }
        }else{
            if(Object.prototype.toString.call(cbok)=='[object Function]'){
                cbok();
            }
        }

    })

}

