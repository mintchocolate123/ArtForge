import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTilesetStore = defineStore('tileset', () => {
    const tilesetData = ref(null)
    const tilesetImage = ref(null)
    const selectedTile = ref(null)
    const selectedCell = ref(null)
    const tilemapConfig = ref({ tileSize: 16, spacing: 1, cols: 0, rows: 0 })

    function setTilemapConfig(tileSize, spacing, cols, rows) {
        tilemapConfig.value = { tileSize, spacing, cols, rows }
    }

    function loadJSON(data) {
        tilesetData.value = data
        if (!data.rules) data.rules = {}
        if (!data.weights) data.weights = {}
        if (!data.wfc) data.wfc = {}
    }

    function loadImage(img) {
        tilesetImage.value = img
    }

    function selectTile(name) {
        selectedTile.value = name
    }

    function updateRule(fromTile, dir, targetTile, add = true) {
        const oppositeDir = { up: 'down', down: 'up', left: 'right', right: 'left' }[dir]
        
        if (!tilesetData.value.rules[fromTile])
            tilesetData.value.rules[fromTile] = { up: [], down: [], left: [], right: [] }
        if (!tilesetData.value.rules[targetTile])
            tilesetData.value.rules[targetTile] = { up: [], down: [], left: [], right: [] }

        const list = tilesetData.value.rules[fromTile][dir]
        const oppositeList = tilesetData.value.rules[targetTile][oppositeDir]

        if (add) {
            if (!list.includes(targetTile)) list.push(targetTile)
            if (!oppositeList.includes(fromTile)) oppositeList.push(fromTile)
        } else {
            tilesetData.value.rules[fromTile][dir] = list.filter(n => n !== targetTile)
            tilesetData.value.rules[targetTile][oppositeDir] = oppositeList.filter(n => n !== fromTile)
        }
    }

    function updateWeight(tileName, weight) {
        tilesetData.value.weights[tileName] = weight
    }

    function selectCell(row, col) {
        const name = Object.keys(tilesetData.value?.tiles || {})
            .find(n => tilesetData.value.tiles[n].row === row && tilesetData.value.tiles[n].col === col)
        selectedCell.value = { row, col, name: name || null }
        if (name) selectedTile.value = name
        else selectedTile.value = null
    }

    return { tilesetData, tilesetImage, selectedTile, loadJSON, loadImage, selectTile, updateRule, updateWeight, tilemapConfig, setTilemapConfig, selectedCell, selectCell }
})