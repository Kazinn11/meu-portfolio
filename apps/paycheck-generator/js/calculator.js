/**
 * Motor Trabalhista (CLT 2024 Approximation)
 * Realiza os cálculos de vencimentos e descontos.
 */

const PaycheckEngine = {
    // Tabela INSS Simplificada (Aproximação Progressiva 2024)
    calculateINSS: function(base) {
        let inss = 0;
        if (base <= 1412.00) {
            inss = base * 0.075;
        } else if (base <= 2666.68) {
            inss = (1412.00 * 0.075) + ((base - 1412.00) * 0.09);
        } else if (base <= 4000.03) {
            inss = (1412.00 * 0.075) + ((2666.68 - 1412.00) * 0.09) + ((base - 2666.68) * 0.12);
        } else if (base <= 7786.02) {
            inss = (1412.00 * 0.075) + ((2666.68 - 1412.00) * 0.09) + ((4000.03 - 2666.68) * 0.12) + ((base - 4000.03) * 0.14);
        } else {
            // Teto máximo INSS
            inss = 908.85; 
        }
        return inss;
    },

    // Tabela IRRF Retido na Fonte Simplificada
    calculateIRRF: function(base) {
        // Base = Salario Base + Periculosidade + Extras - Pensões - Dependentes.
        // Simulando a regra de 2024 baseada em faixas com deduções automáticas
        if (base <= 2259.20) return 0;
        if (base <= 2826.65) return (base * 0.075) - 169.44;
        if (base <= 3751.05) return (base * 0.15) - 381.44;
        if (base <= 4664.68) return (base * 0.225) - 662.77;
        return (base * 0.275) - 896.00;
    },

    parseCurrency: function(str) {
        if (!str) return 0;
        let numStr = str.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
        return parseFloat(numStr) || 0;
    },

    formatCurrency: function(val) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    },

    calculatePayload: function(data) {
        const salaryBaseValue = this.parseCurrency(data.salaryStr);
        const days = Math.min(Math.max(parseInt(data.days) || 30, 0), 31);
        
        // 1. Salário Proporcional Mensalista
        const propSalary = (salaryBaseValue / 30) * days;
        
        // 2. Horas Extras (Assumindo base 220 hrs mensais padrão)
        const valHora = salaryBaseValue / 220;
        const he50 = parseInt(data.he50) || 0;
        const he100 = parseInt(data.he100) || 0;
        
        const valHe50 = (valHora * 1.5) * he50;
        const valHe100 = (valHora * 2.0) * he100;
        
        // DSR sobre Extras (1/6 = ~16% fixo simplificado p/ DSR)
        const dsrHe = (valHe50 + valHe100) / 6;

        // Vencimentos Totais Brutos
        const totalVencimentos = propSalary + valHe50 + valHe100 + dsrHe;

        // 3. Descontos
        const baseINSS = totalVencimentos;
        const inssDesc = this.calculateINSS(baseINSS);

        const baseIRRF = totalVencimentos - inssDesc;
        const irrfDesc = this.calculateIRRF(baseIRRF);

        const totalDescontos = inssDesc + (irrfDesc > 0 ? irrfDesc : 0);
        
        // 4. FGTS 8%
        const fgtsDesc = baseINSS * 0.08;

        // Liquido
        const liquido = totalVencimentos - totalDescontos;

        return {
            company: data.company || "Empresa Fictícia S.A.",
            name: data.name || "Colaborador",
            month: data.month || "01/2024",
            role: data.role || "Funcionario",
            days: days,
            
            // Números em FLOAT
            earnValBase: propSalary,
            earnHE50: valHe50,
            earnHE100: valHe100,
            earnDSR: dsrHe,
            
            discINSS: inssDesc,
            discIRRF: irrfDesc > 0 ? irrfDesc : 0,

            totalEarn: totalVencimentos,
            totalDisc: totalDescontos,
            netVal: liquido,

            bases: {
                baseTotal: totalVencimentos, // mesmo q Inss
                baseFGTS: totalVencimentos,
                valFGTS: fgtsDesc
            }
        };
    }
};
