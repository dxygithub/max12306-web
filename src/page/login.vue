<template>
  <div>
    <div class="background">
      <img src="../assets/image/080538219e14a50979b3fadafce70d22.jpg" />
    </div>
    <h1 class="head-title">12306 - Max</h1>
    <el-form :model="loginForm"
             :rules="rules"
             ref="loginForm"
             class="login-form">
      <el-form-item label="用户名"
                    prop="userName"
                    class="item-label">
        <el-input v-model="loginForm.userName"
                  size="small"
                  @keyup.enter.native="loginSubmit('loginForm')"
                  clearable
                  placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码"
                    prop="password">
        <el-input v-model="loginForm.password"
                  size="small"
                  @keyup.enter.native="loginSubmit('loginForm')"
                  clearable
                  show-password
                  placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <!--图片验证码-->
        <div class="wrap">
          <img :src="imgCapthcha" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   class="submit-btn"
                   @click="loginSubmit('loginForm')">登录</el-button>
        <!-- <el-button type="primary"  @click="checkImgCapthcha">校验验证码</el-button> -->
      </el-form-item>
    </el-form>

    <!--滑块验证内容-->
    <el-dialog title="滑块验证"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               :show-close="false"
               :visible.sync="centerDialogVisible"
               width="30%"
               center>
      <div id="captcha"></div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>
<script>
import api from "../request/api";
import QS from "qs";
// import Msg from "../assets/js/common";
import $ from "jquery";
import SM4 from "../assets/js/SM4";

