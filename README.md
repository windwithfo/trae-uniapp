# 小程序登录页面 - 使用说明

## 📱 项目概述
这是一个基于uni-app框架开发的小程序登录页面，使用了蓝色主题设计，集成了uni-ui组件库。

## 🎨 设计特色
- **蓝色主题**：采用#1890ff为主色调的渐变设计
- **现代化UI**：圆角卡片式布局，视觉效果佳
- **响应式设计**：适配不同屏幕尺寸
- **完整功能**：包含表单验证、登录逻辑、用户反馈

## 🚀 快速开始

### 环境要求
- 微信开发者工具
- HBuilderX（推荐）
- 或支持uni-app的其他IDE

### 预览步骤

#### 方法一：使用HBuilderX（推荐）
1. 打开HBuilderX
2. 点击"文件" → "打开目录"，选择本项目根目录
3. 点击"运行" → "运行到小程序模拟器" → "微信开发者工具"
4. 项目将自动在微信开发者工具中打开

#### 方法二：使用微信开发者工具直接打开
1. 打开微信开发者工具
2. 点击"导入项目"
3. 选择项目根目录下的`unpackage/dist/build/mp-weixin`目录（需要先构建）
4. 填写小程序AppID（测试可使用测试号）
5. 点击"导入"即可预览

#### 方法三：命令行构建（高级用户）
```bash
# 安装依赖
npm install

# 构建微信小程序
npm run build:mp-weixin

# 在微信开发者工具中导入 dist/build/mp-weixin 目录
```

## 📁 项目结构
```
trae-uniapp/
├── pages/
│   └── login/
│       └── login.vue          # 登录页面主文件
├── pages.json                 # 页面路由配置
├── manifest.json             # 小程序配置
├── uni.scss                  # 全局样式变量
├── package.json              # 项目依赖
└── login-preview.html        # 页面预览文件
```

## 🔧 主要功能

### 登录页面功能
- ✅ 账号密码输入
- ✅ 表单验证（账号≥3位，密码≥6位）
- ✅ 登录按钮加载状态
- ✅ 登录成功/失败提示
- ✅ 忘记密码和注册入口
- ✅ 响应式布局设计

### 使用的uni-ui组件
- `<uni-forms>`：表单组件
- `<uni-easyinput>`：输入框组件
- `<uni-forms-item>`：表单项组件

## 🎨 自定义修改

### 修改主题色
1. 打开`pages/login/login.vue`
2. 修改样式中的颜色值：
   ```scss
   // 背景渐变
   background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
   
   // 按钮颜色
   background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
   
   // 链接颜色
   color: #1890ff;
   ```

### 修改表单验证规则
在`login.vue`的`rules`对象中修改：
```javascript
const rules = {
  username: {
    rules: [
      { required: true, errorMessage: '请输入账号' },
      { minLength: 3, errorMessage: '账号长度不能少于3位' }
    ]
  },
  password: {
    rules: [
      { required: true, errorMessage: '请输入密码' },
      { minLength: 6, errorMessage: '密码长度不能少于6位' }
    ]
  }
}
```

### 添加更多登录方式
可以在页面底部添加其他登录方式，如：
- 手机号登录
- 微信登录
- QQ登录

## 📱 真机调试
1. 在微信开发者工具中点击"预览"
2. 使用微信扫描二维码
3. 在手机上体验真实效果

## 🔍 常见问题

### Q: 页面显示异常？
A: 确保已正确安装uni-ui组件库，检查控制台是否有错误信息。

### Q: 表单验证不生效？
A: 检查`uni-forms`和`uni-forms-item`的绑定是否正确。

### Q: 如何在其他页面使用登录功能？
A: 可以将登录逻辑提取到单独的JS文件中，在需要的地方导入使用。

## 📞 技术支持
- uni-app官方文档：https://uniapp.dcloud.net.cn/
- uni-ui组件文档：https://uniapp.dcloud.net.cn/component/uniui/overview.html
- 微信小程序文档：https://developers.weixin.qq.com/miniprogram/dev/framework/

---

**提示**：你可以直接打开`login-preview.html`文件在浏览器中预览页面设计效果！