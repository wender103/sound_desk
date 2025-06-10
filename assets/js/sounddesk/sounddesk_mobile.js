let sound_desk = null
let lista_favoritos = []
let last_pesquisa = { query: '', page: 1 }

let id_device = localStorage.getItem('id_device')

function conectar_ao_sound_desk() {
  const url = new URL(window.location.href)
  const codigo = url.searchParams.get('sounddesk')

  db.collection('sound_desks')
    .where('sound_board_code', '==', codigo)
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        sound_desk = doc.data()

        if (!id_device) {
          id_device = gerar_id_unico()
          localStorage.setItem('id_device', id_device)
        }

        let pedido_enviado = false
        let device_conectado = false
        let esse_device = null
        sound_desk.synchronized_devices.forEach(device => {
          if (device.id == id_device) {
            pedido_enviado = true
            device_conectado = device.synchronized
            esse_device = device
          }
        })

        if (pedido_enviado) {
          console.log('caiu no if')

          if (device_conectado) {
            criar_audios_biblioteca(sound_desk.search.results.data)
            construir_cards_audio_favoritos(sound_desk.favorite_list)

            if (sound_desk.command == 'results search') {
              criar_audios_biblioteca(sound_desk.search.results.data)
            } else if (sound_desk.command == 'play_iniciado') {
              marcar_audio_play_pause('play')
            } else if (sound_desk.command == 'pause_iniciado') {
              marcar_audio_play_pause('pause')
            } else if (sound_desk.command == 'change_theme' && localStorage.getItem('selectedTheme') != sound_desk.theme) {
              temaManager.applyTheme(sound_desk.theme)
              location.reload()
            }
          } else {
            console.log('Não sincronizado')
            verificacao_popup.abrir_popup(esse_device.password, () => {
              for (let c = 0; c < sound_desk.synchronized_devices.length; c++) {
                if(sound_desk.synchronized_devices[c].id == id_device) {
                  sound_desk.synchronized_devices[c].synchronized = true
                  break
                }
              }
              sound_desk.command == 'new device'
              db.collection('sound_desks').doc(sound_desk.user_id).update(sound_desk)
            })
          }

        } else {
          console.log('caiu no else')

          const new_device = {
            id: id_device,
            device_name: detectar_dispositivo(),
            synchronized: false,
            password: gerar_codigo(5),
            date: new Date().getTime()
          }

          sound_desk.synchronized_devices.push(new_device)
          sound_desk.command = `device_conectado:${id_device}`
          db.collection('sound_desks').doc(sound_desk.user_id).update(sound_desk)
        }
      })
    })
} conectar_ao_sound_desk()

//? ----------------------------------- Funções Html --------------------------------------------
document.getElementById('btn_layout_coluna').addEventListener('click', function () {
  const all_audio_grid = document.querySelectorAll('.audio-grid')
  all_audio_grid.forEach(audio_grid => {
    audio_grid.classList.remove('list-view')
    audio_grid.classList.add('compact-view')
  })

  this.classList.add('active')
  document.getElementById('btn_layout_linha').classList.remove('active')
})

document.getElementById('btn_layout_linha').addEventListener('click', function () {
  const all_audio_grid = document.querySelectorAll('.audio-grid')
  all_audio_grid.forEach(audio_grid => {
    audio_grid.classList.remove('compact-view')
    audio_grid.classList.add('list-view')
  })
  this.classList.add('active')
  document.getElementById('btn_layout_coluna').classList.remove('active')
})

const select_categorias = document.getElementById('select_categorias')
let pagina_atual = 'favoritos'
function criar_filtros() {
  let todas_classes = []
  select_categorias.innerHTML = '<option value="Todos">Todos</option>'

  for (let c = 0; c < lista_favoritos.length; c++) {
    todas_classes.push(lista_favoritos[c].class.title)
  }

  let classes_unicas = [...new Set(todas_classes)]


  for (let c = 0; c < classes_unicas.length; c++) {
    const option = document.createElement('option')
    option.value = classes_unicas[c]
    option.innerText = classes_unicas[c]
    select_categorias.appendChild(option)
  }
}

const input_search_header = document.getElementById('input_search_header')
select_categorias.addEventListener('change', () => {
  input_search_header.value = ''

  if (select_categorias.value == 'Todos') {
    pesquisar_audios_favoritos('')
  } else {
    pesquisar_audios_favoritos(select_categorias.value)
  }
})

