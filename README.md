# MediaWiki
MediaWikiに埋め込む場合、MediaWiki:Common.jsに
```javascript
function addScript(src){
	let scr=document.createElement("script");
	scr.src=`https://cdn.jsdelivr.net/gh/Delisoal/MediaWiki@main/${src}.js`;
	document.body.appendChild(scr);
};
```
と記述し、
```javascript
addScript("IconMaker");
```
のように埋め込んでください
