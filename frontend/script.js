document.addEventListener('DOMContentLoaded', function() {
            const input = document.querySelector('#inputId');
            const chatContainer = document.querySelector('#chat-container');
            const askBtn = document.querySelector('#ask-btn');
            const authButtons = document.querySelector('#auth-buttons');
            const userMenu = document.querySelector('#user-menu');
            const logoutBtn = document.querySelector('#logout-btn');

            const authToken = localStorage.getItem('authToken');
            if (authToken) {
                authButtons.classList.add('hidden');
                userMenu.classList.remove('hidden');
            }

            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('authToken');
                window.location.reload();
            });

            console.log('Input element:', input);
            console.log('Ask button element:', askBtn);
            console.log('Chat container:', chatContainer);

            if (!askBtn) {
                console.error('Ask button not found! Check if element with id="ask-btn" exists');
                return;
            }

            if (!input) {
                console.error('Input element not found! Check if element with id="inputId" exists');
                return;
            }

            if (!chatContainer) {
                console.error('Chat container not found! Check if element with id="chat-container" exists');
                return;
            }

            let threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

            input.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 150) + 'px';
            });

            input.addEventListener('keydown', handleEnter);

            askBtn.addEventListener('click', function() {
                askBtn.classList.add('btn-press');
                setTimeout(() => askBtn.classList.remove('btn-press'), 100);
                handleAsk();
            });

            askBtn.addEventListener('touchend', function(e) {
                e.preventDefault();
                askBtn.classList.add('btn-press');
                setTimeout(() => askBtn.classList.remove('btn-press'), 100);
                handleAsk();
            });

            input.focus();

            function createLoadingElement() {
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'mb-6 fade-in flex justify-start';
                
                const bubble = document.createElement('div');
                bubble.className = 'max-w-[80%] px-5 py-3 rounded-2xl bg-neutral-800 text-gray-100 rounded-bl-sm border border-neutral-700 italic animate-pulse';
                bubble.textContent = 'Thinking...';
                
                loadingDiv.appendChild(bubble);
                return loadingDiv;
            }

            function appendMessage(text, isUser = true) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `mb-6 fade-in ${isUser ? 'flex justify-end' : 'flex justify-start'}`;
                
                const bubble = document.createElement('div');
                bubble.className = `max-w-[80%] px-5 py-3 rounded-2xl ${
                    isUser 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-neutral-800 text-gray-100 rounded-bl-sm border border-neutral-700'
                }`;
                bubble.textContent = text;
                
                messageDiv.appendChild(bubble);
                chatContainer.appendChild(messageDiv);

                chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }

            async function callServer(inputText) {
                try {
                    const headers = {
                        'Content-Type': 'application/json',
                    };

                    if (authToken) {
                        headers['Authorization'] = `Bearer ${authToken}`;
                    }

                    const response = await fetch('https://bhoundubot-backend.onrender.com/chat', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ threadId, message: inputText }),
                    });

                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    }

                    const result = await response.json();
                    return result;
                } catch (error) {
                    console.error('Error calling server:', error.message);
                    throw error;
                }
            }

            async function generate(text) {
                appendMessage(text, true);
                input.value = '';
                input.style.height = 'auto';

                const loadingElement = createLoadingElement();
                chatContainer.appendChild(loadingElement);
                chatContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });

                try {
                    const assistantMsg = await callServer(text);
                    loadingElement.remove();

                    if (assistantMsg && assistantMsg.message) {
                        const { message } = assistantMsg;
                        appendMessage(message, false);
                    } else {
                        appendMessage('⚠️ No response from server', false);
                    }
                } catch (error) {
                    loadingElement.remove();
                    console.error('Error generating message:', error);
                    appendMessage(`⚠️ Error: ${error.message}`, false);
                }
            }

            function handleEnter(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const text = input?.value.trim();
                    if (!text) return;
                    generate(text);
                }
            }

            function handleAsk() {
                console.log('Ask button clicked/touched'); 
                const text = input?.value.trim();
                if (!text) {
                    console.log('No text to send'); 
                    return;
                }
                generate(text);
            }
        });