input_search_header.addEventListener('input', () => {
  if (pagina_atual == 'favoritos') {
    select_categorias.value = 'Todos'
    pesquisar_audios_favoritos(input_search_header.value)
  }
})

input_search_header.addEventListener('keypress', (e) => {
  if (e.key == 'Enter') {
    if (pagina_atual == 'favoritos') {
      select_categorias.value = 'Todos'
      pesquisar_audios_favoritos(input_search_header.value)
    } else {
      pesquisar_myinstants(input_search_header.value)
    }
  }
})

function pesquisar_audios_favoritos(_pesquisa = '') {
  let pesquisa_formatada = formatar_texto(_pesquisa)

  for (let c = 0; c < lista_favoritos.length; c++) {
    let titulo_formatado = formatar_texto(lista_favoritos[c].title)
    let titulo_classe_formatado = formatar_texto(lista_favoritos[c].class.title)

    if (titulo_formatado.includes(pesquisa_formatada) || titulo_classe_formatado.includes(pesquisa_formatada) || pesquisa_formatada.includes(titulo_classe_formatado) || pesquisa_formatada.includes(titulo_formatado)) {
      document.querySelector(`[data-audio_id="${lista_favoritos[c].id}"]`).style.display = 'block'
    } else {
      document.querySelector(`[data-audio_id="${lista_favoritos[c].id}"]`).style.display = 'none'
    }
  }
}

let container_audios_favoritos = document.getElementById('container_audios_favoritos')
function construir_cards_audio_favoritos(array_audios) {
  lista_favoritos = array_audios
  criar_filtros()

  container_audios_favoritos.innerHTML = ''

  array_audios.forEach(audio => {
    const card = document.createElement('div')
    card.className = 'audio-card'
    card.dataset.audio_id = audio.id

    const card_top = document.createElement('div')
    card_top.className = 'audio-card-top'

    const shortcut = document.createElement('span')
    shortcut.className = 'audio-shortcut'
    shortcut.textContent = audio.shortcut.key
    shortcut.style.backgroundColor = audio.class.color
    shortcut.style.color = get_contrast_color(audio.class.color)

    const favorite_btn = document.createElement('button')
    favorite_btn.className = 'favorite-btn'
    favorite_btn.innerHTML = '<i class="fas fa-heart"></i>'

    card_top.appendChild(shortcut)
    card_top.appendChild(favorite_btn)

    const card_content = document.createElement('div')
    card_content.className = 'audio-card-content'

    const title_wrapper = document.createElement('div')
    title_wrapper.className = 'audio-title-wrapper'

    const title = document.createElement('h3')
    title.className = 'audio-title'
    title.textContent = audio.title

    const category = document.createElement('span')
    category.className = 'audio-category'
    category.textContent = audio.class.title
    category.style.color = audio.class.color

    title_wrapper.appendChild(title)
    title_wrapper.appendChild(category)
    card_content.appendChild(title_wrapper)

    card.appendChild(card_top)
    card.appendChild(card_content)

    container_audios_favoritos.appendChild(card)

    favorite_btn.addEventListener('click', () => remove_favorite(audio.id))

    card.addEventListener('click', (e) => {
      if (e.target !== favorite_btn) {
        iniciar_play(audio)
      }
    })
  })
}

//? --------------------------------- Biblioteca
function trocar_pagina(_nome_pagina) {
  pagina_atual = _nome_pagina
  const all_paginas = document.querySelectorAll('.paginas')
  all_paginas.forEach((pagina) => {
    pagina.style.display = 'none'
  })

  const li_paginas = document.querySelectorAll('.li_paginas')
  li_paginas.forEach((li_pagina) => {
    li_pagina.classList.remove('active')
  })
  document.getElementById(`li_${_nome_pagina}`).classList.add('active')

  const pagina = document.querySelector(`#pagina_${_nome_pagina}`)
  pagina.style.display = 'block'

  if (pagina_atual == 'favoritos') {
    select_categorias.style.display = 'block'
  } else {
    select_categorias.style.display = 'none'
  }
}

async function pesquisar_myinstants(_pesquisa = '') {
  if (last_pesquisa.query != _pesquisa) {
    last_pesquisa = {
      query: _pesquisa,
      page: 1
    }
  } else {
    last_pesquisa.page++
  }

  sound_desk.search.query = _pesquisa
  sound_desk.search.page = last_pesquisa.page
  sound_desk.command = 'search'
  db.collection('sound_desks').doc(sound_desk.user_id).update(sound_desk)
}

