// Resize Panels functionality
// Copyright (c) 2026 Hoa Quang Thang - Chuyên Nguyễn Tất Thành, Lào Cai

export function initResizePanels() {
    const sidebar = document.getElementById('control-panel');
    const resizeSidebar = document.getElementById('resize-sidebar');
    const problemPanel = document.getElementById('problem-panel');
    const editorPanel = document.getElementById('editor-panel');
    const resizePanels = document.getElementById('resize-panels');
    const contentArea = document.getElementById('content-area');

    // Min/max widths
    const MIN_SIDEBAR_WIDTH = 200;
    const MAX_SIDEBAR_WIDTH = 400;
    const MIN_PANEL_WIDTH = 300;

    // Sidebar Resize
    if (resizeSidebar && sidebar) {
        let isResizing = false;
        let startX, startWidth;

        resizeSidebar.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = sidebar.offsetWidth;
            document.body.classList.add('resizing');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const delta = e.clientX - startX;
            let newWidth = startWidth + delta;

            // Clamp width
            newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, newWidth));

            sidebar.style.width = `${newWidth}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.classList.remove('resizing');
                // Save to localStorage
                localStorage.setItem('sidebarWidth', sidebar.offsetWidth);
            }
        });

        // Restore from localStorage
        const savedWidth = localStorage.getItem('sidebarWidth');
        if (savedWidth) {
            sidebar.style.width = `${savedWidth}px`;
        }
    }

    // Problem/Editor Resize
    if (resizePanels && problemPanel && editorPanel && contentArea) {
        let isResizing = false;
        let startX, startProblemWidth;

        resizePanels.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startProblemWidth = problemPanel.offsetWidth;
            document.body.classList.add('resizing');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const delta = e.clientX - startX;
            const contentWidth = contentArea.offsetWidth - resizePanels.offsetWidth;
            let newProblemWidth = startProblemWidth + delta;

            // Clamp width
            const minWidth = MIN_PANEL_WIDTH;
            const maxWidth = contentWidth - MIN_PANEL_WIDTH;
            newProblemWidth = Math.max(minWidth, Math.min(maxWidth, newProblemWidth));

            // Calculate percentages
            const problemPercent = (newProblemWidth / contentWidth) * 100;
            const editorPercent = 100 - problemPercent;

            problemPanel.style.flex = `0 0 ${problemPercent}%`;
            editorPanel.style.flex = `0 0 ${editorPercent}%`;
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.classList.remove('resizing');
                // Save to localStorage
                localStorage.setItem('problemPanelFlex', problemPanel.style.flex);
                localStorage.setItem('editorPanelFlex', editorPanel.style.flex);
            }
        });

        // Restore from localStorage
        const savedProblemFlex = localStorage.getItem('problemPanelFlex');
        const savedEditorFlex = localStorage.getItem('editorPanelFlex');
        if (savedProblemFlex && savedEditorFlex) {
            problemPanel.style.flex = savedProblemFlex;
            editorPanel.style.flex = savedEditorFlex;
        }
    }

    // Double-click to reset
    if (resizeSidebar) {
        resizeSidebar.addEventListener('dblclick', () => {
            sidebar.style.width = '256px'; // 16rem = w-64
            localStorage.removeItem('sidebarWidth');
        });
    }

    if (resizePanels) {
        resizePanels.addEventListener('dblclick', () => {
            problemPanel.style.flex = '1';
            editorPanel.style.flex = '1';
            localStorage.removeItem('problemPanelFlex');
            localStorage.removeItem('editorPanelFlex');
        });
    }
}
