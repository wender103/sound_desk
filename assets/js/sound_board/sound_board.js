function Pegar_CodigoDaURL() {
    const urlParams = new URLSearchParams(window.location.search)
    const codigo = urlParams.get('sounddesk')
    return codigo
}

let User = null


async function Carregar_Infos_User() {
    const snapshot = await db.collection('Users').get()

    snapshot.forEach(user => {
        if (user.data().Sound_Board_Code
            === Pegar_CodigoDaURL()) {
            User = user.data()
        }
    })

    const userReadyEvent = new CustomEvent('userReady', { detail: User })
    document.dispatchEvent(userReadyEvent);
} Carregar_Infos_User()

document.addEventListener("userReady", function () {
  Criar_Html_Sons(User.Favorites_List)
})

let Infos_Audio_Tocando_Agora = null
let _ID_Ultimo_Audio = null
const loadingOverlay = document.getElementById('loading-overlay')
loadingOverlay.classList.add('active')
const Audio_Player = document.getElementById("Audio_Player")
Audio_Player.volume = 0
Audio_Player.muted = true

// TODO Se alguém tentar mudar o volume, volta pra 0 na hora
Object.defineProperty(Audio_Player, 'volume', {
  set: () => {},
  get: () => 0
})
const Btn_Play = document.getElementById("btn_play_pause_audio")