export default {
  name: "login",
  data () {
    return {
      loginForm: {
        userName: "",
        password: "",
      },
      rules: {
        userName: {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
        password: { required: true, message: "请输入密码", trigger: "blur" },
      },
      imgIndex: [],
      imgCapthcha: "",
      jqueryCallBack: "",
      capthChaPos: [], // 验证码坐标位置
      centerDialogVisible: false,
      appKey: "FFFF0N000000000085DE", // appkey后期可能会变
      scene: "nc_login",
      appId: "otn",
      SM4_key: "tiekeyuankp12306", // 加密字符串
      loadingId: null,
      autoCheck: true, // 图片验证码是否自动识别
    };
  },
  created () { },
  mounted () {
    // 提供jquery使用:_this
    const _this = this;

    this.getImgCapthcha();

    $(".wrap").click(function (e) {
      var radius = 0; //半径
      var offset = $(this).offset();
      var top = parseInt(e.pageY - offset.top - radius);
      var left = parseInt(e.pageX - offset.left - radius);
      $(".wrap").append(
        '<div class="ball" style="top:' +
        top +
        "px;left:" +
        left +
        'px;"></div>'
      );
      //$('.container').html('<div class="ball" style="top:'+top+';left:'+left+'"></div>');
      _this.capthChaPos.push(left + "," + top);
      //console.log("选中的验证码坐标:"+_this.capthChaPos);
    });
  },
  methods: {
    loginSubmit (formName) {
      this.$refs[formName].validate((flag) => {
        if (flag) {
          let param = this.loginForm;
          // 图片验证码校验
          this.checkImgCapthcha();
        } else {
          console.log("请输入用户名和密码!");
          return false;
        }
      });
    },
    // 校验图片验证码
    async checkImgCapthcha () {
      let tempArr = this.jqueryCallBack.split("_");
      let captchaPos = this.capthChaPos;
      if (!this.autoCheck) {
        if (captchaPos.length <= 0) {
          this.$common.errorMsg("请选择对应的验证码!", this);
          return false;
        }
      }

      let params = {
        imgIndex: "" + captchaPos,
        timer: tempArr[1],
      };
      let { data, error } = await api.checkCapthcha(params);
      if (error) {
        console.log(error);
        this.$common.errorMsg("验证码校验失败", this);
      } else {
        if (data.code === 200 && data.data == "4") {
          this.$common.successMsg("验证码校验通过", this);
          // 清空点击标记
          $(".ball").remove();
          // 清空坐标数组
          this.capthChaPos = [];
          // 初始化滑块验证
          this.initSalisPassPort();
        } else {
          this.$common.errorMsg(data.message, this);
          // 清空点击标记
          $(".ball").remove();
          // 清空坐标数组
          this.capthChaPos = [];
          // 重新获取验证码
          this.getImgCapthcha();
        }
      }
    },
    // 获取图片验证码
    async getImgCapthcha () {
      let params = {};
      let { data, error } = await api.getImgCapthcha(params);
      if (error) {
        console.log(error);
        this.$common.errorMsg("获取验证码失败", this);
      } else {
        this.jqueryCallBack = data.data[0];
        this.imgCapthcha = "data:image/jpg;base64," + data.data[1];
        this.$common.successMsg("验证码加载成功", this);
      }
    },
    // 初始化滑块验证
    async initSalisPassPort () {
      let params = {
        appid: "otn",
        username: this.loginForm.userName,
        slideMode: "0",
      };
      let { data, error } = await api.initSlidePassport(params);
      if (error) {
        console.log(error);
        this.$common.errorMsg("初始化滑块验证失败", this);
      } else {
        let nc_token = data.data;
        if (nc_token) {
          this.getSlidePasscode(nc_token);
        } else {
          this.$common.errorMsg("初始化滑块验证失败", this);
        }
      }
    },
    // 调用滑块
    getSlidePasscode (nc_token) {
      this.centerDialogVisible = true;
      // 等待弹出层渲染完毕再进行调用滑块
      this.$nextTick(() => {
        let that = this;
        let nc = NoCaptcha.init({
          renderTo: "#captcha",
          appkey: that.appKey,
          scene: that.scene,
          token: nc_token,
          customWidth: 340,
          trans: { key1: "code0" },
          elementID: ["usernameID"],
          is_Opt: 0,
          language: "zh",
          isEnabled: true,
          timeout: 3000,
          times: 5,
          apimap: {},
          bannerHidden: false,
          initHidden: false,
          callback: function (data) {
            let csessionid = data.csessionid;
            let sig = data.sig;
            if (csessionid && sig) {
              console.log("csessionid:" + csessionid);
              console.log("sig:" + sig);
              that.$common.successMsg("滑块验证通过", that);
              that.centerDialogVisible = false;
            }
            // 统一认证登录 + 滑动验证
            var formData = {};
            formData["sessionId"] = csessionid;
            formData["sig"] = sig;
            formData["ifCheckSlidePasscodeToken"] = nc_token;
            formData["scene"] = that.scene;
            formData["tk"] = ""; // apptk_tmp_control此处暂时为空
            formData["username"] = that.loginForm.userName;
            formData["password"] =
              "@" + SM4.encrypt_ecb(that.loginForm.password, that.SM4_key);
            formData["appid"] = "otn"; // popup_passport_appId
            //that.userPassPortUamtk();
            that.userLogin(formData);
          },
          error: function (s) {
            console.log(s);
          },
        });
        NoCaptcha.setEnabled(true);
        nc.reset(); //请务必确保这里调用一次reset()方法
        NoCaptcha.upLang("zh", {
          LOADING: "加载中...", //加载
          SLIDER_LABEL: "请按住滑块，拖动到最右边，完成登录", //等待滑动
          CHECK_Y: "验证通过", //通过
          ERROR_TITLE: "非常抱歉，这出错了...", //拦截
          CHECK_N: "验证未通过", //准备唤醒二次验证
          OVERLAY_INFORM: "经检测你当前操作环境存在风险，请输入验证码", //二次验证
          TIPS_TITLE: "验证码错误，请重新输入", //验证码输错时的提示
        });
      });
    },
    // 用户登录
    async userLogin (formData) {
      this.loadingId = this.$common.loading("登录中...", this);
      let params = formData;
      let { data, error } = await api.userLogin(params);
      // 关闭遮罩层
      this.loadingId.close();
      if (error) {
        console.log(error);
        this.$common.errorMsg("登录失败", this);
      } else {
        if (data.code === 200 && data.data != "5") {
          console.log("======> 登录成功...");
          // 本地保存用户名和uamtk
          localStorage.setItem("username", this.loginForm.userName);
          localStorage.setItem(this.loginForm.userName + "uamtk", data.data);
          // 登录成功后需要认证
          this.userPassPortUamtk();
          // 登录流程结束，进入home页面
          // this.$router.push({ name: "home" });
        } else {
          this.$common.errorMsg(data.message, this);
          // 重新尝试登录
          // location.reload();
        }
      }
    },
    // 用户认证
    async userPassPortUamtk () {
      let local_uamtk = localStorage.getItem(
        localStorage.getItem("username") + "uamtk"
      );
      let params = {
        appId: this.appId,
        uamtk: local_uamtk,
      };
      let { data, error } = await api.userPassPortUamtk(params);
      if (error) {
        console.log(error);
        this.$common.errorMsg("登录失败", this);
      } else {
        if (data.code === 200 && data.data != "5") {
          console.log("======> 认证成功...");
          // 本地保存apptk
          localStorage.setItem(this.loginForm.userName + "apptk", data.data);
          this.$router.push({ name: "home" });
        } else {
          this.$common.errorMsg(data.message, this);
          // 重新尝试登录
          // location.reload();
        }
      }
    },
  },
};
</script>
<style scoped>
.login-form {
  width: 15%;
  margin: 0 auto;
}
.login-form /deep/ .el-form-item__label {
  color: #ffffff;
}
.submit-btn {
  width: 100%;
}
.background {
  width: 100%;
  height: 100%; /**宽高100%是为了图片铺满屏幕 */
  z-index: -1;
  position: fixed;
  top: 0px; /*这里是设置与顶部的距离*/
  left: 0px; /*这里是设置与左边的距离*/
  bottom: 0px;
  right: 0px;
}
.head-title {
  line-height: 100px;
  margin: 0px;
  color: rgb(131, 132, 145);
  text-align: center;
}
.checkbox-color {
  color: #ffffff;
}
.wrap {
  width: 293px;
  height: 190px;
  background: #ccc;
  position: relative;
}
.wrap /deep/ .ball {
  width: 20px;
  height: 20px;
  background: springgreen;
  border-radius: 50%;
  position: absolute;
}
</style>
