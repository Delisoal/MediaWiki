let isComposingTextIME=false;
let isPressing=false;
let isAutofillBlocked=false;
(function(){
    let progressParent=document.createElement("div");
    let progressMsg=document.createElement("div");
    progressParent.style.cssText="position:fixed;display:block;width:100%;top:0;left:0;text-align:center;z-index:5000;opacity:0;transition:opacity 0.2s,top 0.2s;visibility:hidden;";
    progressMsg.style.cssText=`display:inline-block;max-width:99%;background:white;color:black;border-radius:10px;box-shadow:0 0 18px rgba(18, 18, 18, 0.2);box-sizing:border-box;padding:0.5em 1em;`;
    progressParent.appendChild(progressMsg);
    document.body.appendChild(progressParent);
    let li=document.createElement("li");
    let myStorage=localStorage.getItem("autofill");
    if(!myStorage){
        myStorage="OFF";
        localStorage.setItem("autofill",myStorage);
    }
    li.innerHTML=`<a title="自動入力機能を${myStorage}にする" id="pt-autofill-main">自動入力機能を<span id="pt-autofill-ms">${myStorage}</span></a>`;
    li.id="pt-autofill";
    isAutofillBlocked=myStorage=="ON";
    document.querySelector(".cosmos-personalTools-list ul").appendChild(li);
    li.onclick=function(){
        if(!li.classList.contains("clicked")){
            progressMsg.innerHTML=`自動入力機能が${myStorage=="ON"?"有効":"無効"}になりました`;
            progressParent.style.visibility="visible";
            progressParent.style.opacity="1";
            progressParent.style.top="3em";
            li.classList.add("clicked");
            li.style.filter="grayscale(1)";
            myStorage=myStorage=="ON"?"OFF":"ON";
            document.getElementById("pt-autofill-ms").innerHTML=myStorage;
            document.getElementById("pt-autofill-main").title=`自動入力機能を${myStorage}にする`;
            localStorage.setItem("autofill",myStorage);
            isAutofillBlocked=localStorage.getItem("autofill")=="ON";
            let getInnerHTML=document.getElementById("pt-autofill-main").innerHTML;
            document.getElementById("pt-autofill-main").innerHTML="処理中…";
            setTimeout(function(){
                progressParent.style.visibility="hidden";
                progressParent.style.opacity="0";
                progressParent.style.top="0px";
                li.classList.remove("clicked");
                li.style.filter="grayscale(0)";
                document.getElementById("pt-autofill-main").innerHTML=getInnerHTML;
            },1000);
        }
    };
})();
window.addEventListener("compositionstart",function(e){
    isComposingTextIME=true;
});
window.addEventListener("compositionend",function(e){
    isComposingTextIME=false;
});
window.addEventListener("keydown",function(e){
    isPressing=true;
});
window.addEventListener("keyup",function(){
    isPressing=false;
    isComposingTextIME=false;
});
window.addEventListener("input",function(e){
    if(!isAutofillBlocked){
        let element=e.target;
        function insertText(text,fncA,fncB){
            if(isPressing){
                isComposingTextIME?text="":"";
                if(element.tagName=="INPUT"||element.tagName=="TEXTAREA"){
                    fncA({start:element.selectionStart,text:text,end:element.selectionEnd});
                    element.focus();
                }
                else if(element.isContentEditable){
                    let selection=window.getSelection();
                    if(selection.rangeCount){
                        setTimeout(function(){
                            let range=selection.getRangeAt(0);
                            fncB({selection:selection,text:text,range:range,setNode:function(nodeText){this.node=document.createTextNode(nodeText)}});
                            selection.removeAllRanges();
                            selection.addRange(range);
                            element.normalize();
                        },80);
                    }
                }
            }
        }
        let obj={
            "{":"}",
            "(":")",
            "\"":"\"",
            "[":"]",
            "\'":"\'",
            "\`":"\`",
            "「":"」",
            "（":"）"
        };
        for(let data in obj){
            if(e.data==data){
                insertText(obj[data],function(data){
                    element.value=element.value.slice(0,data.start)+data.text+element.value.slice(data.end);
                    element.selectionStart=element.selectionEnd=data.start;
                },function(data){
                    data.setNode(data.text);
                    data.range.insertNode(data.node);
                    data.range.setStartBefore(data.node);
                    data.range.setEndBefore(data.node);
                });
            }
        }
        if(e.data=="<"){
            insertText(">",function(data){
                if(element.value.slice(data.start-3,data.start).split("<").at(0).indexOf("}}")==-1||element.value.slice(0,data.start).split("{{I|").at(-1).split("<")[0].indexOf("{{")!=-1){
                    element.value=element.value.slice(0,data.start)+data.text+element.value.slice(data.end);
                    element.selectionStart=element.selectionEnd=data.start;
                }
            },function(data){
                let preRange=data.range.cloneRange();
                preRange.selectNodeContents(element);
                preRange.setEnd(data.range.startContainer,data.range.startOffset);
                let start=preRange.toString().length;
                let textContent=element.textContent;
                if(textContent.slice(start-3,start).split("<").at(0).indexOf("}}")==-1||textContent.slice(0,start).split("{{I|").at(-1).split("<")[0].indexOf("{{")!=-1){
                    data.setNode(data.text);
                    data.range.insertNode(data.node);
                    data.range.setStartBefore(data.node);
                    data.range.setEndBefore(data.node);
                }
            });
        }
    }
});
