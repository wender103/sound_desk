function Get_DispositivoID() {
    let id = localStorage.getItem('ID_Dispositivo')
    if (!id) {
        // id = crypto.randomUUID()
        id = Gerar_ID()

        localStorage.setItem('ID_Dispositivo', id)
    }
    return id
}

function Pegar_CodigoDaURL() {
    const urlParams = new URLSearchParams(window.location.search)
    const codigo = urlParams.get('sounddesk')
    return codigo
}

let User = null
let Infos_Sound_Desk = null
let Ultimo_Audio = null
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

async function Carregar_Infos_User() {
    const snapshot = await db.collection('Users').get()

    snapshot.forEach(user => {
        if (user.data().Sound_Board_Code
            === Pegar_CodigoDaURL()) {
            User = user.data()
        }
    })

    const snapshot_souddesk = await db.collection('Sound_Desk').doc(User.ID).get()
    Infos_Sound_Desk = snapshot_souddesk.data()

    let Sincronizado = false
    let Pedido_Sincronizacao = false
    let PassWord = Gerar_Senha()
    for (let c = 0; c < Infos_Sound_Desk.Synchronized_Devices.length; c++) {
        if (Infos_Sound_Desk.Synchronized_Devices[c].ID === Get_DispositivoID()) {
            const agora = Date.now() // ou new Date().getTime()
            const cincoMin = 5 * 60 * 1000 // 5 minutos em milissegundos
            Pedido_Sincronizacao = true
            Sincronizado = Infos_Sound_Desk.Synchronized_Devices[c].Synchronized

            console.log(agora - Infos_Sound_Desk.Synchronized_Devices[c].Date, cincoMin)


            if (agora - Infos_Sound_Desk.Synchronized_Devices[c].Date < cincoMin) {
                PassWord = Infos_Sound_Desk.Synchronized_Devices[c].PassWord
            } else if (agora - Infos_Sound_Desk.Synchronized_Devices[c].Date >= cincoMin && !Sincronizado) {
                Infos_Sound_Desk.Synchronized_Devices[c].Date = agora
                Infos_Sound_Desk.Synchronized_Devices[c].PassWord = PassWord
                await db.collection("Sound_Desk").doc(User.ID).update({
                    Synchronized_Devices: Infos_Sound_Desk.Synchronized_Devices
                })
            }

            break
        }
    }


    if (!Pedido_Sincronizacao) {
        Infos_Sound_Desk.Synchronized_Devices.push({
            ID: Get_DispositivoID(),
            Date: new Date().getTime(),
            Synchronized: false,
            PassWord,
        })

        const agora = Date.now()
        const cincoMin = 5 * 60 * 1000 // 5 minutos em ms

        Infos_Sound_Desk.Synchronized_Devices = Infos_Sound_Desk.Synchronized_Devices.filter(dispositivo => {
            const tempoPassou = agora - dispositivo.Date > cincoMin
            const naoSincronizado = !dispositivo.Synchronized

            return !(tempoPassou && naoSincronizado)
            // ! Só remove se passou 5min e NÃO tá sincronizado
        })

        await db.collection('Sound_Desk').doc(User.ID).update({
            Synchronized_Devices: Infos_Sound_Desk.Synchronized_Devices
        })
    }

    if (!Sincronizado) {
        loadingOverlay.classList.remove('active')
        showSyncCodeModal(PassWord,
            () => {
                for (let c = 0; c < Infos_Sound_Desk.Synchronized_Devices.length; c++) {
                    if (Infos_Sound_Desk.Synchronized_Devices[c].ID == localStorage.getItem('ID_Dispositivo')) {
                        Infos_Sound_Desk.Synchronized_Devices[c].Synchronized = true
                        break
                    }
                }

                const agora = Date.now()
                const cincoMin = 5 * 60 * 1000 // 5 minutos em ms

                Infos_Sound_Desk.Synchronized_Devices = Infos_Sound_Desk.Synchronized_Devices.filter(dispositivo => {
                    const tempoPassou = agora - dispositivo.Date > cincoMin
                    const naoSincronizado = !dispositivo.Synchronized

                    return !(tempoPassou && naoSincronizado)
                    // ! Só remove se passou 5min e NÃO tá sincronizado
                })

                db.collection('Sound_Desk').doc(User.ID).update({
                    Synchronized_Devices: Infos_Sound_Desk.Synchronized_Devices
                }).then(() => {
                    const userReadyEvent = new CustomEvent('userReady', { detail: User })
                    document.dispatchEvent(userReadyEvent);
                })
            },
            () => {
                console.log('Modal fechado');
                // Coloque aqui o código para quando o modal for fechado
            }
        )
    }

    if (Sincronizado) {
        const userReadyEvent = new CustomEvent('userReady', { detail: User })
        document.dispatchEvent(userReadyEvent);
    } else {

    }
} Carregar_Infos_User()

