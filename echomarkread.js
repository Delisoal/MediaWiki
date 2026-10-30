mw.loader.using(["mediawiki.api","mediawiki.util"]).then(function(){
    if(mw.config.get("wgUserGroups").indexOf("user")==-1) return;
    (function(){
        let button=new DOMParser().parseFromString(`<li id="pt-mark-all-read"><a href="#" style="color:#d33; font-weight:bold;">通知を一括既読</a></li>`,"text/html").body.firstChild;
        button.onclick=function(e){
            e.preventDefault();
            if(!confirm("すべての通知を既読にしてもよろしいですか？")) return;
            new mw.Api().postWithToken("csrf",{action:"echomarkread",all:1}).done(function(data){
                alert("すべての通知を既読にしました。ページを再読込します。");
                location.reload();
            }).fail(function(code,result){
                alert("エラーが発生しました:"+code);
            });
        };
        document.querySelector(".cosmos-personalTools-list ul").appendChild(button);
    })();
});
