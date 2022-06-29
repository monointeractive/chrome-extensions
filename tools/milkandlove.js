(async () => {
    if (window !== parent) return;
    let isBreak = false;
    let getProductsFromCategory = (config) => {
        return new Promise((resolve, reject) => {
            frontAPI.getProductsFromCategory(function (products) {
                resolve(products);
            }, config);
        })
    }

    let getProductVariantsAvailable = (product) => {
        return new Promise((resolve, reject) => {
            let $iframe = $('<iframe style="position:absolute;width:1px;height:1px">');
            $iframe.prependTo('body').attr('src', product.url).on('load', async () => {
                await new Promise(r => setTimeout(r, 100));
                let document = $iframe[0].contentWindow.document;
                let values = {};
                for (let select of $('.option_select select', document).toArray()) {
                    for (let option of $('option', select).toArray()) {
                        if (option.label) {
                            let label = option.label;
                            if (label.toLowerCase().includes('wybierz')) label = 'Domyślnie';
                            option.selected = true;
                            select.dispatchEvent(new Event('change'));
                            await new Promise(r => setTimeout(r, 10));
                            let info = $('.row.availability .second', document).first().text();
                            if (info) {
                                values[label] = info;
                            }
                        }
                    }
                }
                $iframe.remove();
                resolve(values);
            }).on('error', reject);
        });
    }

    let category_id = parseInt(($('body').attr('id') || '').split('shop_category').join(''), 10) || 0;
    if (!category_id) {
        alert('Musisz być w konkretnej kategorii');
        return;
    }


    let products = [];
    let currentPage = 0;
    let totalPages = 1;
    while (currentPage < totalPages) {
        currentPage++;
        let result = (await getProductsFromCategory({
            urlParams: `?limit=50&page=${currentPage}`,
            id: category_id
        })) || {};
        if (result.pages > totalPages) totalPages = result.pages;
        if (Array.isArray(result.list)) products = [...products, ...result.list];
    }
    let addColumnToTable = ($tr, name, value) => {
        let table = $tr.parents('table').first();
        let theadRow = $('thead tr', table).first();
        let tbodyRows = $('tbody tr', table);
        let column = $('th', theadRow).filter((idx, th) => {
            return $(th).text() == name
        }).first();
        if (!column.length) {
            column = $('<th>').appendTo(theadRow).text(name);
            tbodyRows.append($('<td>').text('-'));
        }
        if (column.length) {
            try {

                let idx = $(column).index();
                $tr.find('td').eq(idx).text(value);
            } catch (err) { };
        }
    }
    let wnd = window.open('', 'skan', 'width=1280,height=1024,location=no,resizable=no,scrollbars=no');
    wnd.onbeforeunload = function () {
        isBreak = true;
    }
    $(`<style>table td{white-space:nowrap;table th{white-space:nowrap;}</style>`).appendTo(wnd.document.head);

    $('<table class="table" border=1 cellpadding=1 cellspacing=0>').each((idx, table) => {
        let thead = $('<thead>').each((idx, thead) => {
            $('<tr>').each((idx, tr) => {
                $('<th>').text('No').appendTo(tr);
                $('<th>').text('Produkt').appendTo(tr);
                $('<th>').text('Status').appendTo(tr);
            }).appendTo(thead);
        }).appendTo(table);
        $('<tbody>').each((idx, tbody) => {
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                $('<tr>').each((idx, tr) => {
                    $('<td>').text(i + 1).appendTo(tr);
                    $('<td>').html(`<a href="${product.url}" target="_blank">${product.name}</a>`).appendTo(tr);
                    product.$statusTd = $('<td>').text('Do sprawdzenia').appendTo(tr);
                    product.$tr = $(tr);
                    product.table = table;
                }).appendTo(tbody);
            }
        }).appendTo(table);
    }).appendTo(wnd.document.body);

    //products.length = 2;
    for (let i = 0; i < products.length; i++) {
        if (isBreak) return;
        let product = products[i];
        product.$statusTd.text('Wczytywanie');
        try {
            product.available = await getProductVariantsAvailable(product);
            product.$statusTd.html('<b>Wczytano</b>');
        } catch (err) {
            product.$statusTd.text('Błąd');
        }

        Object.keys(product?.available || {}).forEach((column) => {
            addColumnToTable(product.$tr, column, product?.available[column]);
        })

    }
    console.log(products);
    window.scanner = false;
})();