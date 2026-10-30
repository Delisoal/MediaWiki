(async function(){
    let cssText="";
    function setAnimation(type){
        let animationObj={
            neon:"neon 2s infinite",
            aurora:"aurora 4s linear infinite",
            pop:"pop 2s linear infinite",
            shake:"shake  0.15s infinite alternate",
            glitch:"glitch 0.3s infinite alternate"
        };
        return type.split(",").map(function(data){return animationObj[data]||""}).filter(function(data){return data!=""}).join(",")||"";
    }
    await fetch(mw.config.get("wgServer")+"/wiki/Project:LinkColor?action=raw&t="+new Date().getTime()).then(function(data){return data.text()}).then(function(UserColor){
        if(UserColor.indexOf("==!")!=-1){
            UserColor=new DOMParser().parseFromString(UserColor,"text/html").body.textContent.replaceAll(/\n/g,"").replaceAll("== !","==!").replaceAll("==! ","==!").replaceAll(" ==","==");
            UserColor.split("==!").forEach(function(fullData,i){
                if(i!=0){
                    let data=fullData.split("==");
                    let cssNormal=cssHover=cssDarkmode=cssDarkmodeHover=cssEffect="";
                    let UserName="/wiki/"+encodeURI(data[0].replaceAll(" ","_").replaceAll("[[","").replaceAll("]]",""));
                    data[1].split(";")?.forEach(function(cssData){
                        let cssObj=cssData.split(":");
                        if(cssObj[0].indexOf("effect-color")!=-1){
                            cssObj=[cssObj[0].replace("effect-color","--animation-color"),cssObj[1]];
                        }
                        else if(cssObj[0].indexOf("effect")!=-1){
                            cssObj=["animation",setAnimation(cssObj[1])];
                        }
                        if(cssObj[0].indexOf("hover-")==0){
                            cssHover+=`${cssObj[0].split("hover-")[1]}:${cssObj[1]};\n--normal-${cssObj[0].split("hover-")[1]}:${cssObj[1]};`;
                            cssNormal+=`--${cssData};`;
                        }
                        else if(cssObj[0].indexOf("darkmode-")==0){
                            cssDarkmode+=`${cssObj[0].split("darkmode-")[1]}:${cssObj[1]};\n--normal-${cssObj[0].split("darkmode-")[1]}:${cssObj[1]};`;
                            cssNormal+=`--${cssData};`;
                        }
                        else if(cssObj[0].indexOf("darkmodeHover-")==0){
                            cssDarkmodeHover+=`${cssObj[0].split("darkmodeHover-")[1]}:${cssObj[1]};\n--normal-${cssObj[0].split("darkmodeHover-")[1]}:${cssObj[1]};`;
                            cssNormal+=`--${cssData};`;
                        }
                        else{
                            cssNormal+=`${cssObj[0]}:${cssObj[1]};\n--normal-${cssData};`;
                        }
                    });
                    cssText+=`#mw-content a[href$="${UserName}"]{${cssNormal};--rev-color:var(--darkmode---theme-link-color)}\n.client-darkmode #mw-content a[href$="${UserName}"]{${cssDarkmode};--rev-color:var(--normal---theme-link-color)}\n#mw-content a[href$="${UserName}"]:hover{${cssHover}}\n.client-darkmode #mw-content a[href$="${UserName}"]:hover{${cssDarkmodeHover}}\n`;
                }
            });
            cssText+=`
#mw-content a:not(.visible){
    animation-play-state:paused;
}
#mw-content a.visible{
    animation-play-state:running;
}
.no-animation a{
    animation-play-state:paused !important;
}
@keyframes neon{
    0%,100%{
        text-shadow:0 0 5px var(--animation-color,var(--rev-color,var(--theme-link-color))),0 0 15px var(--animation-color,var(--rev-color,var(--theme-link-color)));
        font-weight:bold;
        display:inline-block;
        background:var(--normal-background-image,var(--normal-background,var(--normal-background-color,black)));
        padding:0.1em 0.4em;
    	border-radius:0.1em;
    }
    50%{
        text-shadow:0 0 15px  var(--animation-color,var(--rev-color,var(--theme-link-color))),0 0 40px var(--animation-color,var(--rev-color,var(--theme-link-color)));
    }
}
@keyframes aurora{
    0%,100%{
        font-weight:bold;
        background:linear-gradient(
            90deg,
            var(--normal---theme-link-color),
            color-mix(in srgb,var(--normal---theme-link-color) 60%,white),
            var(--normal---theme-link-color),
            color-mix(in srgb,var(--normal---theme-link-color) 60%,white),
            var(--normal---theme-link-color)
        );
        display:inline-block;
        background-size:300% 100%;
        --theme-link-color:transparent;
        --theme-link-color--hover:transparent;
        background-clip:text;
        -webkit-background-clip:text;
    }
    0%{
        background-position:0%;
    }
    100%{
        background-position:300%;
    }
}
@keyframes pop{
	0%,100%{
        display:inline-block;
		transform:translate(0,-0.1em);
	}
	1%{
		transform:translate(0,-0.12em);
	}
	40%{
		transform:translate(0,0.1em);
	}

}
@keyframes shake{
	0%,100%{
		transform:translate(-0.05em,-0.05em);
        display:inline-block;
	}
	25%{
		transform:translate(0.05em,0.05em);
	}
	50%{
		transform:translate(-0.05em,0.05em);
	}
	75%{
		transform:translate(0.05em,-0.05em);
	}
}
@keyframes glitch{
	0%,100%{
		font-weight:bold;
        	display:inline-block;
        	background:var(--normal-background-image,var(--normal-background,var(--normal-background-color,black)));
        	padding:0.1em 0.4em;
		border-radius:0.1em;
	}
	0%{
		text-shadow:-0.05em 0 cyan,0.05em 0 red;
	}
	100%{
		text-shadow:0.05em 0 cyan,-0.05em 0 red;
	}
}`;
            let styleEl=document.createElement("style");
            styleEl.textContent=cssText;
            document.querySelector("head").appendChild(styleEl);
        }
    });
    let io=new IntersectionObserver(function(entries){
        if(!document.body.classList.contains("no-animation")){
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    entry.target.classList.add("visible");
                }
                else{
                    entry.target.classList.remove("visible");
                }
            });
        }
    });
    document.querySelectorAll("#mw-content a").forEach(function(element){
        io.observe(element);
    });
    let mo=new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            mutation.addedNodes.forEach(function(node){
                if(node.nodeType!=1){
                    return;
                }
                if(node.tagName=="A"){
                    io.observe(node);
                }
                node.querySelectorAll("a").forEach(function(element){
                    io.observe(element);
                });
            });
        });
    });
    mo.observe(document.getElementById("mw-content"),{childList:true,subtree:true});
    (function(){
        let progressParent=document.createElement("div");
        let progressMsg=document.createElement("div");
        progressParent.style.cssText="position:fixed;display:block;width:100%;top:0;left:0;text-align:center;z-index:5000;opacity:0;transition:opacity 0.2s,top 0.2s;visibility:hidden;";
        progressMsg.style.cssText=`display:inline-block;max-width:99%;background:white;color:black;border-radius:10px;box-shadow:0 0 18px rgba(18, 18, 18, 0.2);box-sizing:border-box;padding:0.5em 1em;`;
        progressParent.appendChild(progressMsg);
        document.body.appendChild(progressParent);
        let li=document.createElement("li");
        let myStorage=localStorage.getItem("animation");
        if(!myStorage){
            myStorage="OFF";
            localStorage.setItem("animation",myStorage);
        }
        li.innerHTML=`<a title="アニメーションを${myStorage}にする" id="pt-animation-main">アニメーションを<span id="pt-animation-ms">${myStorage}</span></a>`;
        li.id="pt-animation";
        myStorage=="ON"?document.body.classList.add("no-animation"):document.body.classList.remove("no-animation");
        document.querySelector(".cosmos-personalTools-list ul").appendChild(li);
        li.onclick=function(){
            if(!li.classList.contains("clicked")){
                progressMsg.innerHTML=`アニメーションが${myStorage=="ON"?"有効":"無効"}になりました`;
                progressParent.style.visibility="visible";
                progressParent.style.opacity="1";
                progressParent.style.top="3em";
                li.classList.add("clicked");
                li.style.filter="grayscale(1)";
                myStorage=myStorage=="ON"?"OFF":"ON";
                document.getElementById("pt-animation-ms").innerHTML=myStorage;
                document.getElementById("pt-animation-main").title=`アニメーションを${myStorage}にする`;
                localStorage.setItem("animation",myStorage);
                localStorage.getItem("animation")=="ON"?document.body.classList.add("no-animation"):document.body.classList.remove("no-animation");
                let getInnerHTML=document.getElementById("pt-animation-main").innerHTML;
                document.getElementById("pt-animation-main").innerHTML="処理中…";
                setTimeout(function(){
                    progressParent.style.visibility="hidden";
                    progressParent.style.opacity="0";
                    progressParent.style.top="0px";
                    li.classList.remove("clicked");
                    li.style.filter="grayscale(0)";
                    document.getElementById("pt-animation-main").innerHTML=getInnerHTML;
                },1000);
            }
        };
    })();
})();
