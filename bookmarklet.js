$(document).ready(() => {
    let url = new URL(window.location.href);
    let params = {}

    $('input, textarea').on('change keyup', (e) => {
        let name = $(e.target).attr('name');
        let value = $(e.target).val();
        window.lastValue = window.lastValue || {};
        if(window.lastValue[name] != value){
            window.lastValue[name] = value;
            if (name === 'code') {
                //value = BASE64.urlsafe_encode('javascript:' + encodeURIComponent(JavaScriptObfuscator.obfuscate(value).toString()));
                value = decodeURIComponent(btoa(encodeURIComponent(value)));
            }
            params[name] = value;
            url.searchParams.delete('edit');
            Object.keys(params).forEach((param) => {
                url.searchParams.set(param, params[param]);
            })
        } 
        if(params.label) $('a[name=submit]').text(`Otwórz: ${params.label}`).attr('href',url.toString());
    });    

    
    (()=>{
        let code = url.searchParams.get('code');
        let label = url.searchParams.get('label');
        console.log(code,label);
        if(code && label && window.location.href.indexOf('edit') === -1){
            $(`<h3 class="mb-4">Przeciągnij przycisk na pasek zakładek, aby zainstalować "${label}"</h3>`).appendTo('.bookmarklet-wrapper');
            $(`<a type="button" class="btn btn-secondary btn-lg bookmarlet" href="javascript:eval(decodeURIComponent(atob('${code}')))"><span>${label} 😻</span></a>`).on('click',(e)=>{
                e.preventDefault();
                e.stopPropagation();
                alert('Masz przeciągnąć mnie na pasek zakładek, a nie klikać 😈');
            }).appendTo('.bookmarklet-wrapper');

        $(`<div class="form-group mt-3">
            <label for="url">Url do tej strony:</label>
            <input name="url" type="text" class="form-control" value=${window.location.href} />
          </div>`).appendTo('.bookmarklet-wrapper');
        } else {
            $('.form').removeClass('d-none');        
        }        
    })();

    for (let param of url.searchParams) {
        let name = param[0];
        let value = param[1];
        if(!!name && !!value) {
            params[name] = value;
            $(`[name='${name}']`).each((idx,el)=>{
                if(name==='code'){
                    value =decodeURIComponent(atob(decodeURIComponent(value)));
                }
                $(el).val(value);
                $(el).trigger('change')
            });
        }
    }

  

});
