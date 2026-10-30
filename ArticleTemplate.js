/*article template*/
if((mw.config.values.wgAction=="edit"||mw.config.values.wgAction=="submit")&&(mw.config.values.wgNamespaceNumber==0||mw.config.values.wgNamespaceNumber==2||mw.config.values.wgNamespaceNumber==200)){
    (async function(){
        let isDataCorrect;
        let textarea=document.getElementById("wpTextbox1");
        let message=document.createElement("span");
        message.style.display="block";
        message.innerHTML="ページ編集にお困りの方はこちらのボタンをクリックしてください。";
        await fetch(mw.config.get("wgServer")+"/wiki/MediaWiki:ArticleTemplate?action=raw&t="+new Date().getTime()).then(function(data){return data.text()}).then(function(innerHTML){
            if(innerHTML.indexOf("==!")!=-1){
                isDataCorrect=true;
                innerHTML.split("==!").forEach(function(ArticleTemplate,i){
                    if(i!=0){
                        let dataArray=ArticleTemplate.split("==");
                        let btnLabel=dataArray.shift();
                        let data=dataArray.join("==");
                        if(data.split("")[0]=="\n"){
                            data=data.replace("\n","");
                        }
                        if(data.split("")[data.split("").length-1]=="\n"){
                            data=data.slice(0,-1);
                        }
                        let btn=document.createElement("input");
                        btn.type="button";
                        btn.value=btnLabel;
                        btn.classList.add("ArticleTemplate");
                        if(document.querySelector(".ArticleTemplate")){
                            document.querySelectorAll(".ArticleTemplate")[document.querySelectorAll(".ArticleTemplate").length-1].after(btn);
                        }
                        else{
                            document.querySelector("#wikiPreview,.wikiEditor-ui").after(btn);
                        }
                        btn.onclick=function(){
                            let syntaxBtn=document.getElementById("mw-editbutton-codemirror").querySelector("a");
                            let isSyntaxBtnPressed=syntaxBtn.getAttribute("aria-pressed")=="true";
                            if(isSyntaxBtnPressed){
                                syntaxBtn.click();
                            }
                            textarea.value="<!--このように書かれた部分は左右の<>と共に削除してください。-->\n"+data;
                            if(isSyntaxBtnPressed){
                                syntaxBtn.click();
                            }
                        };
                    }
                });
            }
        });
        if(isDataCorrect){
            document.querySelectorAll(".ArticleTemplate")[document.querySelectorAll(".ArticleTemplate").length-1].after(message);
            function setDisplay(){
                let visibility;
                if(document.querySelector(".CodeMirror,.cm-line")){
                    let syntaxBtn=document.getElementById("mw-editbutton-codemirror").querySelector("a");
                    let isSyntaxBtnPressed=syntaxBtn.getAttribute("aria-pressed")=="true";
                    if(isSyntaxBtnPressed){
                        visibility=document.querySelector(".CodeMirror-line,.cm-line").textContent.replace("​","")=="";
                    }
                    else{
                        visibility=textarea.value=="";
                    }
                }
                else{
                    visibility=textarea.value=="";
                }
                document.querySelectorAll(".ArticleTemplate").forEach(function(element){
                    element.style.display=(visibility?"inline-block":"none");
                });
                message.style.display=(visibility?"block":"none");
            }
            setInterval(function(){
                setDisplay();
            },10);
            textarea.addEventListener("input",setDisplay);
        }
    })();
}
