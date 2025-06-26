function is_fora_do_ar() {
    const fora_do_ar_doc = db.collection('admin').doc('fora_do_ar')
    
    // Usando onSnapshot para monitorar em tempo real
    const unsubscribe = fora_do_ar_doc.onSnapshot((doc) => {
        console.log('Monitorando status do ar')
        
        if (!doc.exists) return
        
        const { sound_desk_online } = doc.data()
        
        if (!sound_desk_online) {
            if (!location.pathname.includes('fora_do_ar')) {
                location.href = 'fora_do_ar.html'
            }
        } else {
            if (location.pathname.includes('fora_do_ar')) {
                location.href = 'index.html'
            }
        }
    })
    
    // Opcional: limpar o listener quando não for mais necessário
    window.addEventListener('beforeunload', () => {
        unsubscribe()
    })
}

is_fora_do_ar()