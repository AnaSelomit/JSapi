const amout = document.getElementById("amout");
const currency = document.getElementById("currency");
const btn = document.getElementById("btn");
const resultado = document.getElementById("resultado");

const APIurl = "https://mindicador.cl/api/";

async function getMonedas() {
    try {
        const res = await fetch(APIurl);
        const data = await res.json();
        monedas = data;
        console.log(data);
    } catch (e) {
        let imageNot = document.createElement("img");
        imageNot.src = "assets/img/404.png";
        imageNot.style.width = "180px";
        imageNot.style.margin = "20px";
        imageNot.style.display = "flex";
        imageNot.style.flexDirection = "column";
        imageNot.style.alignItems = "center";
        resultado.appendChild(imageNot);
    }
}

function coversor() {
    btn.addEventListener("click", () => {
        let cplCantidad = amout.value;

        if (currency.value == "Dolar1") {
            let cantidadDolar = cplCantidad / monedas.dolar.valor;
            resultado.innerHTML = ` ${cantidadDolar.toFixed(2)} Dólares`;
        } else if (currency.value == "Euro1") {
            let cantidadEuro = cplCantidad / monedas.euro.valor;
            resultado.innerHTML = ` ${cantidadEuro.toFixed(2)} EUROS`;
        } else {
            resultado.innerHTML = "error de datos ingresados";
        }

        getAndCreateGraficoDolar();
    });
}

const getAndCreateGraficoDolar = async () => {
    try {
        const info = "https://mindicador.cl/api/dolar";
        const resD = await fetch(info);
        const dinero = await resD.json();
        baseConv = dinero;
    } catch (e) {
        resultado.innerHTML = `Falló el gráfico`;
    }

    try {
        const info2 = "https://mindicador.cl/api/euro";
        const resD2 = await fetch(info2);
        const dinero2 = await resD2.json();
        baseConv2 = dinero2;
    } catch (e) {
        resultado.innerHTML = `Falló el gráfico`;
    }

    const serie1 = baseConv.serie.slice(-7);
    const fechas = serie1.map((date) => date.fecha);
    const valores = serie1.map((cifra) => cifra.valor);
    console.log(fechas);
    console.log(valores);

    const serie2 = baseConv2.serie.slice(-7);
    const fechas2 = serie2.map((date) => date.fecha);
    const valores2 = serie2.map((cifra) => cifra.valor);
    console.log(fechas2);
    console.log(valores2);

    const options = {
        series: [
            {
                name: "Valot Dolar",
                data: valores,
            },
            {
                name: "Valor Euro",
                data: valores2,
            },
        ],
        chart: {
            height: 300,
            type: "line",
            zoom: {
                enabled: true,
            },
        },
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: "straight",
        },
        title: {
            text: "Dolar y Euro en CPL la última semana ",
            align: "left",
        },
        grid: {
            row: {
                colors: ["#8422c9"],
                opacity: 0.9,
            },
        },
        xaxis: {
            categories: fechas,
        },
    };

    const chart = new ApexCharts(document.querySelector("#grafico"), options);
    chart.render();
};

getMonedas();
coversor();
