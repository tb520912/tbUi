(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tbPopup = factory());
})(this, (function () { 'use strict';

    // 弹框组件
    // 接收配置项
    const defaultOptions = {
        title: {
            text: '标题',
            textAlign: 'center',
        },
        width: '100vw',
        height: '30vh',
        content: document.createTextNode('内容'),
        footer: null,
        mask: true,
        leftBtn: {
            text: '取消',
            callback: null
        },
        rightBtn: {
            text: '确定',
            callback: null
        },
    };
    /**
     * {
     *   title: {
     *    text: String, // 标题文本
     *    style: Object // 标题样式
     * }
     * }
     */
    // 1. title: 抽屉标题
    // 2. width: 抽屉宽度
    // 3. height: 抽屉高度
    // 4. content: 抽屉内容 节点或字符串 如果是字符串 默认获取该id的节点下的内容
    // 5. footer: 抽屉底部按钮 默认无
    class TbPopup {
        constructor(options) {
            // 合并配置项
            this.options = Object.assign({}, defaultOptions, options);
            // 创建抽屉
            this.createPopup();
        }
        // 创建抽屉
        createPopup() {
            // 创建抽屉
            this.popup = document.createElement('div');
            // 设置抽屉样式
            this.popup.className = 'tb-popup';
            this.popup.style.width = this.options.width;
            this.popup.style.minHeight = this.options.height;
            // 创建抽屉标题
            this.createTitle();
            // 创建抽屉内容
            this.createContent();
            // 创建遮罩层
            this.createMask();
            // 将抽屉添加到页面
            document.body.appendChild(this.popup);
        }
        // 创建抽屉头部
        createTitle() {
            // 创建头部
            this.header = document.createElement('div');
            this.header.className = 'tb-popup-header';
            this.title = document.createElement('div');
            // 设置头部样式
            this.title.className = 'tb-popup-title';
            // 判断有无两侧按钮
            if (this.options.leftBtn ) {
                this.title.className += ' tb-popup-title-has-left-btn';
                // 创建左侧按钮
                this.leftBtn = document.createElement('div');
                // 设置左侧按钮样式
                this.leftBtn.className = 'tb-popup-left-btn';
                // 设置左侧按钮文本
                this.leftBtn.textContent = this.options.leftBtn.text;
                // 事件监听
                this.leftBtn.addEventListener('click', () => {
                    this.options.leftBtn.callback ? this.options.leftBtn.callback() : this.close();
                });
                // 将左侧按钮添加到头部中
                this.title.appendChild(this.leftBtn);
            }
            // 设置标题
            const titleText = document.createElement('div');
            titleText.className = 'tb-popup-title-text';
            // 设置标题文本居中
            titleText.style.textAlign = this.options.title.textAlign;
            // 设置标题文本
            titleText.textContent = this.options.title.text;
            // 将标题文本添加到标题中
            this.title.appendChild(titleText);
            if (this.options.rightBtn) {
                this.title.className += ' tb-popup-title-has-right-btn';
                // 创建右侧按钮
                this.rightBtn = document.createElement('div');
                // 设置右侧按钮样式
                this.rightBtn.className = 'tb-popup-right-btn';
                // 设置右侧按钮文本
                this.rightBtn.textContent = this.options.rightBtn.text;
                // 将右侧按钮添加到头部中
                this.title.appendChild(this.rightBtn);
            }
            // 如果两侧存在一个或两个按钮 并且设置标题文字居中 则标题两侧都预留padding
            if (this.options.title.titleAlign === 'center' && (this.options.leftBtn || this.options.rightBtn)) {
                this.title.className = 'tb-popup-title tb-popup-title-has-right-btn tb-popup-title-has-left-btn';
            }
            // 设置标题文本
            this.header.appendChild(this.title);
            // 将头部添加到抽屉中
            this.popup.appendChild(this.header);
        }
        // 创建抽屉内容
        createContent() {
            // 创建内容
            this.content = document.createElement('div');
            // 设置内容样式
            this.content.className = 'tb-popup-content';
            // 如果内容是字符串 则获取该id的节点下的内容
            if (typeof this.options.content === 'string') {
                const doms = document.getElementById(this.options.content).childNodes;
                const domFragment = document.createDocumentFragment();
                if (doms.length > 0) {
                    doms.forEach(dom => {
                        domFragment.appendChild(dom.cloneNode(true));
                    });
                }
                this.content.appendChild(domFragment);
            } else if (this.options.content instanceof HTMLElement || this.options.content instanceof DocumentFragment) {
                this.content.appendChild(this.options.content);
            } else {
                throw new Error('content参数类型错误, 请传入字符串或者dom节点')
            }
            // 将内容添加到抽屉中
            this.popup.appendChild(this.content);
        }
        // 创建遮罩层
        createMask() {
            // 创建遮罩层
            this.mask = document.createElement('div');
            // 设置遮罩层样式
            this.mask.style.width = '100vw';
            this.mask.style.height = '100vh';
            this.mask.style.backgroundColor = 'rgba(0,0,0,.5)';
            this.mask.style.position = 'fixed';
            this.mask.style.left = 0;
            this.mask.style.bottom = '-100vh';
            this.mask.style.zIndex = 999;
            // 设置遮罩层过渡效果 颜色过渡时间为.3s
            this.mask.style.transition = 'opacity .3s';

            // 事件监听，如果点击遮罩层 则关闭抽屉 
            this.mask.addEventListener('click', () => {
                this.close();
            });
            // 将遮罩层添加到页面中
            document.body.appendChild(this.mask);
        }
        // 创建关闭按钮
        createClose() {
            // 创建关闭按钮
            this.close = document.createElement('div');
            // 设置关闭按钮样式
            this.close.className = 'tb-popup-close';
            // 设置关闭按钮文本
            this.close.textContent = 'X';
            // 事件监听
            this.close.addEventListener('click', () => {
                this.close();
            });
            // 将关闭按钮添加到抽屉中
            this.popup.appendChild(this.close);
        }
        show () {
            this.mask.style.opacity = 1;
            this.popup.style.bottom = 0;
            this.mask.style.transform = 'translateY(-100vh)';
        }
        close () {
            this.popup.style.bottom = '-100%';
            this.mask.style.opacity = 0;
            // 过渡结束后隐藏mask
            this.popup.addEventListener('transitionend', () => {
            this.mask.style.transform = 'translateY(100vh)';
            }, {
                once: true
            });
        }
    }

    return TbPopup;

}));
