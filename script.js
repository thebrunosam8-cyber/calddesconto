(function() {
    // Elementos do DOM
    const inputValor = document.getElementById('valorCompra');
    const btnCalcular = document.getElementById('calcularBtn');
    const resultadoContainer = document.getElementById('resultadoContainer');
  
    // Formatação para moeda brasileira
    const formatarMoeda = (valor) => {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
  
    // Lógica de desconto conforme regras:
    // - R$ 100,00 até R$ 500,00 → 5% de desconto
    // - Acima de R$ 1.989,00 → 10% de desconto
    // - Outros valores → sem desconto
    function calcularDesconto(valor) {
      if (valor >= 100 && valor <= 1988) {
        return { percentual: 5, descricao: '5% (R$ 100 a R$ 1.988)' };
      } else if (valor > 1989) {
        return { percentual: 10, descricao: '10% (acima de R$ 1.989)' };
      } else {
        return { percentual: 0, descricao: 'Sem desconto' };
      }
    }
  
    // Renderiza o resultado na tela
    function renderizarResultado(valorOriginal) {
      // Validação básica
      if (isNaN(valorOriginal) || valorOriginal <= 0) {
        resultadoContainer.innerHTML = `
          <div class="empty-message">
            <i class="fas fa-exclamation-triangle" style="color: #b13e3e;"></i>
            Informe um valor válido maior que zero.
          </div>
        `;
        return;
      }
  
      // Obtém regra de desconto
      const descontoInfo = calcularDesconto(valorOriginal);
      const percentual = descontoInfo.percentual;
  
      // Cálculo do valor do desconto e total
      const valorDesconto = valorOriginal * (percentual / 100);
      const totalComDesconto = valorOriginal - valorDesconto;
  
      // Define classes e badges
      const temDesconto = percentual > 0;
      const badgeHtml = temDesconto 
        ? `<span class="badge-desconto">-${percentual}%</span>` 
        : '';
  
      // Monta o HTML do resumo
      let html = '';
  
      // Linha: Valor original
      html += `
        <div class="result-line">
          <span class="result-label"><i class="fas fa-tag"></i> Valor original</span>
          <span class="result-value">${formatarMoeda(valorOriginal)}</span>
        </div>
      `;
  
      // Linha: Desconto aplicado (percentual)
      html += `
        <div class="result-line">
          <span class="result-label">
            <i class="fas fa-percent"></i> Desconto 
            ${badgeHtml}
          </span>
          <span class="result-value ${temDesconto ? 'negative' : ''}">
            ${temDesconto ? '- ' + formatarMoeda(valorDesconto) : formatarMoeda(0)}
          </span>
        </div>
      `;
  
      // Linha: Regra aplicada (informativo)
      html += `
        <div class="result-line" style="font-size:0.9rem; color:#4b6f88;">
          <span class="result-label"><i class="fas fa-info-circle"></i> Regra</span>
          <span style="font-weight:500;">${descontoInfo.descricao}</span>
        </div>
      `;
  
      // Linha destacada: Total a pagar
      html += `
        <div class="result-line highlight">
          <span class="result-label"><i class="fas fa-wallet"></i> Total a pagar</span>
          <span class="result-value big">${formatarMoeda(totalComDesconto)}</span>
        </div>
      `;
  
      // Se não houver desconto, exibe um aviso amigável
      if (!temDesconto) {
        html += `
          <div style="font-size:0.9rem; color:#8a6e4b; background:#fff7e6; border-radius:1rem; padding:0.8rem 1rem; margin-top:1rem; display:flex; align-items:center; gap:0.6rem;">
            <i class="fas fa-lightbulb" style="color:#e6a017;"></i>
            Compras entre R$ 100 e R$ 500 ganham 5% — acima de R$ 1.989 ganham 10%.
          </div>
        `;
      }
  
      resultadoContainer.innerHTML = html;
    }
  
    // Pega o valor do input, calcula e mostra
    function processarCalculo() {
      const valorTexto = inputValor.value.trim();
      const valor = parseFloat(valorTexto);
  
      if (valorTexto === '' || isNaN(valor) || valor <= 0) {
        resultadoContainer.innerHTML = `
          <div class="empty-message">
            <i class="fas fa-exclamation-circle" style="color: #b13e3e;"></i>
            Por favor, insira um valor válido maior que zero.
          </div>
        `;
        return;
      }
  
      renderizarResultado(valor);
    }
  
    // Evento do botão
    btnCalcular.addEventListener('click', processarCalculo);
  
    // Pressionar Enter no input também calcula
    inputValor.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        processarCalculo();
      }
    });
  
    // Inicialização: já mostra o resultado para R$ 100,00 (valor padrão)
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        if (!inputValor.value || parseFloat(inputValor.value) <= 0) {
          inputValor.value = '100.00';
        }
        processarCalculo();
      }, 10);
    });
  })();