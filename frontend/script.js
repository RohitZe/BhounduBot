const input = document.querySelector('#inputId');
const chatContainer = document.querySelector('#chat-container');
const askBtn = document.querySelector('#ask-btn');

let threadId = localStorage.getItem('threadId');

if (!threadId) {
  threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  localStorage.setItem('threadId', threadId);
}

input.addEventListener('keyup', handleEnter);
askBtn.addEventListener('click', handleAsk);

function createLoadingElement() {
  const loading = document.createElement('div');
  loading.className = 'my-2 p-2 rounded-xl max-w-fit bg-gray-500 text-gray-200 italic animate-pulse';
  loading.textContent = 'Thinking...';
  return loading;
}

function appendMessage(text, isUser = true) {
  const msg = document.createElement('div');
  msg.className = `my-2 p-2 rounded-xl max-w-fit ${
    isUser ? 'bg-neutral-800 ml-auto text-white' : ' mr-auto text-gray-50 pb-38 '
  }`;
  msg.textContent = text;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function callServer(inputText) {
  try {
    const response = await fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({threadId, message: inputText }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling server:', error.message);
    appendMessage(`⚠️ Error: ${error.message}`, false);
    return null;
  }
}

async function generate(text) {
  appendMessage(text, true);
  input.value = '';

  const loadingElement = createLoadingElement();
  chatContainer.appendChild(loadingElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;

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
  const text = input?.value.trim();
  if (!text) return;
  generate(text);
}
