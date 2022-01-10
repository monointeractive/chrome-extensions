$(function() {
 let src = (new URL("extension.js", document.location)).href;
   let bookmarklet = 'javascript:'+encodeURIComponent((`(()=>{
    try{
       let script = document.createElement("script");
       script.src = '${src}';
       document.head.appendChild(script);
     } catch(err){
       alert(err.toString());
     }
   })();`).split('\n').join('').replace(/\s\s+/g, ' '));
   $(`<a type="button" class="btn btn-secondary btn-lg bookmarlet" href="${bookmarklet}"><span>Forms, I like it 😏</span></a>`).appendTo('body').on('click',(e)=>{
    e.preventDefault();
    e.stopPropagation();
    alert('Masz przeciągnąć mnie na pasek zakładek, a nie klikać 😈');
   });
});