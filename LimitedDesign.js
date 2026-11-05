(function(){
    let getmonth=new Date().getMonth()+1;
    function addCSSText(cssText,name){
        let stylesheetElement=document.createElement("style");
        stylesheetElement.innerHTML=cssText;
        name?stylesheetElement.id=name:"";
        document.querySelector("head").appendChild(stylesheetElement);
    }
    function getCSS(query,property){
        return window.getComputedStyle(query).getPropertyValue(property);
    }
    addCSSText(`
#mw-content{
	--theme-mode-opacity:10%;
}
.client-darkmode #mw-content{
	--theme-mode-opacity:30%;
}
    `);
    if(getmonth==12){
        addCSSText(`
#mw-content{
    background:linear-gradient(135deg,color-mix(in srgb, aliceblue var(--theme-mode-opacity), rgba(var(--theme-page-color--rgb),0.9)),color-mix(in srgb, #40ffff var(--theme-mode-opacity), rgba(var(--theme-page-color--rgb),0.9)),color-mix(in srgb, aliceblue var(--theme-mode-opacity), rgba(var(--theme-page-color--rgb),0.9)));
}
.pagesnowflake{
    filter:drop-shadow(2px 2px 6px #00ffff);
    position:absolute;
    opacity:1;
    transition:opacity 0.2s,z-index 0s 0.2s;
}
        `);
        function pagesnowflake(){
            for(var yukiLength=0;yukiLength<(Math.round(document.body.offsetHeight/40)<500?Math.round(document.body.offsetHeight/40):500);yukiLength++){
                let myimg=document.createElement("img");
                myimg.src="https://japolandballfanon.miraheze.org/wiki/Special:FilePath/Pagesnowflake.svg";
                myimg.width="40";
                myimg.height="40";
                myimg.classList.add("pagesnowflake");
                myimg.style.top=(Math.floor(Math.random() *(document.body.offsetHeight-50))+1)+"px";
                myimg.style.left=(Math.floor(Math.random() *(document.body.offsetWidth-50))+1)+"px";
                document.body.style.background=window.getComputedStyle(document.getElementById("mw-content")).background;
                document.body.appendChild(myimg);
                myimg.onclick=function(){
                    myimg.style.opacity="0";	
                };
            }
        }
        pagesnowflake();
        window.addEventListener("resize",function(){
            document.querySelectorAll(".pagesnowflake").forEach(function(element){
                element.remove();
            });
            pagesnowflake();
        });
        function fncforphone(){
            let cssElement=document.getElementById("cssforphone");
            if(window.innerWidth<=850){
                if(!cssElement){
                    addCSSText(`
.pagesnowflake{
    z-index:2;
}
                    `,"cssforphone");
                }
                document.querySelectorAll(".pagesnowflake").forEach(function(element){
                    let elementTop=Number(getCSS(element,"top").replace("px",""));
                    let marginarea=100;
                    if(window.scrollY+marginarea<elementTop&&elementTop<window.scrollY+window.innerHeight-marginarea){
                        element.style.opacity="0";
                        element.style.zIndex="-1";
                    }
                    else{
                        element.style.opacity="";
                        element.style.zIndex="";
                    }
                });
            }
            else{
                cssElement?cssElement.remove():"";
            }
        }
        fncforphone();
        window.addEventListener("scroll",fncforphone);
    }
    if(document.referrer!=""&&decodeURIComponent(document.referrer).indexOf(mw.config.get("wgServer"))!=-1){
        fetch(`${mw.util.wikiScript("api")}?action=query&titles=${decodeURIComponent(new URL(document.referrer).pathname.replace("/wiki/",""))}&prop=info&format=json`).then(function(data){
            return data.json();
        }).then(function(object){
            for(let refPageId in object.query.pages){
                let isPageIdMatch=false;
                for(let data of [48599]){
                    if(data==refPageId){
                        isPageIdMatch=true;
                        break;
                    }
                }
                if(isPageIdMatch){
                    let search={};
                    location.search?location.search.substring(1).split("&").forEach(function(obj){
                        search[obj.split("=")[0]]=obj.split("=")[1];
                    }):"";
                    if(search.pagestyle&&search.pagestyle=="90s"){
                        addCSSText(`
html{
    --theme-link-color:blue !important;
    --theme-main-bg-color:lightgray !important;
}
a{
    text-decoration:underline !important;
	text-shadow:0 0 1px color-mix(in srgb,var(--theme-link-color) 85%,transparent);
}
*{
    transition:all 0s !important;
    box-shadow:none !important;
    border-radius:0 !important;
	text-shadow:0 0 1px rgb(0,0,0,0.85);
	color:transparent !important;
}
body{
    background:url("https://japolandball.miraheze.org/wiki/Special:FilePath/Bluesummer.gif") !important;
}
img{
    filter:contrast(0.8) brightness(1.5) saturate(1.5);
}
@media screen and (min-width: 850px){
    body::after{
        background:transparent;
        background-repeat:repeat;
        background-size:auto;
        background-position:0 !important;
    }
}
#mw-content{
    background:lightgrey;
    --theme-text-color:black;
}
h1,h2,h3{
    text-shadow:0 0 1px color-mix(in srgb,red 85%,transparent) !important;
}
#mw-content h1, #mw-content h2{
    border-bottom-style:ridge;
    border-bottom-width:2px;
}
#cosmos-banner,#cosmos-banner::after{
    background:transparent !important;
}
#cosmos-banner{
    border-bottom:ridge;
    position:absolute !important;
}
#mw-content,#cosmos-footer-footerContent,.cosmos-header,#cosmos-toolbar,.portable-infobox.pi-background,#CosmosRail,#cosmos-articleHeader-actions,#cosmos-actionsList-button,#ca-edit,#ca-talk,#toc{
    border:ridge !important;
}
.oo-ui-inputWidget-input.oo-ui-buttonElement-button, .mw-htmlform-submit, .mw-ui-button, .oo-ui-buttonElement-frameless.oo-ui-widget-enabled.oo-ui-flaggedElement-destructive > .oo-ui-buttonElement-button,input[type="button"]{
    box-shadow:none !important;
    border:ridge !important;
}
table,td,th{
    border:solid 1px black !important;
}
#bodyContent ul > li{
	display:block;
}
#bodyContent ul > li::before {
    content: "";
    display:inline-block;
    background:url("https://japolandball.miraheze.org/wiki/Special:FilePath/OldMarker.gif");
    width:1em;
    height:0.5em;
    background-size:contain;
    background-repeat:no-repeat;
}
#mw-banner-home.visible,.pagesnowflake{
    display:none !important;
}
                        `);
                    }
                }
                break;
            }
        });
    }
})();
