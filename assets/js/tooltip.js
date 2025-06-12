document.addEventListener('DOMContentLoaded', function () {
    const tooltip = document.getElementById('tooltip');
    const tooltipTitle = document.getElementById('tooltip-title');
    const tooltipTable = document.getElementById('tooltip-table');
    const tooltipData = document.getElementById('tooltip-data');
    const tooltipLoading = document.querySelector('.tooltip-loading');
    const estados = document.querySelectorAll('path[id^="BR-"]');
    const anoSelect = document.getElementById('years');
    const mesSelect = document.getElementById('months');

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Fechar ✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: transparent;
      border: none;
      font-size: 1.2rem;
      color: #555;
      cursor: pointer;
      z-index: 1001;
      padding: 0;
      line-height: 1;
      font-weight: bold;
      transition: color 0.3s ease;
    `;
    tooltip.style.position = 'absolute';
    tooltip.appendChild(closeBtn);

    function isMobile() {
      return ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }

    function closeTooltip() {
      tooltip.style.display = 'none';
      closeBtn.style.display = 'none';
    }

    function showTooltip(element) {
      const estadoNome = element.getAttribute('title');
      const estadoId = element.id.replace('BR-', '');
      tooltipTitle.textContent = estadoNome;

      const elementRect = element.getBoundingClientRect();

      tooltip.style.left = `${elementRect.left + elementRect.width / 2 - 100}px`;
      tooltip.style.top = `${elementRect.top - 120}px`;
      tooltip.style.display = 'block';

      tooltipLoading.style.display = 'block';
      tooltipTable.classList.add('hidden');

      const ano = parseInt(anoSelect.value);
      const mes = mesSelect.value.toLowerCase();

      tooltipData.innerHTML = '';

      const resultado = estadosData.find(item =>
        item.UF === estadoId &&
        parseInt(item.Ano) === ano &&
        item['Mês'].toLowerCase() === mes
      );

      if (resultado) {
        const chavesIgnoradas = ['Ano', 'Mês', 'UF'];
        let linhas = Object.entries(resultado)
          .filter(([chave, valor]) => !chavesIgnoradas.includes(chave) && valor !== null && valor !== '0')
          .map(([chave, valor]) => ({
            tipo_imposto: chave,
            valor: parseFloat(valor.replace(',', '.'))
          }));

        linhas.sort((a, b) => b.valor - a.valor);
        linhas = linhas.slice(0, 10);

        if (linhas.length > 0) {
          linhas.forEach(item => {
            const row = document.createElement('tr');

            const tipoTd = document.createElement('td');
            tipoTd.textContent = item.tipo_imposto;
            row.appendChild(tipoTd);

            const valorTd = document.createElement('td');
            valorTd.textContent = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(item.valor);
            row.appendChild(valorTd);

            tooltipData.appendChild(row);
          });
        } else {
          const row = document.createElement('tr');
          const td = document.createElement('td');
          td.colSpan = 2;
          td.textContent = 'Sem dados disponíveis para este estado/período';
          td.style.textAlign = 'center';
          row.appendChild(td);
          tooltipData.appendChild(row);
        }
      } else {
        const row = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 2;
        td.textContent = 'Sem dados disponíveis para este estado/período';
        td.style.textAlign = 'center';
        row.appendChild(td);
        tooltipData.appendChild(row);
      }

      tooltipLoading.style.display = 'none';
      tooltipTable.classList.remove('hidden');
    }

    estados.forEach(estado => {
      estado.addEventListener('mouseenter', function () {
        if (isMobile()) return;
        showTooltip(this);
        closeBtn.style.display = 'none';
      });

      estado.addEventListener('mouseleave', function () {
        if (isMobile()) return;
        closeTooltip();
      });

      estado.addEventListener('touchstart', function (e) {
        e.preventDefault();
        showTooltip(this);
        closeBtn.style.display = 'block';
      });
    });

    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeTooltip();
    });


    document.addEventListener('touchstart', function (e) {
      if (tooltip.style.display === 'block' && !tooltip.contains(e.target) && !e.target.matches('path[id^="BR-"]')) {
        closeTooltip();
      }
    });
  });