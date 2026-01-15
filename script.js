document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesContainer = document.getElementById('messagesContainer');
    const conversationItems = document.querySelectorAll('.conversation-item');

    // Enviar mensagem ao pressionar Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            sendMessage();
        }
    });

    // Enviar mensagem ao clicar no botão
    sendButton.addEventListener('click', function() {
        if (messageInput.value.trim() !== '') {
            sendMessage();
        }
    });

    // Alternar entre conversas
    conversationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove a classe active de todos os itens
            conversationItems.forEach(i => i.classList.remove('active'));
            
            // Adiciona a classe active ao item clicado
            this.classList.add('active');
            
            // Aqui você pode carregar as mensagens da conversa selecionada
            const contactName = this.querySelector('h4').textContent;
            document.querySelector('.contact-info h3').textContent = contactName;
            
            // Limpa as mensagens atuais (apenas para demonstração)
            messagesContainer.innerHTML = `
                <div class="message received">
                    <div class="message-content">
                        <p>Olá! Esta é uma nova conversa com ${contactName}</p>
                        <span class="message-time">${getCurrentTime()}</span>
                    </div>
                </div>
            `;
        });
    });

    function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (messageText === '') return;
        
        // Cria nova mensagem
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${messageText}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        
        // Adiciona ao container de mensagens
        messagesContainer.appendChild(messageElement);
        
        // Limpa o input
        messageInput.value = '';
        
        // Scroll para a última mensagem
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simula uma resposta automática após 1 segundo
        setTimeout(sendAutoReply, 1000);
    }

    function sendAutoReply() {
        const replies = [
            "Olá! Como posso ajudar?",
            "Estou aqui se precisar de algo!",
            "Recebi sua mensagem!",
            "Vou responder em breve!"
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message received';
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${randomReply}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    // Scroll automático para a última mensagem
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});
