
//??????

$(function(){
//???string ??trim?????????????β???
    String.prototype.trim=function(){
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
})


function mystopPropagation(e) {
    var ev = e || window.event;
    if (ev.stopPropagation) {
        ev.stopPropagation();
    } else {
        ev.cancelBubble = true;
    }
}


var Base64 = {
    // ????
    table : [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
    ],
    UTF16ToUTF8 : function(str) {
        var res = [], len = str.length;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            if (code > 0x0000 && code <= 0x007F) {
                // ????????????????0x0000?????????????
                // U+00000000 ?C U+0000007F  0xxxxxxx
                res.push(str.charAt(i));
            } else if (code >= 0x0080 && code <= 0x07FF) {
                // ????
                // U+00000080 ?C U+000007FF  110xxxxx 10xxxxxx
                // 110xxxxx
                var byte1 = 0xC0 | ((code >> 6) & 0x1F);
                // 10xxxxxx
                var byte2 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1),
                    String.fromCharCode(byte2)
                );
            } else if (code >= 0x0800 && code <= 0xFFFF) {
                // ?????
                // U+00000800 ?C U+0000FFFF  1110xxxx 10xxxxxx 10xxxxxx
                // 1110xxxx
                var byte1 = 0xE0 | ((code >> 12) & 0x0F);
                // 10xxxxxx
                var byte2 = 0x80 | ((code >> 6) & 0x3F);
                // 10xxxxxx
                var byte3 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1),
                    String.fromCharCode(byte2),
                    String.fromCharCode(byte3)
                );
            } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                // ?????
                // U+00010000 ?C U+001FFFFF  11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                // ?????
                // U+00200000 ?C U+03FFFFFF  111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                // ?????
                // U+04000000 ?C U+7FFFFFFF  1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }

        return res.join('');
    },
    UTF8ToUTF16 : function(str) {
        var res = [], len = str.length;
        var i = 0;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            // ?????????????ж?
            if (((code >> 7) & 0xFF) == 0x0) {
                // ?????
                // 0xxxxxxx
                res.push(str.charAt(i));
            } else if (((code >> 5) & 0xFF) == 0x6) {
                // ????
                // 110xxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var byte1 = (code & 0x1F) << 6;
                var byte2 = code2 & 0x3F;
                var utf16 = byte1 | byte2;
                res.push(String.fromCharCode(utf16));
            } else if (((code >> 4) & 0xFF) == 0xE) {
                // ?????
                // 1110xxxx 10xxxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var code3 = str.charCodeAt(++i);
                var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                utf16 = ((byte1 & 0x00FF) << 8) | byte2
                res.push(String.fromCharCode(utf16));
            } else if (((code >> 3) & 0xFF) == 0x1E) {
                // ?????
                // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (((code >> 2) & 0xFF) == 0x3E) {
                // ?????
                // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                // ?????
                // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }

        return res.join('');
    },
    encode : function(str) {
        if (!str) {
            return '';
        }
        var utf8    = this.UTF16ToUTF8(str); // ???UTF8
        var i = 0; // ????????
        var len = utf8.length;
        var res = [];
        while (i < len) {
            var c1 = utf8.charCodeAt(i++) & 0xFF;
            res.push(this.table[c1 >> 2]);
            // ?????2??=
            if (i == len) {
                res.push(this.table[(c1 & 0x3) << 4]);
                res.push('==');
                break;
            }
            var c2 = utf8.charCodeAt(i++);
            // ?????1??=
            if (i == len) {
                res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                res.push(this.table[(c2 & 0x0F) << 2]);
                res.push('=');
                break;
            }
            var c3 = utf8.charCodeAt(i++);
            res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
            res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
            res.push(this.table[c3 & 0x3F]);
        }

        return res.join('');
    },
    decode : function(str) {
        if (!str) {
            return '';
        }

        var len = str.length;
        var i   = 0;
        var res = [];

        while (i < len) {
            code1 = this.table.indexOf(str.charAt(i++));
            code2 = this.table.indexOf(str.charAt(i++));
            code3 = this.table.indexOf(str.charAt(i++));
            code4 = this.table.indexOf(str.charAt(i++));

            c1 = (code1 << 2) | (code2 >> 4);
            c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
            c3 = ((code3 & 0x3) << 6) | code4;

            res.push(String.fromCharCode(c1));

            if (code3 != 64) {
                res.push(String.fromCharCode(c2));
            }
            if (code4 != 64) {
                res.push(String.fromCharCode(c3));
            }

        }

        return this.UTF8ToUTF16(res.join(''));
    }
};
function FormatTime(datetime,sformate) {

    var res = null;
    var Time = new Date(datetime);
    var year = Time.getFullYear(); //??
    var month = Time.getMonth() + 1; //0----11 ????·?????
    var date = Time.getDate();//??
    var hour = Time.getHours();//?
    var minite = Time.getMinutes()//??;
    var sencond=Time.getSeconds();

    minite = minite >= 10 ? minite : '0' + minite;
    sencond=sencond>10?sencond:'0'+sencond;

    sformate=sformate?sformate:'yyyy/mm/dd hh:mm';

    //yyyy/mm/dd hh:mm
    //mm-dd hh:mm
    if(sformate=='mm-dd hh:mm'){
        res=month+'-'+date+' '+hour+':'+minite
    }else if(sformate=='yyyy/mm/dd hh:mm'){
        res = year + "/" + month + "/" + date + " " + hour + ":" + minite;
    }else if(sformate=='dd/mm'){
        res=date+'/'+month;
    }else if(sformate=='yyyy-mm-dd hh:mm:ss'){
        res= res = year + "-" + month + "-" + date + " " + hour + ":" + minite+':'+sencond;
    }else if(sformate=='yyyy-mm-dd hh:mm'){
        res= res = year + "-" + month + "-" + date + " " + hour + ":" + minite;
    }else if(sformate=='yyyy年mm月dd日'){
        res=year+'年'+month+'月'+date+'日'
    }

    return res

};
function getUrl (str_url) {

    //var strRegex=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
    //var strRegex=/((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
//var strRegex='(((ht|f)tp(s?))\://)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk)(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\;\?\'\\\+&%\$#\=~_\-]+))*'
//    var strRegex=/((http|ftp|https):\/\/)|(www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
    var strRegex=/(((http|ftp|https):\/\/)|(www\.))[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g

    if(strRegex.test(str_url)){
        var re=new RegExp(strRegex,'g');
        return str_url.match(re)
    }else{
        return [];
    }

};
//tittle ??? ??? ??? ??С ???
function TitleTools(){
    $('.tool li').on('click', function () {
        mystopPropagation();
        //???
        if ($(this).hasClass('Winclose')) {
            try {

                window.lxpc.closewnd();
            }
            catch (e) {
                console.log(e.message)
            }


        } else if ($(this).hasClass('Winmax')) {  //???

            $(this).removeClass('Winmax').addClass('Winreback');
            try {

                window.lxpc.maxwnd();
            }
            catch (e) {
                console.log(e.message)
            }


        } else if ($(this).hasClass('Winmin')) {//??С

            try {

                window.lxpc.minwnd();
            }
            catch (e) {
                console.log(e.message)
            }


        } else if ($(this).hasClass('Winreback')) {//???

            $(this).removeClass('Winreback').addClass('Winmax');

            try {

                window.lxpc.restorewnd();
            }
            catch (e) {

            }
        }else{
            try {

                window.lxpc.closewnd();
            }
            catch (e) {
                console.log(e.message)
            }
        }

    });
};

//?????λ?????????????????С
function RsetFileSize (size) {
    size = parseFloat(size)
    var result
    if (size < 1024) {
        result = size + ' B'
    } else if (size < 1024 * 1024) {
        result = Math.ceil(size / 1024) + ' KB'
    } else if (size < 1024 * 1024 * 1024) {
        result = Math.ceil(size / 1024 / 1024) + ' MB'
    } else {
        result = Math.ceil(size / 1024 / 1024 / 1024) + ' G'
    }
    return result;

};
function createGuid() {
    function GUID() {
        this.date = new Date();

        /* ?ж????????????????????????????????????????????У????????????? */
        if (typeof this.newGUID != 'function') {

            /* ????GUID?? */
            GUID.prototype.newGUID = function () {
                this.date = new Date();
                var guidStr = '';
                sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
                for (var i = 0; i < 9; i++) {
                    guidStr += Math.floor(Math.random() * 16).toString(16);
                }
                guidStr += sexadecimalDate;
                guidStr += sexadecimalTime;
                while (guidStr.length < 32) {
                    guidStr += Math.floor(Math.random() * 16).toString(16);
                }
                return this.formatGUID(guidStr);
            }

            /*
             * ????????????????GUID???????8λ?????????19700101
             * ???????????GUID??????????????
             */
            GUID.prototype.getGUIDDate = function () {
                return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
            }

            /*
             * ???????????????GUID???????8λ????????????????????2λ????12300933
             * ???????????GUID??????????????
             */
            GUID.prototype.getGUIDTime = function () {
                return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
            }

            /*
             * ????: ??λ????????????????0??????????????NaN??????????????????
             * ????: ??????????????????0?????????????????????????
             * ?????: ????????????????????0?????????????????????????????
             */
            GUID.prototype.addZero = function (num) {
                if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                    return '0' + Math.floor(num);
                } else {
                    return num.toString();
                }
            }

            /*
             * ???????y??????????????x????????
             * ????????1???????????????????????2??????????????????????3???????????????????????????粻д???10
             * ??????????????????????
             */
            GUID.prototype.hexadecimal = function (num, x, y) {
                if (y != undefined) {
                    return parseInt(num.toString(), y).toString(x);
                } else {
                    return parseInt(num.toString()).toString(x);
                }
            }

            /*
             * ??????????32λ????????GUID?????????
             * ????????1?????????32λ???????
             * ??????????GUID??????????
             */
            GUID.prototype.formatGUID = function (guidStr) {
                var str1 = guidStr.slice(0, 8) + '-',
                    str2 = guidStr.slice(8, 12) + '-',
                    str3 = guidStr.slice(12, 16) + '-',
                    str4 = guidStr.slice(16, 20) + '-',
                    str5 = guidStr.slice(20);
                return str1 + str2 + str3 + str4 + str5;
            }
        }
    }

    var guid = new GUID();
    return guid.newGUID();
};

