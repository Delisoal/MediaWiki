if(document.getElementById("page-iconMaker")){
    function id(id){
        return document.getElementById(id);
    }
    function query(q){
        return document.querySelectorAll(q);
    }
    (function(){
		let link=document.createElement("link");
		link.href="https://cdn.jsdelivr.net/gh/Delisoal/MediaWiki@main/IconMaker.css";
		link.rel="stylesheet";
		document.querySelector("head").appendChild(link);
        ["https://cdn.jsdelivr.net/gh/TakeshiOkamoto/GIFAnime.js/GIFAnime.js","https://cdn.jsdelivr.net/npm/omggif@1.0.10/omggif.js"].forEach(function(url){
            let giftool=document.createElement("script");
            giftool.src=url;
            document.body.appendChild(giftool);
        });
	})();
    function toInnerHTML(data){
        return data.replaceAll("\n","").replaceAll(/\s\s\s\s/g,"");
    }
    let parentArea=document.createElement("div");
    let form=document.createElement("form");
    let colorform=document.createElement("form");
    let downloadForm=document.createElement("div");
    let canvas=document.createElement("canvas");
    let bgCanvas=document.createElement("canvas");
	let canvasarea=document.createElement("div");
    let modelCanvas=document.createElement("canvas");
    let flowArea=document.createElement("div");
    let gifarea=document.createElement("div");
    let gifeditorBG=document.createElement("div");
    let gifeditorParent=document.createElement("div");
    let sizeData={width:0,height:0,cellSize:0};
    let pallet=new Set();
    let history=[];
    let historyStep=-1;
    let gifeditorData=[];
    parentArea.style.display="none";
    parentArea.classList.add("iconMaker");
    form.innerHTML=toInnerHTML(`<span style="font-size:2em;font-weight:bold;">【暫定版】</span><br><div class="group">
        <div class="meta">使い方</div>
        1. モードを選択してください。幅及び高さの最大は100pxです。<br>
        2. プレビューを確認しながらツールなどを用いて描画してください。<br> 
        3. 完成したらファイル名を設定してダウンロードしてください。<br><br>
        ※作ったアイコンをサイトに追加する場合は、「このwikiにアップロード」というボタンをクリックしてください。
    </div>
    <div class="group">
        <div class="meta">モード</div>
        <input type="radio" value="normal" name="data" id="label-data-normal" checked><label for="label-data-normal">普通のアイコン（17px×14px）</label>
        <input type="radio" value="tangle" name="data" id="label-data-tangle"><label for="label-data-tangle">タングル（12px×17px）</label>
        <input type="radio" value="language" name="data" id="label-data-language"><label for="label-data-language">言語アイコン（30px×18px）</label>
        <input type="radio" value="mc" name="data" id="label-data-mc"><label for="label-data-mc">軍帽アイコン（17px×20px）</label>
        <input type="radio" value="upload" name="data" id="label-data-upload"><label for="label-data-upload">アップロード</label>
        <input type="radio" value="free" name="data" id="label-data-free"><label for="label-data-free">自由</label>
    </div>`);
    colorform.innerHTML=toInnerHTML(`<div class="group">
        <div class="meta">ツール</div>
        <span class="label-item">
            <input type="radio" name="item" value="pen" id="label-item-pen" checked><label for="label-item-pen">ペン</label>
            <input type="radio" name="item" value="eraser" id="label-item-eraser"><label for="label-item-eraser">消しゴム</label>
            <input type="radio" name="item" value="grab" id="label-item-grab"><label for="label-item-grab" id="label-item-grab-label" style="display:none;">描画ロック</label>
        </span>
        ズーム：<input type="range" id="zoom" min="0.5" step="any" value="1" max="3" list="zoom-list"><span id="zoom-value" style="font-size:1.1em;">100%</span><datalist id="zoom-list"><option value="1"></datalist><br>
        <input type="button" value="塗りつぶしモード：OFF" id="floodFill"><br>
        <span id="forPen">色：<input type="color" list="" id="pxColor">#<input value="000000" id="colorValue" placeholder="HEXを入力"><input type="button" value="スポイト" id="pickupColor"><br>
        パレット：<br><span id="palletItem"></span><input type="button" value="消去" id="palletDelete" style="display:none;vertical-align:top;margin-left:3px;"></span><br>
        <span id="pixSizeArea">線の太さ：<input type="range" min="1" max="10" step="1" value="1" id="pixSize"><input type="number" value="1" min="0" max="10" id="pixSizeValue">px</span>
    </div>`);
    downloadForm.innerHTML=toInnerHTML(`<div class="group">
        <div class="meta">操作</div>
        <input type="button" value="取り消し" id="undo" disabled>
        <input type="button" value="やり直し" id="redo" disabled>
        <input id="clearCanvas" value="キャンバスをリセット" type="button">
        <br>
        <input id="mirror" value="左右反転" type="button">
        <input id="upsideDown" value="上下反転" type="button">
        <br>
        左右対称：
        <input id="symmetryLeft" value="左側に合わせる" type="button">
        <input id="symmetryRight" value="右側に合わせる" type="button">
    </div>
    <div class="group">
        <div class="meta">プレビュー/ダウンロード</div>
        プレビュー：<img id="previewImage"><br>
        ダウンロード：<input type="text" id="fileName" value="image-icon">.png<input type="button" value="ダウンロード" id="downloadImage">
    </div>`);
    gifarea.innerHTML=toInnerHTML(`<div class="group">
        <div class="meta">GIFエディタ</div>
        キャンバスに描いた画像やアップロードした画像を使ってGIFアニメーションを作ることができます。<br><br>
        <input type="button" value="GIFエディタを開く" id="openGifEditor"><br>
        <input type="button" value="キャンバスの画像をフレームとして追加" id="appendData"><br><span id="appendDataLog"></span>
    </div>
    <div class="group">
        <div class="meta">使用したライブラリ</div>
        <ul>
            <li><a href="https://www.petitmonte.com/javascript/howto_gifanime_js.html">GIFAnime.js</a></li>
            <li><a href="https://github.com/deanm/omggif">omggif</a></li>
        </ul>
    </div>`);
    gifeditorBG.innerHTML=toInnerHTML(`<div class="gifeditor-main main">
        <h2>GIFエディタ</h2>
        <div class="gifeditor-flexParent">
            <div class="gifeditor-imagesColumn">
                <div>
                    デフォルトの表示時間：<input type="number" value="0.2" placeholder="0.2" id="gifeditor-defaultSec">秒<br><br>
                </div>
                フレーム：<br><br>
                <div id="gifeditor-appendImage"><span id="gifeditor-appendImageLabel">＋フレームを追加</span></div>
            </div>
            <div class="group">
                <div class="meta">ツール</div>
                プレビュー：<img id="gifeditor-preview"><br><br>
                ファイル名：<input type="text" id="gifeditor-downloadName" value="image">.gif<br><br>
                <input type="button" value="ダウンロード" id="gifeditor-download">
            </div>
        </div>
    </div>`);
    canvas.classList.add("canvas");
    bgCanvas.classList.add("bg");
	canvasarea.classList.add("canvasarea");
    flowArea.classList.add("bg");
    flowArea.classList.add("flowArea");
    flowArea.style.display="none";
	canvasarea.appendChild(canvas);
	canvasarea.appendChild(bgCanvas);
    id("page-iconMaker").after(parentArea);
    gifeditorBG.classList.add("popupConfirm");
    gifeditorParent.classList.add("iconMaker");
    gifeditorParent.classList.add("gifeditor-parent");
    gifeditorParent.style.cssText="display:none;";
    gifeditorParent.appendChild(gifeditorBG);
    parentArea.appendChild(form);
    form.after(canvasarea);
    canvasarea.after(colorform);
    colorform.after(downloadForm);
    downloadForm.after(gifarea);
    document.body.appendChild(flowArea);
    document.body.appendChild(gifeditorParent);
    flowArea.innerHTML="キャンバスをクリック";
    if("ontouchstart" in window){
        id("label-item-grab-label").style.display="inline-block";
    }
    document.querySelectorAll("form").forEach(function(element){
        element.onsubmit=function(e){
            e.preventDefault();
        };
    });
    (function(){
        let msg=document.createElement("div");
        msg.innerHTML="キャンバス";
        msg.classList.add("meta");
        msg.style.marginLeft="16px";
        canvasarea.before(msg);
    })();
    let icondata={
        normal:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAYAAADJ7fe0AAAAtklEQVR4AZSQgRLCMAxCE///nyePG92sq2d7JUmB4M5XPZ9D9AqSPu9TCMst2wrokq97D0EELF+O7wkdH7CaEAhEwBzYdJZwdHyAuRJy+urQoRgibaIveEnlEIzt135h75i/ZD9GG3NI61QgnV9Sg2qKIaKFcecQBAwB7yAcPZw7IZD8LyY2C3tNSPYgMv/Thz8hfA2LQ+DxA/F5LyH4IQAGADcDHuAD1u8hJlQiYp4huaIzG28AAAD//xsNk/EAAAAGSURBVAMABg48Fh6w1RYAAAAASUVORK5CYII=",
        tangle:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAARCAYAAADpPU2iAAAAVElEQVR4AeySUQoAIAhDtfvf2bYSwSDYdyRJaj5ScdiWwKWoEWCiA1A0CCBXPw0IyIkixAoq3ACH1EsaCLHU9Gz1UI5itB8+cJnAK1Ny9McFU9QnAAAA//8yNRWQAAAABklEQVQDADsyHhkGjbIvAAAAAElFTkSuQmCC",
        language:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAASCAYAAABM8m7ZAAABAUlEQVR4AaySgQ6EIAxD4f7/n7k+kxJcIEyCoTK7rpU7f+Xu1WS3gySl3AwmsMp1B3TXgjEjULnbha7dPPE2cRSsgjnBCuP8cT0LJpCfYwX6MRDtjI86ntHVMRgCYIJgBfrowKgxD0dvBXT940IEAagNTAxz7OgAtftxpz/DoxtPDNF0FUOEjUW1GS9JX2gJ8t4bs4LglHA2LM5BKp+V9iL4mbhw4yVAyioGV13FkIONRNUZL8nZisG4VN0MlX2ZY+/kaUEwRvw3Jx7MMf95lmAPYeI6s3/Vvzwd7LfOmlnnuZdp5sHBaDEBmAK4CHiADsR++nkM9pANCYhA4z71Mf4AAAD//+1fhlYAAAAGSURBVAMAiq9WHvBM4N0AAAAASUVORK5CYII=",
        mc:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAUCAYAAABroNZJAAAA4UlEQVR4AZSSAQ6DMAwDYf//M8sFXRUCRXTCTePYbif4bc+/I+gZYnR9eojGPWQzqAnJ+RjiQOM5fV7V6NkIoUHOkPoV6g9CMEmwX0H6DOlGbjdD1+bfIa0b4Ga4aetNqul2WiFuuhriCUU/3V60NcQTFLxVtXlKDYHAqIAKVyt7gI5ZghAIBkksLvjGd7Lovcq5SWUyOQhuB+ij3aj0gh4+0UMgEQh6IUeVy0oIJCcksbjg2wnRB+H+Sx16Q7gNxjGgeYG69BmCHgIgAHAd8AAdyHkNSSIWh4g7YpxvijrwBwAA//+tji5GAAAABklEQVQDAP4URiK4t6gxAAAAAElFTkSuQmCC",
        free:false,
        get upload(){return uploadImage()}
    };
    async function setCanvas(href,save,noresize){
        let originElement;
        if(href){
            let img=new Image();
            img.src=href;
            img=await new Promise(function(resolve,reject){
                img.onload=function(){
                    resolve(img);
                };
            });
            sizeData.width=img.width;
            sizeData.height=img.height;
            originElement=img;
        }
        else{
            let size=await new Promise(function(resolve,reject){
                let mydiv=document.createElement("div");
                mydiv.classList.add("template-confirm");
                mydiv.innerHTML=`<div class="template-confirm-main" id="confirm-main" style="background:white;color:black;">
                <span style="font-size:1.2em;font-weight:bold;display:inline-block;margin-bottom:0.5em;">サイズの設定</span>
                <br>
                サイズを指定してください<br>
                幅：<input type="number" id="imageWidth" value="17" max="100">px<br>
                高さ：<input type="number" id="imageHeight" value="14" max="100">px
                <br><br>
                <div style="text-align:right">
                    <input type="button" value="決定" id="imageSubmit">    
                </div>
                </div>`;
                document.body.appendChild(mydiv);
                document.body.style.overflow="hidden";
                id("confirm-main").style.top=((window.innerHeight-id("confirm-main").offsetHeight)/2)+"px";
                id("imageSubmit").onclick=function(){
                    resolve({width:id("imageWidth").value,height:id("imageHeight").value});
                    mydiv.remove();
                    document.body.style.overflow="auto";
                };
            });
            sizeData=size;
        }
        let isNumCorrectFormat=true;
        [sizeData.width,sizeData.height].forEach(function(num){
            if(num>100||num!=Math.ceil(num)||num<=0){
                isNumCorrectFormat=false;
            }
        });
        if(!isNumCorrectFormat){
            alert("エラー：画像サイズ");
            form.data.value="free";
            setCanvas(icondata[form.data.value]);
            return;
        }
        canvas.width=id("cosmos-pageBody-content").offsetWidth*0.7*id("zoom").value;
        canvas.height=canvas.width/sizeData.width*sizeData.height;
        bgCanvas.width=canvas.width;
        bgCanvas.height=canvas.height;
        noresize?"":canvasarea.style.maxWidth=canvas.width+"px";
        noresize?"":canvasarea.style.maxHeight=canvas.height+"px";
        sizeData.cellSize=canvas.width/sizeData.width;
        let bgctx=bgCanvas.getContext("2d");
        for(let i=0;i<sizeData.width;i++){
            if(i>0){
                let blocksize=sizeData.cellSize;
                bgctx.beginPath();
                bgctx.moveTo(blocksize*i,0);
                bgctx.lineTo(blocksize*i,bgCanvas.height);
                bgctx.stroke();
                bgctx.closePath(); 
            }           
        }
        for(let i=0;i<sizeData.height;i++){
            if(i>0){
                let blocksize=sizeData.cellSize;
                bgctx.beginPath();
                bgctx.moveTo(0,blocksize*i);
                bgctx.lineTo(bgCanvas.width,blocksize*i);
                bgctx.stroke();
                bgctx.closePath();   
            }
        }
        if(href){
            let mctx=modelCanvas.getContext("2d",{willReadFrequently:true});
            modelCanvas.width=sizeData.width;
            modelCanvas.height=sizeData.height;
            mctx.drawImage(originElement,0,0,modelCanvas.width,modelCanvas.height);
            let imageData=mctx.getImageData(0,0,sizeData.width,sizeData.height).data;
            for(let y=0;y<sizeData.height;y++){
                for(let x=0;x<sizeData.width;x++){
                    let ctx=canvas.getContext("2d");
                    let i=(y*sizeData.width+x)*4;
                    ctx.fillStyle=`rgba(${imageData[i]},${imageData[i+1]},${imageData[i+2]},${imageData[i+3]})`;
                    ctx.fillRect(x*sizeData.cellSize,y*sizeData.cellSize,sizeData.cellSize,sizeData.cellSize);
                }
            }
        }
        else{
            modelCanvas.width=sizeData.width;
            modelCanvas.height=sizeData.height;
        }
        let previewLink=modelCanvas.toDataURL();
		id("previewImage").src=previewLink;
        if(!save){
            history=[];
            historyStep=-1;
            saveState();            
        }
    }
    setCanvas(icondata[form.data.value]);
    form.oninput=async function(){
        setCanvas(await icondata[form.data.value]);
    };
    async function uploadImage(){
        return await new Promise(async function(resolve){
            let input=document.createElement("input");
            input.type="file";
            input.click();
            let file=await new Promise(function(fileData){
                input.onchange=function(){
                    fileData(input.files[0]);
                };
                input.oncancel=function(){
                    fileData(false);
                };
            });
            if(!file){
                resolve(false);
                form.data.value="free";
            }
            let r=new FileReader();
            r.readAsDataURL(file);
            r.onload=function(){
                resolve(r.result);
            };
        });
    }
    function setColor(hex){
        id("pxColor").value=hex;
        id("colorValue").value=hex.substring(1);
    }
    id("pxColor").oninput=function(){
        setColor(id("pxColor").value);
    };
    id("colorValue").oninput=function(){
        setColor("#"+id("colorValue").value);
    };
    id("pixSize").oninput=function(e){
        id("pixSizeValue").value=e.target.value;
    }
    id("pixSizeValue").oninput=function(e){
        id("pixSize").value=e.tafrget.value;
    }
    id("clearCanvas").onclick=async function(){
        if(confirm("本当にリセットしますか？")){
            setCanvas(await icondata[form.data.value]);
        }
    };
    id("zoom").oninput=function(){
        id("zoom-value").innerHTML=Math.floor(id("zoom").value*100)+"%";
        let previewLink=modelCanvas.toDataURL();
        setCanvas(previewLink,true,true);
    };
    id("zoom").onchange=function(){
        id("zoom-value").innerHTML=Math.floor(id("zoom").value*100)+"%";
        let previewLink=modelCanvas.toDataURL();
        setCanvas(previewLink,true);
    };
    function setPallet(){
        id("palletItem").innerHTML="";
        pallet.add(id("pxColor").value);
        [...pallet].forEach(function(bg){
            let palletItem=document.createElement("div");
            palletItem.classList.add("palletItem");
            palletItem.style.background=bg;
            palletItem.onclick=function(){
                setColor(bg);
            };
            id("palletItem").appendChild(palletItem);
        });
        if([...pallet].length>0){
            id("palletDelete").style.display="inline-block";
        }
    }
    id("palletDelete").onclick=function(){
        if(confirm("パレットを消去しますか？")){
            id("palletItem").innerHTML="";
            pallet.clear();
            id("palletDelete").style.display="none";
        }
    };
    let isDrawing=false;
    let isFloodFill=false;
    colorform.oninput=function(){
        if(colorform.item.value=="pen"){
            id("forPen").style.display="inline";
        }
        else{
            id("forPen").style.display="none";
        }
    };
    id("floodFill").onclick=function(){
        id("floodFill").classList.toggle("accent");
        id("floodFill").classList.toggle("inUse");
        isFloodFill=id("floodFill").classList.contains("inUse");
        id("pixSizeArea").style.display=id("floodFill").classList.contains("inUse")?"none":"inline";
        id("floodFill").value="塗りつぶしモード："+(id("floodFill").classList.contains("inUse")?"ON":"OFF");
    }
    function getCell(event){
        let rect=canvas.getBoundingClientRect();
        let clientX,clientY;
        if(event.touches){
            clientX=event.touches[0].clientX;
            clientY=event.touches[0].clientY;
        }
        else{
            clientX=event.clientX;
            clientY=event.clientY;
        }
        let col=Math.floor((clientX-rect.left)/sizeData.cellSize);
        let row=Math.floor((clientY-rect.top)/sizeData.cellSize);
        return {col,row};
    }
    function paintCell(e){
        let {row,col}=getCell(e);
        let ctx=canvas.getContext("2d");
        let mctx=modelCanvas.getContext("2d",{willReadFrequently:true});
        if(!isFloodFill){
            if(colorform.item.value=="pen"){
                let pixSize=Number(id("pixSize").value);
                col=col-Math.floor((pixSize-1)/2);
                row=row-Math.floor((pixSize-1)/2);
                ctx.fillStyle=id("pxColor").value;
                ctx.fillRect(col*sizeData.cellSize,row*sizeData.cellSize,pixSize*sizeData.cellSize,pixSize*sizeData.cellSize);
                mctx.fillStyle=id("pxColor").value;
                mctx.fillRect(col,row,pixSize,pixSize);
                setPallet();
            }
            else{
                let pixSize=Number(id("pixSize").value);
                col=col-Math.floor((pixSize-1)/2);
                row=row-Math.floor((pixSize-1)/2);
                ctx.clearRect(col*sizeData.cellSize,row*sizeData.cellSize,pixSize*sizeData.cellSize,pixSize*sizeData.cellSize);
                mctx.clearRect(col,row,pixSize,pixSize);
            }
        }
        else{
            let imageData=mctx.getImageData(0,0,modelCanvas.width,modelCanvas.height);
            let data=imageData.data;
            let width=imageData.width;
            let height=imageData.height;
            let fillColor=id("pxColor").value.substring(1).match(/.{1,2}/g);
            fillColor=[parseInt(fillColor[0],16),parseInt(fillColor[1],16),parseInt(fillColor[2],16),colorform.item.value=="pen"?255:0];
            function index(x,y){
                return (y*width+x)*4;
            }
            let start=index(col,row);
            let target=[data[start],data[start+1],data[start+2],data[start+3]];
            if(target[0]===fillColor[0]&&target[1]===fillColor[1]&&target[2]===fillColor[2]&&target[3]===fillColor[3]){
                return;
            }
            function matchColor(i){
                return (data[i]===target[0]&&data[i+1]===target[1]&&data[i+2]===target[2]&&data[i+3]===target[3]);
            }
            let stack=[[col,row]];
            while (stack.length){
                let [cx,cy]=stack.pop();
                if (cx<0||cy<0||cx>=width||cy>=height){
                    continue;
                }
                let i=index(cx,cy);
                if(!matchColor(i)){
                    continue
                };
                data[i]=fillColor[0];
                data[i+1]=fillColor[1];
                data[i+2]=fillColor[2];
                data[i+3]=fillColor[3];
                stack.push([cx+1,cy]);
                stack.push([cx-1,cy]);
                stack.push([cx,cy+1]);
                stack.push([cx,cy-1]);
            }
            mctx.putImageData(imageData,0,0);
            let modelCanvasDataURL=modelCanvas.toDataURL();
            setCanvas(modelCanvasDataURL,true);
            setPallet();
        }
        let previewLink=modelCanvas.toDataURL();
		id("previewImage").src=previewLink;
    }
    function isGrab(){
        return id("label-item-grab").checked;
    }
    bgCanvas.oncontextmenu=function(e){
        e.preventDefault();
    };
    bgCanvas.addEventListener("mousedown",function(e){
        if(!isGrab()){
            isDrawing=true;
            paintCell(e);
        }
    });
    bgCanvas.addEventListener("mousemove",function(e){
        if(isDrawing) paintCell(e);
    });
    bgCanvas.addEventListener("mouseup",function(){
        isDrawing=false;
        saveState();
    });
    bgCanvas.addEventListener("mouseleave",function(){
        if(isDrawing){
            saveState();
        }
        isDrawing=false;
    });
    let didSave=false;
    bgCanvas.addEventListener("touchstart",function(e){
        if(!isGrab()){
            isDrawing=true;
            didSave=false;
            paintCell(e);
            e.preventDefault();
        }
        else{
            isDrawing=false;
        }
    },{passive:false});
    bgCanvas.addEventListener("touchmove",function(e){
        if(isDrawing&&!isGrab()){
            paintCell(e);
            e.preventDefault();
        }
    },{passive:false});
    window.addEventListener("touchend",function(e){
        if(isDrawing&&!isGrab()){
            isDrawing=false;
            if(!didSave){
                saveState();
                didSave=true;
            }
        }
    });
    window.addEventListener("touchcancel",function(e){
        if(isDrawing){
            isDrawing=false;
            if(!didSave){
                saveState();
                didSave=true;
            }
        }
    });
    function saveState(){
        let previewLink=modelCanvas.toDataURL();
        history=history.slice(0,historyStep+1);
        history.push(previewLink);
        historyStep++;
        updateUndoRedoButtons();
    }
    function updateUndoRedoButtons(){
        id("undo").disabled=true;
        id("redo").disabled=true;
        if(historyStep>0){
            id("undo").disabled=false;
        }
        if(historyStep<history.length-1){
            id("redo").disabled=false;
        }
    }
    id("undo").onclick=function(){
        if(historyStep>0){
            historyStep--;
            setCanvas(history[historyStep],true);
        }
        updateUndoRedoButtons();
    };
    id("redo").onclick=function(){
        if(historyStep<history.length-1){
            historyStep++;
            setCanvas(history[historyStep],true);
        }
        updateUndoRedoButtons();
    };
    window.onkeydown=function(e){
        if(e.target==document.body){
            if(e.ctrlKey&&e.key=="z"){
                id("undo").click();
            }
            if((e.ctrlKey&&e.key=="y")||(e.ctrlKey&&e.shiftKey&&e.key=="z")){
                id("redo").click();
            }
        }
    };
    function mirror(){
        let mctx=modelCanvas.getContext("2d",{willReadFrequently:true});
        let imageData=mctx.getImageData(0,0,modelCanvas.width,modelCanvas.height);
        let data=imageData.data;
        let width=imageData.width;
        let height=imageData.height;
        for(let y=0;y<height;y++){
            for(let x=0;x<Math.floor(width/2);x++){
                let left=(y*width+x)*4;
                let right=(y*width+(width-1-x))*4;
                for(let c=0;c<4;c++){
                    let temp=data[left+c];
                    data[left+c]=data[right+c];
                    data[right+c]=temp;
                }
            }
        }
        mctx.putImageData(imageData,0,0);
        let modelCanvasDataURL=modelCanvas.toDataURL();
        setCanvas(modelCanvasDataURL,true);
        saveState();
    }
    function upsideDown(){
        let mctx=modelCanvas.getContext("2d",{willReadFrequently:true});
        let imageData=mctx.getImageData(0,0,modelCanvas.width,modelCanvas.height);
        let data=imageData.data;
        let width=imageData.width;
        let height=imageData.height;
        for(let y=0;y<Math.floor(height/2);y++){
            for(let x=0;x<width;x++){
                let top=(y*width+x)*4;
                let bottom=((height-1-y)*width+x)*4;
                for(let c=0;c<4;c++){
                    let temp=data[top+c];
                    data[top+c]=data[bottom+c];
                    data[bottom+c]=temp;
                }
            }
        }
        mctx.putImageData(imageData,0,0);
        let modelCanvasDataURL=modelCanvas.toDataURL();
        setCanvas(modelCanvasDataURL,true);
        saveState();
    }
    function symmetryLeft() {
        let mctx=modelCanvas.getContext("2d",{willReadFrequently:true});
        let imageData=mctx.getImageData(0,0,modelCanvas.width,modelCanvas.height);
        let data=imageData.data;
        let width=imageData.width;
        let height=imageData.height;
        for(let y=0;y<height;y++){
            for(let x=0;x<Math.floor(width/2);x++){
                let left=(y*width+x)*4;
                let right=(y*width+(width-1-x))*4;
                for(let c=0;c<4;c++){
                    data[right+c]=data[left+c];
                }
            }
        }
        mctx.putImageData(imageData,0,0);
        let modelCanvasDataURL=modelCanvas.toDataURL();
        setCanvas(modelCanvasDataURL,true);
        saveState();
    }
    function symmetryRight() {
        let mctx=modelCanvas.getContext("2d",{willReadFrequently:true});
        let imageData=mctx.getImageData(0,0,modelCanvas.width,modelCanvas.height);
        let data=imageData.data;
        let width=imageData.width;
        let height=imageData.height;
        for(let y=0;y<height;y++){
            for(let x=0;x<Math.floor(width/2);x++){
                let left=(y*width+x)*4;
                let right=(y*width+(width-1-x))*4;
                for(let c=0;c<4;c++){
                    data[left+c]=data[right+c];
                }
            }
        }
        mctx.putImageData(imageData,0,0);
        let modelCanvasDataURL=modelCanvas.toDataURL();
        setCanvas(modelCanvasDataURL,true);
        saveState();
    }
    id("mirror").onclick=mirror;
    id("upsideDown").onclick=upsideDown;
    id("symmetryLeft").onclick=symmetryLeft;
    id("symmetryRight").onclick=symmetryRight;
    id("downloadImage").onclick=function(){
        let a=document.createElement("a");
        a.href=modelCanvas.toDataURL();
        a.download=id("fileName").value+".png";
        a.click();
    };
    if(typeof mw!=="undefined"&&mw.Api&&OO){
        let uploadButton=document.createElement("input");
        uploadButton.type="button";
        uploadButton.value="このwikiにアップロード";
        id("downloadImage").after(uploadButton);
        uploadButton.onclick=async function(){
            let filename=id("fileName").value+".png";
            if(confirm(`${filename} をアップロードしますか？`)){
                let blob=await new Promise(function(resolve){
                    modelCanvas.toBlob(resolve,"image/png");
                });
                let api=new mw.Api();
                try{
                    let result=await new Promise(function(resolve,reject){
                        api.upload(blob,{filename:filename}).then(
                            function(result){
                                resolve(result);
                            },
                            function(error,result){
                                reject({
                                    error:error,
                                    result:result
                                });
                            }
                        );
                    });
                    alert("アップロード成功");
                    return result;
                }
                catch(error){
                    let apiResult=error.result;
                    if(apiResult&&apiResult.upload&&apiResult.upload.warnings){
                        let warnings=apiResult.upload.warnings;
                        if(warnings.exists){
                            await mw.loader.using(["oojs-ui-windows"]);
                            let dialog=new OO.ui.MessageDialog();
                            let windowManager=new OO.ui.WindowManager();
                            $(document.body).append(windowManager.$element);
                            windowManager.addWindows([dialog]);
                            let promise=windowManager.openWindow(dialog,{
                                title:"ファイルが既に存在します",
                                message:new OO.ui.PanelLayout({
                                    padded:true,
                                    expanded:false,
                                    $content:$(`<div><p><b>${mw.html.escape(filename)}</b> は既に存在します。</p><br><p>このファイルを上書きしますか？</p></div>`)
                                }),
                                actions:[
                                    {
                                        action:"cancel",
                                        label:"キャンセル",
                                        flags:["safe","close"]
                                    },
                                    {
                                        action:"overwrite",
                                        label:"上書き",
                                        flags:["primary","progressive"]
                                    }
                                ]
                            });
                            let result=await promise.closed;
                            windowManager.destroy();
                            if(result&&result.action=="overwrite"){
                                let uploadResult=await api.upload(blob,{filename:filename,ignorewarnings:1});
                                alert("上書き成功");
                                return uploadResult;
                            }
                            else{
                                alert("アップロードをキャンセルしました");
                                return null;
                            }
                        }
                    }
                    throw error.error;
                }
            }
        }
    }
    id("pickupColor").onclick=function(e){
        let vd=document.createElement("div");
        let cr=document.createElement("canvas");
        vd.style.cssText=`width:${canvas.width}px;height:${canvas.height}px;position:absolute;z-index:2;cursor:crosshair;`;
        cr.classList.add("cr");
        cr.width=cr.height=sizeData.cellSize;
        bgCanvas.after(vd);
        document.body.appendChild(cr);
        id("pickupColor").disabled=true;
		id("pickupColor").value="キャンバスをクリック";
        flowArea.style.width=form.offsetWidth+"px";
        flowArea.style.height=flowArea.style.lineHeight=colorform.offsetHeight+16+"px";
        flowArea.style.top=scrollY+colorform.getBoundingClientRect().y-8+"px";
        flowArea.style.left=scrollX+form.getBoundingClientRect().x+"px";
        flowArea.style.display="block";
        vd.onclick=function(e){
            let {col,row}=getCell(e);
            let mctx=modelCanvas.getContext("2d",{willReadFrequently:true});
            let data=mctx.getImageData(col,row,1,1).data;
            setColor("#"+[...data].map(function(hex){return String(hex.toString(16)).padStart(2,"0")}).join("").slice(0,-2));
            setPallet();
            vd.remove();
            cr.remove();
            id("pickupColor").disabled=false;
			id("pickupColor").value="スポイト";
            flowArea.style.display="none";
        };
        vd.onmousemove=function(e){
            cr.style.top=e.pageY-sizeData.cellSize-10+"px";
            cr.style.left=e.pageX+10+"px";
            let {col,row}=getCell(e);
            let mctx=modelCanvas.getContext("2d",{willReadFrequently:true});
            let data=mctx.getImageData(col,row,1,1).data;
            cr.getContext("2d").clearRect(0,0,cr.width,cr.height);
            cr.getContext("2d").beginPath();
            cr.getContext("2d").fillStyle="rgba("+data.join(",")+")";
            cr.getContext("2d").rect(0,0,cr.width,cr.height);
            cr.getContext("2d").fill();
        };
        vd.onmouseover=function(e){
            if(!e.touches){
                cr.style.display="block";
            }
            else{
                cr.style.display="none";
            }
        };
        vd.onmouseleave=function(e){
            if(!e.touches){
                cr.style.display="none";
            }
        };
    };
    id("openGifEditor").onclick=function(){
        gifeditorBG.classList.add("open");
        document.body.style.overflow="hidden";
    };
    gifeditorBG.onclick=function(e){
        if(e.target==gifeditorBG){
            gifeditorBG.classList.remove("open");
            document.body.style.overflow="";
        }
    };
    id("gifeditor-appendImage").onclick=function(){
        let popupConfirm=document.createElement("div");
        popupConfirm.id="gifeditor-appendImageConfirm";
        popupConfirm.classList.add("popupConfirm");
        popupConfirm.innerHTML=toInnerHTML(`<div class="main appendSelect">
            <h2>追加</h2>
            以下のボタンにて画像を追加してください。幅及び高さの最大は100pxです。<br><br>
            <input type="button" value="アップロード" id="gifeditor-upload"><br>
            <input type="button" value="キャンバスから追加" id="gifeditor-fromCanvas">
        </div>`);
        gifeditorParent.appendChild(popupConfirm);
        popupConfirm.classList.add("open");
        popupConfirm.onclick=function(e){
            if(e.target==popupConfirm){
                popupConfirm.remove();
            }
        };
        id("gifeditor-fromCanvas").onclick=function(){
            id("appendData").click();
            popupConfirm.remove();
        };
        id("gifeditor-upload").onclick=function(){
            let file=document.createElement("input");
            file.type="file";
            file.click();
            file.onchange=function(){
                let r=new FileReader();
                r.readAsDataURL(file.files[0]);
                r.onload=async function(){
                    if(file.files[0].type=="image/gif"){
                        let buffer=await file.files[0].arrayBuffer();
                        let reader=new GifReader(new Uint8Array(buffer));
                        for(let i=0;i<reader.numFrames();i++){
                            let width=reader.width;
                            let height=reader.height;
                            let imgDataArray=new Uint8ClampedArray(width*height*4);
                            reader.decodeAndBlitFrameRGBA(i,imgDataArray);
                            let frameCanvas=document.createElement("canvas");
                            frameCanvas.width=width;
                            frameCanvas.height=height;
                            let ctx=frameCanvas.getContext("2d");
                            ctx.putImageData(new ImageData(imgDataArray,width,height),0,0);
                            let previewLink=frameCanvas.toDataURL();
                            await appendGifData(previewLink,`frame${i+1}.png`,reader.frameInfo(i).delay/100);
                        }
                    }
                    else{
                        await appendGifData(r.result,file.files[0].name);
                    }
                    popupConfirm.remove();
                };
            };
            file.oncancel=file.onerror=function(){
                popupConfirm.remove();
            };
        };
    };
    let timedata=[];
    async function createGIF(){
        loaded(false);
        if(gifeditorData.length!=0){
            let gifsizeData=await Promise.all(gifeditorData.map(function(data){
                return new Promise(function(resolve){
                    let img=new Image();
                    img.src=data.href;
                    img.onload=function(){
                        resolve({width:img.width,height:img.height});
                    };
                });
            }));
            gifsizeData={width:Math.min(...gifsizeData.map(function(data){return data.width})),height:Math.min(...gifsizeData.map(function(data){return data.height}))};
            let gifimageData=await Promise.all(gifeditorData.map(function(data){
                return new Promise(function(resolve){
                    let img=new Image();
                    img.crossOrigin="anonymous";
                    img.src=data.href;
                    img.onload=function(){
                        resolve([img,data.time]);
                    };
                });
            }));
            let medianCut;
            let used=new Set();
            gifimageData=gifimageData.map(function(imgdata){
                let gifcanvas=document.createElement("canvas");
                gifcanvas.width=gifsizeData.width;
                gifcanvas.height=gifsizeData.height;
                let ctx=gifcanvas.getContext("2d");
                ctx.imageSmoothingEnabled=false;
                ctx.clearRect(0,0,gifcanvas.width,gifcanvas.height);
                ctx.drawImage(imgdata[0],0,0,imgdata[0].width,imgdata[0].height);
                let pixels=ctx.getImageData(0,0,gifcanvas.width,gifcanvas.height).data;
                for(let i=0;i<pixels.length;i+=4){
                    if(pixels[i+3]!=0){
                        used.add((pixels[i]<<16)|(pixels[i+1]<<8)|pixels[i+2]);
                    }
                }
                imgdata[2]=ctx.getImageData(0,0,gifcanvas.width,gifcanvas.height);
                return imgdata;
            });
            let step=17;
            let transparentSearchValue={};
            for(let r=0;r<256;r+=step){
                for(let g=0;g<256;g+=step){
                    for(let b=0;b<256;b+=step){
                        let color=(r<<16)|(g<<8)|b;
                        if(!used.has(color)){
                            transparentSearchValue={rgb:`rgb(${r},${g},${b})`,hex:color,r:r,g:g,b:b};
                            break;
                        }
                    }
                }
            }
            gifwriterData=gifimageData.map(function(imgdata){
                let gifcanvas=document.createElement("canvas");
                gifcanvas.width=gifsizeData.width;
                gifcanvas.height=gifsizeData.height;
                let ctx=gifcanvas.getContext("2d");
                ctx.imageSmoothingEnabled=false;
                ctx.fillStyle=transparentSearchValue.rgb;
                ctx.fillRect(0,0,gifcanvas.width,gifcanvas.height);
                ctx.drawImage(imgdata[0],0,0,imgdata[0].width,imgdata[0].height);
                let delaytime=imgdata[1];
                let rtdata=gifcanvas.getContext("2d").getImageData(0,0,gifcanvas.width,gifcanvas.height);
                let colors=getColorInfo(rtdata);
                if(colors.length>255){
                    medianCut=new TMedianCut(rtdata,colors);
                    medianCut.run(255,true);
                }
                rtdata["transflg"]=true;
                rtdata["overlaid"]=2;
                rtdata["delaytime"]=delaytime*100;
                if(medianCut){
                    rtdata["colors"]=medianCut.rep_color;
                }
                else{
                    rtdata["colors"]=colors;
                }
                return rtdata;
            });
            let GIFWriter=new TGIFAnime(gifwriterData,0);
            loaded(true);
            id("gifeditor-download").onclick=function(){            
                GIFWriter.SaveToFile(id("gifeditor-downloadName").value+".gif",transparentSearchValue.r,transparentSearchValue.g,transparentSearchValue.b);
            };
            timedata?timedata.forEach(function(data){
                clearInterval(data[0]);
                clearTimeout(data[1]);
            }):"";
            gifimageData.forEach(function(imgdata,i){
                let sum=0;
                let all=0;
                for(let num=0;num<i;num++){
                    sum+=gifimageData[num][1]*1000;
                }
                for(let num=0;num<gifimageData.length;num++){
                    all+=gifimageData[num][1]*1000;
                }
                let previewImage=id("gifeditor-preview");
                previewImage.width=gifsizeData.width;
                previewImage.height=gifsizeData.height;
                let rtarray=[];
                let timeoutdata=setTimeout(function(){
                    let intervaldata=setInterval(function(){
                        let gifcanvas=document.createElement("canvas");
                        gifcanvas.width=gifsizeData.width;
                        gifcanvas.height=gifsizeData.height;
                        let ctx=gifcanvas.getContext("2d");
                        ctx.putImageData(imgdata[2],0,0);
                        let previewLink=gifcanvas.toDataURL();
                        previewImage.src=previewLink;
                    },all);
                    rtarray[0]=intervaldata;
                },sum);
                rtarray[1]=timeoutdata;
                timedata[timedata.length]=rtarray;
            });
        }
    }
    async function appendGifData(url,name="image-icon.png",time=""){
        let img=await new Promise(function(resolve){
            let element=new Image();
            element.src=url;
            element.onload=function(){
                resolve([element.width,element.height]);
            };
        });
        let isNumCorrectFormat=true;
        img.forEach(function(num){
            if(num>100||num!=Math.ceil(num)||num<=0){
                isNumCorrectFormat=false;
            }
        });
        if(isNumCorrectFormat){
            gifeditorData[gifeditorData.length]={href:url,time:time,name:name};
            await createGIF();
            let item=document.createElement("div");
            item.classList.add("gifeditor-imagesItem");
            item.innerHTML=toInnerHTML(`<div class="gifeditor-thumb"><img src="${url}" class="gifeditor-image"><br><span class="gifeditor-name">image-icon.png</span></div>
            <div class="info">
                <b class="gifeditor-index">1枚目</b><span class="gifeditor-changeIndex">変更</span><br>
                表示時間：<input type="number" class="gifeditor-sec" value="${time}" placeholder="${id("gifeditor-defaultSec").value||0.2}">秒<br>
                <span class="gifeditor-dup">複製</span>・<span class="gifeditor-putData">キャンバスに描画</span>・<span class="gifeditor-delete">削除</span>
            </div>`);
            id("gifeditor-appendImage").before(item);
            setItemData();
        }
        else{
            alert("エラー：画像サイズ");
        }
    }
    function setItemData(){
        query(".gifeditor-imagesItem").forEach(function(element,i){
            query(".gifeditor-index")[i].innerHTML=`${i+1}枚目`;
            query(".gifeditor-changeIndex")[i].innerHTML="変更";
            query(".gifeditor-image")[i].src=gifeditorData[i].href;
            query(".gifeditor-sec")[i].value=gifeditorData[i].time;
            query(".gifeditor-name")[i].innerHTML=gifeditorData[i].name;
            query(".gifeditor-delete")[i].onclick=async function(){
                gifeditorData.splice(i,1);
                element.remove();
                setItemData();
                await createGIF();
            };
            query(".gifeditor-sec")[i].oninput=async function(){
                gifeditorData[i].time=Number(query(".gifeditor-sec")[i].value||(id("gifeditor-defaultSec").value||0.2));
                await createGIF();
            };
            query(".gifeditor-changeIndex")[i].onclick=changeIndexFnc;
            function changeIndexFnc(){
                query(".gifeditor-index")[i].innerHTML=`<select id="gifeditor-changeIndexSelect${i}"></select>枚目`;
                query(".gifeditor-changeIndex")[i].innerHTML="キャンセル";
                let select=id("gifeditor-changeIndexSelect"+i);
                gifeditorData.forEach(function(data,num){
                    let option=document.createElement("option");
                    option.value=num+1;
                    option.innerHTML=num+1;
                    select.appendChild(option);
                });
                select.querySelectorAll("option").forEach(function(option,num){
                    if(num==i){
                        option.selected=true;
                    }
                });
                select.onchange=async function(){
                    let data=gifeditorData.splice(i,1);
                    let newindex=Number(select.value);
                    gifeditorData.splice(newindex-1,0,data[0]);
                    await createGIF();
                    setItemData();
                };
                query(".gifeditor-changeIndex")[i].onclick=function(){
                    query(".gifeditor-index")[i].innerHTML=`${i+1}枚目`;
                    query(".gifeditor-changeIndex")[i].innerHTML="変更";
                    query(".gifeditor-changeIndex")[i].onclick=changeIndexFnc;
                };
            }
            query(".gifeditor-putData")[i].onclick=async function(){
                if(confirm("現在のキャンバスのデータが失われます。")){
                    await setCanvas(gifeditorData[i].href);
                    gifeditorBG.click();
                    canvasarea.scrollIntoView(true);
                }
            };
            query(".gifeditor-dup")[i].onclick=async function(){
                await appendGifData(gifeditorData[i].href,"duplicated.png",gifeditorData[i].time);
                query(".gifeditor-changeIndex")[query(".gifeditor-changeIndex").length-1].click();
                id("gifeditor-changeIndexSelect"+(query(".gifeditor-changeIndex").length-1)).value=i+2;
                id("gifeditor-changeIndexSelect"+(query(".gifeditor-changeIndex").length-1)).dispatchEvent(new Event("change"));
            };
        });
    }
    function loaded(bl){
        id("gifeditor-download").disabled=!bl;
        if(!bl){
            id("gifeditor-preview").src="";
        }
    }
    id("appendData").onclick=async function(){
        let previewLink=modelCanvas.toDataURL();
        await appendGifData(previewLink,id("fileName").value+".png");
        id("appendDataLog").innerHTML="正常に追加されました："+id("fileName").value+".png";
        id("appendDataLog").classList.remove("hiddenLog");
        await new Promise(function(resolve){setTimeout(resolve,1000)});
        id("appendDataLog").classList.add("hiddenLog");
        await new Promise(function(resolve){setTimeout(resolve,1500)});
        id("appendDataLog").innerHTML="";
    };
    id("gifeditor-defaultSec").oninput=function(){
        query(".gifeditor-sec")?.forEach(function(element){
            element.placeholder=id("gifeditor-defaultSec").value||0.2;
        });
    };
    id("page-iconMaker").remove();
}
