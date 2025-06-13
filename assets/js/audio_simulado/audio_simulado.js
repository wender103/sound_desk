function criarSimuladorAudio() {
  let intervalo
  let ouvintes = {
    timeupdate: [],
    ended: [],
    loadeddata: [],
    play: [],
    pause: []
  }

  let estado = {
    src: '', // Inicializa sem src
    paused: true,
    currentTime: 0,
    duration: 60
  }

  function emitir(evento) {
    ouvintes[evento]?.forEach(fn => fn())
  }

  function iniciarTempo() {
    intervalo = setInterval(() => {
      if (!estado.paused) {
        estado.currentTime += 0.25
        emitir('timeupdate')

        if (estado.currentTime >= estado.duration) {
          estado.currentTime = estado.duration
          pausar()
          emitir('ended')
        }
      }
    }, 250)
  }

  iniciarTempo()
  emitir('loadeddata')

  function play() {
    if (!estado.paused) return
    estado.paused = false
    emitir('play')
  }

  function pausar() {
    if (estado.paused) return
    estado.paused = true
    emitir('pause')
  }

  function setSrc(novoSrc) {
    if (estado.src !== novoSrc) {
      estado.src = novoSrc
      estado.currentTime = 0
      emitir('loadeddata')
    }
  }

  function setDuration(novoDuration) {
    estado.duration = novoDuration
  }

  function setCurrentTime(novoCurrentTime) {
    estado.currentTime = novoCurrentTime
  }

  function setPaused(novoPaused) {
    estado.paused = novoPaused
  }

  return {
    play,
    pause: pausar,
    set src(novoSrc) {
      setSrc(novoSrc)
    },
    get src() {
      return estado.src
    },
    set currentTime(v) {
      setCurrentTime(v)
    },
    get currentTime() {
      return estado.currentTime
    },
    set paused(v) {
      setPaused(v)
    },
    get paused() {
      return estado.paused
    },
    get duration() {
      return estado.duration
    },
    set duration(v) {
      setDuration(v)
    },
    on(evento, callback) {
      if (ouvintes[evento]) ouvintes[evento].push(callback)
    },
    destroy() {
      clearInterval(intervalo)
    }
  }
}

const fakeAudio = criarSimuladorAudio()