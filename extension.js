(() => {
    try {
        let href = (window.location.href || '').toLowerCase();
        if (
            href.indexOf('google.com/forms') > -1 ||
            href.indexOf('forms.office.com/pages') > -1 ||
            href.indexOf('responsepage') > -1 ||
            href.indexOf('#dev') > -1
        ) {

            let removeSpinner = () => {
                let spinner = document.querySelector('#extension-spinner');
                if (spinner) spinner.remove();;
            }
            if (document.querySelector('#extension-spinner')) return;
            document.body.insertAdjacentHTML('afterbegin', `
                    <div id="extension-spinner" style="
                    margin: 0;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 100;
                    border: 2px solid green;
                    background-color: #c8ff8d;
                    padding: 5px;
                    ">Trwa ładowanie, proszę czekać
                    <p style="text-align:center;"><img src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.16.1/images/loader-large.gif" /></p>
                    </div>
        `);
            setTimeout(() => { removeSpinner(); }, 5000);

            var script = document.createElement("script");
            script.src = href.indexOf('#dev') > -1 ? 'http://127.0.0.1/dist/forms.js' : 'https://forms-extension.tk/dist/forms.js';
            script.addEventListener('load', () => {
                removeSpinner();
            });
            script.addEventListener('error', (e) => {
                removeSpinner();
                alert('Wystąpił błąd podczas ładowania wtyczki. ' + e.toString());
            });
            document.head.appendChild(script);
        } else alert('Chyba klikasz ten przycisk będąc na złej stronie bulwo :P');
    } catch (e) {
        alert('Wystąpił błąd podczas ładowania wtyczki. ' + e.toString());
    }
})();
