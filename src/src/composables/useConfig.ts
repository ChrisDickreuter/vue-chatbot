import { ref } from 'vue'

export function useConfig() {
    const apiKey = ref('demo-key-12345')
    const model = ref('gpt-4')
    const temperature = ref(0.7)

    return {apiKey, model, temperature}
}