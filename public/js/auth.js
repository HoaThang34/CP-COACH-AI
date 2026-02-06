// Copyright (c) 2026 Hoa Quang Thang - Chuyên Nguyễn Tất Thành, Lào Cai

import { API } from './api.js';
import { state } from './state.js';

export class AuthManager {
    constructor() {
        this.modal = document.getElementById('auth-modal');
        this.form = document.getElementById('auth-form');
        this.titleEl = document.getElementById('auth-modal-title');
        this.submitBtn = document.getElementById('auth-submit');
        this.toggleBtn = document.getElementById('auth-toggle');
        this.closeBtn = document.getElementById('auth-close');
        this.errorEl = document.getElementById('auth-error');
        this.usernameInput = document.getElementById('auth-username');
        this.passwordInput = document.getElementById('auth-password');

        this.isLoginMode = true;

        this.init();
    }

    init() {
        // Check auth status on load
        this.checkAuthStatus();

        // Event listeners
        document.getElementById('btn-login')?.addEventListener('click', () => this.showModal());
        document.getElementById('btn-logout')?.addEventListener('click', () => this.logout());
        this.closeBtn.addEventListener('click', () => this.hideModal());
        this.toggleBtn.addEventListener('click', () => this.toggleMode());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hideModal();
        });
    }

    async checkAuthStatus() {
        try {
            const result = await API.checkAuth();
            if (result.authenticated) {
                this.setUser(result);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }

    showModal() {
        this.modal.classList.remove('hidden');
        this.clearError();
        this.usernameInput.value = '';
        this.passwordInput.value = '';
        this.usernameInput.focus();
    }

    hideModal() {
        this.modal.classList.add('hidden');
    }

    toggleMode() {
        this.isLoginMode = !this.isLoginMode;
        if (this.isLoginMode) {
            this.titleEl.textContent = 'Đăng nhập';
            this.submitBtn.textContent = 'Đăng nhập';
            this.toggleBtn.innerHTML = 'Chưa có tài khoản? <span class="text-primary font-medium">Đăng ký ngay</span>';
        } else {
            this.titleEl.textContent = 'Đăng ký tài khoản';
            this.submitBtn.textContent = 'Đăng ký';
            this.toggleBtn.innerHTML = 'Đã có tài khoản? <span class="text-primary font-medium">Đăng nhập</span>';
        }
        this.clearError();
    }

    async handleSubmit(e) {
        e.preventDefault();

        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        if (!username || !password) {
            this.showError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Đang xử lý...';

        try {
            const result = this.isLoginMode
                ? await API.login(username, password)
                : await API.register(username, password);

            if (result.success) {
                this.setUser(result);
                this.hideModal();
            } else {
                this.showError(result.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            this.showError('Lỗi kết nối. Vui lòng thử lại.');
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = this.isLoginMode ? 'Đăng nhập' : 'Đăng ký';
        }
    }

    async logout() {
        try {
            await API.logout();
            this.clearUser();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    setUser(userData) {
        state.currentUser = {
            user_id: userData.user_id,
            username: userData.username
        };

        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('user-info').classList.add('flex');
        document.getElementById('username-display').textContent = userData.username;
        document.getElementById('btn-login').classList.add('hidden');

        // Trigger history reload
        window.dispatchEvent(new CustomEvent('auth-changed'));
    }

    clearUser() {
        state.currentUser = null;
        state.history = [];

        document.getElementById('user-info').classList.add('hidden');
        document.getElementById('user-info').classList.remove('flex');
        document.getElementById('btn-login').classList.remove('hidden');

        // Trigger UI update
        window.dispatchEvent(new CustomEvent('auth-changed'));
    }

    showError(message) {
        this.errorEl.textContent = message;
        this.errorEl.classList.remove('hidden');
    }

    clearError() {
        this.errorEl.classList.add('hidden');
    }
}
