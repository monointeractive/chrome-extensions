$(function() {
 let src = (new URL("extension.js", document.location)).href;
   let bookmarklet = 'javascript:'+encodeURIComponent(JavaScriptObfuscator.obfuscate(`(()=>{
    try{
       let script = document.createElement("script");
       script.src = '${src}';
       script.addEventListener('error', (e) => {
       alert('Na tej stronie mnie nie uruchomisz 😈');
    });
       document.head.appendChild(script);
     } catch(err){
      alert('Na tej stronie mnie nie uruchomisz 😈');
     }
   })();`).toString());
   let btn  = $(`<a type="button" class="btn btn-secondary btn-lg bookmarlet d-none" href="${bookmarklet}"><span>🅲🆉🅰🆁🆈 🅼🅰🆁🆈</span></a>`).appendTo('body').on('click',(e)=>{
    e.preventDefault();
    e.stopPropagation();
    alert('Masz przeciągnąć mnie na pasek zakładek, a nie klikać 😈');
   });
   $('body').one('dblclick',(e)=>{
    $('#iframeDiv').hide('slow');

     btn.removeClass('d-none').addClass('animate__tada');
     e.preventDefault();
     e.stopPropagation();
   });
});