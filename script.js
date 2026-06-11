document.addEventListener("DOMContentLoaded", async function() {

    const colorAntes = 'rgba(47, 133, 90, 0.6)'; 
    const borderAntes = 'rgba(47, 133, 90, 1)';
    const colorDepois = 'rgba(214, 158, 46, 0.6)'; 
    const borderDepois = 'rgba(214, 158, 46, 1)';

    function calcularMedias(dados) {
        let somas = { vida: 0, sono: 0, estresse: 0, prod: 0, foco: 0, procrast: 0 };
        let contagens = { vida: 0, sono: 0, estresse: 0, prod: 0, foco: 0, procrast: 0 };

        dados.forEach(resposta => {
            for (const [pergunta, valor] of Object.entries(resposta)) {
                let nota = parseInt(valor); // Tenta transformar a resposta em número
                
                if (isNaN(nota)) continue; 

                let p = pergunta.toLowerCase();

                if (p.includes("qualidade de vida geral")) {
                    somas.vida += nota; contagens.vida++;
                } else if (p.includes("qualidade do seu sono")) {
                    somas.sono += nota; contagens.sono++;
                } else if (p.includes("sob estresse")) {
                    somas.estresse += nota; contagens.estresse++;
                } else if (p.includes("produtividade geral")) {
                    somas.prod += nota; contagens.prod++;
                } else if (p.includes("perde o foco")) {
                    somas.foco += nota; contagens.foco++;
                } else if (p.includes("adia o início")) {
                    somas.procrast += nota; contagens.procrast++;
                }
            }
        });

        return {
            vida: contagens.vida ? (somas.vida / contagens.vida).toFixed(2) : 0,
            sono: contagens.sono ? (somas.sono / contagens.sono).toFixed(2) : 0,
            estresse: contagens.estresse ? (somas.estresse / contagens.estresse).toFixed(2) : 0,
            prod: contagens.prod ? (somas.prod / contagens.prod).toFixed(2) : 0,
            foco: contagens.foco ? (somas.foco / contagens.foco).toFixed(2) : 0,
            procrast: contagens.procrast ? (somas.procrast / contagens.procrast).toFixed(2) : 0
        };
    }

    try {
        const res1 = await fetch('json/form1.json');
        const res2 = await fetch('json/form2.json');
        
        const form1Dados = await res1.json();
        const form2Dados = await res2.json();

        const medias1 = calcularMedias(form1Dados);
        const medias2 = calcularMedias(form2Dados);

        //Gráfico 1: Saúde e Bem-Estar
        const ctxSaude = document.getElementById('chartSaude').getContext('2d');
        new Chart(ctxSaude, {
            type: 'bar',
            data: {
                labels: ['Qualidade de Vida', 'Qualidade do Sono', 'Nível de Estresse'],
                datasets: [
                    {
                        label: 'Antes (Form 1)',
                        data: [medias1.vida, medias1.sono, medias1.estresse],
                        backgroundColor: colorAntes,
                        borderColor: borderAntes,
                        borderWidth: 1
                    },
                    {
                        label: 'Depois (Form 2)',
                        data: [medias2.vida, medias2.sono, medias2.estresse],
                        backgroundColor: colorDepois,
                        borderColor: borderDepois,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, max: 5, title: { display: true, text: 'Média (Escala 1 a 5)' } } }
            }
        });

        //Gráfico 2: Produtividade e Foco
        const ctxProdutividade = document.getElementById('chartProdutividade').getContext('2d');
        new Chart(ctxProdutividade, {
            type: 'bar',
            data: {
                labels: ['Produtividade', 'Perda de Foco', 'Procrastinação'],
                datasets: [
                    {
                        label: 'Antes (Form 1)',
                        data: [medias1.prod, medias1.foco, medias1.procrast],
                        backgroundColor: colorAntes,
                        borderColor: borderAntes,
                        borderWidth: 1
                    },
                    {
                        label: 'Depois (Form 2)',
                        data: [medias2.prod, medias2.foco, medias2.procrast],
                        backgroundColor: colorDepois,
                        borderColor: borderDepois,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, max: 5, title: { display: true, text: 'Média (Escala 1 a 5)' } } }
            }
        });

    } catch (erro) {
        console.error("Erro ao processar os dados:", erro);
        document.querySelector('.charts-container').innerHTML = 
            '<p style="color: red; text-align: center; width: 100%;">Erro ao carregar os dados (Arquivos JSON).</p>';
    }
});