let container_audios_biblioteca = document.getElementById('container_audios_biblioteca')
function criar_audios_biblioteca(array_audios, adicionar = last_pesquisa.page > 1) {

  if (!adicionar) {
    console.log(container_audios_biblioteca)

    container_audios_biblioteca.innerHTML = ''
  }

  let currentlyPlayingAudio = null // ! Controla o áudio atual em reprodução

  array_audios.forEach(audio => {
    const card = document.createElement('div')
    card.className = 'audio-card'
    card.dataset.audio_id = audio.id

    // ! Parte de cima do card (título, favorito e alerta)
    const cardTop = document.createElement('div')
    cardTop.className = 'audio-card-top'

    const title = document.createElement('h3')
    title.className = 'audio-title'
    title.textContent = audio.title

    const favoriteBtn = document.createElement('button')
    favoriteBtn.className = 'favorite-btn'

    if (is_favorite(audio.id)) {
      favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>'
    } else {
      favoriteBtn.innerHTML = '<i class="far fa-heart"></i>'
    }

    const volumeWarning = document.createElement('span')
    volumeWarning.className = 'volume-warning'
    volumeWarning.textContent = 'ALTO'

    // TODO: adicionar lógica para mostrar isso só se o áudio for alto

    cardTop.appendChild(title)
    cardTop.appendChild(favoriteBtn)
    cardTop.appendChild(volumeWarning)

    // ! Parte de baixo (duração e botão de tocar)
    const cardContent = document.createElement('div')
    cardContent.className = 'audio-card-content'

    const duration = document.createElement('span')
    duration.className = 'audio-duration'
    duration.innerHTML = '<i class="far fa-clock"></i> 0:10' // TODO: pegar a duração real do áudio

    const playBtn = document.createElement('button')
    playBtn.className = 'play-btn'
    playBtn.innerHTML = '<i class="fas fa-play"></i> Tocar'

    // & Lógica de play/pause
    playBtn.addEventListener('click', () => {
      if (currentlyPlayingAudio && currentlyPlayingAudio.src === audio.mp3) {
        currentlyPlayingAudio.pause()
        currentlyPlayingAudio = null
        playBtn.innerHTML = '<i class="fas fa-play"></i> Tocar'
        return
      }

      if (currentlyPlayingAudio) {
        currentlyPlayingAudio.pause()
        document.querySelectorAll('.play-btn').forEach(btn => {
          btn.innerHTML = '<i class="fas fa-play"></i> Tocar'
        })
      }

      currentlyPlayingAudio = new Audio(audio.mp3)
      currentlyPlayingAudio.play()
      playBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar'

      currentlyPlayingAudio.onended = () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i> Tocar'
        currentlyPlayingAudio = null
      }
    })

    cardContent.appendChild(duration)
    cardContent.appendChild(playBtn)

    card.appendChild(cardTop)
    card.appendChild(cardContent)

    container_audios_biblioteca.appendChild(card)

    favoriteBtn.addEventListener('click', () => {
      toolbarFavorite(audio, favoriteBtn)
    })
  })
}

function toolbarFavorite(audio, favoriteBtn) {
  if (is_favorite(audio.id)) {
    remove_favorite(audio.id)
    favoriteBtn.innerHTML = '<i class="far fa-heart"></i>'
  } else {
    add_favorite(audio)
    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>'
  }
}

function is_favorite(id) {
  return lista_favoritos.some(fav => fav.id === id)
}

function add_favorite(_audio) {
  let colocar_classe = '#6c5ce7'
  for (let c = 0; c < lista_favoritos.length; c++) {
    if (lista_favoritos[c].class.title == 'Memes') {
      colocar_classe = lista_favoritos[c].class.color
      break
    }
  }

  const new_audio = {
    id: _audio.id,
    title: _audio.title,
    mp3: _audio.mp3,
    class: { color: colocar_classe, title: 'Memes' },
    shortcut: { key: '' }
  }

  lista_favoritos.push(new_audio)
  lista_favoritos = atribuir_atalhos(lista_favoritos, false, false)
  construir_cards_audio_favoritos(lista_favoritos)

  sound_desk.command = 'add_favorite'
  sound_desk.favorite_list = lista_favoritos
  db.collection('sound_desks').doc(sound_desk.user_id).update(sound_desk)
}

