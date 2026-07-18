const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function listFiles(path = '') {
    const res = await fetch(`${BASE_URL}/api/files/list?path=${encodeURIComponent(path)}`)
    return res.json()
}

export async function listAllFiles(suffix = '') {
    const res = await fetch(`${BASE_URL}/api/files/list_all?suffix=${encodeURIComponent(suffix)}`)
    return res.json()
}

export async function readFile(path) {
    const res = await fetch(`${BASE_URL}/api/files/read?path=${encodeURIComponent(path)}`)
    return res.json()
}

export async function getImageUrl(path) {
    return `${BASE_URL}/api/files/image?path=${encodeURIComponent(path)}`
}