document.addEventListener("userReady", function () {
    loadingOverlay.classList.remove('active')
    Criar_Html_Sons(User.Favorites_List)
})

function Criar_Html_Sons(audioItems) {
    const deckGrid = document.getElementById('deck-grid');

    // Limpa o conteúdo existente
    deckGrid.innerHTML = '';

    audioItems.forEach(item => {
        // Extrai as iniciais do título (pega as primeiras letras de cada palavra)
        const initials = item.Title.split(' ')
            .filter(word => word.length > 0)
            .map(word => word[0].toUpperCase())
            .join('')
            .substring(0, 2);

        // Cria a div principal
        const deckKey = document.createElement('div');
        deckKey.className = 'deck-key';
        deckKey.dataset.soundId = item.ID;
        deckKey.dataset.audioClass = item.Class.Title.toLowerCase();
        deckKey.dataset.duration = '2.5s'; // Você pode ajustar isso conforme necessário

        // Cria o visual com as iniciais
        const keyVisual = document.createElement('div');
        keyVisual.className = 'key-visual key-initials';
        keyVisual.textContent = initials;
        keyVisual.style.background = item.Class.Color;
        keyVisual.style.color = getContrastColor(item.Class.Color);
        keyVisual.style.textShadow = 'none';
        keyVisual.style.fontWeight = '500';

        // Cria os metadados
        const keyMetadata = document.createElement('div');
        keyMetadata.className = 'key-metadata';

        const keyLabel = document.createElement('div');
        keyLabel.className = 'key-label';
        keyLabel.textContent = item.Title;

        const keyDetails = document.createElement('div');
        keyDetails.className = 'key-details';

        const keyBadge = document.createElement('span');
        keyBadge.className = 'key-badge';
        keyBadge.textContent = item.Shortcut.Key;

        const keyAudioClass = document.createElement('span');
        keyAudioClass.className = 'key-audio-class';
        keyAudioClass.style.background = item.Class.Color;
        keyAudioClass.style.color = getContrastColor(item.Class.Color);
        keyAudioClass.textContent = item.Class.Title;

        // Monta a estrutura
        keyDetails.appendChild(keyBadge);
        keyDetails.appendChild(keyAudioClass);

        keyMetadata.appendChild(keyLabel);
        keyMetadata.appendChild(keyDetails);

        // Cria o indicador de ativo
        const keyActiveIndicator = document.createElement('div');
        keyActiveIndicator.className = 'key-active-indicator';

        // Adiciona tudo à div principal
        deckKey.appendChild(keyVisual);
        deckKey.appendChild(keyMetadata);
        deckKey.appendChild(keyActiveIndicator);

        // Adiciona ao grid
        deckGrid.appendChild(deckKey);

        deckKey.addEventListener('click', () => {
            console.log('aaaaaaa');
            
            Tocar_Audio_No_PC(item, "play_start")
        })
    });
}

