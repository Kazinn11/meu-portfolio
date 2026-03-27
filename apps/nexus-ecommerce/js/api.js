const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Teclado Mecânico Nexus Pro",
        price: 899.90,
        originalPrice: 1199.90,
        category: "Periféricos",
        rating: 4.8,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800",
        description: "Estrutura em alumínio anodizado, switches Hot-Swappable táteis e iluminação RGB customizável por tecla. O modelo definitivo para produtividade e setups limpos."
    },
    {
        id: 2,
        name: "Mouse Wireless Ergonomic X1",
        price: 459.00,
        originalPrice: null,
        category: "Periféricos",
        rating: 4.9,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800",
        description: "Sensor ótico de 26.000 DPI, formato ergonômico projetado para destro, e bateria com duração de até 80 dias com carregamento super rápido USB-C."
    },
    {
        id: 3,
        name: "Monitor Ultrawide 34\" Curved",
        price: 2999.00,
        originalPrice: 3499.00,
        category: "Monitores",
        rating: 4.7,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
        description: "Painel Nano IPS, taxa de atualização de 144Hz e resolução WQHD. Hub USB-C embutido (fornece 90W) que permite conectar seu laptop com apenas 1 cabo."
    },
    {
        id: 4,
        name: "Headset Noise Canceling Zero",
        price: 1599.90,
        originalPrice: null,
        category: "Áudio",
        rating: 4.6,
        reviews: 55,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
        description: "Cancelamento de ruído ativo de última geração (ANC). Acabamento em couro sintético macio e arco de alumínio premium. Áudio espacial avançado."
    },
    {
        id: 5,
        name: "Desk Mat Premium de Couro Vegano",
        price: 199.90,
        originalPrice: 249.90,
        category: "Acessórios",
        rating: 4.9,
        reviews: 320,
        image: "https://images.unsplash.com/photo-1617469165786-8007eda8a608?auto=format&fit=crop&q=80&w=800",
        description: "Proteja sua mesa com estilo. Material resistente a água, base antiderrapante em cortiça e textura ultra macia para deslizamento do mouse."
    },
    {
        id: 6,
        name: "Smart Desk Lamp OLED",
        price: 649.00,
        originalPrice: null,
        category: "Iluminação",
        rating: 4.5,
        reviews: 42,
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
        description: "Controle de temperatura de cor, brilho ajustável automático via sensor e integração via wi-fi com assistentes de voz. Reduz a fadiga ocular."
    },
    {
        id: 7,
        name: "Hub USB-C 8-in-1 Alumínio",
        price: 349.90,
        originalPrice: null,
        category: "Acessórios",
        rating: 4.7,
        reviews: 18,
        image: "https://images.unsplash.com/photo-1647427017066-5e589f81ee6c?auto=format&fit=crop&q=80&w=800",
        description: "Expanda as portas do seu laptop. Contém HDMI 4K, 3 portas USB-A 3.2, 1 porta USB-C Power Delivery 100W, leitor de cartões SD/MicroSD e porta Ethernet Gigabit."
    },
    {
        id: 8,
        name: "Webcam 4K Creator Pro",
        price: 1199.00,
        originalPrice: 1499.00,
        category: "Periféricos",
        rating: 4.8,
        reviews: 76,
        image: "https://images.unsplash.com/photo-1621644781440-ad05a698a6fd?auto=format&fit=crop&q=80&w=800",
        description: "Sensor Sony STARVIS 4K, lente de vidro Premium autolimpante. Foco automático instantâneo com IA de enquadramento."
    }
];

class NexusAPI {
    // Simula atraso de rede (delay)
    static async delay(ms = 600) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async getProducts() {
        await this.delay(800); // Simulando loading
        return [...MOCK_PRODUCTS];
    }

    static async getProductById(id) {
        await this.delay(400);
        const product = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
        if (!product) throw new Error("Produto não encontrado");
        return product;
    }

    static async simulateCheckout(cartData) {
        await this.delay(1500); // Simula processamento de pagamento
        // Sorteio de sucesso (90% de chance para a demo parecer real, mas geralmente sucesso)
        return { success: true, orderId: "NEX-" + Math.floor(Math.random() * 100000) };
    }
}

// Expõe GLOBAL
window.NexusAPI = NexusAPI;
