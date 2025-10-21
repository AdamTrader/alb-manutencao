const CHECKLIST_DB = {
    "GE-201": {
        title: "Inspeção Anual do Gerador Diesel GE-201",
        description: "Use esta lista para acompanhar todas as tarefas de manutenção.",
        sections: [
            {
                id: 5,
                title: "Segurança Inicial",
                tasks: [
                    "Realizar liberação de AT, bloqueios de fontes de energia/LOTO"
                ]
            },
            {
                id: 10,
                title: "Sistema de Combustível",
                tasks: [
                    "Regular válvula e injetores - consulte manual do motor"
                ]
            },
            {
                id: 20,
                title: "Sistema de Ar",
                tasks: [
                    "Troque o elemento filtrante",
                    "Verificar e reapertar tubulações e conexões"
                ]
            },
            {
                id: 30,
                title: "Sistema de Refrigeração",
                tasks: [
                    "Trocar a água e anticorrosivo do radiador",
                    "Limpeza geral do radiador e do ventilador"
                ]
            },
            {
                id: 40,
                title: "Sistema Elétrico",
                tasks: [
                    "Verificar a(s) bateria(s), o liquido eletrolítico e a condição de carga",
                    "Verificar e reapertar se necessario todos os parafusos do sistema de controle e potencia",
                    "Limpar os paineis com um pano seco"
                ]
            },
            {
                id: 50,
                title: "Sistema de Escape",
                tasks: [
                    "Verificar se há condensação de água na linha de escape",
                    "Verificar estado de conservação dos tubos e silenciosos de escape",
                    "Verificar visualmente a cor da fumaça e escape",
                    "Verificar fixação da tubulação",
                    "Regular e reapertar porcas do coletor de escape e turbo compressor"
                ]
            },
            {
                id: 60,
                title: "Gerador",
                tasks: [
                    "Medir e registrar a resistencia de isolação",
                    "Verificar e reapertar os parafusos de fixação do Grupo Gerador",
                    "Engraxar os mancais",
                    "Inspecionar as buchas do motor de partida"
                ]
            },
            {
                id: 70,
                title: "Outras Providências",
                tasks: [
                    "Verificar infiltrações e vazamentos nas proximidades do Grupo Gerador",
                    "Revisar todas as conexões e fixações do Grupo",
                    "Verificar e testar botoeiras de emergência"
                ]
            }
        ]
    }
    // Para adicionar um novo checklist, adicione uma nova chave como "GE-202": { ... }
};