//????????Unicode

function Unicode(str){
    function unicode(str){
        var value='';
        for (var i = 0; i < str.length; i++) {
            value += '\\u' + left_zero_4(parseInt(str.charCodeAt(i)).toString(16));
        }
        return value;
    }
    function left_zero_4(str) {
        if (str != null && str != '' && str != 'undefined') {
            if (str.length == 2) {
                return '00' + str;
            }
        }
        return str;
    };
    return unicode(str);
}

//function tohanzi(data)
//{
//    if(data == '') return '';
//    data = data.split("\u");
//    var str ='';
//    for(var i=0;i<data.length;i++)
//    {
//        str+=String.fromCharCode(parseInt(data[i],16).toString(10));
//    }
//    return str;
//}
function reconvert(str){
    str = str.replace(/(\\u)(\w{1,4})/gi,function($0){
        return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g,"$2")),16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi,function($0){
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g,"$2"),16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi,function($0){
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g,"$2")));
    });

    return str;
};

function EncodeUtf8 (str) {
    //???????UTF-8????

    function EncodeUtf8(s1) {
        var s = escape(s1);
        var sa = s.split("%");
        var retV = "";
        if (sa[0] != "") {
            retV = sa[0];
        }
        for (var i = 1; i < sa.length; i++) {
            if (sa[i].substring(0, 1) == "u") {
                retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)));

            }
            else retV += "%" + sa[i];
        }

        return retV;
    }

    function Str2Hex(s) {
        var c = "";
        var n;
        var ss = "0123456789ABCDEF";
        var digS = "";
        for (var i = 0; i < s.length; i++) {
            c = s.charAt(i);
            n = ss.indexOf(c);
            digS += Dec2Dig(eval(n));

        }
        //return value;
        return digS;
    }

    function Dec2Dig(n1) {
        var s = "";
        var n2 = 0;
        for (var i = 0; i < 4; i++) {
            n2 = Math.pow(2, 3 - i);
            if (n1 >= n2) {
                s += '1';
                n1 = n1 - n2;
            }
            else
                s += '0';

        }
        return s;

    }

    function Dig2Dec(s) {
        var retV = 0;
        if (s.length == 4) {
            for (var i = 0; i < 4; i++) {
                retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
            }
            return retV;
        }
        return -1;
    }

    function Hex2Utf8(s) {
        var retS = "";
        var tempS = "";
        var ss = "";
        if (s.length == 16) {
            tempS = "1110" + s.substring(0, 4);
            tempS += "10" + s.substring(4, 10);
            tempS += "10" + s.substring(10, 16);
            var sss = "0123456789ABCDEF";
            for (var i = 0; i < 3; i++) {
                retS += "%";
                ss = tempS.substring(i * 8, (eval(i) + 1) * 8);


                retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
                retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
            }
            return retS;
        }
        return "";
    }

    return EncodeUtf8(str);

};
function init_File(parm,targ,$down,$saveAs,cb){

    try{
        window.lxpc.exebusinessaction('ChatRecord', 'CheckResource','0', JSON.stringify(parm), targ, function(status, result, targ){
            if(status==0){

                var data=JSON.parse(result);
                console.log(result)
                console.log('pppppppppppp============================')
                if(data.filePath){

                    $down.html('打开');
                    $saveAs.html('打开文件夹');
                    $down.data('path',data.filePath);
                    $saveAs.data('path',data.filePath);
                    $down.addClass('openfile');
                    $saveAs.addClass('openfileDir');

                    if(Object.prototype.toString.call(cb)=="[object Function]"){
                        cb(data.filePath)
                    }

                }


            }else{
                console.log(status)
            }


        })

    }catch (e){
        console.log(e.message)
    }
}
function bindfiledown($down,$saveAs,filename,resId,$filebox){

    if($down.hasClass('openfile')){//下载完成之后打开文件

        var parm=  {filePath:$down.data('path')};

        try{
            window.lxpc.exebusinessaction('ChatRecord', 'OpenFile','0', JSON.stringify(parm),0, function(status, result, targ){

            })

        }catch (e){
            console.log(e.message)
        }


    }else{//下载文件

        var str='<img src="images/ajax-loader_smail.gif" style="" alt="" class="mlr_Downfile">';

        $filebox.append(str);

        var parm=  {resourceList:[{resourceType:'res_file', fileName:filename, photoResId:resId}]}

        try{
            window.lxpc.exebusinessaction('DownloadResource', 'Noticefile','0', JSON.stringify(parm),0, function (status, result, targ) {

                if(status==0){

                   if(result.indexOf('\\')>-1){

                       my_layer({title:'蓝信',icon:'/images/ic_tip1.png',message:'文件下载成功'},'success',function(){
                           $filebox.find('.mlr_Downfile').remove();
                       })
                       $down.html('打开');
                       $saveAs.html('打开文件夹')
                       $down.addClass('openfile');
                       $saveAs.addClass('openfileDir');
                       $down.data('path',result);
                       $saveAs.data('path',result);
                   }
                   

                }else{
                    console.log(status)
                }

            })


        }catch (e){
            console.log(e.message)
        }

    }
};
function bindfilesaveAS($down,$saveAs,filename,resId,$filebox){


    if($saveAs.hasClass('openfileDir')){//另存为后打开文件

        var parm=  {filePath:$saveAs.data('path')}

        try{
            window.lxpc.exebusinessaction('ChatRecord', 'OpenFileDir','0', JSON.stringify(parm),0, function(status, result, targ){

            })

        }catch (e){
            console.log(e.message)
        }


    }else{//另存为

        var parm=  {fileName:filename}


        try{
            window.lxpc.exebusinessaction('ChatRecord', 'OpenSaveAsWnd','0', JSON.stringify(parm),0,function(status, result, targ) {

                if (status == 0) {


                    var data=JSON.parse(result),
                        filePath=data.filePath;

                    var index=filePath.lastIndexOf('\\'),
                        path=filePath.substring(0,index)

                    var parm=  {resourceList:[{resourceType:'res_file', fileName:filename, photoResId:resId,filePath:path}]}

                    var str='<img src="images/ajax-loader_smail.gif" style="" alt="" class="mlr_Downfile">';

                    $filebox.append(str);


                    try{
                        window.lxpc.exebusinessaction('DownloadResource', 'Noticefile','0', JSON.stringify(parm),0, function (status, result, targ) {

                            if(status==0){

                                if(result.indexOf('\\')>-1){
                                    my_layer({title:'蓝信',icon:'/images/ic_tip1.png',message:'另存为成功'},'success',function(){

                                        $filebox.find('.mlr_Downfile').remove();
                                    })
                                    $down.html('打开');
                                    $saveAs.html('打开文件夹')
                                    $saveAs.addClass('openfileDir');
                                    $down.addClass('openfile');
                                    $down.data('path', result);
                                    $saveAs.data('path', result);
                                }


                            }else{
                                console.log(status)
                            }

                        })


                    }catch (e){
                        console.log(e.message)
                    }



                } else {
                    console.log(status)
                }

            })


        }catch (e){
            console.log(e.message)
        }

    }
};
//支持鼠标上下键
function keyDown (datalist,hightclass){
    var keyIndex= 0,
        total=datalist.length;
    document.onkeydown=function(event){
        var curIndex
        if(total==0||total==1){
            return ;
        }
        if (event.keyCode==38)//上
        {

            if(keyIndex==0){
                curIndex=total-1;
            }else{
                curIndex=keyIndex-1;
            }
            clickTr(curIndex)
        }
        if (event.keyCode==40)//下
        {

            if(keyIndex==total-1){
                curIndex=0;
            }else{
                curIndex=keyIndex+1;
            }
            clickTr(curIndex)
        }

        function clickTr(currTrIndex){
            if (currTrIndex > -1){

                datalist.eq(currTrIndex).addClass(hightclass)
            }
            datalist.eq(keyIndex).removeClass(hightclass);
            keyIndex=currTrIndex;
        }
    }
};

