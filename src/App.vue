<script setup lang="ts">
import { ref, watch } from 'vue'
import { useConfig  } from '@/src/composables/useConfig'

const { apiKey, model, temperature } = useConfig()

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

async function callChatAPI(message:string, signal?: AbortSignal): Promise<string> {
  const delay = Math.random() * 5000 + 500

  console.log('apiKey: ', apiKey.value);
  console.log('model: ', model.value);
  console.log('temperature: ', temperature.value);

  

  // Prüfe während des Delays, ob abort aufgerufen wurde
  await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, delay)
    
    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId)
      reject(new Error('AbortError: Request was cancelled'))
    })
  })
  
  if (Math.random() < 0.1) {
    throw new Error('API momentarily unavailable')
  }

  return `Du hast gesagt: "${message}". Das ist interessant!`
}

const history = ref<Message[]>([])
const input = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

let abortController: AbortController | null = null

const sendMessage = async () => {
  if(input.value.trim() === '') return

  if(abortController) {
    abortController.abort()
  }
  abortController = new AbortController()

  history.value.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: input.value
    })
  
  const userMessage = input.value
  input.value = ''
  isLoading.value = true
  error.value = null

  try {   
    const response = await callChatAPI(userMessage, abortController.signal)
    
      history.value.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response
      })
  } catch (err) {
    if (err instanceof Error && err.message.includes('AbortError')) {
      console.log('Request was cancelled')
      return
    }
    error.value = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
  } finally {
    isLoading.value = false
  }
}

watch(error, (newError) => {
  if (newError) {
    setTimeout(() => {
      error.value = null
    }, 5000)
  }
})
</script>

<template>
  <h1>Chatbot</h1>
  <input type="text" v-model="input"  placeholder="Schreib eine Nachricht...">
  <button @click="sendMessage" >{{ isLoading ? 'Senden' : 'Absenden' }}</button>

  <div v-if="error" style="color: red; margin-top: 10px;">
    {{ error }}
  </div>

  <div v-for="msg in history" :key="msg.id">
    <strong>{{ msg.role }}:</strong>
    {{ msg.content }}
  </div>
  <div v-if="isLoading" style="color: gray">
      <em>Assisten schreibt..</em>
  </div>
</template>
<style scoped></style>