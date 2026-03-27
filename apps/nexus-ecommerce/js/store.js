class NexusStore {
    constructor() {
        this.cart = this.loadData('nexus_cart') || [];
        this.wishlist = this.loadData('nexus_wishlist') || [];
        this.listeners = [];
    }

    loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Erro ao ler localStorage", e);
            return null;
        }
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this));
    }

    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    addToCart(product, quantity = 1) {
        const itemIndex = this.cart.findIndex(item => item.id === product.id);
        if (itemIndex > -1) {
            this.cart[itemIndex].quantity += quantity;
        } else {
            this.cart.push({ ...product, quantity });
        }
        
        this.saveData('nexus_cart', this.cart);
        this.notify();
    }

    updateQuantity(productId, newQty) {
        const item = this.cart.find(i => i.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQty);
            this.saveData('nexus_cart', this.cart);
            this.notify();
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveData('nexus_cart', this.cart);
        this.notify();
    }

    clearCart() {
        this.cart = [];
        this.saveData('nexus_cart', this.cart);
        this.notify();
    }

    toggleWishlist(productId) {
        const idx = this.wishlist.indexOf(productId);
        if (idx > -1) {
            this.wishlist.splice(idx, 1);
        } else {
            this.wishlist.push(productId);
        }
        this.saveData('nexus_wishlist', this.wishlist);
        this.notify();
    }

    isInWishlist(productId) {
        return this.wishlist.includes(productId);
    }
}

// Global Instantie
window.store = new NexusStore();