/*********************补全两位数***********************************/
function ToDou(n) {
    n > 0 && n < 10 ? "0" + n : n;
    return n;
}

function resetTime (time,format){
    var NowDate=new Date(),
        comparedDate=new Date(time);
    //查询当天的结果
    if(NowDate.getFullYear()==comparedDate.getFullYear()&&NowDate.getMonth()==comparedDate.getMonth()&&NowDate.getDate()==comparedDate.getDate()){

        var nowTime=NowDate.getTime(),
            temTime=comparedDate.getTime();

        var spantime=nowTime-temTime;

        var s=Math.floor(spantime/1000);

        var day =Math.floor(s/(3600*24));
        s%=(3600*24);
        var hour =Math.floor(s/3600);
        s%=3600;
        var minute=Math.floor(s/60);
        var second=s%60;

        if(hour<1){
            return ToDou(minute)+'分钟前'
        }else{
            return hour+'小时前'
        }


    }else{
        format=format||'mm-dd hh:mm';

        if(format=='mm-dd hh:mm'){
            return ToDou(comparedDate.getMonth()+1)+'-'+ToDou(comparedDate.getDate())+' '+ToDou(comparedDate.getHours())+':'+ToDou(comparedDate.getMinutes())

        }
    }
}
//文件大小
function FormatSize (size) {
    size = parseFloat(size)
    var result
    if (size < 1024) {
        result = size + ' B'
    } else if (size < 1024 * 1024) {
        result = Math.ceil(size / 1024) + ' KB'
    } else if (size < 1024 * 1024 * 1024) {
        result = Math.ceil(size / 1024 / 1024) + ' MB'
    } else {
        result = Math.ceil(size / 1024 / 1024 / 1024) + ' G'
    }
    return result;

}
//时间大小
function ReSizeforTime (size) {
    size = parseFloat(size)
    //2:30'50''
    var result,
        min,
        h,
        s;

    size=Math.ceil(size/1000);
    if (size < 60) {//秒
        result=size+'"'
    } else if (size < (60*60)) {//分
        min=Math.floor(size/(60))
        result = min+"'"+Math.ceil((size-min*60))+'"'
    } else  {

       h=Math.floor(size/(60*60)) ;
        min=Math.floor((size-h*60*60)/60);
        s=Math.ceil(size-h*60*60)%60
        result =  h+':'+min+"'"+s+'"'
    }
    return result;

}
//下载资源
function downresource(parm ,targ,callback) {

        try {

            window.lxpc.exebusinessaction('DownloadResource', 'HeaderImage', '0', JSON.stringify(parm),targ, function (status, result, targ) {

                if(status==0){

                    if(Object.prototype.toString.call(callback)=='[object Function]'){

                        callback(result,targ);
                    }


                }else{

                    //my_layer({message: '调用接口出错，错误码' + status}, 'error')
                    callback(result,targ);
                    console.log(status)
                }


            })
        }
        catch (e) {
            my_layer({message: '调用接口出错，错误码' + e.message}, 'error')
console.log(e.message)
        }


};
//打开图片预览
function ViewSrcPicture($ele,parm){

        //var parm = {picturePath: result};
        try {
            window.lxpc.exebusinessaction('notice', 'ViewSrcPicture', '0', JSON.stringify(parm), 0, null)
        }
        catch (e) {

            console.log(e.message);
        }
        mystopPropagation(event);
}
function scrollSetings(){
    return {

            probeType: 2,
            scrollbars: "custom",
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            preventDefault: false,
            momentum: false,


     }
}

