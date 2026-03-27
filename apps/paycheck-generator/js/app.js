/**
 * App.js: Lógica de Interação da UI do Formulário + Preview
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // Configura a Máscara da Moeda (IMask)
    const elSalary = document.getElementById('inp-salary');
    const currencyMask = IMask(elSalary, {
        mask: 'num',
        blocks: {
            num: {
                mask: Number,
                scale: 2,
                thousandsSeparator: '.',
                padFractionalZeros: true,
                normalizeZeros: true,
                radix: ',',
                mapToRadix: ['.']
            }
        }
    });
    // Opcional Formatar inicial
    currencyMask.value = '8500,00';

    const renderPreview = () => {
        const payloadParams = {
            company: document.getElementById('inp-company').value,
            name: document.getElementById('inp-name').value,
            month: document.getElementById('inp-month').value,
            role: document.getElementById('inp-role').value,
            salaryStr: currencyMask.value,
            days: document.getElementById('inp-days').value,
            he50: document.getElementById('inp-he50').value,
            he100: document.getElementById('inp-he100').value,
        };

        const result = PaycheckEngine.calculatePayload(payloadParams);
        window.currentCalculatedPayload = result; // Guardo global para Export PDF
        
        // Atualiza Labels Estaticas
        document.getElementById('prev-company').innerText = result.company;
        document.getElementById('prev-name').innerText = result.name;
        document.getElementById('prev-role').innerText = result.role;
        document.getElementById('prev-month').innerText = result.month.split('-').reverse().join('/');

        // Linhas Dinâmicas Tr
        let trs = '';
        
        // Base
        trs += `
            <tr>
                <td class="border-r border-black p-1">001</td>
                <td class="border-r border-black p-1">Salário Normal</td>
                <td class="border-r border-black p-1 text-center">${result.days}d</td>
                <td class="border-r border-black p-1 text-right">${PaycheckEngine.formatCurrency(result.earnValBase)}</td>
                <td class="p-1 text-right"></td>
            </tr>
        `;

        if (result.earnHE50 > 0) {
            trs += `
                <tr>
                    <td class="border-r border-black p-1">007</td>
                    <td class="border-r border-black p-1">Horas Extras 50%</td>
                    <td class="border-r border-black p-1 text-center">${payloadParams.he50}h</td>
                    <td class="border-r border-black p-1 text-right">${PaycheckEngine.formatCurrency(result.earnHE50)}</td>
                    <td class="p-1 text-right"></td>
                </tr>
            `;
        }

        if (result.earnHE100 > 0) {
            trs += `
                <tr>
                    <td class="border-r border-black p-1">008</td>
                    <td class="border-r border-black p-1">Horas Extras 100%</td>
                    <td class="border-r border-black p-1 text-center">${payloadParams.he100}h</td>
                    <td class="border-r border-black p-1 text-right">${PaycheckEngine.formatCurrency(result.earnHE100)}</td>
                    <td class="p-1 text-right"></td>
                </tr>
            `;
        }

        if (result.earnDSR > 0) {
            trs += `
                <tr>
                    <td class="border-r border-black p-1">015</td>
                    <td class="border-r border-black p-1">D.S.R sobre H.Extras</td>
                    <td class="border-r border-black p-1 text-center"></td>
                    <td class="border-r border-black p-1 text-right">${PaycheckEngine.formatCurrency(result.earnDSR)}</td>
                    <td class="p-1 text-right"></td>
                </tr>
            `;
        }

        // Descontos
        trs += `
            <tr>
                <td class="border-r border-black p-1">101</td>
                <td class="border-r border-black p-1 text-red-700">INSS</td>
                <td class="border-r border-black p-1 text-center"></td>
                <td class="border-r border-black p-1 text-right"></td>
                <td class="p-1 text-right text-red-700">${PaycheckEngine.formatCurrency(result.discINSS)}</td>
            </tr>
        `;

        if (result.discIRRF > 0) {
            trs += `
                <tr>
                    <td class="border-r border-black p-1">102</td>
                    <td class="border-r border-black p-1 text-red-700">I.R.R.F.</td>
                    <td class="border-r border-black p-1 text-center"></td>
                    <td class="border-r border-black p-1 text-right"></td>
                    <td class="p-1 text-right text-red-700">${PaycheckEngine.formatCurrency(result.discIRRF)}</td>
                </tr>
            `;
        }

        document.getElementById('prev-events-body').innerHTML = trs;

        // Totais e Liquido
        document.getElementById('prev-total-earn').innerText = PaycheckEngine.formatCurrency(result.totalEarn);
        document.getElementById('prev-total-disc').innerText = PaycheckEngine.formatCurrency(result.totalDisc);
        document.getElementById('prev-net').innerText = PaycheckEngine.formatCurrency(result.netVal);

        // Bases Finais
        document.getElementById('prev-base').innerText = PaycheckEngine.formatCurrency(result.bases.baseTotal);
        document.getElementById('prev-inss-base').innerText = PaycheckEngine.formatCurrency(result.bases.baseTotal);
        document.getElementById('prev-fgts-base').innerText = PaycheckEngine.formatCurrency(result.bases.baseFGTS);
        document.getElementById('prev-fgts').innerText = PaycheckEngine.formatCurrency(result.bases.valFGTS);
    };

    // Watchers Reativos - Qualquer Input Dispara Refresh
    const inputs = document.querySelectorAll('.lux-input');
    inputs.forEach(inp => {
        inp.addEventListener('input', renderPreview);
    });
    
    // Chamada inicial
    renderPreview();

    // Exportação Real (Chagador no arquivo pdfEngine.js)
    document.getElementById('btn-generate-pdf').addEventListener('click', async () => {
        if(window.PDFGenerator && window.currentCalculatedPayload) {
            const btn = document.getElementById('btn-generate-pdf');
            const loader = document.getElementById('loader-pdf');
            
            btn.disabled = true;
            btn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 mr-2 animate-spin"></i> Processando...`;
            loader.classList.remove('hidden');
            loader.classList.add('flex');
            lucide.createIcons();

            try {
                // PDF-lib Call Async
                await window.PDFGenerator.createAndDownload(window.currentCalculatedPayload);
            } catch(e) {
                console.error("PDF Fail", e);
                alert("Erro ao formatar o modelo PDF. Tente Novamente.");
            } finally {
                setTimeout(() => {
                    loader.classList.add('hidden');
                    loader.classList.remove('flex');
                    btn.disabled = false;
                    btn.innerHTML = `<i data-lucide="file-down" class="w-5 h-5 mr-2"></i> Exportar Holerite Oficial (PDF)`;
                    lucide.createIcons();
                }, 1000); // UI visual delay para notar q baixou
            }
        }
    });

});
