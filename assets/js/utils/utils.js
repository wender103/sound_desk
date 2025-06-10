function audio_duration(audio_url, format = false) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audio_url)

    // ? Espera carregar os metadados pra pegar a duração
    audio.onloadedmetadata = () => {
      const duracao = audio.duration

      if (format) {
        const minutos = Math.floor(duracao / 60)
        const segundos = Math.floor(duracao % 60)
        const tempo_formatado = `${minutos}:${segundos.toString().padStart(2, '0')}`
        resolve(tempo_formatado)
      } else {
        resolve(duracao)
      }
    }

    // ! Erro ao carregar o áudio
    audio.onerror = () => {
      reject(new Error('Erro ao carregar o áudio 😢'))
    }
  })
}

function formatar_texto(_texto) {
  // * Normaliza acentos e coloca em minúsculo
  const texto_normalizado = _texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  // * Remove caracteres especiais
  const texto_formatado = texto_normalizado.replace(/[^a-z0-9]/g, '')

  return texto_formatado
}

function checar_alteracao(antigo, novo) {
  // * Se os tipos são diferentes, já mudou
  if (Array.isArray(antigo) !== Array.isArray(novo)) return true

  // * Se for array
  if (Array.isArray(antigo)) {
    if (antigo.length !== novo.length) return true

    return antigo.some((item, index) => {
      return JSON.stringify(item) !== JSON.stringify(novo[index])
    })
  }

  // * Se for objeto
  const chaves_antigas = Object.keys(antigo)
  const chaves_novas = Object.keys(novo)
  if (chaves_antigas.length !== chaves_novas.length) return true

  return chaves_antigas.some(chave => {
    return JSON.stringify(antigo[chave]) !== JSON.stringify(novo[chave])
  })
}

//? -------------------- Padroniza os Objs
function padronizar_titulos(obj) {
  if (Array.isArray(obj)) {
    // ! Se for array, percorre e padroniza cada item
    return obj.map(item => padronizar_titulos(item))
  } else if (typeof obj === 'object' && obj !== null) {
    const obj_padronizado = {}

    for (let chave in obj) {
      if (obj.hasOwnProperty(chave)) {
        // ! Transforma a chave em minúscula direto (sem _)
        const nova_chave = chave.toLowerCase()

        // ? Se o valor for objeto ou array, chama recursivo
        const valor = obj[chave]
        if (typeof valor === 'object' && valor !== null) {
          obj_padronizado[nova_chave] = padronizar_titulos(valor)
        } else {
          obj_padronizado[nova_chave] = valor
        }
      }
    }

    return obj_padronizado
  }

  return obj // Se não for objeto nem array, retorna direto
}

//? Abre Links No Navegador
function open_url(url) {
  api.open_url_in_external_browser(url)
}

//? Reorganiza os lista de audios
function reorganizar_por_classe(ordemClasses, listaObjs) {
  return listaObjs.sort((a, b) => {
    const posA = ordemClasses.indexOf(a.class.title)
    const posB = ordemClasses.indexOf(b.class.title)
    return posA - posB
  })
}

//? ------------------- Atribuir Atalhos --------------------------
function atribuir_atalhos(audios, reorganizar = false, _gravar_atalhos = true) {
  const sequencia_atalhos = [
    ...Array.from({ length: 10 }, (_, i) => `F${i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `Control+${(i + 1) % 10}`),
    ...Array.from({ length: 12 }, (_, i) => `Control+F${i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `RightAlt+${(i + 1) % 10}`),
    ...Array.from({ length: 12 }, (_, i) => `RightAlt+F${i + 1}`)
  ]

  const atalhos_em_uso = new Set()
  audios.forEach(audio => {
    if (audio.shortcut?.key && audio.shortcut.key.trim() !== '') {
      atalhos_em_uso.add(audio.shortcut.key)
    }
  })

  const audios_para_atalhos = reorganizar
    ? audios.filter(audio => !audio.shortcut?.key || audio.shortcut.key.trim() === '')
    : audios.filter(audio => !audio.shortcut?.key || audio.shortcut.key.trim() === '')

  const atalhos_disponiveis = sequencia_atalhos.filter(atalho => !atalhos_em_uso.has(atalho))

  audios_para_atalhos.forEach((audio, index) => {
    audio.shortcut = audio.shortcut || {}
    if (index < atalhos_disponiveis.length) {
      audio.shortcut.key = atalhos_disponiveis[index]
      atalhos_em_uso.add(atalhos_disponiveis[index])
    } else {
      audio.shortcut.key = ''
    }
  })

  if(_gravar_atalhos) {
    gravar_atalhos(audios)
  }

  return audios
}

//? Sorter Números
const gerador_numeros = {
  ultimo_numero: null,

  gerar: function (max) {
    let numero_atual

    do {
      numero_atual = Math.floor(Math.random() * (max + 1))
    } while (numero_atual === this.ultimo_numero && max > 0)

    this.ultimo_numero = numero_atual
    return numero_atual
  }
}

//? Retorna o prox
function anterior_prox_lista(lista, id, direcao) {
  const index = lista.findIndex(item => item.id === id)

  if (index === -1) return null

  if (direcao === 'antes') {
    return lista[(index - 1 + lista.length) % lista.length]
  }

  if (direcao === 'depois') {
    return lista[(index + 1) % lista.length]
  }

  return null
}

//? Pegar Cor oposta
function get_contrast_color(inputColor) {
  let r, g, b

  // ! Se for cor hexadecimal tipo #RRGGBB
  if (inputColor.startsWith('#')) {
    const hex = inputColor.substring(1)
    const bigint = parseInt(hex, 16)
    r = (bigint >> 16) & 255
    g = (bigint >> 8) & 255
    b = bigint & 255

  // ! Se for formato RGB/RGBA tipo rgb(255,255,255)
  } else if (inputColor.startsWith('rgb')) {
    const rgbValues = inputColor.match(/\d+/g)
    r = parseInt(rgbValues[0])
    g = parseInt(rgbValues[1])
    b = parseInt(rgbValues[2])

  // ! Se for nome de cor tipo 'red', 'blue' etc
  } else {
    const temp = document.createElement('div')
    temp.style.color = inputColor
    document.body.appendChild(temp)
    const rgb = window.getComputedStyle(temp).color
    document.body.removeChild(temp)

    const rgbValues = rgb.match(/\d+/g)
    r = parseInt(rgbValues[0])
    g = parseInt(rgbValues[1])
    b = parseInt(rgbValues[2])
  }

  // & Calcula a luminância percebida
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // ! Retorna branco pra cores escuras, preto pra cores claras
  return luminancia > 0.5 ? '#000000' : '#FFFFFF'
}

//? Gera ids unicos
function gerar_id_unico() {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)

  return [...array].map(b => b.toString(16).padStart(2, '0')).join('')
}

//? --------------- Gerar Senha
function gerar_codigo(tamanho) {
  let caracteresPermitidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let codigo = ''
  const total = caracteresPermitidos.length

  for (let i = 0; i < tamanho; i++) {
    const index = Math.floor(Math.random() * total)
    codigo += caracteresPermitidos[index]
  }

  return codigo
}

//? Tipo dispositivo
function detectar_dispositivo() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera

  if (/android/i.test(userAgent)) return 'Android'
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'iOS'
  if (/Win/i.test(userAgent)) return 'Windows'
  if (/Mac/i.test(userAgent)) return 'Mac'
  if (/Linux/i.test(userAgent)) return 'Linux'

  return 'Desconhecido'
}