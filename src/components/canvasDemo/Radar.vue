<template>
    <div ref="radarContainer" class="radar-container">
        <div class="circle">3.7</div>
        <img :src="source" class="radar-canvas" />
    </div>
</template>

<script>
export default {
    name: 'radar-demo',
    data() {
        return {
            data: [
                { label: 'self-control', type: 1, percent: 5 },
                { label: 'social engagement', type: 2, percent: 5 },
                { label: 'innovation', type: 3, percent: 5 },
                { label: 'emotional resilience', type: 4, percent: 5 },
                { label: 'cooperation', type: 5, percent: 5 }
            ],
            ctx: null,
            source: '',
            circlePoint: {} // 记录圆上的点
        }
    },
    mounted() {
        this.$nextTick(() => {
            const step = this.data.length // 五个点，设置绘制次数
            const w = 304 // 取决于在设计稿中的真实宽度
            const ratio = 1
            const canvas = document.createElement('CANVAS')
            this.ctx = canvas.getContext('2d') // 实例化2dcanvas

            canvas.width = w * ratio // 必须给画布设置width height，否则坐标系比例不正确
            canvas.height = w * ratio

            canvas.style.width = w + 'px'
            canvas.style.height = w + 'px'
            // 值得注意的是canvas.style.width 与 canvas.width的关系相当于显示器宽度与显示器分辨率的关系
            this.ctx.scale(ratio, ratio)
            // ratio与scale的使用为了canvas能渲染更清晰的图像，此处设置了三倍渲染大小
            // 相当于屏幕大小不变，分辨率却扩大三倍
            const radius = Math.floor(w / 2 - 12) //  圆的半径 = w / 2，-12是为了画一个不会占满画布的小圆
            this.drawRadar({ step, radius, canvas })
        })
    },
    methods: {
        drawRadar(option) {
            console.log('drawRadar', option);
            this.radarBG(option)
            // this.radarBone(option)
            // this.radarPoint()
            this.radarLine()
            this.source = option.canvas.toDataURL('image/png', 0.3) // 将canvas的内容转化为图像
        },
        radarBG({ step, radius }) {
            // 不使圆紧贴在画布边缘，使圆心偏移12像素，以offset值绘制大圆
            const offset = radius + 12
            // 遍历6次而不是5次，是为了留最外一层做label的绘制
            for (let s = 6; s > 0; s--) {
                this.ctx.beginPath() // 表示开始绘制
                // this.ctx.lineWidth = 1 // 线条粗细
                this.ctx.lineWidth = 0 // 线条粗细
                this.ctx.setLineDash([1, 2]) // 虚线
                for (let i = 0; i < step; i++) {
                    const rad = ((2 * Math.PI) / step) * i // 弧度
                    const x = offset + Math.sin(rad) * radius * (s / 6)
                    const y = offset - Math.cos(rad) * radius * (s / 6)
                    if (s === 6) {
                        // this.radarLabel(i, x, y) // 绘制标签
                    } else {
                        if (s === 5) {
                            // === 5 时为雷达图最外层的时候，只需在此时记录一次内部的点
                            // 此处计算处于伞骨上的点坐标
                            const { type, percent } = this.data[i]
                            const percentX =
                                offset +
                                Math.sin(rad) *
                                (radius * (percent / 5)) *
                                (s / 6)
                            const percentY =
                                offset -
                                Math.cos(rad) *
                                (radius * (percent / 5)) *
                                (s / 6)
                            this.circlePoint[type] = {
                                x: percentX,
                                y: percentY
                            }
                        }
                        this.ctx.lineTo(x, y) // 绘制线条
                    }
                }
                this.ctx.closePath() // 闭合线条
                // this.ctx.strokeStyle = `black` // 线条样式-颜色设置
                // this.ctx.stroke() // 线条样式-绘制
            }
        },
        radarLabel(i, x, y) {
            const text = this.data[i].label
            this.ctx.font = `normal normal 300 14px PingFangSC-Regular`
            this.ctx.fillStyle = 'black'
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = 'top'
            this.ctx.fillText(text, x, y)
        },
        radarBone({ step, radius }) {
            const offset = radius + 12
            for (let s = 6; s > 4; s--) {
                if (s === 5) {
                    this.ctx.beginPath() // 表示开始绘制
                    this.ctx.lineWidth = 1 // 线条粗细
                    this.ctx.setLineDash([1, 2]) // 虚线
                    for (let i = 0; i < step; i++) {
                        const rad = ((2 * Math.PI) / step) * i // 弧度
                        const x = offset + Math.sin(rad) * radius * (s / 6)
                        const y = offset - Math.cos(rad) * radius * (s / 6)
                        this.ctx.moveTo(offset, offset)
                        this.ctx.lineTo(x, y)
                    }
                }
                this.ctx.strokeStyle = `black` // 线条样式-颜色设置
                this.ctx.stroke() // 线条样式-绘制
            }
        },
        radarPoint() {
            for (const item of this.data) {
                const { type } = item
                const { x, y } = this.circlePoint[type]
                this.ctx.beginPath() // 表示开始绘制
                this.ctx.arc(x, y, 1.2, 0, 2 * Math.PI)
                this.ctx.fillStyle = 'red'
                this.ctx.fill()
                this.ctx.closePath()
            }
        },
        radarLine() {
            this.ctx.beginPath() // 表示开始绘制
            for (const item of this.data) {
                const { type } = item
                const { x, y } = this.circlePoint[type]
                this.ctx.lineTo(x, y) // 绘制线条
            }
            this.ctx.closePath() // 闭合
            this.ctx.fillStyle = 'RGBA(255, 255, 255, 0.7)'
            this.ctx.fill()
        }
    },
}
</script>

<style lang="scss" scoped>
.radar-container {
    width: 288px;
    height: 288px;
    position: relative;
    overflow: hidden;
    background: url('../../assets/onboarding_pie_en@2x.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.circle {
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 2;
    background: #F9FBFF;
    border-radius: 50%;
    font-weight: 900;
    font-size: 26px;
    line-height: 70px;
    text-align: center;
    color: #000341;
}

.radar-canvas {
    height: 304px;
    width: 304px;
    left: -6px;
    top: -7px;
    position: absolute;
    transform: rotate(-36deg);
}
</style>