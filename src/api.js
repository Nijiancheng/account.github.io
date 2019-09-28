import {
  resolve
} from "url";
import {
  reject
} from "q";

const ip = 'http://jizhang-api-dev.it266.com/api';

//获取图片
const GetImg = ip + '/captcha';
//登录
const Login = ip + '/user/token/mobile';
//获取验证码
const Verify = ip + '/sms/verify';
//注册
const Reg = ip + '/user/register';
//获取用户信息
const User = ip + `/user/profile?token=`;
//图片上传
const UploadImg = ip + '/upload/image?token=';
//修改个人资料
const UserInfoEdit = ip + '/user/profile/update?token=';
//成员
const Member = ip + '/member?token=';
//账簿
const Book = ip + '/book?token=';
//账单明细(全部)
const Record = ip + '/record/account?token=';
//当前账簿
const BookGet = ip + '/book/get-default?token=';
//退出登录
const UserOut = ip + '/user/logout?token=';
//修改密码
const UpdatePass = ip + '/user/password?token=';
//修改手机号
const UpdateMobile = ip + '/user/mobile?token=';
//获取账户
const Account = ip + '/account?token=';
//删除账户
const DelAcc = {
  Url1: ip + '/account/delete?id=',
  Url2: '&token=',
}
//添加账户
const AccAdd = ip + '/account/create?token=';
//账户详情
const AccDetail = {
  Url1: ip + '/account/detail?id=',
  Url2: '&token='
}
//账户编辑
const AccEdit = {
  Url1: ip + '/account/update?id=',
  Url2: '&token='
}
//删除账簿
const BookDel = ip + '/book/delete?token=';
//切换当前账簿
const BookSet = ip + '/book/set-default?token=';
//添加账簿
const BookAdd = ip + '/book/create?token=';
//账簿编辑
const BookEdit = ip + '/book/update?token=';
//账簿详情
const BookDate = ip + '/book/detail?token=';
//全部类别
const Cate = ip + '/category?token=';
//删除类别
const CateDel = {
  Url1: ip + '/category/delete?id=',
  Url2: '&token='
}
//添加类别
const CateAdd = ip + '/category/create?token=';
//编辑类别
const CateEdit = {
  Url1: ip + '/category/update?id=',
  Url2: '&token='
}
//成员列表
const MemberList = ip + '/member?token=';
//删除成员
const MemberDel = ip + '/member/delete?token=';
//成员添加
const MemberAdd = ip + '/member/add?token=';
//意见反馈
const Feed = ip + '/feedback/add?token=';
//提交账单
const SubAcc = ip + '/record/create?token=';
//待付款收款
const WaitRP = ip + '/record/account/waiting?token=';
//总数据
const View = ip + '/view/home?token=';
//删除订单
const Del = {
  Url1: ip + '/record/delete?id=',
  Url2: '&token='
}
//订单详情
const RecDetail = {
  Url1: ip + '/record/detail?id=',
  Url2: '&token='
}
//修改账单
const RecEdit = {
  Url1: ip + '/record/update?id=',
  Url2: '&token='
}
//未结清修改
const RecItemEdit = {
  Url1: ip + '/record/item/update?itemId=',
  Url2: '&token='
}
//后续记账提交
const Sequel = ip + '/record/sequel?token=';




//全部抛出
export default {
  GetImg: GetImg,
  Login: Login,
  Verify: Verify,
  Reg: Reg,
  User: User,
  UploadImg: UploadImg,
  UserInfoEdit: UserInfoEdit,
  Member: Member,
  Book: Book,
  Record: Record,
  BookGet: BookGet,
  UserOut: UserOut,
  UpdatePass: UpdatePass,
  UpdateMobile: UpdateMobile,
  Account: Account,
  DelAcc: DelAcc,
  AccAdd: AccAdd,
  AccDetail: AccDetail,
  AccEdit: AccEdit,
  BookDel: BookDel,
  BookSet: BookSet,
  BookAdd: BookAdd,
  BookEdit: BookEdit,
  BookDate: BookDate,
  Cate: Cate,
  CateDel: CateDel,
  CateAdd: CateAdd,
  CateEdit: CateEdit,
  MemberList: MemberList,
  MemberDel: MemberDel,
  MemberAdd: MemberAdd,
  Feed: Feed,
  SubAcc: SubAcc,
  WaitRP: WaitRP,
  View: View,
  Del: Del,
  RecDetail: RecDetail,
  RecEdit: RecEdit,
  RecItemEdit: RecItemEdit,
  Sequel: Sequel
}
