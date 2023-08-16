# SpecialTemplate

> 专题模板

### 项目结构
```bash
└── SpecialTemplate
    ├── README.md 
    ├── build     构建模块
    ├── common    公共部分
    ├── dist      构建结果
    └── src       
        ├── CMS   后台部分
        └── Page  页面部分
```
### 注
##### 1. 运行项目
```
npm install
npm dev
href-CMS  -> ip:8098/CMS.html#/list
href-Page -> ip:8098/Page.html#/index
```
##### 2. 创建模板流程
> Page部分
>+ 在 Page/views/ 中新建对应模板文件
>+ 在 Page/views/index/data.js 中添加对应文件路径
>+ 无需配置路由 
> 
> CMS部分
>+ 在 CMS/views/Temps 中新增对应模板
>+ 在组件中引入 Page 中对应模板

##### 3. git branch 
```
GitLab
    ├── master    主分支 线上版本 
    ├── release   待发布分支
    ├── dev       开发主分支
    └── test      测试分支
```
##### 4. 分支操作流程
```
git checkout release            切换至待发布分支
git pull                        更新远程代码
git checkout -b feature_xxx     新建本地分支开发
git commit                      提交
git checkout test               切换至测试分支
git pull                        更新远程代码
git merge feature_xxx           合并新功能
git push                        同步至远程
-----------------------功能测试-----------------          
git checkout dev                切换至开发主分支
git pull                        更新远程代码
git merge feature_xxx           合并新功能
git push                        同步至远程
-----------------------版本测试-----------------
git checkout release            切换至待发布分支
git merge dev                   合并版本
-----------------------发布完成-----------------
git checkout master             切换至主分支
git merge release               合并版本
```