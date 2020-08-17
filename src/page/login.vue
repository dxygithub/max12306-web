<template>
  <div>
    <div class="background">
      <img src="../assets/image/080538219e14a50979b3fadafce70d22.jpg" />
    </div>
    <h1 class="head-title">Max</h1>
    <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
      <el-form-item label="用户名" prop="userName" class="item-label">
        <el-input
          v-model="loginForm.userName"
          size="small"
          @keyup.enter.native="userLogin('loginForm')"
          clearable
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          size="small"
          @keyup.enter.native="userLogin('loginForm')"
          clearable
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <!-- <el-form-item label="JSESSIONID" prop="JSESSIONID">
        <el-input
          v-model="loginForm.JSESSIONID"
          size="small"
          @keyup.enter.native="userLogin('loginForm')"
          clearable
        />
      </el-form-item>
      <el-form-item label="RAIL_EXPIRATION" prop="RAIL_EXPIRATION">
        <el-input
          v-model="loginForm.RAIL_EXPIRATION"
          size="small"
          @keyup.enter.native="userLogin('loginForm')"
          clearable
        />
      </el-form-item>
      <el-form-item label="RAIL_DEVICEID" prop="RAIL_DEVICEID">
        <el-input
          v-model="loginForm.RAIL_DEVICEID"
          size="small"
          @keyup.enter.native="userLogin('loginForm')"
          clearable
        />
      </el-form-item>-->
      <el-form-item>
        <div>
          <img :src="imgCapthcha" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-checkbox-group v-model="imgIndex">
          <el-checkbox class="checkbox-color" label="1" key="1">1</el-checkbox>
          <el-checkbox class="checkbox-color" label="2" key="2">2</el-checkbox>
          <el-checkbox class="checkbox-color" label="3" key="3">3</el-checkbox>
          <el-checkbox class="checkbox-color" label="4" key="4">4</el-checkbox>
          <el-checkbox class="checkbox-color" label="5" key="5">5</el-checkbox>
          <el-checkbox class="checkbox-color" label="6" key="6">6</el-checkbox>
          <el-checkbox class="checkbox-color" label="7" key="7">7</el-checkbox>
          <el-checkbox class="checkbox-color" label="8" key="8">8</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  class="submit-btn" @click="userLogin('loginForm')">登录</el-button>
        <!-- <el-button type="primary"  @click="checkImgCapthcha">校验验证码</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from "../request/api";
import QS from "qs";
import Msg from "../assets/js/common";

export default {
  name: "login",
  data() {
    return {
      loginForm: {
        userName: "",
        password: "",
        JSESSIONID: "",
        RAIL_EXPIRATION: "",
        RAIL_DEVICEID: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        password: { required: true, message: "请输入密码", trigger: "blur" },
      },
      imgIndex: [],
      imgCapthcha: "",
      jqueryCallBack:""
    };
  },
  created() {},
  mounted() {
      this.getImgCapthcha();
  },
  methods: {
    userLogin(formName) {
      this.$refs[formName].validate((flag) => {
        if (flag) {
          let param = this.loginForm;
          if (param.userName === "admin" && param.password === "123456") {
            // this.$message({
            //   message: "登录成功",
            //   type: "success",
            // });
            //this.$router.push({ name: "home" });
            this.checkImgCapthcha();
          } else {
            this.$message.error("用户名或密码错误!");
          }
        } else {
          console.log("请输入用户名和密码!");
          return false;
        }
      });
    },
    // 校验图片验证码
    async checkImgCapthcha() {
      let tempArr=this.jqueryCallBack.split("_");
      let params = {
        imgIndex: "" + this.imgIndex,
        timer:tempArr[1]
      };
      let { data, error } = await api.checkCapthcha(params);
      if (error) {
        console.log(error);
        Msg.errorMsg("验证码校验失败", this);
      } else {
        if (data.code === 200 && data.data=="4") {
          Msg.successMsg("验证码校验通过", this);
          this.$router.push({ name: "home" });
        }else{
          Msg.errorMsg(data.message,this);
        }
      }
    },
    // 获取图片验证码
    async getImgCapthcha() {
      let params = {};
      let { data, error } = await api.getImgCapthcha(params);
      if (error) {
        console.log(error);
        Msg.errorMsg("获取验证码失败", this);
      } else {
        this.jqueryCallBack=data.data[0];
        this.imgCapthcha = "data:image/jpg;base64," + data.data[1];
        Msg.successMsg("验证码加载成功", this);
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
</style>
