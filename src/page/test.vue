<template>
    <div class="scaleProgress">
        <el-progress :text-inside="true" :stroke-width="30" :percentage="progressNum"></el-progress>
    </div>
</template>
 
<script>
    export default {
        data() {
            return {
                progressNum: 0,
                startTimer: '',
                endTimer: ''
            }
        },
        props: {
            progressStatus: {
                type: Boolean,
                default() {
                    return false
                }
            }
        },
        watch: {
            progressStatus (val) {
                if (val) {
                    this.endProgress()
                }
            }
        },
        methods: {
            startProgress () {
                this.startTimer = setInterval(() => {
                    this.progressNum ++
                    if (this.progressNum >=100) {
                        this.progressNum=0;
                        setTimeout(() => {
                            console.log('等待。。。')
                        }, 1000);
                    }
                }, 100); 
            },
            endProgress () {
                clearInterval(this.startTimer)
                this.endTimer = setInterval(() => {
                    this.progressNum ++
                    if (this.progressNum > 99) {
                        clearInterval(this.endTimer)
                        this.finishProgress()
                    }
                }, 10);
            },
            finishProgress () {
                this.$emit('finishProgress', false)
            }
        },
        mounted() {
            this.startProgress()
        }
    }
    // 使用示例
    // import sProgress from 'components/common/SProgress'
    // <s-progress @finishProgress="closeProgress" v-if="showProgress" :progressStatus="progressStatus"></s-progress>                     
    // closeProgress (val) {
    //     this.showProgress = val
    //     this.progressStatus = val
    // },
    // save () {
    //     this.showProgress = true
    //     setTimeout(() => {
    //         this.progressStatus = true
    //     }, 3000)
    // },
</script>
<style scoped>
.scaleProgress {
    transform: scaleY(0.75);
}
</style>