function remove_favorite(id) {
  console.log(lista_favoritos.length)

  lista_favoritos = lista_favoritos.filter((audio) => audio.id !== id)
  console.log(lista_favoritos.length)
  construir_cards_audio_favoritos(lista_favoritos)

  sound_desk.command = 'remove_favorite'
  sound_desk.favorite_list = lista_favoritos
  db.collection('sound_desks').doc(sound_desk.user_id).update(sound_desk)
}

// ? --------------------------------------------- Player bar ------------------------
const container_play_bar = document.getElementById('container_play_bar')
const audio_player = document.getElementById('audio_player')
const btn_play_pause_player_bar = document.getElementById('btn_play_pause_player_bar')
const btn_next_player_bar = document.getElementById('btn_next_player_bar')
const btn_prev_player_bar = document.getElementById('btn_prev_player_bar')

let audio_tocando_agora = null
function iniciar_play(_audio, _command = '') {
  audio_tocando_agora = _audio
  audio_player.src = _audio.mp3
  audio_player.volume = 0
  audio_player.muted = true

  play_pause_audio(`reset, ${_command}`)

  container_play_bar.classList.add('active')
  document.getElementById('nome_audio_player_bar').innerText = _audio.title
  document.getElementById('categoria_audio_player_bar').innerText = _audio.class.title
  document.getElementById('categoria_audio_player_bar').style.backgroundColor = _audio.class.color
  document.getElementById('categoria_audio_player_bar').style.color = get_contrast_color(_audio.class.color)
  document.getElementById('shortcut_audio_player_bar').innerText = _audio.shortcut.key
  document.getElementById('shortcut_audio_player_bar').style.backgroundColor = _audio.class.color
  document.getElementById('shortcut_audio_player_bar').style.color = get_contrast_color(_audio.class.color)
}

audio_player.addEventListener('timeupdate', atualizar_progresso)

function atualizar_progresso() {
  const progressBar = document.getElementById('progressBar')

  try {
    const progress = (audio_player.currentTime / audio_player.duration) * 100
    progressBar.style.width = `${progress}%`

  } catch { }
}

function play_pause_audio(_command = '') {
  console.log(_command)

  if (audio_player.paused || _command.includes('reset')) {
    if (_command.includes('reset')) {
      sound_desk.command = 'play_start'
    } else {
      sound_desk.command = 'play'
    }
  } else {
    sound_desk.command = 'pause'
  }

  sound_desk.audio = audio_tocando_agora

  if (!_command.includes('não salvar')) {
    db.collection('sound_desks').doc(sound_desk.user_id).update(sound_desk)
  }
}

function marcar_audio_play_pause(_command = '') {
  if (_command == 'play') {
    audio_player.play()
    btn_play_pause_player_bar.innerHTML = '<i class="fa-solid fa-pause"></i>'
  } else {
    audio_player.pause()
    btn_play_pause_player_bar.innerHTML = '<i class="fa-solid fa-play"></i>'
  }
}

function tocar_audio_anterior() {
  iniciar_play(anterior_prox_lista(lista_favoritos, audio_tocando_agora.id, 'antes'))
}

function tocar_audio_prox() {
  iniciar_play(anterior_prox_lista(lista_favoritos, audio_tocando_agora.id, 'depois'))
}

btn_play_pause_player_bar.addEventListener('click', () => play_pause_audio())
btn_prev_player_bar.addEventListener('click', tocar_audio_anterior)
btn_next_player_bar.addEventListener('click', tocar_audio_prox)

const btnTelaCheia = document.getElementById('btn_tela_cheia')
function toggleTelaCheia() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    btnTelaCheia.querySelector('i').classList.remove('fa-expand')
    btnTelaCheia.querySelector('i').classList.add('fa-compress') // ícone de "sair da tela cheia"
  } else {
    document.exitFullscreen()
    btnTelaCheia.querySelector('i').classList.remove('fa-compress')
    btnTelaCheia.querySelector('i').classList.add('fa-expand') // ícone de "entrar em tela cheia"
  }
}

btnTelaCheia.addEventListener('click', toggleTelaCheia)

