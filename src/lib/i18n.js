import _ from 'underscore';

const dict = {
  male: '男',
  female: '女',
  pending: '邀请中',
  normal: '已加入',
  rejected: '已拒绝',

  processing: '审批中',
  approved: '同意',
  //rejected: '驳回',
  revoked: '已撤回',

  name: 'label',
  _id: 'key',

  admin: '管理员',
  owner: '所有者',

  notice: '事务通知',
  news: '企业新闻',

  // action
  'add': '添加',
  'remove': '移除',
  'create': '创建',
  'update': '更新',
  'delete': '删除',
  'tansfer': '转让',
  'accept': '接受',
  'approve': '通过',
  'reject': '拒绝',
  'revoke': '撤回',
  'submit': '提交',
  'copy': '抄送',
  'cancel': '取消',
  'complete': '完成',
  'reopen': '重新开启',
  'follow': '关注',
  'unfollow': '取消关注',
  'rename': '重命名',
  'upload': '上传',
  'reminding': '提醒',
  'sign': '签到',
  'sign.audit': '补签',
  'release': '发布',
  'system.set': '系统设置',
  'schedule.remind': '您有新的',

  // object_type
  'field': '内容',
  'announcement': '公告',
  'approval.item': '审批申请',
  'approval.template': '审批模板',
  'attendance': '签到',
  'company': '公司',
  'company.member': '公司成员',
  'company.dir': '文件夹',
  'company.file': '文件',
  'document.dir': '文件夹',
  'dir.file': '文件',
  'project': '项目',
  'project.tag': '标签',
  'project.member': '项目成员',
  'project.dir': '文件夹',
  'project.file': '文件',
  'reminding': '日程提醒',
  'request': '请求',
  'schedule': '日程',
  'task': '任务',
  'task.tag': '任务标签',
  'task.follower': '任务关注者',

  'activiate_code_invalid': '激活码无效',
  'activiate_code_expired': '激活码已过期',
  'already_activiated': '您已经激活过了，请直接登录',

  'sms_code_invalid': '验证码错误',
  'sms_code_expired': '验证码已过期，请重新获取',

  'user_exists': '该帐户已存在',
};

let i18n = {};
i18n.translate = text => {
  if (_.has(dict, text)) {
    return dict[text];
  } else {
    return text;
  }
};

export const __ = i18n.translate;
