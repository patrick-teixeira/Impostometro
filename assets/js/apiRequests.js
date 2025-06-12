document.addEventListener("DOMContentLoaded", function () {
    const yearSelect = document.getElementById('years');
    const defaultYearOption = document.createElement('option');
    defaultYearOption.value = "";
    defaultYearOption.textContent = "Selecione";
    defaultYearOption.selected = true;
    defaultYearOption.disabled = true;
    yearSelect.appendChild(defaultYearOption);

    for (let year = 2024; year >= 2000; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }

    const monthSelect = document.getElementById('months');
    const defaultMonthOption = document.createElement('option');
    defaultMonthOption.value = "";
    defaultMonthOption.textContent = "Selecione";
    defaultMonthOption.selected = true;
    defaultMonthOption.disabled = true;
    monthSelect.appendChild(defaultMonthOption);

    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    
    months.forEach((month) => {
      const option = document.createElement('option');
      option.value = month;
      option.textContent = month;
      monthSelect.appendChild(option);
    });

    window.estadosData = null;

    function checkAndFetchData() {
      const selectedYear = yearSelect.value;
      const selectedMonth = monthSelect.value;

      if (selectedYear && selectedMonth) {
        fetchData(selectedYear, selectedMonth);
      }
    }

    
    function fetchData(year, month) {
      const apiUrl = `https://www.bigdataempython.xyz/api/dados/por_mes_ano`;

      const requestData = {
        ano: year,
        mes: month
      };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      };

      console.log(`Carregando dados para ${month}/${year}...`);

      fetch(apiUrl, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Falha na requisição');
          }
          return response.json();
        })
        .then(data => {
          
          window.estadosData = data;
          console.log('Dados carregados com sucesso:', window.estadosData);

        })
        .catch(error => {
          console.error('Erro ao carregar dados:', error);
        });
    }

    yearSelect.addEventListener('change', checkAndFetchData);
    monthSelect.addEventListener('change', checkAndFetchData);

    document.querySelectorAll('.estado').forEach(estadoElement => {
      estadoElement.addEventListener('mouseover', function () {
        const estadoId = this.id;

        if (window.estadosData && window.estadosData[estadoId]) {
          const dadosEstado = window.estadosData[estadoId];
          console.log(`Dados do estado ${estadoId}:`, dadosEstado);
        }
      });
    });
  });