function Gerar_Cor_Por_Iniciais(iniciais) {
    const charCode1 = iniciais.charCodeAt(0) || 0
    const charCode2 = iniciais.charCodeAt(1) || 0

    const hue = (charCode1 * 17 + charCode2 * 13) % 360
    const saturation = 60 + (charCode1 % 31)
    const lightness = 30 + (charCode2 % 41)

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function Calcular_Luminancia(cor) {
    const hsl = cor.match(/\d+/g)
    const h = parseInt(hsl[0]) / 360
    const s = parseInt(hsl[1]) / 100
    const l = parseInt(hsl[2]) / 100

    let r, g, b
    if (s === 0) {
        r = g = b = l
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q

        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function Gerar_Cor_Texto(corFundo) {
    const luminancia = Calcular_Luminancia(corFundo)

    if (luminancia > 0.6) {
        return '#111'
    } else if (luminancia > 0.3) {
        return '#333'
    } else {
        return '#fff'
    }
}

function Criar_Audio_Visual(sound) {
    if (sound.Category) {
        return `
      <div class="key-visual key-category ${sound.Category}">
        <i class="fas ${Pegar_Category_Icon(sound.Category)}"></i>
      </div>
    `
    }

    const iniciais = Pegar_Iniciais(sound.Title)
    let corFundo, corTexto

    try {
        corFundo = Gerar_Cor_Por_Iniciais(iniciais)
        corTexto = Gerar_Cor_Texto(corFundo)
    } catch (e) {
        corFundo = 'var(--primary-color)'
        corTexto = 'white'
    }

    return `
    <div class="key-visual key-initials" 
        style="background: ${corFundo}; color: ${corTexto};
        text-shadow: ${corTexto === '#fff' ? '0 1px 3px rgba(0,0,0,0.5)' : 'none'};
        font-weight: ${corTexto === '#fff' ? '600' : '500'}">
      ${iniciais}
    </div>
  `
}

function Pegar_Iniciais(title) {
    const words = String(title).split(' ')
    if (words.length >= 2) {
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
    }
    return String(title).substring(0, 2).toUpperCase()
}

function Pegar_Category_Icon(category) {
    const icons = {
        'sound-effect': 'fa-sliders-h',
        'music': 'fa-music',
        'voice': 'fa-microphone',
        'nature': 'fa-tree',
        'default': 'fa-play'
    }
    return icons[category] || icons.default
}

function Criar_Html_Sons(_Lista) {
    const Deck_Grid = document.getElementById("deck-grid")

    try {
        Deck_Grid.innerHTML = ""
        _Lista.forEach((sound, index) => {
            const keyElement = document.createElement("div")
            keyElement.className = "deck-key"
            keyElement.setAttribute("data-sound-id", sound.ID)

            keyElement.innerHTML = `
        ${Criar_Audio_Visual(sound)}
        <div class="key-label">${sound.Title}</div>
        <div class="key-badge">${sound.Shortcut.Key}</div>
        <div class="key-active-indicator"></div>
      `

            keyElement.addEventListener("click", function () {
                if (sound.ID == _ID_Ultimo_Audio) {
                    Tocar_Audio_No_PC(sound.ID, 'set_time')
                } else {
                    Tocar_Audio_No_PC(sound.ID)
                }

            })

            Deck_Grid.appendChild(keyElement)
        })

        loadingOverlay.classList.remove("active")

    } catch { }
}

function Tocar_Audio_No_PC(_ID, _Action = "play") {
    Marcar_Audio_Na_Tela(_ID)
    Audio_Player.volume = 0

    for (let c = 0; c < User.Favorites_List.length; c++) {
        if (User.Favorites_List[c].ID == _ID) {
            Infos_Audio_Tocando_Agora = User.Favorites_List[c]
            break
        }
    }

    const All_Sound_Card = document.querySelectorAll(".sound-card")
    All_Sound_Card.forEach((soundCard) => {
        soundCard.classList.remove("playing")

        if (soundCard.id == `sound-card-${_ID}`) {
            soundCard.classList.add("playing")
        }
    })

    if (_Action == 'play') {
        if (Infos_Audio_Tocando_Agora.Mp3 != Audio_Player.src) {
            Audio_Player.src = Infos_Audio_Tocando_Agora.Mp3
        }
        Audio_Player.play()

    } else if (_Action == 'pause') {
        Audio_Player.pause()
    } else {
        Audio_Player.currentTime = 0
        Audio_Player.play()
    }

    atualizarPlayer({
        title: Infos_Audio_Tocando_Agora.Title,
        shortcut: Infos_Audio_Tocando_Agora.Shortcut.Key,
        duration: Audio_Player.duration,
        currentTime: Audio_Player.currentTime
    })
    // acompanharProgresso(Audio_Player)

    _ID_Ultimo_Audio = _ID
    const New_Sound_Deck = {
        ID_Audio: _ID,
        Action: _Action,
        LastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
        Update_For: "Mobile",
        ID_Call: db.collection('Sound_Deck').doc().id
    }
    db.collection("Sound_Deck")
        .doc(User.ID)
        .set(New_Sound_Deck, { merge: true })
}

function Marcar_Audio_Na_Tela(_ID) {
    const All_Deck_Key = document.querySelectorAll('.deck-key')
    All_Deck_Key.forEach((deck_key) => {
        if (deck_key.getAttribute("data-sound-id") == _ID) {
            deck_key.classList.add("playing")
            deck_key.classList.add("key-press-animation")
            deck_key.classList.add("playing")

            // Simular toque do áudio
            setTimeout(() => {
                deck_key.classList.remove("key-press-animation")
            }, 300)
        } else {
            deck_key.classList.remove("playing")
        }
    })
}

//? ----------------------- Controlers -------------------------------------------------
Audio_Player.addEventListener('play', () => {
    Btn_Play.innerHTML = '<i class="fas fa-pause"></i>'
})

Audio_Player.addEventListener('pause', () => {
    Btn_Play.innerHTML = '<i class="fas fa-play"></i>'
})

Audio_Player.addEventListener('ended', () => {
    Btn_Play.innerHTML = '<i class="fas fa-play"></i>'
})

Audio_Player.addEventListener('timeupdate', () => {
    let tempoAtual = Audio_Player.currentTime
    let duracaoTotal = Audio_Player.duration

    atualizarPlayer({
        title: Infos_Audio_Tocando_Agora.Title,
        shortcut: Infos_Audio_Tocando_Agora.Shortcut.Key,
        duration: duracaoTotal,
        currentTime: tempoAtual
    })
})

Btn_Play.addEventListener("click", () => {
    if (Audio_Player.paused) {
        Tocar_Audio_No_PC(_ID_Ultimo_Audio, "play")
    } else {
        Tocar_Audio_No_PC(_ID_Ultimo_Audio, "pause")
    }
})

document.getElementById("btn-next").addEventListener("click", () => {
    _ID_Ultimo_Audio = Pegar_Anterior_Proximo(
        User.Favorites_List,
        _ID_Ultimo_Audio,
        "depois"
    ).ID
    Tocar_Audio_No_PC(_ID_Ultimo_Audio, "play")
})

document.getElementById("btn-prev").addEventListener("click", () => {
    _ID_Ultimo_Audio = Pegar_Anterior_Proximo(
        User.Favorites_List,
        _ID_Ultimo_Audio,
        "antes"
    ).ID
    Tocar_Audio_No_PC(_ID_Ultimo_Audio, "play")
})

let playerVisible = false
const playerControls = document.querySelector('.player-controls')
const mobileDeckContainer = document.querySelector('.mobile-deck-container')
const progressBarFill = document.createElement('div')
progressBarFill.className = 'progress-bar-fill'
document.querySelector('.progress-bar').appendChild(progressBarFill)

// Função para mostrar o player com animação
function mostrarPlayerControls() {
    if (playerVisible) return

    playerVisible = true

    // Adiciona classe ao container principal
    mobileDeckContainer.classList.add('with-player')

    // Mostra o player com animação
    playerControls.classList.add('visible')

    // Sincroniza a animação de altura
    setTimeout(() => {
        playerControls.style.transition = 'all 0.3s ease-out'
    }, 10)
}

// Função para esconder o player com animação
function esconderPlayerControls() {
    if (!playerVisible) return

    playerVisible = false

    // Remove a classe do container principal
    mobileDeckContainer.classList.remove('with-player')

    // Esconde o player com animação
    playerControls.classList.remove('visible')

    // Reset após animação
    setTimeout(() => {
        playerControls.style.transition = 'none'
    }, 300)
}

// Função para atualizar o player com informações do áudio
function atualizarPlayer(audio) {
    // Atualiza informações
    document.getElementById('now-playing-title').textContent = audio.title
    document.getElementById('now-playing-subtitle').innerHTML = `
    <span class="shortcut-badge">${audio.shortcut}</span>
    <span>${formatarTempo(audio.duration)}</span>
  `

    // Mostra o player se estiver escondido
    if (!playerVisible) {
        mostrarPlayerControls()
    }

    // Atualiza progresso (exemplo)
    atualizarProgresso(audio.currentTime, audio.duration)
}

// Função para atualizar barra de progresso
function atualizarProgresso(currentTime, duration) {
    const percent = (currentTime / duration) * 100
    progressBarFill.style.width = `${percent}%`
}

// Função auxiliar para formatar tempo
function formatarTempo(segundos) {
    const mins = Math.floor(segundos / 60)
    const secs = Math.floor(segundos % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}
//? ----------------------- Fim Controlers -------------------------------------------------