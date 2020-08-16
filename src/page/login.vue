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
        <el-button type="primary" class="submit-btn" @click="userLogin('loginForm')">登录</el-button>
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
    };
  },
  created() {},
  mounted() {
    this.imgCapthcha="data:image/jpg;base64,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";
      //this.getImgCapthcha();
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
      let params = {
        imgIndex: "" + this.imgIndex,
      };
      let { data, error } = await api.checkCapthcha(params);
      if (error) {
        console.log(error);
        Msg.errorMsg("验证码校验失败", this);
      } else {
        if (data.code === 200) {
          Msg.successMsg("验证码校验通过", this);
        }else{
          Msg.successMsg("验证码校验失败", this);
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
