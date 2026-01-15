document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const loginForm = document.getElementById('loginForm');
    const showPasswordBtn = document.getElementById('showPassword');
    const passwordInput = document.getElementById('password');
    const refreshQRBtn = document.getElementById('refreshQR');
    const usePhoneBtn = document.getElementById('usePhone');
    const useQRBtn = document.getElementById('useQR');
    const phoneModal = document.getElementById('phoneModal');
    const modalClose = document.querySelector('.modal-close');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const qrPlaceholder = document.querySelector('.qr-placeholder');

    // Mostrar/ocultar senha
    showPasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Atualizar QR Code (simulação)
    refreshQRBtn.addEventListener('click', function() {
        // Animação de atualização
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando novo código...';
        this.disabled = true;
        
        // Simula tempo de geração
        setTimeout(() => {
            // Efeito visual no QR
            qrPlaceholder.style.borderColor = '#00a884';
            qrPlaceholder.style.boxShadow = '0 0 20px rgba(0, 168, 132, 0.3)';
            
            // Reset após 2 segundos
            setTimeout(() => {
                qrPlaceholder.style.borderColor = '#d1d7db';
                qrPlaceholder.style.boxShadow = 'none';
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar código QR';
                this.disabled = false;
                
                // Notificação de sucesso
                showNotification('Código QR atualizado com sucesso!', 'success');
            }, 2000);
        }, 1500);
    });

    // Login com email/senha
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;
        
        // Validação simples
        if (!validateEmail(email)) {
            showNotification('Por favor, insira um email válido', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }
        
        // Simulação de login
        simulateLogin(email, rememberMe);
    });

    // Alternar para telefone
    usePhoneBtn.addEventListener('click', function() {
        phoneModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Alternar para QR Code
    useQRBtn.addEventListener('click', function() {
        // Rola para a seção do QR Code
        document.querySelector('.qr-panel').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Destaca a seção
        const qrSection = document.querySelector('.qr-container');
        qrSection.style.boxShadow = '0 0 0 3px rgba(0, 168, 132, 0.5)';
        qrSection.style.transition = 'box-shadow 0.3s';
        
        setTimeout(() => {
            qrSection.style.boxShadow = 'none';
        }, 2000);
    });

    // Fechar modal
    modalClose.addEventListener('click', function() {
        phoneModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === phoneModal) {
            phoneModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Validação em tempo real do email
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        if (this.value.trim() && !validateEmail(this.value.trim())) {
            this.style.borderColor = '#ff4444';
            showTooltip(this, 'Email inválido');
        } else {
            this.style.borderColor = '#d1d7db';
            hideTooltip();
        }
    });

    // Funções auxiliares
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function simulateLogin(email, remember) {
        // Mostra loading
        loadingOverlay.classList.add('active');
        
        // Simula tempo de autenticação
        setTimeout(() => {
            // Esconde loading
            loadingOverlay.classList.remove('active');
            
            // Simulação de sucesso
            showNotification('Login realizado com sucesso! Redirecionando...', 'success');
            
            // Em um caso real, aqui você redirecionaria para o chat
            setTimeout(() => {
                // Para demonstração, vamos apenas mostrar uma mensagem
                alert(`Login bem-sucedido!\n\nEmail: ${email}\nManter conectado: ${remember ? 'Sim' : 'Não'}\n\nEm um sistema real, você seria redirecionado para o WhatsApp Web.`);
                
                // Aqui você poderia redirecionar para a página principal
                // window.location.href = 'chat.html';
            }, 1500);
        }, 2000);
    }

    function showNotification(message, type) {
        // Remove notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#00a884' : '#ff4444'};
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 4000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(notification);
        
        // Remove após 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Adiciona animações CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    function showTooltip(element, message) {
        // Implementação simples de tooltip
        console.log(`Tooltip: ${message} para elemento:`, element);
    }

    function hideTooltip() {
        // Implementação simples
    }

    // Efeito visual no QR Code ao passar o mouse
    const qrImage = document.querySelector('.qr-image');
    qrImage.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s';
    });
    
    qrImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    // Troca de idioma
    const languageSelect = document.querySelector('select');
    languageSelect.addEventListener('change', function() {
        // Em um sistema real, aqui você carregaria as traduções
        const language = this.value;
        console.log('Idioma selecionado:', language);
        
        // Simulação de mudança de idioma
        showNotification(`Idioma alterado para: ${this.options[this.selectedIndex].text}`, 'success');
    });

    // Efeito de digitação no placeholder do email (opcional)
    const placeholders = [
        "seu.email@exemplo.com",
        "nome.sobrenome@gmail.com",
        "usuario@outlook.com"
    ];
    let currentPlaceholder = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typePlaceholder() {
        const input = emailInput;
        const placeholder = placeholders[currentPlaceholder];
        
        if (input.value === '') {
            if (!isDeleting && charIndex <= placeholder.length) {
                input.placeholder = placeholder.substring(0, charIndex);
                charIndex++;
                setTimeout(typePlaceholder, 100);
            } else if (isDeleting && charIndex >= 0) {
                input.placeholder = placeholder.substring(0, charIndex);
                charIndex--;
                setTimeout(typePlaceholder, 50);
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    currentPlaceholder = (currentPlaceholder + 1) % placeholders.length;
                }
                setTimeout(typePlaceholder, 1000);
            }
        }
    }
    
    // Inicia o efeito apenas se o campo estiver vazio
    emailInput.addEventListener('focus', function() {
        if (this.value === '') {
            typePlaceholder();
        }
    });
    
    emailInput.addEventListener('blur', function() {
        this.placeholder = "seu.email@exemplo.com";
        charIndex = 0;
        isDeleting = false;
    });
});
