<template>
  <div>
    <el-container>
      <el-header class="top-content" style="height:80px;">
        <el-row :gutter="20" style="margin-top: 6px;">
          <el-col :span="4">
            <div class="top-left">
              <el-button type="primary" @click="myOrder">我的订单</el-button>
              <el-button type="primary" @click="passengersDiaVis=true">乘车人</el-button>
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
                <el-button type="primary" @click="getUserName" style="width:100%;">刷新用户</el-button>
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
                  <el-col class="span-content">查询间隔：3.0/s</el-col>
                </el-row>
                <el-row>
                  <el-col class="span-content span-content-space">可用CDN：{{cdnCount}}</el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-progress class="progress" :percentage="percentageVal" :stroke-width="10"></el-progress>
                <el-row>
                  <el-col>
                    <el-input
                      type="textarea"
                      disabled
                      class="console-log"
                      :rows="7"
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
                    <el-button
                      class="start-btn"
                      type="primary"
                      @click="orderMainSetting(1)"
                      plain
                    >抢票设置</el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="start">
                    <el-button
                      v-if="isStartTicketBug==false"
                      class="start-btn"
                      type="primary"
                      @click="orderMainSetting(2)"
                      plain
                    >捡漏设置</el-button>
                    <el-button
                      v-if="isStartTicketBug"
                      class="start-btn"
                      type="primary"
                      @click="stopTicketBug"
                      plain
                    >停止捡漏</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="main-content">
        <!-- <h2>主体内容</h2> -->
        <div style="text-align: right;">
          <el-tag v-if="isStartTicketBug" type="warning">目前正在进行余票捡漏，不建议查询其他余票信息，查询其他余票信息会中断余票捡漏</el-tag>
          <el-tag v-if="isStartTicketBug==false" type="success">有票</el-tag>
          <el-tag v-if="isStartTicketBug==false" type="warning">无票</el-tag>
          <el-tag
            v-if="isStartTicketBug==false"
            type="danger"
          >未开售&nbsp;&nbsp;/&nbsp;&nbsp;列车停运&nbsp;&nbsp;/&nbsp;&nbsp;列车运行图调整，暂停发售</el-tag>
        </div>
        <el-table
          stripe
          :data="tableData"
          height="468"
          border
          style="width: 100%"
          v-loading="tabLoading"
          @selection-change="selectTicket"
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
          <el-table-column prop="remark" label="备注" width="130" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.canBuy=='Y'"
                style="color: #37B328;font-weight: bold;"
              >{{ scope.row.remark }}</span>
              <span
                v-else-if="scope.row.canBuy=='N'"
                style="color: #E6A23C;font-weight: bold;"
              >{{ scope.row.remark }}</span>
              <span v-else style="color: red;font-weight: bold;">{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="102" align="center">
            <template slot-scope="scope">
              <el-button round size="mini" @click="queryTicketPrice(scope.row)">查看票价</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background class="page-style" layout="total" :total="tabTotal"></el-pagination>
      </el-main>
    </el-container>

    <!--车票价格-->
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

    <!--乘车人-->
    <el-dialog title="乘车人信息" :visible.sync="passengersDiaVis" width="50%" center>
      <el-button type="primary" style="margin-bottom: 5px;" @click="addPassDiaVis=true">新增乘车人</el-button>
      <el-table
        @row-dbclick="delPassenger"
        stripe
        border
        style="width: 100%"
        :data="passengersData"
      >
        <el-table-column prop="id" label="序号" type="index" :index="indexMethod" align="center"></el-table-column>
        <el-table-column prop="passengerName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="passengeridTypeName" label="证件类型" align="center"></el-table-column>
        <el-table-column prop="passengerIdNo" label="证件号码" align="center"></el-table-column>
        <el-table-column prop="mobileNo" label="手机/电话" align="center"></el-table-column>
        <el-table-column prop="passengerTypeName" label="旅客类型" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="passengerDisable(scope.row)"
              round
              size="mini"
              @click="() => {delPassenger(scope.row)}"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: right;padding: 20px 0px;"
        background
        layout="total, prev, pager, next"
        :total="passengersTotal"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="passengersDiaVis = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--新增乘车人表单-->
    <el-dialog title="新增乘车人" :visible.sync="addPassDiaVis" width="25%" center>
      <el-form ref="addPassengerForm" :model="addPassengerForm" :rules="passengerRules">
        <el-form-item label="姓名：" prop="passengerName">
          <el-input v-model="addPassengerForm.passengerName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="身份证号码：" prop="passengerIdNo">
          <el-input v-model="addPassengerForm.passengerIdNo" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="性别：" prop>
          <el-radio-group v-model="addPassengerForm.sexCode">
            <el-radio label="M">男</el-radio>
            <el-radio label="F">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobileNo">
          <el-input v-model="addPassengerForm.mobileNo" placeholder="请输入手机号码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddPassenger('addPassengerForm')">确 定</el-button>
        <el-button type="primary" @click="clearForm('addPassengerForm')">取 消</el-button>
      </span>
    </el-dialog>

    <!--订单-->
    <el-dialog title="我的订单" :visible.sync="orderDiaVis" width="90%" center>
      <el-tabs v-model="activeName" @tab-click="orderTabClick">
        <el-tab-pane label="未完成订单" name="first">
          <el-table
            v-loading="noCompleteOrderLoad"
            stripe
            border
            style="width: 100%"
            :data="noCompleteOrder"
          >
            <el-table-column prop="id" label="序号" type="index" :index="indexMethod" align="center"></el-table-column>
            <el-table-column prop="sequenceNo" label="订单号" align="center"></el-table-column>
            <el-table-column prop="orderDate" label="订单生成日期" align="center"></el-table-column>
            <el-table-column prop="fromToStation" label="出发站 - 到达站" align="center"></el-table-column>
            <el-table-column prop="trainCodePage" label="车次" align="center"></el-table-column>
            <el-table-column prop="startTrainDatePage" label="发车日期" align="center"></el-table-column>
            <el-table-column prop="arrayPassserNamePage" label="乘车人" align="center"></el-table-column>
            <el-table-column prop="seat" label="席位" align="center"></el-table-column>
            <el-table-column prop="strTicketPricePage" label="票价" align="center"></el-table-column>
            <el-table-column prop="ticketTypeName" label="车票类型" align="center"></el-table-column>
            <el-table-column prop="ticketStatusName" label="车票状态" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="未出行订单" name="second">
          <el-table
            v-loading="orderHistoryLoad"
            stripe
            border
            style="width: 100%"
            :data="orderHistory"
          >
            <el-table-column prop="id" label="序号" type="index" :index="indexMethod" align="center"></el-table-column>
            <el-table-column prop="sequenceNo" label="订单号" align="center"></el-table-column>
            <el-table-column prop="orderDate" label="订单生成日期" align="center"></el-table-column>
            <el-table-column prop="fromToStation" label="出发站 - 到达站" align="center"></el-table-column>
            <el-table-column prop="trainCodePage" label="车次" align="center"></el-table-column>
            <el-table-column prop="startTrainDatePage" label="发车日期" align="center"></el-table-column>
            <el-table-column prop="arrayPassserNamePage" label="乘车人" align="center"></el-table-column>
            <el-table-column prop="seat" label="席位" align="center"></el-table-column>
            <el-table-column prop="strTicketPricePage" label="票价" align="center"></el-table-column>
            <el-table-column prop="ticketTypeName" label="车票类型" align="center"></el-table-column>
            <el-table-column prop="ticketStatusName" label="车票状态" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="历史订单" name="third">
          <el-table
            v-loading="orderHistoryLoad"
            stripe
            border
            style="width: 100%"
            :data="orderHistory"
          >
            <el-table-column prop="id" label="序号" type="index" :index="indexMethod" align="center"></el-table-column>
            <el-table-column prop="sequenceNo" label="订单号" align="center"></el-table-column>
            <el-table-column prop="orderDate" label="订单生成日期" align="center"></el-table-column>
            <el-table-column prop="fromToStation" label="出发站 - 到达站" align="center"></el-table-column>
            <el-table-column prop="trainCodePage" label="车次" align="center"></el-table-column>
            <el-table-column prop="startTrainDatePage" label="发车日期" align="center"></el-table-column>
            <el-table-column prop="arrayPassserNamePage" label="乘车人" align="center"></el-table-column>
            <el-table-column prop="seat" label="席位" align="center"></el-table-column>
            <el-table-column prop="strTicketPricePage" label="票价" align="center"></el-table-column>
            <el-table-column prop="ticketTypeName" label="车票类型" align="center"></el-table-column>
            <el-table-column prop="ticketStatusName" label="车票状态" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="orderDiaVis = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--提交订单表单-->
    <el-dialog
      :title="isTicketBug=='N'?'提交订单':'捡漏设置'"
      :visible.sync="submitOrderDiaVis"
      @close="submitOrderDiaVisClose('submitOrderForm')"
      width="68%"
      center
    >
      <el-form :label-position="labelPosition" ref="submitOrderForm" :model="submitOrderForm">
        <el-form-item>
          <label>
            <!-- {{submitOrderForm.ticketInfo.fromStationName}}&nbsp;&nbsp;- >&nbsp;&nbsp;
            {{submitOrderForm.ticketInfo.toStationName}}&nbsp;&nbsp;/&nbsp;&nbsp;-->
            发车时间：
            {{queryForm.fromDate}}&nbsp;&nbsp;{{submitOrderForm.ticketInfo.fromTime}}
          </label>
          <el-button
            v-if="isTicketBug=='N'"
            type="primary"
            @click="refushTickets"
            style="margin-left: 20px;"
            :disabled="Object.keys(submitOrderForm.ticketInfo).length == 0"
          >刷新已选车次</el-button>
        </el-form-item>
        <el-form-item label="出发车次：">
          <!--抢票-->
          <label v-if="isTicketBug=='N'">
            <el-radio-group v-model="submitOrderForm.selectTicket">
              <el-radio
                v-for="item in submitOrderForm.ticketInfo"
                :key="item.trainCode"
                class="radio-style"
                :label="item.trainCode"
              >{{item.trainCode}}</el-radio>
            </el-radio-group>
          </label>
          <!--捡漏-->
          <label v-if="isTicketBug=='Y'">
            <span
              v-for="item in submitOrderForm.ticketInfo"
              :key="item.trainCode"
            >{{item.trainCode}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </label>
        </el-form-item>
        <el-form-item label="选座位：" prop="seatType">
          <el-checkbox-group v-model="submitOrderForm.seatType">
            <el-checkbox label="BUSINESS_SEAT" key="BUSINESS_SEAT">商务座</el-checkbox>
            <el-checkbox label="FIRST_SEAT" key="FIRST_SEAT">一等座</el-checkbox>
            <el-checkbox label="SECOND_SEAT" key="SECOND_SEAT">二等座</el-checkbox>
            <el-checkbox label="SOFT_SLEEP" key="SOFT_SLEEP">软卧</el-checkbox>
            <el-checkbox label="HARD_SLEEP" key="HARD_SLEEP">硬卧</el-checkbox>
            <el-checkbox label="HARD_SEAT" key="HARD_SEAT">硬座</el-checkbox>
            <el-checkbox label="NONE_SEAT" key="NONE_SEAT">无座</el-checkbox>
            <el-checkbox label="HIGH_SOFT_SLEEP" key="HIGH_SOFT_SLEEP">高级软卧</el-checkbox>
            <el-checkbox label="SECOND_SOFT_SLEEP" key="SECOND_SOFT_SLEEP">动车：二等卧</el-checkbox>
            <el-checkbox label="FIRST_SOFT_SLEEP" key="FIRST_SOFT_SLEEP">动车：一等卧</el-checkbox>
            <el-checkbox label="SOFT_SEAT" key="SOFT_SEAT">软座</el-checkbox>
            <el-checkbox label="SPECIAL_SEAT" key="SPECIAL_SEAT">特等座</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="乘车人：" prop="passengerInfoList">
          <el-checkbox-group v-model="submitOrderForm.passengerInfoList">
            <el-checkbox
              v-for="item in passengersData"
              :label="item.passengerName"
              :key="item.passengerName"
            >{{item.passengerName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="isTicketBug=='N'" label="是否预售：" prop="isYS">
          <el-radio-group v-model="submitOrderForm.isYS">
            <el-radio class="radio-style" label="N">否</el-radio>
            <el-radio label="Y">
              是
              <el-input
                style="width:83%;margin-left:10px;"
                :disabled="submitOrderForm.isYS=='N'"
                clearable
                size="medium"
                v-model="submitOrderForm.ysTime"
                placeholder="请输入预售时间: 如 -> 13:30"
              />
            </el-radio>
          </el-radio-group>
          <el-button
            type="primary"
            @click="getUserName"
            style="margin-left: 18px;"
            :disabled="submitOrderForm.isYS=='Y'"
          >刷新用户</el-button>
        </el-form-item>
        <!-- <el-form-item label="是否捡漏：" prop="isTicketBug">
          <el-radio-group v-model="submitOrderForm.isTicketBug">
            <el-radio class="radio-style" label="N">否</el-radio>
            <el-radio class="radio-style" label="Y">是</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOrder" v-if="isTicketBug=='N'">提交</el-button>
        <el-button type="primary" @click="startTicketBug" v-if="isTicketBug=='Y'">开始</el-button>
        <el-button type="primary" @click="submitOrderDiaVis=false">取 消</el-button>
      </span>
    </el-dialog>

    <!--滑块验证内容-->
    <el-dialog
      title="订单滑块验证"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="slideDiaVis"
      width="30%"
      center
    >
      <div id="captcha"></div>
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
      addPassengerForm: {
        passengerName: "", // 姓名
        sexCode: "M", // 性别
        passengerIdNo: "", // 身份证号码
        mobileNo: "", // 手机号码
      },
      submitOrderForm: {
        ticketInfo: [], // 车票信息
        passengerInfoList: [], // 乘车人信息
        seatType: [], // 座位类型
        isYS: "N", // 是否预售
        ysTime: "", // 预售时间
        selectTicket: "", // 提交订单时选择的车次
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
      passengerRules: {
        passengerName: {
          required: true,
          message: "请输入姓名",
          trigger: "blur",
        },
        passengerIdNo: {
          required: true,
          message: "请输入身份证号码",
          trigger: "blur",
        },
        mobileNo: {
          required: true,
          message: "请输入手机号码",
          trigger: "blur",
        },
      },
      sendTrainTimeValue: "", // 发车时间段
      trainCodeType: [], // 车次类型
      fromStation: [], // 出发车站
      fromStationArray: [], // 所有出发车站
      consoleLog: "", // 控制台日志
      tableData: [], // table数据
      ticketArray: [], // 元数据
      tabLoading: false,
      orderHistoryLoad: false,
      noCompleteOrderLoad: false,
      tabTotal: 0,
      percentageVal: 0, // 进度
      percentageStartTimeId: "",
      currentTime: "", // 当前时间
      timeId: "",
      centerDialogVisible: false,
      passengersDiaVis: false,
      addPassDiaVis: false,
      orderDiaVis: false,
      slideDiaVis: false,
      isTicketBug: "N", // 是否捡漏
      isStartTicketBug: false, // 是否开始捡漏
      queryTicketCount: 0, // 余票监控查询累计次数
      ticketBugTimerId: "",
      submitOrderDiaVis: false,
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
          let curDate = new Date().getTime();
          let lastDate = 29 * 24 * 60 * 60 * 1000;
          let maxTime = curDate + lastDate;
          if (time.getTime() < Date.now() - 8.64e7) {
            return true;
          } else {
            if (time.getTime() < maxTime) {
              return false;
            } else {
              return true;
            }
          }
        },
      },
      userName: "", // 用户名
      passengersData: [], // 乘车人信息
      passengersTotal: 0,
      activeName: "first",
      orderHistory: [], // 历史订单
      noCompleteOrder: [], // 未完成订单
      appKey: "FFFF0N000000000097AD", // appkey后期可能会变：(2020-09-24,FFFF0N000000000097AD)
      scene: "nc_login",
      labelPosition: "right",
      excuteSubmitOrderTimeId: "", // 定时提交订单ID
      excuteGetUserNameId: "", // 定时获取用户名
      cdnCount: 0, // 可用cdn数量
    };
  },
  mounted() {
    let apptk = localStorage.getItem(
      localStorage.getItem("username") + "apptk"
    );
    if (!apptk) {
      this.$router.push({ name: "/" });
      return false;
    }
    this.getUserName(); // 获取用户名
    this.getStations(); // 获取车站
    this.getCdnCount(); // 获取可用cdn
    this.percentageStartTimeId = setInterval(() => {
      this.percentageValTimer(5);
    }, 5000);
    this.timeId = setInterval(() => {
      this.getCurrentDateTime();
    }, 1000);
  },
  beforeDestroy: function () {
    // 实力销毁前清除所有定时器
    if (this.timeId) {
      clearInterval(this.timeId);
    }
    if (this.percentageStartTimeId) {
      clearInterval(this.percentageStartTimeId);
    }
    if(this.ticketBugTimerId){
      clearInterval(this.ticketBugTimerId);
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
          if (this.isStartTicketBug) {
            this.$common.confirm(
              "目前正在进行余票捡漏，不建议查询其他余票信息，查询其他余票信息会中断余票捡漏，是否继续查询其他余票信息？",
              "查询提示",
              () => {
                this.isStartTicketBug = false;
                clearInterval(this.ticketBugTimerId);
                this.queryTickets(params);
              },
              this
            );
          } else {
            this.queryTickets(params);
          }
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
        if (data.data.ticketInfos.length > 0) {
          ticketArray = this.settingTicketInfo(data.data.ticketInfos);
          this.tableData = ticketArray;
          this.ticketArray = data.data.ticketInfos;
          this.fromStationArray = data.data.fromStations;
          //console.log("fromStations:" + this.fromStationArray);
          this.tabTotal = this.tableData.length;
          this.tabLoading = false;
        } else {
          this.$common.warningMsg(
            "根据搜索条件，暂时没有找到相关的出发车次信息",
            this
          );
          this.tableData = [];
          this.fromStationArray = [];
          this.tabTotal = 0;
          this.tabLoading = false;
        }
      }
      return this.ticketArray;
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
            from_to_station: item.fromStationName + " - " + item.toStationName,
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
            canBuy: item.canBuy,
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
          // 获取乘车人信息
          this.getPassengers();
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
    // 获取乘车人信息
    async getPassengers() {
      let params = {};
      let { data, error } = await api.getPassengers(params);
      if (error) {
        this.$common.errorMsg(error, this);
        return false;
      } else {
        // this.passengersDiaVis = true;
        this.passengersData = data.data;
        this.passengersTotal = this.passengersData.length;
      }
    },
    // 删除乘车人
    delPassenger(row) {
      let params = {
        isUserSelf: row.isUserSelf,
        allEncStr: row.allEncStr,
        passengerIdNo: row.passengerIdNo,
        passengerIdTypeCode: row.passengerIdTypeCode,
        passengerName: row.passengerName,
      };
      this.$common.confirm(
        "确定删除当前乘车人吗？",
        "删除乘车人",
        async () => {
          let { data, error } = await api.delPassengers(params);
          if (error) {
            this.$common.errorMsg(error, this);
            return false;
          } else {
            let result = data.data.split("-");
            if (result[1] == "0") {
              this.$common.successMsg(result[0], this);
              this.passengersDiaVis = false;
            } else {
              this.$common.warningMsg(result[0], this);
            }
          }
        },
        this
      );
    },
    submitAddPassenger(formName) {
      this.$refs[formName].validate((flag) => {
        if (flag) {
          this.addPassengers(formName);
        } else {
          // this.$common.errorMsg("请完善乘车人信息", this);
          console.log("请完善乘车人信息");
        }
      });
    },
    // 新增乘车人
    async addPassengers(formName) {
      let params = this.addPassengerForm;
      let { data, error } = await api.addPassengers(params);
      if (error) {
        this.$common.errorMsg(error, this);
        return false;
      } else {
        let result = data.data.split("-");
        if (result[1] == "0") {
          this.$common.successMsg(result[0], this);
          // 清空表单
          this.$refs[formName].resetFields();
          // 刷新乘车人列表
          this.getPassengers();
          this.addPassDiaVis = false;
          // this.passengersDiaVis = false;
        } else {
          this.$common.warningMsg(result[0], this);
        }
      }
    },
    indexMethod(index) {
      return index + 1;
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
    orderTabClick(tab, event) {
      if (tab.index == 0) {
        // console.log("未完成的订单");
        this.getNoCompleteOrder();
      } else if (tab.index == 1) {
        // console.log("未出行的订单");
        this.getHistoryOrder("G");
      } else if (tab.index == 2) {
        // console.log("历史订单");
        this.getHistoryOrder("H");
      }
    },
    // 获取未出行或历史订单信息
    async getHistoryOrder(queryWhereStr) {
      this.orderHistoryLoad = true;
      // 清空订单数据
      this.orderHistory = [];
      let lastDay = new Date();
      if (queryWhereStr == "H") {
        lastDay.setDate(lastDay.getDate() - 1);
      }
      let lastDayStr = lastDay.format("yyyy-MM-dd");
      let firstDay = new Date();
      firstDay.setDate(firstDay.getDate() - 30);
      let firstDayStr = firstDay.format("yyyy-MM-dd");
      let params = {
        queryStartDate: firstDayStr,
        queryEndDate: lastDayStr,
        queryWhere: queryWhereStr,
      };
      let { data, error } = await api.getOrderInfo(params);
      if (error) {
        this.$common.errorMsg(error, this);
        return false;
      } else {
        let orderData = data.data;
        let historyOrderArr = [];
        if (orderData.length > 0) {
          for (let item of orderData) {
            let order = {
              sequenceNo: item.sequenceNo,
              orderDate: item.orderDate,
              fromToStation:
                item.fromStationNamePage + " - " + item.toStationNamePage,
              trainCodePage: item.trainCodePage,
              startTrainDatePage: item.startTrainDatePage,
              arrayPassserNamePage: item.arrayPassserNamePage,
              seat:
                item.coachNo + "车" + item.seatName + " - " + item.seatTypeName,
              strTicketPricePage: item.strTicketPricePage,
              ticketTypeName: item.ticketTypeName,
              ticketStatusName: item.ticketStatusName,
            };
            historyOrderArr.push(order);
          }
          this.orderHistory = historyOrderArr;
        }
        this.orderHistoryLoad = false;
      }
    },
    // 获取未完成订单
    async getNoCompleteOrder() {
      this.noCompleteOrderLoad = true;
      let params = {};
      let { data, error } = await api.getNoCompleteOrder(params);
      if (error) {
        this.$common.errorMsg(error, this);
        return false;
      } else {
        let orderData = data.data;
        let noCompleteOrderArr = [];
        if (orderData.length > 0) {
          for (let item of orderData) {
            let order = {
              sequenceNo: item.sequenceNo,
              orderDate: item.orderDate,
              fromToStation:
                item.fromStationNamePage + " - " + item.toStationNamePage,
              trainCodePage: item.trainCodePage,
              startTrainDatePage: item.startTrainDatePage,
              arrayPassserNamePage: item.arrayPassserNamePage,
              seat:
                item.coachNo + "车" + item.seatName + " - " + item.seatTypeName,
              strTicketPricePage: item.strTicketPricePage,
              ticketTypeName: item.ticketTypeName,
              ticketStatusName: item.ticketStatusName,
            };
            noCompleteOrderArr.push(order);
          }
          this.noCompleteOrder = noCompleteOrderArr;
        }
        this.noCompleteOrderLoad = false;
      }
    },
    myOrder() {
      this.orderDiaVis = true;
      // 默认查询未完成的订单
      this.getNoCompleteOrder();
    },
    passengerDisable(row) {
      if (row.passengerName == this.userName) {
        return true;
      }
      return false;
    },
    // 获取当前月最后一天
    getLastDayByMonth() {
      var date = new Date();
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      return new Date(nextMonthFirstDay - oneDay);
    },
    clearForm(formName) {
      // 清空新增乘车人表单
      this.$refs[formName].resetFields();
      this.addPassDiaVis = false;
    },
    // 调用滑块
    getSlidePasscode(nc_token) {
      this.slideDiaVis = true;
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
          language: "cn",
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
              that.slideDiaVis = false;
            }

            var formData = {};
            formData["sessionId"] = csessionid;
            formData["sig"] = sig;
            that.checkOrderInfo(formData);
          },
          error: function (s) {
            console.log(s);
          },
        });
        NoCaptcha.setEnabled(true);
        nc.reset(); //请务必确保这里调用一次reset()方法
        NoCaptcha.upLang("zh", {
          LOADING: "加载中...", //加载
          SLIDER_LABEL: "请按住滑块，拖动到最右边，提交订单", //等待滑动
          CHECK_Y: "验证通过", //通过
          ERROR_TITLE: "非常抱歉，这出错了...", //拦截
          CHECK_N: "验证未通过", //准备唤醒二次验证
          OVERLAY_INFORM: "经检测你当前操作环境存在风险，请输入验证码", //二次验证
          TIPS_TITLE: "验证码错误，请重新输入", //验证码输错时的提示
        });
      });
    },
    // 检查订单并校验滑块验证
    async checkOrderInfo(formData) {
      let params = formData;
      let loadingid = this.$common.loading(
        "订单正在提交确认中，请稍等...",
        this
      );
      let { data, error } = await api.checkSlidePassCodeForOrder(params);
      // 关闭遮罩层
      loadingid.close();
      if (error) {
        console.log(error);
        this.$common.errorMsg("订单提交失败", this);
      } else {
        if (data.code === 200) {
          this.consoleLog=this.currentTime+" => 出票成功 . . .\n"+data.message+"\n"+this.consoleLog;
          // 订单出票成功
          this.$common.confirm(data.message, "订单提示", () => {}, this);
        } else {
          this.consoleLog=this.currentTime+" => 出票失败 . . .\n原因："+data.message+"\n"+this.consoleLog;
          // 订单出票失败
          this.$common.confirm(data.message, "订单提示", () => {}, this);
        }
      }
    },
    // 提交预定订单
    submitOrder() {
      let passArr = [];
      for (let pass of this.submitOrderForm.passengerInfoList) {
        for (let item of this.passengersData) {
          if (pass == item.passengerName) {
            passArr.push(item);
            break;
          }
        }
      }

      let ticketInfo = {};
      for (let item of this.submitOrderForm.ticketInfo) {
        if (this.submitOrderForm.selectTicket == item.trainCode) {
          ticketInfo = item;
          break;
        }
      }
      let params = {
        fromStationCode: this.queryForm.fromStationCode, // 出发地车站编号
        toStationCode: this.queryForm.toStationCode, // 目的地车站编号
        fromDate: this.queryForm.fromDate, // 出发日期
        ticketType: "TICKETS",
        ticketInfo: ticketInfo, // 车票信息
        passengerInfoList: passArr, // 乘车人信息
        seatType: this.submitOrderForm.seatType[0], // 座位类型
      };

      if (params.fromStationCode == "") {
        this.$common.errorMsg("出发地车站为空", this);
        return false;
      } else if (params.toStationCode == "") {
        this.$common.errorMsg("目的地车站为空", this);
        return false;
      } else if (params.fromDate == "") {
        this.$common.errorMsg("出发日期为空", this);
        return false;
      } else if (Object.keys(params.ticketInfo).length == 0) {
        this.$common.errorMsg("请选择出发车次", this);
        return false;
      } else if (params.seatType == null) {
        this.$common.errorMsg("请选择座位", this);
        return false;
      } else if (params.passengerInfoList.length <= 0) {
        this.$common.errorMsg("请选择乘车人", this);
        return false;
      }

      // 保存订单数据
      localStorage.setItem("order_data", JSON.stringify(params));

      // 准点预售
      if (this.submitOrderForm.isYS == "Y") {
        if (this.submitOrderForm.ysTime == "") {
          this.$common.errorMsg("请设置预售时间", this);
          return false;
        }
        let todayDate = new Date();
        let ysDate = new Date(
          todayDate.format("yyyy-MM-dd") +
            " " +
            this.submitOrderForm.ysTime +
            ":00"
        );
        let residueTime = ysDate.getTime() - todayDate.getTime();
        console.log(
          "距离预售时间预计还剩: " + parseInt(residueTime / 1000 / 60) + "/min"
        );

        // 提交订单前3秒刷新车票信息并重新获取用户名，防止提交订单失效
        this.excuteGetUserNameId = setTimeout(() => {
          this.refushTickets();
          // this.getUserName();
        }, residueTime - 3000);

        // 设置订单定时任务
        this.excuteSubmitOrderTimeId = setTimeout(() => {
          let orderData = JSON.parse(localStorage.getItem("order_data"));
          // this.$common.successMsg("测试完成", this);
          this.executeSubmitOrder(orderData);
        }, residueTime);

        this.$common.successMsg(
          "本次订单为准点预售，将在" +
            this.submitOrderForm.ysTime +
            "分自动提交订单，届时请留意浏览器提示",
          this
        );
      } else {
        // this.refushTickets();
        // this.getUserName();
        let orderData = JSON.parse(localStorage.getItem("order_data"));
        // this.$common.successMsg("测试完成", this);
        // 非准点预售
        this.executeSubmitOrder(orderData);
      }
    },
    // 执行提交订单
    async executeSubmitOrder(params) {
      this.consoleLog=this.currentTime+" => 开始提交订单 . . .\n"+this.consoleLog;
      let loadingid = this.$common.loading("订单正在预定中，请稍等...", this);
      this.consoleLog=this.currentTime+" => 订单正在提交中，请耐心等待 . . .\n"+this.consoleLog;
      let { data, error } = await api.submitOrderRequest(params);
      // 关闭遮罩层
      loadingid.close();
      if (error) {
        console.log(error);
        this.$common.errorMsg("订单预定提交失败", this);
      } else {
        console.log("本次订单提交结果: " + JSON.stringify(data));
        if (data.code == 200) {
          if (data.isSlidePassCode == 1) {
             this.consoleLog=this.currentTime+" => 订单提示：\n本次订单提交需要滑块验证，请注意浏览器页面出现的滑块 . . .\n"+this.consoleLog;
            // 本次订单，需要滑块验证，准备初始化滑块验证
            this.getSlidePasscode(data.data.ifCheckSlidePasscodeToken);
          } else if (data.isSlidePassCode == 0) {
            this.consoleLog=this.currentTime+" => 出票成功 . . .\n"+data.message+"\n"+this.consoleLog;
            // 本次订单，不需要滑块验证，并出票成功
            this.$common.confirm(data.message, "订单提示", () => {}, this);
          }
        } else {
          this.consoleLog=this.currentTime+" => 出票失败 . . .\n原因："+data.message+"\n"+this.consoleLog;
          this.$common.confirm(data.message, "订单提示", () => {}, this);
        }
      }
    },
    // 刷新车票信息
    async refushTickets() {
      let params = this.queryForm;
      let { data, error } = await api.getTickets(params);
      if (error) {
        console.log(error);
        this.tabLoading = false;
      } else {
        if (data.data.ticketInfos) {
          let orderData = JSON.parse(localStorage.getItem("order_data"));
          console.log("befor-ticket:" + JSON.stringify(orderData));
          for (let item of data.data.ticketInfos) {
            if (orderData.ticketInfo.trainCode == item.trainCode) {
              orderData.ticketInfo = item;
              break;
            }
          }
          this.$common.successMsg("车次刷新成功", this);
          localStorage.setItem("order_data", JSON.stringify(orderData));
          console.log("after-ticket:" + JSON.stringify(orderData));
        }
      }
    },
    // 获取选中的车次
    selectTicket(val) {
      console.log(val);
      let ticket = [];
      for (let tick of val) {
        for (let item of this.ticketArray) {
          if (tick.trainCode == item.trainCode) {
            ticket.push(item);
            break;
          }
        }
      }

      this.submitOrderForm.ticketInfo = ticket;
      console.log("车票信息:" + QS.stringify(this.submitOrderForm.ticketInfo));
    },
    submitOrderDiaVisClose(formName) {
      // 余票捡漏时，不清空表单内容
      if (!this.isStartTicketBug) {
        this.$refs[formName].resetFields();
      }
    },
    // 获取可用cdn数量
    async getCdnCount() {
      let params = {};
      let { data, error } = await api.getCdnCount(params);
      if (error) {
        console.log(error);
      } else {
        this.cdnCount = data.data;
      }
    },
    // 订单主界面操作配置
    orderMainSetting(operate) {
      if (operate == 1) {
        // 抢票配置
        if (this.isStartTicketBug) {
          this.$common.warningMsg(
            "目前正在进行余票捡漏，不可进行抢票，如需抢票，请先停止余票捡漏",
            this
          );
          return false;
        }
        this.isTicketBug = "N";
      } else {
        // 捡漏配置
        this.isTicketBug = "Y";
      }
      this.submitOrderDiaVis = true;
    },
    // 余票捡漏
    async TicketBugSetting() {
      let passArr = [];
      let trainCodes = [];
      for (let pass of this.submitOrderForm.passengerInfoList) {
        for (let item of this.passengersData) {
          if (pass == item.passengerName) {
            passArr.push(item);
            break;
          }
        }
      }
      for (let item of this.submitOrderForm.ticketInfo) {
        trainCodes.push(item.trainCode);
      }
      let params = {
        fromStationCode: this.queryForm.fromStationCode, // 出发地车站编号
        toStationCode: this.queryForm.toStationCode, // 目的地车站编号
        fromDateList: [this.queryForm.fromDate], // 出发日期
        ticketType: "TICKETS",
        passengerInfos: passArr, // 乘车人信息
        seatTypes: this.submitOrderForm.seatType, // 座位类型
        trainCodeList: trainCodes,
      };
      // debugger;
      let { data, error } = await api.monitorTicketsLeft(params);
      if (error) {
        console.log(error);
      } else {
        this.queryTicketCount = this.queryTicketCount + 1;
        let queryResultMsg =
          "" +
          this.currentTime +
          " => 第[" +
          this.queryTicketCount +
          "]次，查询间隔[3.0]s\n";
        this.consoleLog = queryResultMsg + this.consoleLog;
        if (data.code == 500 && data.data.ticket) {
          let queryResultMsg =this.currentTime+" => 监控到有符合条件的车次：\n余票监控结果 -> 车次："+data.data.ticket.trainCode+"，余票数量："+data.data.count+"，座位："+this.convertSeatType(data.data.seatType)+"\n";
          this.consoleLog = queryResultMsg + this.consoleLog;
          // 监测到有余票，开始准备订单提交操作
          let ticketBugParams = {
            fromStationCode: this.queryForm.fromStationCode, // 出发地车站编号
            toStationCode: this.queryForm.toStationCode, // 目的地车站编号
            fromDate: this.queryForm.fromDate, // 出发日期
            ticketType: "TICKETS",
            ticketInfo: data.data.ticket, // 车票信息
            passengerInfoList: data.data.passengerInfos, // 乘车人信息
            seatType: data.data.seatType, // 座位类型
          };
          // 保存订单数据
          // localStorage.setItem("order_data", JSON.stringify(ticketBugParams));
          // 停止余票监控
          this.isStartTicketBug = false;
          clearInterval(this.ticketBugTimerId);
          // 开始提交订单
          this.executeSubmitOrder(ticketBugParams);
        }
      }
    },
    // 停止余票捡漏
    stopTicketBug() {
      this.$common.confirm(
        "确定要停止余票捡漏吗？",
        "监控提示",
        () => {
          this.isStartTicketBug = false;
          clearInterval(this.ticketBugTimerId);
        },
        this
      );
    },
    // 开始余票捡漏
    startTicketBug() {
      if (this.submitOrderForm.ticketInfo.length == 0) {
        this.$common.errorMsg("请选择出发车次", this);
        return false;
      } else if (this.submitOrderForm.passengerInfoList.length == 0) {
        this.$common.errorMsg("请选择乘车人", this);
        return false;
      } else if (this.submitOrderForm.seatType.length == 0) {
        this.$common.errorMsg("请选择座位", this);
        return false;
      }
      let trainCodeStr = "";
      for (let item of this.submitOrderForm.ticketInfo) {
        trainCodeStr = trainCodeStr + item.trainCode + "\t\t";
      }
      let seatTypeStr = "";
      for (let item of this.submitOrderForm.seatType) {
        let seatTypeName = this.convertSeatType(item);
        seatTypeStr = seatTypeStr + seatTypeName + "\t\t";
      }
      let passStr = "";
      for (let item of this.submitOrderForm.passengerInfoList) {
        passStr = passStr + item + "\t\t";
      }
      let msg =
        "出发日期：" +
        this.queryForm.fromDate +
        "车次：" +
        trainCodeStr +
        "座位：" +
        seatTypeStr +
        "乘车人：" +
        passStr;

      let newDatas = [];
      const h = this.$createElement;
      newDatas.push(h("p", null, "在捡漏前请确认以下信息是否选择无误："));
      newDatas.push(h("p", null, "出发日期：" + this.queryForm.fromDate));
      newDatas.push(h("p", null, "车次：" + trainCodeStr));
      newDatas.push(h("p", null, "座位：" + seatTypeStr));
      newDatas.push(h("p", null, "乘车人：" + passStr));
      this.$common.confirm(
        h("div", null, newDatas),
        "余票捡漏",
        () => {
          this.isStartTicketBug = true;
          this.consoleLog = ""; // 清空控制台监控日志
          this.queryTicketCount = 0; // 清空监控次数
          this.submitOrderDiaVis = false;
          this.$common.successMsg("开始余票捡漏", this);
          this.ticketBugTimerId = setInterval(() => {
            this.TicketBugSetting();
          }, 3000);
        },
        this
      );
    },
    convertSeatType(seatTypeCode) {
      let result = "";
      if (seatTypeCode == "FIRST_SEAT") {
        result = "一等座";
      } else if (seatTypeCode == "SECOND_SEAT") {
        result = "二等座";
      } else if (seatTypeCode == "BUSINESS_SEAT") {
        result = "商务座";
      } else if (seatTypeCode == "HIGH_SOFT_SLEEP") {
        result = "高级软卧";
      } else if (seatTypeCode == "SOFT_SLEEP") {
        result = "软卧";
      } else if (seatTypeCode == "HARD_SLEEP") {
        result = "硬卧";
      } else if (seatTypeCode == "SOFT_SEAT") {
        result = "软座";
      } else if (seatTypeCode == "HARD_SEAT") {
        result = "硬座";
      } else if (seatTypeCode == "NONE_SEAT") {
        result = "无座";
      } else if (seatTypeCode == "SECOND_SOFT_SLEEP") {
        result = "动车二等卧";
      } else if (seatTypeCode == "FIRST_SOFT_SLEEP") {
        result = "动车一等卧";
      } else if (seatTypeCode == "SPECIAL_SEAT") {
        result = "特等座";
      }
      return result;
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
  height: 54px;
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
  font-size: 13px;
}
.console-log /deep/ .el-textarea__inner{
  color: black;
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