function Marcar_Audio_Na_Tela(audioId) {
    // Remove a classe 'active' de todos os deck-keys
    document.querySelectorAll('.deck-key').forEach(deckKey => {
        deckKey.classList.remove('active');
    });

    // Encontra o deck-key com o data-sound-id correspondente e adiciona a classe 'active'
    const activeDeckKey = document.querySelector(`.deck-key[data-sound-id="${audioId}"]`);
    if (activeDeckKey) {
        activeDeckKey.classList.add('active');

        // Rolagem suave para o elemento (opcional)
        activeDeckKey.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

const Btn_Play = document.getElementById("btn_play_pause_audio")

Btn_Play.addEventListener("click", () => {
    if (Audio_Player.paused) {
        Tocar_Audio_No_PC(Ultimo_Audio, "play")
    } else {
        Tocar_Audio_No_PC(Ultimo_Audio, "pause")
    }
})

document.getElementById("btn-next").addEventListener("click", () => {
    Ultimo_Audio = Pegar_Anterior_Proximo(
        User.Favorites_List,
        Ultimo_Audio.ID,
        "depois"
    )
    Tocar_Audio_No_PC(Ultimo_Audio, "play")
})

document.getElementById("btn-prev").addEventListener("click", () => {
    Ultimo_Audio = Pegar_Anterior_Proximo(
        User.Favorites_List,
        Ultimo_Audio.ID,
        "antes"
    )
    Tocar_Audio_No_PC(Ultimo_Audio, "play")
})

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

    Atualizar_Player({
        title: Ultimo_Audio.Title,
        shortcut: Ultimo_Audio.Shortcut.Key,
        duration: duracaoTotal,
        currentTime: tempoAtual
    })
})

function Tocar_Audio_No_PC(_Audio, _Action = "play") {
    Marcar_Audio_Na_Tela(_Audio.ID)
    Audio_Player.volume = 0
    Audio_Player.muted = true

    const All_Sound_Card = document.querySelectorAll(".sound-card")
    All_Sound_Card.forEach((soundCard) => {
        soundCard.classList.remove("playing")

        if (soundCard.id == `sound-card-${_Audio.ID}`) {
            soundCard.classList.add("playing")
        }
    })

    if (_Action == 'play') {
        if (_Audio.Mp3 != Audio_Player.src || Audio_Player.paused) {
            Audio_Player.src = _Audio.Mp3
            Audio_Player.play()
        } else {
            Audio_Player.pause()
            _Action = 'pause'
        }

    } else if (_Action == 'pause') {
        Audio_Player.pause()
    } else {
        Audio_Player.currentTime = 0
        Audio_Player.play()
    }

    Atualizar_Player({
        title: _Audio.Title,
        shortcut: _Audio.Shortcut.Key,
        duration: Audio_Player.duration,
        currentTime: Audio_Player.currentTime
    })
    // acompanharProgresso(Audio_Player)

    Ultimo_Audio = _Audio
    const New_Sound_Desk = {
        ID_Audio: _Audio.ID,
        Action: _Action,
        ID_Call: Gerar_ID(),
        Seek: Audio_Player.currentTime,
    }
    db.collection("Sound_Desk")
        .doc(User.ID)
        .set(New_Sound_Desk, { merge: true })
}

let playerVisible = false
const playerControls = document.querySelector('.player-controls')
const mobileDeckContainer = document.querySelector('.mobile-deck-container')
const progressBarFill = document.createElement('div')
progressBarFill.className = 'progress-bar-fill'
document.querySelector('.progress-bar').appendChild(progressBarFill)

// Função para mostrar o player com animação
function Mostrar_Player_Controls() {
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
function Esconder_Player_Controls() {
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
function Atualizar_Player(audio) {
    // Atualiza informações
    document.getElementById('now-playing-title').textContent = audio.title
    document.getElementById('now-playing-subtitle').innerHTML = `
    <span class="shortcut-badge">${audio.shortcut}</span>
    <span>${Formatar_Tempo(audio.duration)}</span>
  `

    // Mostra o player se estiver escondido
    if (!playerVisible) {
        Mostrar_Player_Controls()
    }

    // Atualiza progresso (exemplo)
    Atualizar_Progresso(audio.currentTime, audio.duration)
}

// Função para atualizar barra de progresso
function Atualizar_Progresso(currentTime, duration) {
    const percent = (currentTime / duration) * 100
    progressBarFill.style.width = `${percent}%`
}

// Função auxiliar para formatar tempo
function Formatar_Tempo(segundos) {
    const mins = Math.floor(segundos / 60)
    const secs = Math.floor(segundos % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}