function Pegar_Anterior_Proximo(lista, id, direcao) {
  const index = lista.findIndex(item => item.ID === id)

  if (index === -1) return null

  if (direcao === 'antes') {
    return lista[(index - 1 + lista.length) % lista.length]
  }

  if (direcao === 'depois') {
    return lista[(index + 1) % lista.length]
  }

  return null
}

//? Peagar as iniciais da string
function Pegar_Iniciais(title) {
    const words = String(title).split(' ')
    if (words.length >= 2) {
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
    }
    return String(title).substring(0, 2).toUpperCase()
}

//? Função auxiliar para determinar a cor do texto com melhor contraste
function getContrastColor(hexColor) {
    // Converte hex para RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calcula o brilho (fórmula de luminosidade)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Retorna preto para cores claras, branco para cores escuras
    return brightness > 128 ? '#111' : '#fff';
}

//? Gerar senhas
function Gerar_Senha() {
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // ! Sem letras parecidas tipo I e O
  let senha = ''

  for (let i = 0; i < 5; i++) {
    const aleatorio = Math.floor(Math.random() * caracteres.length)
    senha += caracteres[aleatorio]
  }

  return senha
}

//? Gerar id
function Gerar_ID() {
  return 'xxxxxx'.replace(/x/g, () => {
    return Math.floor(Math.random() * 36).toString(36)
  })
}