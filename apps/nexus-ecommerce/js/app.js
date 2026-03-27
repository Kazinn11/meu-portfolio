// Componentes de Interface & Roteamento Básicos (SPA)
const app = {
    products: [],
    
    init: async function() {
        this.cacheDOM();
        this.bindEvents();
        
        // Assina mudanças da Store
        window.store.subscribe(() => this.updateCartUI());
        
        // Carrega dados simulados
        try {
            this.products = await window.NexusAPI.getProducts();
            this.router.navigate('home');
            this.updateCartUI(); // Initial state
        } catch (error) {
            this.showToast('Erro ao carregar produtos. Tente recarregar a página.', 'error');
            this.dom.content.innerHTML = `<div class="text-center mt-20 text-red-500">Erro de conexão com servidor.</div>`;
        }
    },

    cacheDOM: function() {
        this.dom = {
            content: document.getElementById('app-content'),
            cartDrawer: document.getElementById('cart-drawer'),
            cartOverlay: document.getElementById('cart-overlay'),
            cartBadge: document.getElementById('cart-badge'),
            cartItems: document.getElementById('cart-items'),
            cartTotal: document.getElementById('cart-total'),
            wishlistBadge: document.getElementById('wishlist-badge'),
            toastContainer: document.getElementById('toast-container')
        };
    },

    bindEvents: function() {
        // Atualiza UI baseada nos dados
    },

    // Roteador super simples (SPA pattern)
    router: {
        navigate: function(route, param = null) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Cleanup state (fechar carrinho se aberto)
            if (app.dom.cartDrawer.classList.contains('translate-x-0')) {
                 app.cart.toggleDrawer();
            }

            switch(route) {
                case 'home':
                    app.views.renderHome();
                    break;
                case 'product':
                    app.views.renderProduct(param);
                    break;
                case 'checkout':
                    app.views.renderCheckout();
                    break;
                case 'wishlist':
                    app.views.renderWishlist();
                    break;
                default:
                    app.views.renderHome();
            }
        }
    },

    // Funções auxiliares (Moeda, Nomenclaturas)
    formatMoney: (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val),

    // Carrinho Controller
    cart: {
        toggleDrawer: function() {
            const drawer = app.dom.cartDrawer;
            const overlay = app.dom.cartOverlay;
            
            const isOpen = drawer.classList.contains('translate-x-0');
            if (isOpen) {
                drawer.classList.remove('translate-x-0');
                drawer.classList.add('translate-x-full');
                overlay.classList.add('opacity-0');
                setTimeout(() => {
                    overlay.classList.add('hidden');
                }, 300);
                document.body.classList.remove('overflow-hidden');
            } else {
                overlay.classList.remove('hidden');
                // reflow force
                void overlay.offsetWidth;
                overlay.classList.remove('opacity-0');
                drawer.classList.remove('translate-x-full');
                drawer.classList.add('translate-x-0');
                document.body.classList.add('overflow-hidden');
            }
        },
        
        add: function(productId) {
            const product = app.products.find(p => p.id === productId);
            if(product) {
                window.store.addToCart(product, 1);
                app.showToast(`${product.name} adicionado ao carrinho!`, 'success');
                this.toggleDrawer(); // Opcional: abrir o menu após add
            }
        },

        remove: function(productId) {
            window.store.removeFromCart(productId);
        },

        updateQty: function(productId, qty) {
            window.store.updateQuantity(productId, parseInt(qty));
        },
        
        checkout: function() {
            if (window.store.cart.length === 0) {
                app.showToast("Seu carrinho está vazio!", "warning");
                return;
            }
            app.router.navigate('checkout');
        }
    },

    // Atualiza a visualização Lateral do Carrinho sempre que houver mudança
    updateCartUI: function() {
        const count = window.store.getCartCount();
        const { cartBadge, wishlistBadge, cartItems, cartTotal } = this.dom;
        
        // Update Badge
        if (count > 0) {
            cartBadge.textContent = count;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }

        // Wishlist Badge
        if (window.store.wishlist.length > 0) {
            wishlistBadge.textContent = window.store.wishlist.length;
            wishlistBadge.classList.remove('hidden');
        } else {
             wishlistBadge.classList.add('hidden');
        }

        // List Cart Items
        cartItems.innerHTML = '';
        if (count === 0) {
            cartItems.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-nexus-muted opacity-60">
                    <i data-lucide="shopping-cart" class="w-16 h-16 mb-4"></i>
                    <p>Seu carrinho está vazio.</p>
                </div>
            `;
            lucide.createIcons();
        } else {
            window.store.cart.forEach(item => {
                cartItems.innerHTML += `
                    <div class="flex gap-4 border-b border-white/5 pb-4 relative group">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg border border-white/10 group-hover:border-nexus-primary transition-colors">
                        <div class="flex-1">
                            <h4 class="text-sm font-semibold pr-6 truncate" style="max-width:200px">${item.name}</h4>
                            <p class="text-nexus-primary font-bold mt-1">${app.formatMoney(item.price)}</p>
                            
                            <div class="flex items-center gap-3 mt-3">
                                <button onclick="app.cart.updateQty(${item.id}, ${item.quantity - 1})" class="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center">-</button>
                                <span class="text-xs font-semibold w-4 text-center">${item.quantity}</span>
                                <button onclick="app.cart.updateQty(${item.id}, ${item.quantity + 1})" class="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center">+</button>
                            </div>
                        </div>
                        <button onclick="app.cart.remove(${item.id})" class="absolute top-0 right-0 text-nexus-muted hover:text-red-400 p-1">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                `;
            });
            lucide.createIcons();
        }

        // Update Total
        cartTotal.textContent = app.formatMoney(window.store.getCartTotal());
    },

    // Sister de Toasts
    showToast: function(message, type = 'success') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-nexus-card border-nexus-accent' : (type === 'error' ? 'bg-nexus-card border-red-500' : 'bg-nexus-card border-nexus-secondary');
        const iconColor = type === 'success' ? 'text-nexus-accent' : (type === 'error' ? 'text-red-500' : 'text-nexus-secondary');
        const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'x-circle' : 'info');

        toast.className = `flex items-center p-4 rounded-xl shadow-lg border-l-4 ${bgColor} text-white toast-enter max-w-sm pointer-events-auto`;
        toast.innerHTML = `
            <i data-lucide="${icon}" class="${iconColor} mr-3 flex-shrink-0"></i>
            <p class="text-sm font-medium mr-2">${message}</p>
        `;

        this.dom.toastContainer.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.classList.replace('toast-enter', 'toast-leave');
            setTimeout(() => toast.remove(), 400); // 400ms after animation logic ends
        }, 3000);
    },

    // Views da SPA
    views: {
        renderHome: function() {
            let html = `
                <!-- Hero Banner -->
                <div class="relative w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden mb-16 shadow-2xl border border-white/5 group">
                    <img src="https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80&w=1920" alt="Tech Setup" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000">
                    <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                    <div class="absolute inset-0 flex items-center">
                        <div class="p-8 sm:p-12 max-w-xl">
                            <span class="text-nexus-primary uppercase tracking-widest text-xs font-bold mb-3 block animate-pulse">Lançamento Exclusivo</span>
                            <h1 class="text-4xl sm:text-6xl font-black mb-4 leading-tight">Setup <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-nexus-accent">Minimalista</span></h1>
                            <p class="text-nexus-muted text-sm sm:text-base mb-8">Performance sem distrações. Conheça nossa nova linha de periféricos High-End pensada para desenvolvedores e criadores.</p>
                            <button onclick="document.getElementById('catalog').scrollIntoView({behavior:'smooth'})" class="bg-white text-black hover:bg-nexus-primary hover:text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-nexus-primary/30 flex items-center">
                                Explorar Coleção <i data-lucide="arrow-down" class="ml-2 w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Section Title -->
                <div class="flex justify-between items-end mb-8" id="catalog">
                    <div>
                        <h2 class="text-3xl font-bold">Destaques</h2>
                        <div class="h-1 w-12 bg-nexus-primary mt-2 rounded"></div>
                    </div>
                    <div class="hidden sm:flex space-x-2">
                        <button class="bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold border border-nexus-primary text-nexus-primary">Todos</button>
                        <button class="bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold transition">Teclados</button>
                        <button class="bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold transition">Áudio</button>
                    </div>
                </div>

                <!-- Product Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            `;

            app.products.forEach((p, idx) => {
                const animDelay = idx * 100;
                const isWished = window.store.isInWishlist(p.id);
                html += `
                    <div class="bg-nexus-card border border-white/5 rounded-2xl overflow-hidden hover:border-nexus-primary/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-nexus-primary/10" style="animation: slideInRight 0.5s ease forwards ${animDelay}ms; opacity:0;">
                        
                        <div class="relative h-56 overflow-hidden cursor-pointer bg-black" onclick="app.router.navigate('product', ${p.id})">
                            <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                            ${p.originalPrice ? `<span class="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">PROMO</span>` : ''}
                            
                            <button onclick="event.stopPropagation(); window.store.toggleWishlist(${p.id}); app.views.renderHome();" class="absolute top-4 right-4 bg-black/50 backdrop-blur p-2 rounded-full border border-white/10 hover:border-nexus-secondary hover:text-nexus-secondary transition-colors ${isWished ? 'text-nexus-secondary' : 'text-white'}">
                                <i data-lucide="heart" class="w-4 h-4 ${isWished ? 'fill-current' : ''}"></i>
                            </button>
                        </div>

                        <div class="p-5">
                            <span class="text-xs text-nexus-muted tracking-wider uppercase">${p.category}</span>
                            <h3 class="font-bold text-lg leading-tight mt-1 cursor-pointer hover:text-nexus-primary transition-colors truncate" onclick="app.router.navigate('product', ${p.id})">${p.name}</h3>
                            
                            <div class="flex items-center mt-2 mb-4">
                                <div class="flex text-yellow-400 mr-2">
                                    <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
                                    <span class="text-xs text-white ml-1 font-bold">${p.rating}</span>
                                </div>
                                <span class="text-[10px] text-nexus-muted">(${p.reviews})</span>
                            </div>

                            <div class="flex justify-between items-center mt-auto">
                                <div>
                                    ${p.originalPrice ? `<p class="text-xs text-nexus-muted line-through">${app.formatMoney(p.originalPrice)}</p>` : ''}
                                    <p class="text-xl font-bold text-nexus-primary">${app.formatMoney(p.price)}</p>
                                </div>
                                <button onclick="app.cart.add(${p.id})" class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-nexus-primary hover:text-black transition-all group-hover:shadow-[0_0_15px_rgba(0,210,255,0.4)]">
                                    <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
            app.dom.content.innerHTML = html;
            lucide.createIcons();
        },

        renderProduct: function(id) {
            const product = app.products.find(p => p.id === id);
            if (!product) return app.router.navigate('home');

            const isWished = window.store.isInWishlist(product.id);

            const html = `
                <div class="mt-4 mb-6">
                    <button onclick="app.router.navigate('home')" class="text-nexus-muted hover:text-white flex items-center text-sm transition-colors">
                        <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i> Voltar ao catálogo
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 bg-nexus-card p-6 sm:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                    <!-- Glow em background -->
                    <div class="absolute -top-40 -left-40 w-96 h-96 bg-nexus-primary opacity-[0.05] rounded-full blur-[100px] pointer-events-none"></div>

                    <!-- Image Gallery -->
                    <div class="rounded-2xl overflow-hidden bg-black/50 border border-white/10 relative group">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-[300px] sm:h-[500px] object-cover mix-blend-lighten group-hover:scale-105 transition-transform duration-700">
                    </div>

                    <!-- Info -->
                    <div class="flex flex-col justify-center relative z-10">
                        <span class="text-sm text-nexus-primary tracking-widest uppercase font-bold mb-2">${product.category}</span>
                        <h1 class="text-4xl sm:text-5xl font-black leading-tight mb-4">${product.name}</h1>
                        
                        <div class="flex items-center gap-4 mb-6">
                            <div class="flex items-center text-yellow-400">
                                <i data-lucide="star" class="w-4 h-4 fill-current mr-1"></i>
                                <span class="font-bold text-white">${product.rating}</span>
                                <span class="text-nexus-muted ml-2 text-sm">(${product.reviews} avaliações)</span>
                            </div>
                            <span class="inline-block px-2 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded">Em Estoque</span>
                        </div>

                        <p class="text-nexus-muted text-lg mb-8 leading-relaxed">${product.description}</p>
                        
                        <div class="mb-8">
                            ${product.originalPrice ? `<span class="text-lg text-nexus-muted line-through block mb-1">${app.formatMoney(product.originalPrice)}</span>` : ''}
                            <span class="text-5xl font-black text-white">${app.formatMoney(product.price)}</span>
                        </div>

                        <div class="flex gap-4 border-t border-white/10 pt-8">
                            <button onclick="app.cart.add(${product.id})" class="flex-1 bg-gradient-to-r from-nexus-primary to-nexus-secondary hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-nexus-primary/30 flex justify-center items-center">
                                <i data-lucide="shopping-cart" class="mr-2"></i> Adicionar ao Carrinho
                            </button>
                            <button onclick="window.store.toggleWishlist(${product.id}); app.views.renderProduct(${product.id});" class="w-14 h-14 bg-white/5 border border-white/10 text-${isWished ? 'nexus-secondary' : 'white'} hover:bg-white/10 rounded-xl flex justify-center items-center transition-all">
                                <i data-lucide="heart" class="w-6 h-6 ${isWished ? 'fill-current' : ''}"></i>
                            </button>
                        </div>
                        
                        <div class="mt-8 flex gap-6 text-xs text-nexus-muted">
                            <div class="flex items-center"><i data-lucide="truck" class="w-4 h-4 mr-2"></i> Frete Grátis Express</div>
                            <div class="flex items-center"><i data-lucide="shield-check" class="w-4 h-4 mr-2"></i> 1 Ano Garantia</div>
                        </div>
                    </div>
                </div>
            `;
            app.dom.content.innerHTML = html;
            lucide.createIcons();
            window.scrollTo(0,0);
        },

        renderCheckout: function() {
            if(window.store.cart.length === 0) {
                 return app.router.navigate('home');
            }

            const total = window.store.getCartTotal();
            
            let itemsHtml = window.store.cart.map(item => `
                <div class="flex justify-between text-sm mb-3">
                    <span class="text-nexus-muted">${item.quantity}x ${item.name}</span>
                    <span class="font-bold">${app.formatMoney(item.price * item.quantity)}</span>
                </div>
            `).join('');

            const html = `
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-3xl font-bold mb-8">Checkout <span class="text-nexus-primary">Seguro</span></h1>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Formulário -->
                        <div class="bg-nexus-card p-6 sm:p-8 rounded-2xl border border-white/10">
                            <h2 class="text-xl font-bold mb-6 flex items-center"><i data-lucide="credit-card" class="mr-2 text-nexus-secondary"></i> Pagamento Fake</h2>
                            
                            <form id="checkout-form" onsubmit="event.preventDefault(); app.processPayment();">
                                <div class="space-y-5">
                                    <div>
                                        <label class="block text-sm text-nexus-muted mb-2">Nome no Cartão</label>
                                        <input type="text" required class="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 focus:border-nexus-primary focus:outline-none transition-colors" placeholder="João da Silva">
                                    </div>
                                    <div>
                                        <label class="block text-sm text-nexus-muted mb-2">Número do Cartão (Qualquer um)</label>
                                        <input type="text" required class="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 focus:border-nexus-primary focus:outline-none transition-colors" placeholder="**** **** **** ****">
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm text-nexus-muted mb-2">Validade</label>
                                            <input type="text" required class="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 focus:border-nexus-primary" placeholder="12/28">
                                        </div>
                                        <div>
                                            <label class="block text-sm text-nexus-muted mb-2">CVV</label>
                                            <input type="text" required class="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 focus:border-nexus-primary" placeholder="123">
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" id="btn-pay" class="w-full mt-8 bg-nexus-primary hover:bg-nexus-accent text-black font-bold py-4 rounded-xl transition-all flex justify-center items-center shadow-lg hover:shadow-nexus-primary/50 relative overflow-hidden">
                                     <span id="btn-pay-text">Confirmar Pagamento • ${app.formatMoney(total)}</span>
                                     <div id="btn-pay-loader" class="absolute hidden"><div class="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div></div>
                                </button>
                            </form>
                        </div>

                        <!-- Resumo -->
                        <div>
                            <div class="bg-nexus-card p-6 rounded-2xl border border-white/10 sticky top-28">
                                <h2 class="text-xl font-bold mb-6">Resumo da Compra</h2>
                                <div class="mb-6 border-b border-white/10 pb-6">
                                    ${itemsHtml}
                                </div>
                                <div class="flex justify-between items-center mb-2 text-sm text-nexus-muted">
                                    <span>Subtotal</span>
                                    <span>${app.formatMoney(total)}</span>
                                </div>
                                <div class="flex justify-between items-center mb-6 text-sm text-nexus-muted">
                                    <span>Frete</span>
                                    <span class="text-green-400">Grátis</span>
                                </div>
                                <div class="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                                    <span class="text-lg font-bold">Total</span>
                                    <span class="text-2xl font-black text-nexus-primary">${app.formatMoney(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            app.dom.content.innerHTML = html;
            lucide.createIcons();
        },

        renderWishlist: function() {
            if (window.store.wishlist.length === 0) {
                app.dom.content.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-[50vh] text-center">
                        <i data-lucide="heart-crack" class="w-20 h-20 text-nexus-muted mb-6"></i>
                        <h2 class="text-3xl font-bold mb-2">Sua Wishlist está vazia</h2>
                        <p class="text-nexus-muted mb-8">Nenhum produto foi salvo. Explore nosso catálogo!</p>
                        <button onclick="app.router.navigate('home')" class="bg-nexus-card border border-nexus-primary text-white px-8 py-3 rounded-full hover:bg-nexus-primary hover:text-black transition-all">Explorar Produtos</button>
                    </div>
                `;
                lucide.createIcons();
                return;
            }

            let html = `
                <h1 class="text-3xl font-bold mb-8">Lista de <span class="text-nexus-secondary">Desejos</span></h1>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            `;
            
            const wishlistItems = app.products.filter(p => window.store.isInWishlist(p.id));

            wishlistItems.forEach(p => {
                html += `
                     <div class="bg-nexus-card border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center hover:border-nexus-secondary/50 transition-colors">
                        <img src="${p.image}" class="w-32 h-32 object-cover rounded-xl mb-4 bg-black">
                        <h3 class="font-bold text-sm mb-2 line-clamp-1">${p.name}</h3>
                        <p class="text-nexus-primary font-bold mb-4">${app.formatMoney(p.price)}</p>
                        <div class="flex gap-2 w-full mt-auto">
                            <button onclick="app.cart.add(${p.id}); window.store.toggleWishlist(${p.id}); app.views.renderWishlist();" class="flex-1 bg-white/10 hover:bg-nexus-primary hover:text-black font-semibold py-2 rounded-lg transition-colors text-sm">Adicionar</button>
                            <button onclick="window.store.toggleWishlist(${p.id}); app.views.renderWishlist();" class="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                                <i data-lucide="trash" class="w-4 h-4"></i>
                            </button>
                        </div>
                     </div>
                `;
            });

            html += `</div>`;
            app.dom.content.innerHTML = html;
            lucide.createIcons();
        }
    },

    // Ação Real de Checkout Fake
    processPayment: async function() {
        const btnText = document.getElementById('btn-pay-text');
        const btnLoader = document.getElementById('btn-pay-loader');
        
        btnText.classList.add('opacity-0');
        btnLoader.classList.remove('hidden');

        try {
            const response = await window.NexusAPI.simulateCheckout();
            if (response.success) {
                window.store.clearCart();
                this.showToast('Pagamento Concluído com Sucesso!', 'success');
                
                // Mostrar UI de sucesso
                this.dom.content.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-[60vh] text-center animate-pulse">
                        <i data-lucide="check-circle-2" class="w-24 h-24 text-green-400 mb-6 drop-shadow-[0_0_15px_rgba(7ade80,0.5)]"></i>
                        <h1 class="text-4xl font-black mb-4">Pedido Confirmado!</h1>
                        <p class="text-nexus-muted text-lg mb-8">Número do seu pedido: <strong class="text-white">${response.orderId}</strong></p>
                        <button onclick="app.router.navigate('home')" class="bg-nexus-card border border-white/10 hover:border-nexus-primary text-white px-8 py-3 rounded-xl transition-all">Voltar ao Início</button>
                    </div>
                `;
                lucide.createIcons();
            }
        } catch (error) {
             btnText.classList.remove('opacity-0');
             btnLoader.classList.add('hidden');
             this.showToast('Erro no pagamento. Tente novamente.', 'error');
        }
    }
};

// Initializar assim que possível
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
