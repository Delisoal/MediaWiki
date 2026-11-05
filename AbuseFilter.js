(function(){
    document.querySelector(".profile-header-attributes h2")?.remove();
    fetch("利用者:"+mw.config.get("wgUserName")).then(function(data){return data.text()}).then(function(innerHTML){
        let dom=new DOMParser().parseFromString(innerHTML,"text/html").querySelector(".profile-header-attributes h2");
        if(dom&&confirm("利用者ページに本名が含まれている可能性があります。\n当該部分は非表示にされているものの、セキュリティ面で脆弱な状態にあります。\n今すぐ特別:個人設定にて変更を行ってください。")){
            location.href="特別:個人設定#ooui-php-22";
        }
    });
	function movepage(){
		location.href=mw.config.get("wgServer")+"/wiki/"+mw.config.get("wgPageName");
	}
	function URLcontains(textString){
		return decodeURIComponent(location.href).indexOf(textString)!=-1;
	}
	let hours=(new Date().getUTCHours()+9)%24;
	if(!(mw.config.get("wgUserGroups").includes("sysop")||mw.config.get("wgUserGroups").includes("bureaucrat"
))){
        if(mw.config.get("wgUserEditCount")<100){
            if(hours>=0&&hours<=5){
                if(mw.config.get("wgAction")=="edit"||mw.config.get("wgAction")=="submit"){
                    movepage();
                }
                else if(URLcontains("特別:GiveGift")){
                    location.href="/";
                }
                let moveinterval=setInterval(function(){
                    if(location.href.indexOf("veaction=edit")!=-1){
                        movepage();
                        clearInterval(moveinterval);
                    }
                },200);
                document.querySelectorAll("a").forEach(function(element){
                    ["?action=edit","?veaction=edit","特別:GiveGift"].forEach(function(href){
                        if(decodeURIComponent(element.href).indexOf(href)!=-1){
                            element.href="";
                        }
                    });
                });
            }
            if(URLcontains("特別:移動")){
                document.body.style.display="none";
                location.href=decodeURIComponent(location.href).replace("/特別:移動","");
            }
        }
        if(mw.config.get("wgUserEditCount")<20){
            if(URLcontains("特別:アップロード")){
                document.body.style.display="none";
                location.href="/";
            }
        }
	}
    fetch(`${mw.util.wikiScript("api")}?action=query&list=users&ususers=${encodeURIComponent(mw.config.get("wgRelevantUserName"))}&usprop=groups&format=json`).then(function(data){
        return data.json();
    }).then(function(json){
        if(mw.config.get("wgNamespaceNumber")==2&&mw.config.get("wgAction")=="view"&&mw.config.get("wgUserGroups").includes("sysop")&&!json.query.users[0].groups.includes("sysop")&&!document.querySelector(".tag-blocked")){
            let fieldset=document.createElement("fieldset");
            let legend=document.createElement("legend");
            let main=document.createElement("div");
            let ul=document.createElement("ul");
            fieldset.style.border="none";
            legend.innerHTML="▼簡易ブロック機能";
            legend.style.cssText="cursor:pointer;font-size:1.2em;color:#cc0000;font-weight:bold;";
            main.innerHTML="操作を選択：<br>";
            main.appendChild(ul);
            main.style.display="none";
            fieldset.appendChild(legend);
            fieldset.appendChild(main);
            let banUserBtnArray=[
                {
                    label:"不適切な名前の利用者として永久追放する",
                    config:[
                        {name:"wpExpiry",value:"infinite"},
                        {name:"wpReason",value:"不適切な利用者名"}
                    ]
                },
                {
                    label:"スパムユーザーとして永久追放する",
                    config:[
                        {name:"wpExpiry",value:"infinite"},
                        {name:"wpReason",value:"ページへ無意味な/意味不明な内容の挿入"}
                    ]
                }
            ];
            banUserBtnArray.forEach(function(banUser){
                let li=document.createElement("li");
                let btn=document.createElement("input");
                btn.value=banUser.label;
                btn.type="button";
                btn.style.cssText="background:#d73333;border-color:#d73333;color:#ffffff;";
                li.appendChild(btn);
                ul.appendChild(li);
                btn.onclick=function(){
                    if(confirm(`「${mw.config.get("wgRelevantPageName")}」を無期限ブロックしますか？`)&&confirm("本当にしますか？")){
                        fetch("/wiki/特別:投稿ブロック/"+mw.config.get("wgRelevantUserName")).then(function(data){
                            return data.text();
                        }).then(function(html){
                            let dom=new DOMParser().parseFromString(html,"text/html").getElementById("mw-content");
                            let div=document.createElement("div");
                            div.style.display="none";
                            div.appendChild(dom);
                            document.body.appendChild(div);
                            document.querySelector("input[name='wpDisableUTEdit']").click();
                            banUser.config.forEach(function(data){
                                let select=document.querySelector(`select[name="${data.name}"]`);
                                select.value=data.value;
                                select.dispatchEvent(new Event("change",{bubbles:true}));
                            });
                            document.querySelector(".mw-htmlform-submit-buttons button").click();
                        });
                    }
                    
                };
            });
            legend.onclick=function(){
                if(legend.classList.contains("open")){
                    legend.classList.remove("open");
                    legend.innerHTML="▼簡易ブロック機能";
                    fieldset.style.border="none";
                    main.style.display="none";
                }
                else{
                    legend.classList.add("open");
                    legend.innerHTML="▲簡易ブロック機能";
                    fieldset.style.border="";
                    main.style.display="block";
                }
            };
            (document.getElementById("profile-top")||document.querySelector(".profile-masthead")).before(fieldset);
        }
    });
})();
