// Lógica do Checklist separada para melhor organização

const params = new URLSearchParams(window.location.search);
const checklistId = params.get('id');
const storageKey = `checklist-progress-${checklistId}`;
const data = CHECKLIST_DB ? CHECKLIST_DB[checklistId] : null;

// --- FUNÇÕES DE LÓGICA ---

function saveProgress() {
    // Salvar cabeçalho de informações
    const technicianSelect = document.getElementById('technician-select');
    let technician = technicianSelect.value;
    if (technician === 'outro') {
        technician = document.getElementById('technician-input').value;
    }
    const discipline = document.getElementById('discipline-select').value;
    const executionDate = document.getElementById('execution-date').value;

    // Salvar status das tarefas (C, NC, NA)
    const taskStatus = {};
    document.querySelectorAll('.task-item').forEach(task => {
        const taskId = task.dataset.taskId;
        const checkedRadio = task.querySelector(`input[name="${taskId}"]:checked`);
        if (checkedRadio) {
            taskStatus[taskId] = checkedRadio.value;
        }
    });
    
    // Salvar observações e evidências
    const observations = document.getElementById('observations').value;
    const evidences = Array.from(document.querySelectorAll('#evidence-preview .evidence-item')).map(item => ({
        src: item.querySelector('img').src,
        description: item.querySelector('textarea').value
    }));

    const dataToSave = { 
        header: { technician, discipline, executionDate },
        taskStatus,
        observations, 
        evidences 
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
}

function loadProgress() {
    const savedData = JSON.parse(localStorage.getItem(storageKey));
    if (!savedData) return;

    // Carregar cabeçalho
    if (savedData.header) {
        const { technician, discipline, executionDate } = savedData.header;
        document.getElementById('discipline-select').value = discipline;
        document.getElementById('execution-date').value = executionDate;

        const techSelect = document.getElementById('technician-select');
        const techInput = document.getElementById('technician-input');
        const isPredefined = Array.from(techSelect.options).some(opt => opt.value === technician);

        if (isPredefined) {
            techSelect.value = technician;
        } else {
            techSelect.value = 'outro';
            techInput.value = technician;
            techInput.classList.remove('hidden');
        }
    }
    
    // Carregar status das tarefas
    if (savedData.taskStatus) {
        Object.keys(savedData.taskStatus).forEach(taskId => {
            const savedValue = savedData.taskStatus[taskId];
            const radioToSelect = document.querySelector(`input[name="${taskId}"][value="${savedValue}"]`);
            if (radioToSelect) {
                radioToSelect.checked = true;
            }
        });
    }

    // Carregar observações
    if (typeof savedData.observations !== 'undefined') {
        document.getElementById('observations').value = savedData.observations;
    }

    // Carregar evidências
    if (savedData.evidences) {
        const previewContainer = document.getElementById('evidence-preview');
        previewContainer.innerHTML = '';
        savedData.evidences.forEach(evidence => {
            previewContainer.appendChild(createEvidenceItem(evidence.src, evidence.description));
        });
    }
}

function createEvidenceItem(src, description = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'border border-gray-200 rounded-xl p-3 no-break evidence-item shadow-sm';
    
    const img = document.createElement('img');
    img.src = src;
    img.className = 'w-full h-auto object-cover rounded-lg mb-3';
    
    const textarea = document.createElement('textarea');
    textarea.rows = 2;
    textarea.placeholder = 'Descrição da evidência...';
    textarea.className = 'w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500';
    textarea.value = description;
    textarea.oninput = saveProgress;

    wrapper.appendChild(img);
    wrapper.appendChild(textarea);
    return wrapper;
}

function renderChecklist() {
    const container = document.getElementById('main-container');
    if (!data) {
        container.innerHTML = `<h1 class="text-2xl font-bold text-red-600 text-center">Checklist não encontrado! Verifique se o arquivo 'database.js' está presente e o ID na URL está correto.</h1>`;
        return;
    }

    document.title = data.title;
    const today = new Date().toISOString().split('T')[0];

    let html = `
        <header class="text-center mb-8 bg-white rounded-xl shadow-lg p-6">
            <h1 class="text-3xl font-bold text-gray-800">${data.title}</h1>
            <p class="text-gray-600 mt-2">${data.description}</p>
        </header>
        <div class="mb-6 bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6 no-break">
            <div>
                <label for="technician-select" class="block text-sm font-medium text-gray-700 mb-1">Técnico</label>
                <select id="technician-select" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione...</option>
                    <option>Adão Santos</option><option>Aécio Neves</option><option>Evair Gondinho</option><option>Geraldo Mota</option><option>João Soares</option><option>Raí Ribeiro</option>
                    <option value="outro">Outro...</option>
                </select>
                <input type="text" id="technician-input" class="w-full p-2 border border-gray-300 rounded-lg mt-2 hidden" placeholder="Digite o nome do técnico">
            </div>
            <div>
                <label for="discipline-select" class="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                <select id="discipline-select" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Elétrica</option><option>Instrumentação</option><option>Mecânica</option>
                </select>
            </div>
            <div>
                <label for="execution-date" class="block text-sm font-medium text-gray-700 mb-1">Data de Execução</label>
                <input type="date" id="execution-date" value="${today}" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
        </div>
        <main id="checklist-container" class="space-y-6">`;

    data.sections.forEach(section => {
        html += `
            <div class="bg-white rounded-xl shadow-lg p-6 no-break">
                <h2 class="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-3 mb-4">${section.title}</h2>
                <div class="space-y-4">`;
        section.tasks.forEach((task, index) => {
            const taskId = `task-${section.id}-${index}`;
            html += `
                <div class="task-item flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 border-b border-gray-100" data-task-id="${taskId}">
                    <span class="text-gray-700 mb-2 sm:mb-0 sm:mr-4">${task}</span>
                    <div class="task-options flex items-center space-x-2 flex-shrink-0">
                        <input type="radio" id="${taskId}-c" name="${taskId}" value="c"><label for="${taskId}-c">C</label>
                        <input type="radio" id="${taskId}-nc" name="${taskId}" value="nc"><label for="${taskId}-nc">NC</label>
                        <input type="radio" id="${taskId}-na" name="${taskId}" value="na"><label for="${taskId}-na">NA</label>
                    </div>
                </div>`;
        });
        html += `</div></div>`;
    });

    html += `
        </main>
        <div class="mt-6 bg-white rounded-xl shadow-lg p-6 no-break">
            <h2 class="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-3 mb-4">Observações</h2>
            <textarea id="observations" rows="5" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Digite suas observações aqui..."></textarea>
        </div>
        <div class="mt-6 bg-white rounded-xl shadow-lg p-6 no-break">
            <h2 class="text-xl font-bold text-gray-800 border-b-2 border-gray-100 pb-3 mb-4">Evidências Fotográficas</h2>
            <div class="print-hide">
                <label for="evidence-upload" class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl inline-block shadow-md transition-transform transform hover:scale-105">Adicionar Fotos</label>
                <input type="file" id="evidence-upload" multiple accept="image/*" class="hidden">
            </div>
            <div id="evidence-preview" class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6"></div>
        </div>`;
    container.innerHTML = html;
}

// --- INICIALIZAÇÃO E EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    if (!checklistId || !data) {
        renderChecklist(); 
        return;
    }

    renderChecklist();
    loadProgress();

    // Event listeners para salvar progresso
    document.getElementById('technician-select').addEventListener('change', (e) => {
        const techInput = document.getElementById('technician-input');
        techInput.classList.toggle('hidden', e.target.value !== 'outro');
        if (e.target.value === 'outro') techInput.focus();
        saveProgress();
    });
    document.getElementById('technician-input').addEventListener('input', saveProgress);
    document.getElementById('discipline-select').addEventListener('change', saveProgress);
    document.getElementById('execution-date').addEventListener('change', saveProgress);
    document.getElementById('observations').addEventListener('input', saveProgress);

    document.getElementById('main-container').addEventListener('change', e => {
        if (e.target.type === 'radio') {
            saveProgress();
        }
    });
    
    document.getElementById('evidence-upload').addEventListener('change', event => {
        const files = Array.from(event.target.files).slice(0, 10);
        const previewContainer = document.getElementById('evidence-preview');
        // Não limpa para permitir adicionar mais fotos depois
        // previewContainer.innerHTML = '';
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                previewContainer.appendChild(createEvidenceItem(e.target.result));
                saveProgress(); 
            }
            reader.readAsDataURL(file);
        });
    });

    const modal = document.getElementById('confirm-modal');
    document.getElementById('clear-data-btn').addEventListener('click', () => modal.classList.remove('hidden'));
    document.getElementById('cancel-btn').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('confirm-clear-btn').addEventListener('click', () => {
        localStorage.removeItem(storageKey);
        window.location.reload();
    });
});

