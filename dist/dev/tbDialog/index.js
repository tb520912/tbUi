(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tbDialog = factory());
})(this, (function () { 'use strict';

    /**
     * 弹框组件
     * @class TbDialog
     * @file tbDialog
     * @exports TbDialog
     * @requires 
     * @example
     */
    /**
     * 参数说明
     * @property {String} title 弹框标题
     * @property {String | HTMLElement | DocumentFragment} content 弹框内容 可以是字符串、dom节点、文档碎片
     * @property {String} confirmText 确认按钮文字
     * @property {String} cancelText 取消按钮文字
     * @property {Boolean} showCancel 是否显示取消按钮
     * @property {Boolean} showConfirm 是否显示确认按钮
     * @property {Boolean} showClose 是否显示关闭按钮
     * @property {Boolean} showMask 是否显示遮罩层
     * @property {Boolean} maskClosable 点击遮罩层是否关闭弹框
     * @property {Boolean} showTitle 是否显示标题
     * @property {Function} onConfirm 点击确认按钮回调函数
     * @property {Function} onCancel 点击取消按钮回调函数
     */
    const defaultOptions = {
        title: '提示',
        content: '',
        confirmText: '确定',
        cancelText: '取消',
        showCancel: true,
        showConfirm: true,
        showClose: false,
        showMask: true,
        maskClosable: true,
        showTitle: true
    };

    class TbDialog {
        constructor (options) {
            // 合并配置项
            this.options = Object.assign({}, defaultOptions, options);
            // 创建弹框
            this.createDialog();
        }
        // 创建弹框
        createDialog () {
            // 创建弹框
            this.dialog = document.createElement('div');
            // 设置弹框样式
            this.dialog.className = 'tb-dialog';
            // 创建弹框头部
            this.createHeader();
            // 创建弹框内容
            this.createContent();
            // 创建弹框底部
            this.createFooter();
            // 创建遮罩层
            this.createMask();
            // 将弹框添加到页面
            document.body.appendChild(this.dialog);
            this.show();
        }
        // 创建弹框头部
        createHeader () {
            // 创建头部
            this.header = document.createElement('div');
            // 设置头部样式
            this.header.className = 'tb-dialog-header';
            // 判断有无标题
            if (this.options.showTitle) {
                this.header.innerHTML = this.options.title;
            }
            // 判断有无关闭按钮
            if (this.options.showClose) {
                // 创建关闭按钮
                this.closeBtn = document.createElement('span');
                this.closeBtn.className = 'tb-dialog-close';
                this.closeBtn.innerHTML = '&times;';
                // 绑定点击事件
                this.closeBtn.addEventListener('click', () => {
                    this.hide();
                });
                // 将关闭按钮添加到头部
                this.header.appendChild(this.closeBtn);
            }
            
            if (this.options.showClose || this.options.showTitle) {
                // 将头部添加到弹框
                this.dialog.appendChild(this.header);
            }
        }
        // 创建弹框内容
        createContent () {
            // 创建内容
            this.content = document.createElement('div');
            this.content.className = 'tb-dialog-content';
            // 判断内容类型
            if (typeof this.options.content === 'string') {
                // 判断是否为id
                if (this.options.content.indexOf('#') === 0) {
                    // 获取内容
                    this.content.innerHTML = document.querySelector(this.options.content).innerHTML;
                } else {
                    this.content.innerHTML = this.options.content;
                }
            } else if (this.options.content instanceof HTMLElement || this.options.content instanceof DocumentFragment) {
                this.content.appendChild(this.options.content);
            } else {
                throw new Error('content参数类型错误, 请传入字符串或者dom节点')
            }
            // 将内容添加到弹框
            this.dialog.appendChild(this.content);
        }
        // 创建弹框底部
        createFooter () {
            // 创建底部
            this.footer = document.createElement('div');
            this.footer.className = 'tb-dialog-footer';
            // 判断是否显示取消按钮
            if (this.options.showCancel) {
                // 创建取消按钮
                this.cancelBtn = document.createElement('button');
                this.cancelBtn.className = 'tb-dialog-cancel';
                this.cancelBtn.innerHTML = this.options.cancelText;
                // 绑定点击事件
                this.cancelBtn.addEventListener('click', () => {
                    this.close();
                    // 判断是否有取消回调函数
                    if (typeof this.options.onCancel === 'function') {
                        this.options.onCancel();
                    }
                });
                // 将取消按钮添加到底部
                this.footer.appendChild(this.cancelBtn);
            }
            // 判断是否显示确认按钮
            if (this.options.showConfirm) {
                // 创建确认按钮
                this.confirmBtn = document.createElement('button');
                this.confirmBtn.className = 'tb-dialog-confirm';
                this.confirmBtn.innerHTML = this.options.confirmText;
                // 绑定点击事件
                this.confirmBtn.addEventListener('click', () => {
                    this.close();
                    // 判断是否有确认回调函数
                    if (typeof this.options.onConfirm === 'function') {
                        this.options.onConfirm();
                    }
                });
                // 将确认按钮添加到底部
                this.footer.appendChild(this.confirmBtn);
            }
            if (this.options.showCancel || this.options.showConfirm) {
                // 将底部添加到弹框
                this.dialog.appendChild(this.footer);
            }
        }
        // 创建遮罩层
        createMask () {
            // 判断是否显示遮罩层
            if (this.options.showMask) {
                // 创建遮罩层
                this.mask = document.createElement('div');
                // 设置遮罩层样式
                this.mask.className = 'tb-mask';
                // 判断点击遮罩层是否关闭弹框
                if (this.options.maskClosable) {
                    // 绑定点击事件
                    this.mask.addEventListener('click', () => {
                        this.close();
                    });
                }
                // 将遮罩层添加到页面
                document.body.appendChild(this.mask);
            }
        }
        // 显示弹框
        show () {
            // 判断是否显示遮罩层
            if (this.options.showMask) {
                this.mask.style.transform = 'translateY(-100vh)';
                this.mask.style.transform = 'opacity(1)';
            }
            this.dialog.style.display = 'block';
            this.dialog.style.transform = 'translate(-50%, -50%) scale(1)';
            this.dialog.style.opacity = 1;
        }
        // 隐藏弹框
        close () {
            this.dialog.style.transform = 'translate(-50%, -50%) scale(0.7)';
            this.dialog.style.opacity = 0;
            this.mask.style.opacity = 0;
            // 过渡完成后执行隐藏mask
            this.dialog.addEventListener('transitionend', () => {
                // 判断是否显示遮罩层
                this.dialog.style.display = 'none';
                this.mask.style.transform = 'translateY(100vh)';
                // 删除元素
                this.dialog.remove();
                this.mask.remove();
            }, {
                once: true
            });
        }
    }

    return TbDialog;

}));
