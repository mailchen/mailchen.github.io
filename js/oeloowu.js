
var audioPlay={
    self:"",
    audioControls:"",
    audio:"",
    audioSource: "",
    songNum: 0,
    autoPlay: function(){
        let audio = this.audio,
            audioSource = this.audioSource,
            audioControls = this.audioControls;
        //随机播放
        let currNum =Math.floor(Math.random()*3);
        console.log(currNum);
        audio[0] && audio.attr("src", audioSource[currNum].src) && audioControls.trigger("click");
    },
    endedListener:function(){
        let audio = this.audio[0],
            audioSource = this.audioSource,
            songNum = this.songNum;

        audio && audio.addEventListener("ended",function(){
            //顺序播放
            songNum = songNum < audioSource.length - 1 ? ++songNum : 0;
            //随机播放
            let currNum =Math.floor(Math.random()*3+1);
            audio.src = audioSource[currNum].src;
            audio.play();
        },false);
    },
    init: function(){
        this.audioControls = $(".audioPlay");
        let audio = this.audio = $("#h5audio_media");
        this.audioSource = this.audio.find("source");
        let _self = this.self = this;

        this.audioControls.click(function(){
            $(this).find("i").toggleClass("fa-pause");
            if(audio!==null){
                //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
                if(audio[0].paused)                     {
                    audio[0].play();
                    $(this).find("img").removeClass("pause")
                }else{
                    audio[0].pause();
                    $(this).find("img").addClass("pause")
                }

                (function($){//监听语音结束
                    _self.endedListener();
                })(jQuery);
            }
        });

        this.autoPlay();
    }
}

var recommendTemp = '<dd><p><img src="{{picture}}"/></p><p><a href="{{url}}" target="_blank">{{name}}</a></p><p>{{describe}}</p><p>{{year}} <span>{{score}}</span></p></dd>';

var loadRecommend = {
    _self:'',
    init: function(path,wrap){
        this._self = this;
        var finalData = this.GetAjaxData({
            path: path,
            type:"json",
            async:false
        });
        var _dom = '';
        finalData.count && (_dom = this.createDom({
            dataSource:finalData.data,
            type:'li',
            domTemp:recommendTemp
        }));

        $('.' + wrap).html(_dom);
    },
    GetAjaxData: function (obj) {
        var resultData="";
        $.ajax({
            url: obj.path,
            dataType: obj.type,
            async: obj.async,
            success: function (xmlResponse) {
                resultData = xmlResponse;
            }
        });
        return this.hasData(resultData);
    },
    hasData: function(data){
        var finalDta = {},
            count= 0;
        for(key in data){
            if(data[key].length){
                finalDta[key]=data[key];
                count+= data[key].length;
            }
        };
        return {
            data:finalDta,
            count:count
        };
    },
    createDom:function(obj){
        var _dom = '';
        for(key in obj.dataSource){
            _dom += '<dt>' + key + '</dt>';
            $(obj.dataSource[key]).each(function(i,v){
                var replaceItem = recommendTemp.match(/{{.+?}}/g),
                    itemStr = recommendTemp;

                $.each(replaceItem,function(a,b){
                    itemStr = itemStr.replace(b,b.indexOf("url")!=-1 ? v[b.substring(2,b.length-2)]?v[b.substring(2,b.length-2)]:'javascript:;':v[b.substring(2,b.length-2)]);
                });
                _dom += itemStr;
            })
        }
        return '<dl>' + _dom + '</dl>';
    }
}

$(function(){

    $(".navMobile").click(function(){
        if ($(this).next(".nav").css("display") == "block")
            $(this).next(".nav").css("display","none");
        else
            $(this).next(".nav").css("display","block");
    });

    if($(".toc").length!=0){
        $(".toc").nextAll("li").appendTo(".toc");
        $(window).scroll(function(){
            $(".toc li").each(function(){
                var currNode = $(this).find("a").attr("href");

                if($(currNode).offset().top>$(window).scrollTop()){
                    $(".toc").find("li").removeClass("currNode");
                    $(this).addClass("currNode");
                    return false;
                }
            })
        });
    }

    if($(".recommendWrap").length != 0){
        var currPath =  $('.recommendWrap').data("path");
        loadRecommend.init(currPath,'recommendWrap');
    }

})