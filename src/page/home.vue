<template>
  <div>
    <el-container>
      <el-header class="top-content" style="height:80px;">
        <el-row :gutter="20" style="margin-top: 6px;">
          <el-col :span="4">
            <div class="top-left">
              <el-button type="primary">我的订单</el-button>
              <el-button type="primary">联系人</el-button>
            </div>
          </el-col>
          <el-col :span="15">
            <div class="top-middle">
              <h1 class="top-title">12306 - Max</h1>
            </div>
          </el-col>
          <el-col :span="5">
            <el-row>
              <el-col :span="8" style="text-align: left;">
                <div style="margin-top:10px;">
                  <label>{{userName}}，你好</label>
                </div>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" style>同步服务器时间</el-button>
              </el-col>
              <el-col :span="3" style="margin-left:40px;">
                <img
                  src="../assets/image/exit.png"
                  width="40"
                  height="40"
                  title="退出"
                  @click="submitLoginOut"
                  class="login-out"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="text-align: left;">
                <div style="margin-top:4px;">
                  <label>
                    当前时间：
                    <span class="time-style">{{currentTime}}</span>
                  </label>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <el-header class="middle-content" style="height:100%;">
        <hr />
        <!-- <h2>中部内容</h2> -->
        <el-row>
          <el-col :span="12">
            <!--中部左侧上方内容-->
            <el-row>
              <el-col>
                <el-form
                  class="query-form"
                  :rules="rules"
                  :inline="true"
                  :model="queryForm"
                  ref="queryForm"
                >
                  <el-form-item label="出发地：" prop="fromStationCode">
                    <el-select
                      size="mini"
                      class="select-style"
                      v-model="queryForm.fromStationCode"
                      filterable
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in stationOptions"
                        :key="item.stationCode"
                        :label="item.stationName"
                        :value="item.stationCode"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="目的地：" prop="toStationCode">
                    <el-select
                      size="mini"
                      class="select-style"
                      v-model="queryForm.toStationCode"
                      filterable
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in stationOptions"
                        :key="item.stationCode"
                        :label="item.stationName"
                        :value="item.stationCode"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="出发日：" prop="fromDate">
                    <el-date-picker
                      size="mini"
                      class="select-date-style"
                      v-model="queryForm.fromDate"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy年MM月dd日"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                    ></el-date-picker>
                  </el-form-item>

                  <el-form-item prop="ticketType">
                    <el-radio-group v-model="queryForm.ticketType">
                      <el-radio class="radio-style" label="TICKETS">普通票</el-radio>
                      <el-radio label="STUDENT_TICKET">学生票</el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="submitQueryForm('queryForm')">查询</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>

            <!--中部左侧下方内容-->
            <el-row>
              <el-col>
                <el-form :inline="true">
                  <el-form-item label="车次类型：">
                    <el-checkbox-group v-model="trainCodeType" @change="filterTrainInfo(1)">
                      <el-checkbox label="G" key="G">G-高铁</el-checkbox>
                      <el-checkbox label="D" key="D">D-动车</el-checkbox>
                      <el-checkbox label="Z" key="Z">Z-直达</el-checkbox>
                      <el-checkbox label="T" key="T">T-特快</el-checkbox>
                      <el-checkbox label="K" key="K">K-快速</el-checkbox>
                      <el-checkbox label="O" key="O">其他</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item class="send-train-time" label="发车时间：">
                    <el-select
                      @change="filterTicketByTime"
                      size="mini"
                      class="select-send-train-date-style"
                      v-model="sendTrainTimeValue"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in sendTrainTimes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form :inline="true">
                  <el-form-item label="出发车站：">
                    <el-checkbox-group v-model="fromStation" @change="filterTrainInfo(2)">
                      <el-checkbox
                        v-for="item in fromStationArray"
                        :label="item.fromStationCode"
                        :key="item.fromStationCode"
                      >{{item.fromStationName}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col>共计：60个车次</el-col>
            </el-row>-->
          </el-col>
          <!--中部右侧内容-->
          <el-col :span="12">
            <el-row>
              <el-col :span="6">
                &nbsp;
                <el-row>
                  <el-col class="span-content">查询间隔：1.5/s</el-col>
                </el-row>
                <el-row>
                  <el-col class="span-content span-content-space">可用CDN：100</el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-progress class="progress" :percentage="percentageVal" :stroke-width="10"></el-progress>
                <el-row>
                  <el-col>
                    <el-input
                      type="textarea"
                      class="console-log"
                      :rows="6"
                      resize="none"
                      v-model="consoleLog"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                &nbsp;
                <el-row>
                  <el-col class="start">
                    <el-button class="start-btn" type="primary" plain>开始刷票</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="main-content">
        <!-- <h2>主体内容</h2> -->
        <el-table
          stripe
          :data="tableData"
          height="530"
          border
          style="width: 100%"
          v-loading="tabLoading"
          @row-dbclick="queryTicketPrice"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="trainCode" label="车次" width="100" align="center"></el-table-column>
          <el-table-column prop="from_to_station" label="出发站 - 到达站" width="180" align="center"></el-table-column>
          <el-table-column prop="from_to_time" label="出发时间 - 到达时间" width="180" align="center"></el-table-column>
          <el-table-column prop="lastTime" label="历时" align="center"></el-table-column>
          <el-table-column prop="businessSeatCount" label="商务座" align="center"></el-table-column>
          <el-table-column prop="firstSeatCount" label="一等座" align="center"></el-table-column>
          <el-table-column prop="secondSeatCount" label="二等座" align="center"></el-table-column>
          <el-table-column prop="highSoftSleepCount" label="高级软卧" align="center"></el-table-column>
          <el-table-column prop="softSleepCount" label="软卧" align="center"></el-table-column>
          <el-table-column prop="motorSleepCount" label="动卧" align="center"></el-table-column>
          <el-table-column prop="hardSleepCount" label="硬卧" align="center"></el-table-column>
          <el-table-column prop="softSeatCount" label="软座" align="center"></el-table-column>
          <el-table-column prop="hardSeatCount" label="硬座" align="center"></el-table-column>
          <el-table-column prop="noneSeatCount" label="无座" align="center"></el-table-column>
          <el-table-column prop="other" label="其他" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button round size="mini" @click="queryTicketPrice(scope.row)">查看票价</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background class="page-style" layout="total" :total="tabTotal"></el-pagination>
      </el-main>
    </el-container>

    <el-dialog title="车票价格" :visible.sync="centerDialogVisible" width="30%" center>
      <span style="font-weight: bold;">车次：{{ticketPrice.trainCode}}</span>
      <br />
      <br />
      <br />
      <span class="span-price">
        商务座：
        <span class="span-price-color">{{ticketPrice.businessSeatPrice}}</span>
      </span>
      <span class="span-price">
        一等座：
        <span class="span-price-color">{{ticketPrice.firstSeatPrice}}</span>
      </span>
      <span class="span-price">
        二等座：
        <span class="span-price-color">{{ticketPrice.secondSeatPrice}}</span>
      </span>
      <br />
      <br />
      <span class="span-price">
        高级软卧：
        <span class="span-price-color">{{ticketPrice.highSoftSleepPrice}}</span>
      </span>
      <span class="span-price">
        软卧：
        <span class="span-price-color">{{ticketPrice.softSleepPrice}}</span>
      </span>
      <span class="span-price">
        硬卧：
        <span class="span-price-color">{{ticketPrice.hardSleepPrice}}</span>
      </span>
      <br />
      <br />
      <span class="span-price">
        动卧：
        <span class="span-price-color">{{ticketPrice.motorSleepPrice}}</span>
      </span>
      <span class="span-price">
        软座：
        <span class="span-price-color">{{ticketPrice.softSeatPrice}}</span>
      </span>
      <span class="span-price">
        硬座：
        <span class="span-price-color">{{ticketPrice.hardSeatPrice}}</span>
      </span>
      <span class="span-price">
        无座：
        <span class="span-price-color">{{ticketPrice.noneSeatPrice}}</span>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../request/api";
import QS from "qs";
// import Msg from "../assets/js/common";

export default {
  name: "home",
  data() {
    return {
      stationOptions: [], // 车站信息
      sendTrainTimes: [
        {
          value: "1",
          label: "00:00 - 23:59",
        },
        {
          value: "2",
          label: "00:00 - 06:00",
        },
        {
          value: "3",
          label: "06:00 - 12:00",
        },
        {
          value: "4",
          label: "12:00 - 18:00",
        },
        {
          value: "5",
          label: "18:00 - 23:59",
        },
      ],
      queryForm: {
        fromStationCode: "", // 出发地车站编号
        toStationCode: "", // 目的地车站编号
        fromDate: "", // 出发日期
        ticketType: "TICKETS", // 车票类型
      },
      rules: {
        fromStationCode: {
          required: true,
          message: "请选择出发地",
          trigger: "change",
        },
        toStationCode: {
          required: true,
          message: "请选择目的地",
          trigger: "change",
        },
        fromDate: {
          required: true,
          message: "请选择出发日期",
          trigger: "blur",
        },
      },
      sendTrainTimeValue: "", // 发车时间段
      trainCodeType: [], // 车次类型
      fromStation: [], // 出发车站
      fromStationArray: [], // 所有出发车站
      // 控制台日志
      consoleLog:
        "2020-08-22 13:13:56 => 第[23523]次，查询间隔[1.5s]\n2020-08-22 13:13:56 => 第[23523]次，查询间隔[1.5s]\n2020-08-22 13:13:56 => 第[23523]次，查询间隔[1.5s]\n2020-08-22 13:13:56 => 第[23523]次，查询间隔[1.5s]\n" +
        "2020-08-22 13:13:56 => 第[23523]次，查询间隔[1.5s]\n2020-08-22 13:13:56 => 第[23523]次，查询间隔[1.5s]\n2020-08-22 13:13:56 => 第[23523]次，查询间隔[1.5s]\n2020-08-22 13:13:56 => 第[23523]次，查询间隔[1.5s]\n",
      tableData: [], // table数据
      ticketArray: [], // 元数据
      tabLoading: false,
      tabTotal: 0,
      percentageVal: 0, // 进度
      percentageStartTimeId: "",
      currentTime: "", // 当前时间
      timeId: "",
      centerDialogVisible: false,
      ticketPrice: {
        trainCode: "",
        businessSeatPrice: "",
        firstSeatPrice: "",
        secondSeatPrice: "",
        highSoftSleepPrice: "",
        softSleepPrice: "",
        motorSleepPrice: "",
        hardSleepPrice: "",
        softSeatPrice: "",
        hardSeatPrice: "",
        noneSeatPrice: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      userName: "", // 用户名
    };
  },
  mounted() {
    let apptk = localStorage.getItem(
      localStorage.getItem("username") + "apptk"
    );
    if(!apptk){
      this.$router.push({ name: "/" });
      return false;
    }
    this.getUserName();// 获取用户名
    this.getStations();
    this.percentageStartTimeId = setInterval(() => {
      this.percentageValTimer(5);
    }, 5000);
    this.timeId = setInterval(() => {
      this.getCurrentDateTime();
    }, 1000);
  },
  beforeDestroy: function () {
    // 实力销毁前清除定时器
    if (this.timeId) {
      clearInterval(this.timeId);
    }
    if (this.percentageStartTimeId) {
      clearInterval(this.percentageStartTimeId);
    }
  },
  methods: {
    // 获取车站信息
    async getStations() {
      const params = {};
      let { data, error } = await api.getStations(params);
      if (error) {
        console.log(error);
        this.$common.errorMsg("加载车站信息失败", this);
      } else {
        this.stationOptions = data.data;
        this.$common.successMsg("加载车站信息成功", this);
      }
    },
    submitQueryForm(queryForm) {
      this.$refs[queryForm].validate((flag) => {
        if (flag) {
          let params = this.queryForm;
          this.queryTickets(params);
        }
      });
    },
    // 查询车票信息
    async queryTickets(params) {
      this.tabLoading = true;
      let { data, error } = await api.getTickets(params);
      if (error) {
        console.log(error);
        this.tabLoading = false;
      } else {
        //console.log(data);
        let ticketArray = [];
        if (data.data.ticketInfos) {
          ticketArray = this.settingTicketInfo(data.data.ticketInfos);
          this.tableData = ticketArray;
          this.ticketArray = data.data.ticketInfos;
          this.fromStationArray = data.data.fromStations;
          //console.log("fromStations:" + this.fromStationArray);
          this.tabTotal = this.tableData.length;
          this.tabLoading = false;
        }
      }
    },
    filterTrainInfo(type) {
      if (type == 1) {
        this.filterTrainType();
      } else {
        this.filterFromStation();
      }
    },
    // 过滤车次类型---------------------------------
    filterTrainType() {
      let trainType = this.trainCodeType;
      console.log("选中的车次:" + trainType);
      let fromStation = this.fromStation;
      console.log("选中的出发站:" + fromStation);
      let ticketInfos = []; // 过滤后的车票信息
      if (trainType.length > 0) {
        for (let ticketItem of this.ticketArray) {
          for (let trainTypeItem of trainType) {
            if (ticketItem.trainCode.indexOf(trainTypeItem) != -1) {
              ticketInfos.push(ticketItem);
            } else {
              let trainCode = parseInt(ticketItem.trainCode);
              if (!isNaN(trainCode) && trainTypeItem === "O") {
                console.log("其他车次:" + ticketItem.trainCode);
                ticketInfos.push(ticketItem);
              }
            }
          }
        }
      }

      // 过滤出发站
      if (fromStation.length > 0) {
        let tempTicket = [];
        for (let ticketItem of ticketInfos) {
          for (let fromStationItem of fromStation) {
            if (ticketItem.fromStationCode.indexOf(fromStationItem) != -1) {
              tempTicket.push(ticketItem);
            }
          }
        }
        if (tempTicket.length > 0) {
          ticketInfos = tempTicket;
        }
      }

      if (fromStation.length > 0 && trainType.length <= 0) {
        for (let ticketItem of this.ticketArray) {
          for (let fromStationItem of fromStation) {
            if (ticketItem.fromStationCode.indexOf(fromStationItem) != -1) {
              ticketInfos.push(ticketItem);
            }
          }
        }
      }

      if (trainType.length <= 0 && fromStation.length <= 0) {
        // 如果过滤条件为空显示查询出的所有信息
        ticketInfos = this.ticketArray;
      }
      this.tableData = this.settingTicketInfo(ticketInfos);
      this.tabTotal = ticketInfos.length;
    },
    // 过滤出发车站---------------------------------
    filterFromStation() {
      let trainType = this.trainCodeType;
      console.log("选中的车次:" + trainType);
      let fromStation = this.fromStation;
      console.log("选中的出发站:" + fromStation);
      let ticketInfos = []; // 过滤后的车票信息
      if (fromStation.length > 0) {
        for (let ticketItem of this.ticketArray) {
          for (let fromStationItem of fromStation) {
            if (ticketItem.fromStationCode.indexOf(fromStationItem) != -1) {
              ticketInfos.push(ticketItem);
            }
          }
        }
      }

      // 过滤车次
      if (trainType.length > 0) {
        let tempTicket = [];
        for (let ticketItem of ticketInfos) {
          for (let trainTypeItem of trainType) {
            if (ticketItem.trainCode.indexOf(trainTypeItem) != -1) {
              tempTicket.push(ticketItem);
            } else {
              let trainCode = parseInt(ticketItem.trainCode);
              if (!isNaN(trainCode) && trainTypeItem === "O") {
                console.log("其他车次:" + ticketItem.trainCode);
                tempTicket.push(ticketItem);
              }
            }
          }
        }
        if (tempTicket.length > 0) {
          ticketInfos = tempTicket;
        }
      }

      if (trainType.length > 0 && fromStation.length <= 0) {
        for (let ticketItem of this.ticketArray) {
          for (let trainTypeItem of trainType) {
            if (ticketItem.trainCode.indexOf(trainTypeItem) != -1) {
              ticketInfos.push(ticketItem);
            } else {
              let trainCode = parseInt(ticketItem.trainCode);
              if (!isNaN(trainCode) && trainTypeItem === "O") {
                console.log("其他车次:" + ticketItem.trainCode);
                ticketInfos.push(ticketItem);
              }
            }
          }
        }
      }

      if (trainType.length <= 0 && fromStation.length <= 0) {
        // 如果过滤条件为空显示查询出的所有信息
        ticketInfos = this.ticketArray;
      }
      this.tableData = this.settingTicketInfo(ticketInfos);
      this.tabTotal = ticketInfos.length;
    },
    // 格式化车票信息
    settingTicketInfo(ticketInfos) {
      let ticketArray = [];
      if (ticketInfos.length > 0) {
        for (let item of ticketInfos) {
          let ticketInfo = {
            trainCode: item.trainCode,
            from_to_station: item.fromeStationName + " - " + item.toStationMame,
            from_to_time: item.fromTime + " - " + item.toTime,
            lastTime: item.lastTime,
            businessSeatCount:
              item.businessSeatCount == "" ? "--" : item.businessSeatCount,
            firstSeatCount:
              item.firstSeatCount == "" ? "--" : item.firstSeatCount,
            secondSeatCount:
              item.secondSeatCount == "" ? "--" : item.secondSeatCount,
            highSoftSleepCount:
              item.highSoftSleepCount == "" ? "--" : item.highSoftSleepCount,
            softSleepCount:
              item.softSleepCount == "" ? "--" : item.softSleepCount,
            motorSleepCount:
              item.motorSleepCount == "" ? "--" : item.motorSleepCount,
            hardSleepCount:
              item.hardSleepCount == "" ? "--" : item.hardSleepCount,
            softSeatCount: item.softSeatCount == "" ? "--" : item.softSeatCount,
            hardSeatCount: item.hardSeatCount == "" ? "--" : item.hardSeatCount,
            noneSeatCount: item.noneSeatCount == "" ? "--" : item.noneSeatCount,
            other: item.other == "" ? "--" : item.other,
            remark: item.remark,
            trainNo: item.trainNo,
            fromStationNo: item.fromStationNo,
            toStationNo: item.toStationNo,
            seatTypes: item.seatType,
          };
          ticketArray.push(ticketInfo);
        }
      }
      return ticketArray;
    },
    // 时间筛选车票信息
    filterTicketByTime() {
      let selectTime = this.sendTrainTimeValue;
      if (selectTime) {
        let timeArray = selectTime.split("-");
        if (this.queryForm.fromDate) {
          if (this.tableData.length <= 0) {
            this.$common.warningMsg("没有可筛选的数据，请先查询", this);
            return false;
          }
          let sendStartTrainDate =
            this.queryForm.fromDate + " " + timeArray[0].trim(); // 发车开始日期
          let sendEndTrainDate =
            this.queryForm.fromDate + " " + timeArray[1].trim(); // 发车结束日期
          let ticketArray = [];

          if (this.trainCodeType.length <= 0 && this.fromStation.length <= 0) {
            // 按照全部数据筛选
            for (let ticket of this.ticketArray) {
              let sendTrainDate =
                this.queryForm.fromDate + " " + ticket.fromTime.trim();
              let flag = this.isDuringDate(
                sendTrainDate,
                sendStartTrainDate,
                sendEndTrainDate
              );
              if (flag) {
                ticketArray.push(ticket);
              }
            }
            ticketArray = this.settingTicketInfo(ticketArray);
          } else {
            // 按照当前数据筛选
            for (let ticket of this.tableData) {
              let fromToTime = ticket.from_to_time.split("-");
              let sendTrainDate =
                this.queryForm.fromDate + " " + fromToTime[0].trim();
              let flag = this.isDuringDate(
                sendTrainDate,
                sendStartTrainDate,
                sendEndTrainDate
              );
              if (flag) {
                ticketArray.push(ticket);
              }
            }
          }

          if (ticketArray.length > 0) {
            this.tableData = ticketArray;
            this.tabTotal = ticketArray.length;
          } else {
            this.$common.warningMsg("当前时间段没有出发车次", this);
          }
        } else {
          this.$common.warningMsg("出发日期未确定，无法进行数据筛选", this);
          return false;
        }
      } else {
        this.tableData = this.settingTicketInfo(this.ticketArray);
        this.tabTotal = this.tableData.length;
      }
    },
    // 判断当前日期时间是否在范围内
    isDuringDate(sendTrainDate, beginDateStr, endDateStr) {
      let trainDate = new Date(sendTrainDate),
        beginDate = new Date(beginDateStr),
        endDate = new Date(endDateStr);
      if (trainDate >= beginDate && trainDate <= endDate) {
        return true;
      }
      return false;
    },
    getCurrentDateTime() {
      var time = new Date(); //获得当前时间
      var year = time.getFullYear(); //获得年
      var month = time.getMonth() + 1; //获月
      var date = time.getDate(); //获得日
      //获得小时、分钟、秒
      var hour = time.getHours();
      var minute = time.getMinutes();
      var second = time.getSeconds();
      if (minute < 10)
        //如果分钟只有1位，补0显示
        minute = "0" + minute;
      if (second < 10)
        //如果秒数只有1位，补0显示
        second = "0" + second;
      this.currentTime =
        year +
        "年" +
        month +
        "月" +
        date +
        "日 " +
        hour +
        ":" +
        minute +
        ":" +
        second;
    },
    percentageValTimer(val) {
      let that = this;
      that.percentageVal = 0;
      let timer = setInterval(() => {
        if (that.percentageVal < 100) {
          that.percentageVal = that.percentageVal + 10;
        } else {
          that.percentageVal = 100;
          clearInterval(timer);
        }
      }, (val * 1000 - 800) / 10);
      // setTimeout(() => {

      // }, 800);
    },
    async queryTicketPrice(row) {
      let params = {
        trainCode: row.trainCode,
        trainNo: row.trainNo,
        fromStationNo: row.fromStationNo,
        toStationNo: row.toStationNo,
        seatTypes: row.seatTypes,
        trainDate: this.queryForm.fromDate,
      };
      let { data, error } = await api.getTicketPrice(params);
      if (error) {
        this.$common.errorMsg(error, this);
        return false;
      } else {
        // 清空票价信息
        Object.keys(this.ticketPrice).forEach(
          (key) => (this.ticketPrice[key] = "")
        );
        let price = {
          trainCode: data.data.trainCode,
          businessSeatPrice:
            data.data.businessSeatPrice == null
              ? "--"
              : data.data.businessSeatPrice,
          firstSeatPrice:
            data.data.firstSeatPrice == null ? "--" : data.data.firstSeatPrice,
          secondSeatPrice:
            data.data.secondSeatPrice == null
              ? "--"
              : data.data.secondSeatPrice,
          highSoftSleepPrice:
            data.data.highSoftSleepPrice == null
              ? "--"
              : data.data.highSoftSleepPrice,
          softSleepPrice:
            data.data.softSleepPrice == null ? "--" : data.data.softSleepPrice,
          motorSleepPrice:
            data.data.motorSleepPrice == null
              ? "--"
              : data.data.motorSleepPrice,
          hardSleepPrice:
            data.data.hardSleepPrice == null ? "--" : data.data.hardSleepPrice,
          softSeatPrice:
            data.data.softSeatPrice == null ? "--" : data.data.softSeatPrice,
          hardSeatPrice:
            data.data.hardSeatPrice == null ? "--" : data.data.hardSeatPrice,
          noneSeatPrice:
            data.data.noneSeatPrice == null ? "--" : data.data.noneSeatPrice,
        };
        this.ticketPrice = price;
        this.centerDialogVisible = true;
      }
    },
    async getUserName() {
      let apptk = localStorage.getItem(
        localStorage.getItem("username") + "apptk"
      );
      let params = {
        tk: apptk,
      };
      let { data, error } = await api.getUserName(params);
      if (error) {
        this.$common.errorMsg(error, this);
        return false;
      } else {
        if (data.code === 200 && data.data != "5") {
          this.$common.successMsg("获取用户名成功", this);
          this.userName = data.data;
        } else {
          this.$common.errorMsg(data.message, this);
          localStorage.removeItem(localStorage.getItem("username") + "apptk");
          this.$common.confirm(
            "您的会话已过期或登录状态异常，请重新登录",
            "登录状态异常",
            () => {
              this.$router.push({ name: "/" });
            },
            this
          );
        }
      }
    },
    submitLoginOut() {
      this.$common.confirm("确定要退出吗？", "用户退出", this.loginOut, this);
    },
    async loginOut() {
      let params = {};
      let { data, error } = await api.userLoginOut(params);
      if (error) {
        this.$common.errorMsg(error, this);
        return false;
      } else {
        localStorage.removeItem(localStorage.getItem("username") + "apptk");
        this.$common.successMsg(data.message, this);
        this.$router.push({ name: "/" });
      }
    },
  },
};
</script>

<style scoped>
.top-content {
  /* background-color: rosybrown; */
}
.middle-content {
  /* background-color: salmon; */
}
.main-content {
  /* background-color: sienna; */
}
.top-left {
  margin-top: 10px;
}
.top-middle {
  margin-top: 10px;
}
.login-out {
  cursor: pointer;
}
.select-style {
  width: 124px;
}
.select-date-style {
  width: 150px;
}
.select-send-train-date-style {
  width: 154px;
}
.radio-style {
  margin-right: 8px;
}
.query-form {
  padding-top: 20px;
}
.top-title {
  text-align: center;
}
.span-content {
  text-align: left;
  padding-left: 100px;
  white-space: nowrap;
  padding-top: 22px;
}
.span-content-space {
  padding-left: 97px;
}
.start {
  text-align: left;
}
.start-btn {
  height: 96px;
  margin-left: 20px;
  margin-top: 28px;
}
.progress {
  padding-top: 20px;
}
.send-train-time {
  margin-left: 35px;
}
.page-style {
  text-align: left;
  padding: 20px 0px;
}
.console-log {
  margin-top: 6px;
}
.time-style {
  color: #409eff;
  font-weight: bold;
}
.span-price {
  display: inline-block;
  margin-right: 16px;
}
.span-price-color {
  color: #409eff;
  font-weight: bold;
}
</style>