//? ---------------------------------------------------- Devices -----------------------------------------
const verificacao_popup = {
  codigo_esperado: '',
  callback_sucesso: null,
  inputs: [],

  init() {
    this.elemento_background = document.getElementById('verificacao_popup_background')
    this.digitos_container = document.getElementById('digitos_container')
    this.botao_verificar = document.getElementById('botao_verificar')
    this.mensagem_erro = document.getElementById('mensagem_erro')

    this.configurar_eventos()
  },

  configurar_eventos() {
    // this.elemento_background.addEventListener('click', (e) => {
    //     if (e.target === this.elemento_background) this.fechar_popup()
    // })

    this.botao_verificar.addEventListener('click', () => this.verificar_codigo())
  },

  criar_inputs(tamanho_codigo = 6) {
    this.digitos_container.innerHTML = ''
    this.inputs = []

    for (let i = 0; i < tamanho_codigo; i++) {
      const input = document.createElement('input')
      input.type = 'text'
      input.maxLength = 1
      input.className = 'digito-input'
      input.dataset.index = i

      input.addEventListener('input', (e) => this.handle_input(e, i))
      input.addEventListener('keydown', (e) => this.handle_key_down(e, i))
      input.addEventListener('paste', (e) => this.handle_paste(e))
      input.addEventListener('focus', () => input.select())

      this.digitos_container.appendChild(input)
      this.inputs.push(input)
    }
  },

  handle_input(e, index) {
    const input = e.target
    const valor = input.value.toUpperCase()

    input.value = valor.replace(/[^A-Z0-9]/g, '')

    if (valor) {
      input.classList.add('filled')

      if (index < this.inputs.length - 1) {
        this.inputs[index + 1].focus()
      }
    } else {
      input.classList.remove('filled')
    }

    this.verificar_preenchimento()
  },

  handle_key_down(e, index) {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      this.inputs[index - 1].focus()
    }
  },

  handle_paste(e) {
    e.preventDefault()
    const paste_data = e.clipboardData.getData('text').toUpperCase()
    const codigo_limpo = paste_data.replace(/[^A-Z0-9]/g, '')

    for (let i = 0; i < Math.min(codigo_limpo.length, this.inputs.length); i++) {
      this.inputs[i].value = codigo_limpo[i]
      this.inputs[i].classList.add('filled')
    }

    if (codigo_limpo.length >= this.inputs.length) {
      this.inputs[this.inputs.length - 1].focus()
    } else if (codigo_limpo.length > 0) {
      this.inputs[codigo_limpo.length].focus()
    }

    this.verificar_preenchimento()
  },

  verificar_preenchimento() {
    const todos_preenchidos = this.inputs.every(input => input.value)
    this.botao_verificar.disabled = !todos_preenchidos
  },

  verificar_codigo() {
    const codigo_digitado = this.inputs.map(input => input.value).join('')
    hideLoading()

    if (codigo_digitado === this.codigo_esperado) {
      if (this.callback_sucesso) {
        this.callback_sucesso()
      }
      this.fechar_popup()
    } else {
      this.mostrar_erro()
    }
  },

  mostrar_erro() {
    this.inputs.forEach(input => {
      input.classList.add('error')
      setTimeout(() => input.classList.remove('error'), 500)
    })

    this.mensagem_erro.textContent = 'Código incorreto. Por favor, tente novamente.'
    this.mensagem_erro.style.visibility = 'visible'

    this.inputs[0].focus()
  },

  abrir_popup(codigo, callback) {
    this.codigo_esperado = codigo.toUpperCase()
    this.callback_sucesso = callback

    this.criar_inputs(codigo.length)
    this.mensagem_erro.style.visibility = 'hidden'
    this.botao_verificar.disabled = true

    this.elemento_background.classList.add('active')
    this.inputs[0].focus()
  },

  fechar_popup() {
    this.elemento_background.classList.remove('active')
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => verificacao_popup.init())

//? -------------------------------- Carregamento ---------------------------
function hideLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
    document.getElementById('container_main_app').style.display = 'block'
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      loadingOverlay.remove();
    }, 200); // Match this with your CSS transition time
  }
}

// Function to show the loading overlay (if needed)
function showLoading() {
  // Check if loading overlay already exists
  if (!document.getElementById('loadingOverlay')) {
    const loadingHTML = `
      <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-container">
          <div class="loading-spinner">
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
          </div>
          <div class="loading-text">Carregando...</div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
  } else {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('hidden');
  }
}