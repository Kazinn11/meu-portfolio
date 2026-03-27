/**
 * JS-PDF Engine
 * Utiliza o UMD Bundle 'window.PDFLib'
 */

window.PDFGenerator = {

    async createAndDownload(data) {
        try {
            const { PDFDocument, rgb } = window.PDFLib;
            
            // Cria arquivo vazio
            const pdfDoc = await PDFDocument.create();
            // A4 Portrait
            const page = pdfDoc.addPage([595.28, 841.89]); 
            
            // Constantes Uteis
            const width = page.getWidth();
            const height = page.getHeight();
            // Cinza claro para bordas (RGB/255)
            const bRgb = rgb(0.7, 0.7, 0.7); 
            const bkRgb = rgb(0, 0, 0); 
            
            // -- DESENHANDO A MATRIZ DE TABELA E TEXTO DO RECIBO -- //
            
            // 1. Box Master do Holerite
            const mX = 30; // margem X
            const topY = height - 50; 
            
            page.drawRectangle({
                x: mX, y: topY - 500, width: width - (mX * 2), height: 500,
                borderColor: bkRgb, borderWidth: 1
            });

            // 2. Cabecalho Empresa E Nome Header
            page.drawLine({
                start: {x: mX, y: topY - 80}, end: {x: width - mX, y: topY - 80},
                throttle: 1, color: bkRgb
            });
            // Separador Mes Vertical
            page.drawLine({
                start: {x: width - 150, y: topY}, end: {x: width - 150, y: topY - 80},
                thickness: 1, color: bkRgb
            });

            // Escreve Textos Empresa
            page.drawText(data.company.toUpperCase(), { x: mX + 10, y: topY - 25, size: 12, color: bkRgb });
            page.drawText('CNPJ: 00.000.000/0000-00', { x: mX + 10, y: topY - 45, size: 9, color: bkRgb });

            // Escreve Textos Referencia no canto
            page.drawText('RECIBO DE PAGAMENTO DE SALÁRIO', { x: width - 140, y: topY - 25, size: 7, color: bkRgb });
            page.drawText('1ª VIA', { x: width - 140, y: topY - 40, size: 7, color: bkRgb });
            page.drawText('Referência:', { x: width - 140, y: topY - 55, size: 9, color: bkRgb });
            page.drawText(data.month.split('-').reverse().join('/'), { x: width - 90, y: topY - 55, size: 10, color: bkRgb }); // Ex. 03/2024

            // 3. Info do Funcionario (Código, Nome, Cbo)
            page.drawLine({
                start: {x: mX, y: topY - 120}, end: {x: width - mX, y: topY - 120},
                throttle: 1, color: bkRgb
            });
            
            page.drawText('Cód.', { x: mX + 5, y: topY - 95, size: 8 });
            page.drawText('00185', { x: mX + 5, y: topY - 110, size: 10 });
            
            page.drawLine({
                start: {x: mX + 50, y: topY - 80}, end: {x: mX + 50, y: topY - 120},
                thickness: 1, color: bkRgb
            });

            page.drawText('Nome do Funcionário', { x: mX + 60, y: topY - 95, size: 8 });
            page.drawText(data.name.toUpperCase(), { x: mX + 60, y: topY - 110, size: 10 });

            page.drawLine({
                start: {x: width - 150, y: topY - 80}, end: {x: width - 150, y: topY - 120},
                thickness: 1, color: bkRgb
            });

            page.drawText('Função', { x: width - 140, y: topY - 95, size: 8 });
            page.drawText(data.role, { x: width - 140, y: topY - 110, size: 10 });

            // 4. THEAD TABELAS EVENTOS
            page.drawLine({
                start: {x: mX, y: topY - 140}, end: {x: width - mX, y: topY - 140},
                color: bRgb, thickness: 1
            });
            // Columns
            page.drawText('Cód.', { x: mX + 5, y: topY - 135, size: 8 });
            page.drawText('Descrição', { x: mX + 50, y: topY - 135, size: 8 });
            page.drawText('Referência', { x: mX + 250, y: topY - 135, size: 8 });
            page.drawText('Vencimentos', { x: mX + 350, y: topY - 135, size: 8 });
            page.drawText('Descontos', { x: mX + 450, y: topY - 135, size: 8 });

            // Linhas Verticais de Escopo Tabela
            [50, 240, 340, 440].forEach(colX => {
                page.drawLine({
                    start: {x: mX + colX, y: topY - 120}, end: {x: mX + colX, y: topY - 420},
                    color: bkRgb, thickness: 1
                });
            });

            // --- ROWS DINÂMICAS ---
            let curY = topY - 155;
            const drawRow = (cod, desc, ref, gain, disc) => {
                page.drawText(cod, { x: mX + 5, y: curY, size: 9 });
                page.drawText(desc, { x: mX + 55, y: curY, size: 9 });
                page.drawText(ref, { x: mX + 250, y: curY, size: 9 });
                if (gain) page.drawText(PaycheckEngine.formatCurrency(gain), { x: mX + 350, y: curY, size: 9 });
                if (disc) page.drawText(PaycheckEngine.formatCurrency(disc), { x: mX + 450, y: curY, size: 9 });
                curY -= 15;
            };

            // Inject Data -> Vencimentos
            drawRow('001', 'Salário Normal', `${data.days} d`, data.earnValBase, 0);
            if (data.earnHE50 > 0) drawRow('007', 'Horas Extras (50%)', '-', data.earnHE50, 0);
            if (data.earnHE100 > 0) drawRow('008', 'Horas Extras (100%)', '-', data.earnHE100, 0);
            if (data.earnDSR > 0) drawRow('015', 'Reflexos D.S.R', '-', data.earnDSR, 0);

            // Inject Data -> Descontos
            drawRow('101', 'INSS Múltiplo Prog.', '-', 0, data.discINSS);
            if (data.discIRRF > 0) drawRow('102', 'IRRF Baseado', '-', 0, data.discIRRF);


            // 5. Linhas Finais Totais e Assinatura
            page.drawLine({
                start: {x: mX, y: topY - 420}, end: {x: width - mX, y: topY - 420},
                color: bkRgb, thickness: 1
            });
            // Bloco Branco Lateral
            page.drawLine({
                start: {x: mX + 340, y: topY - 420}, end: {x: mX + 340, y: topY - 460},
                color: bkRgb, thickness: 1
            });
            page.drawLine({
                start: {x: mX + 440, y: topY - 420}, end: {x: mX + 440, y: topY - 460},
                color: bkRgb, thickness: 1
            });
            
            page.drawText('Total Vencimentos', { x: mX + 345, y: topY - 435, size: 8 });
            page.drawText(PaycheckEngine.formatCurrency(data.totalEarn), { x: mX + 345, y: topY - 445, size: 10, color: bkRgb });

            page.drawText('Total Descontos', { x: mX + 445, y: topY - 435, size: 8 });
            page.drawText(PaycheckEngine.formatCurrency(data.totalDisc), { x: mX + 445, y: topY - 445, size: 10, color: bkRgb });

            // Liquid Value Line
            page.drawLine({
                start: {x: mX, y: topY - 460}, end: {x: width - mX, y: topY - 460},
                color: bkRgb, thickness: 1
            });
            
            page.drawText('LÍQUIDO A RECEBER ->', { x: mX + 310, y: topY - 480, size: 10 });
            page.drawText(PaycheckEngine.formatCurrency(data.netVal), { x: width - mX - 100, y: topY - 485, size: 16, color: bkRgb });


            // 6. Base Calculos Footer
            page.drawLine({
                start: {x: mX, y: topY - 500}, end: {x: width - mX, y: topY - 500},
                color: bkRgb, thickness: 1
            });
            
            // Sub caixas bases calc
            [130, 260, 390].forEach(fx => {
                 page.drawLine({
                    start: {x: mX + fx, y: topY - 500}, end: {x: mX + fx, y: topY - 525},
                    color: bkRgb, thickness: 1
                });
            });
            page.drawLine({
                start: {x: mX, y: topY - 525}, end: {x: width - mX, y: topY - 525},
                color: bkRgb, thickness: 1
            });
            
            page.drawText('Salário Base', { x: mX + 5, y: topY - 510, size: 7 });
            page.drawText(PaycheckEngine.formatCurrency(data.bases.baseTotal), { x: mX + 5, y: topY - 520, size: 9 });

            page.drawText('Sal. Contr. INSS', { x: mX + 135, y: topY - 510, size: 7 });
            page.drawText(PaycheckEngine.formatCurrency(data.bases.baseTotal), { x: mX + 135, y: topY - 520, size: 9 });

            page.drawText('Base Cálc. FGTS', { x: mX + 265, y: topY - 510, size: 7 });
            page.drawText(PaycheckEngine.formatCurrency(data.bases.baseFGTS), { x: mX + 265, y: topY - 520, size: 9 });

            page.drawText('FGTS do Mês', { x: mX + 395, y: topY - 510, size: 7 });
            page.drawText(PaycheckEngine.formatCurrency(data.bases.valFGTS), { x: mX + 395, y: topY - 520, size: 9 });



            // --- COMPILE AND DOWNLOAD ---
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Holerite_${data.name.replace(/\s+/g,'_')}_${data.month}.pdf`;
            
            // Auto click in browser
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error(error);
            alert("Falha Critica na Matriz do PDF-lib.");
        }
    }
}