//筛选出map地址
function mapAddress(str){
    //var reg=/\{\S+\|\d+(\.\d+),\d+(\.\d+)\}/g;
    var reg=/\{([^}|]*)\|(\d{1,3}\.\d+,\d{1,3}\.\d+)\}/g;
    return reg.test(str)
}
//打开地图
function openMap(parm,code){

    try {
        if(code==''||code==null||typeof(code)=='undefined'){
            code='notice'
        }
        window.lxpc.exebusinessaction(code, 'OpenUrl', '0', JSON.stringify(parm), 0, null)
    }
    catch (e) {

        console.log(e.message);
    }


}
//获取语音时长
function getVoiceLength(parm,cb){
    //console.log(JSON.stringify(parm))

    try {

        window.lxpc.exebusinessaction('DownloadResource', 'voice', '0', JSON.stringify(parm),0, function (status, result, targ) {

            if(status==0){

                var path=result;
                var voice_parm={filePath:result};

                //console.log(JSON.stringify(voice_parm))
                try {
                    window.lxpc.exebusinessaction('Notice', 'GetVoiceLength', '0', JSON.stringify(voice_parm), 0, function(status, result, targ){

                        if(status==0){
var data=JSON.parse(result)
                            if(Object.prototype.toString.call(cb)=='[object Function]'){
                                cb({filePath:path,size:data.voiceLength})
                            }

                        }else{
                            my_layer({message:'读取数据出错，状态码'+status},'error')
                        }

                    })
                }
                catch (e) {

                    my_layer({message:'调取接口出错：错误码'+e.message},'error');
                }


            }else{
                console.log('下载失败')
            }


        })
    }
    catch (e) {

        console.log(e.message)

    }



}
//播放音频
function playVoice(parm,cb){

    //var parm={filePath:filePath}

    try {
        window.lxpc.exebusinessaction('Notice', 'PlayVoice', '0', JSON.stringify(parm), 0, function(status,result,targ){
            if(status==0){
                if(Object.prototype.toString.call(cb)=='[object Function]'){
                    cb()
                }
            }else{
                my_layer({message:'读取数据出错，状态码'+status},'error')
            }

        })
    }catch(e){
        my_layer({message:'调取接口出错：错误码'+e.message},'error');
    }
}

//播放音频
function stopVoice(cb){

    //var parm={filePath:filePath}
    try {
        window.lxpc.exebusinessaction('Notice', 'StopPlayVoice', '0', '', 0, function(status,result,targ){
            if(status==0){

                if(Object.prototype.toString.call(cb)=='[object Function]'){
                    cb()
                }
            }else{
                my_layer({message:'读取数据出错，状态码'+status},'error')
            }

        })
    }catch(e){
        my_layer({message:'调取接口出错：错误码'+e.message},'error');
    }
}

