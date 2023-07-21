// Toast

// --------------------------------------------------
/**
 * @namespace tbToast
 * 通过函数调用的方式，弹出一个提示框
 */
/**
 * @method tbToast
 * @param {Object} options
 */
/**
 * @param {String} options.content 吐司内容 required
 * @param {Number} options.duration 吐司持续时间
 * @param {String} options.position 吐司位置 center | top | bottom
 */
const defaultOptions = {
    // 吐司内容
    // 吐司持续时间
    duration: 2000,
    // 吐司位置
    position: 'center'
}
import './index.less'
export default function tbToast (options) {
    if (options.content === undefined) {
        throw new Error('tbToast: options is required')
    }
    if (typeof options.content !== 'string') {
        throw new Error('tbToast: options.content must be a string')
    }
    // 合并配置项
    options = Object.assign({}, defaultOptions, options)
    // 创建吐司
    const toast = document.createElement('div')
    // 设置吐司样式
    toast.className = 'tb-toast'
    // 设置吐司内容
    toast.innerHTML = options.content
    // 设置吐司位置
    toast.style.position = 'fixed'
    toast.style.left = '50%'
    toast.style.top = `${ options.position === 'top' ? '20px' : options.position === 'bottom' ? '80' : '50%' }`
    toast.style.transform = `translateX(-50%)${ options.position === 'center' ? ' translateY(-50%)' : '' }`
    toast.style.transition = `opacity ${ options.duration / 1000 }s`
    // 将吐司添加到页面
    document.body.appendChild(toast)
    // 设置吐司透明度为1
    toast.style.opacity = 1
    // 设置吐司消失
    setTimeout(() => {
        toast.style.opacity = 0
        // 移除吐司
        toast.addEventListener('transitionend', () => {
            document.body.removeChild(toast)
        })
    }, options.duration)
}