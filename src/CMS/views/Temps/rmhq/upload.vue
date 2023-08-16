<template>
<div class="uploadImg">
	<el-upload
		:auto-upload="false"
		:limit="1"
		:on-change="handleBgChange"
		:on-exceed="handleBgExceed"
		:on-remove="handleRemoveBg"
		:action="''"
		:file-list="bg"
		list-type="picture"
		accept="image/*"
		class="uploader"
	>
		<span class="flex-center">
			<span style="font-size:14px;color:#000">{{title}}</span>
			<el-button size="mini" type="primary">点击上传</el-button>
		</span>
		<span slot="file" slot-scope="{file}">
			<img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
			<span class="el-upload-list__item-actions">
				<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
					<i class="el-icon-zoom-in" />
				</span>
				<span class="el-upload-list__item-preview" @click="handleRemoveBg(file)">
					<i class="el-icon-delete" />
				</span>
			</span>
		</span>
		<el-dialog :visible.sync="dialogVisible" :append-to-body="true">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</el-upload>
</div>
</template>

<script>
export default {
	data() {
		return {
			dialogImageUrl: '',
			dialogVisible: false,
			bg: []
		}
	},
	props: {
		title: String,
		img: String||null,
	},
	watch: {
		img: {
			handler(nv) {
				if (nv) {
					this.bg = [{url: nv}]
				}
			},
			immediate:true,
		}
	},
	methods: {
		// 预览
      handlePreview(img) {
				this.$emit('change', img)
        // this.getParams(params => { this.phoneHtml = params }, true)
      },
			// 图片预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
		// 背景图片替换
      handleBgExceed(files, fileList) {
        const [file] = files
        // 格式转换
        const reader = new FileReader()
        let res = ''
        reader.readAsDataURL(file)
        reader.addEventListener('load', () => {
          res = reader.result
          const image = new Image()
          image.onload = () => {
            const dpr = image.width / 750 < 1 ? 1 : image.width / 750 // rem
            // 替换更新
            this.bg = [{ name: file.name, url: URL.createObjectURL(file), image: res, width: image.width / dpr / 100, height: image.height / dpr / 100 }]
            this.handlePreview(res)
          }
          image.src = res
        }, false)
      },
     
      // 背景图片
      handleBgChange(file, fileList) {
        const reader = new FileReader()
        let res = ''
        reader.readAsDataURL(file.raw)
        reader.addEventListener('load', () => {
          res = reader.result
          const image = new Image()
          image.onload = () => {
            const dpr = image.width / 750 < 1 ? 1 : image.width / 750 // rem
            this.bg.push({ name: file.name, url: file.url, image: res, width: image.width / dpr / 100, height: image.height / dpr / 100 })
            this.handlePreview(res)
          }
          image.src = res
        }, false)
      },
      // 删除背景图片
      handleRemoveBg(file, fileList) {
        this.bg = []
        this.handlePreview()
      },
	}
}
</script>

<style lang="scss" scoped>
.uploadImg {
	/deep/  .uploader {
		.el-upload-list {
			width: 80px;
			position: relative;
			.el-upload-list__item {
				transition: none !important;
				&.is-success {
					&:hover {
						&:before {
							content: "";
							width: 100%;
							height: 100%;
							background-color: rgba(0, 0, 0, 0.5);
							position: absolute;
							left: 0;
							top: 0;
							z-index: 2000;
						}
					}
					i {
						position: absolute;
						z-index: 2002;
						color: white;
						font-size: 20px;
						transform: translate(0, -50%);
					}
					.el-icon-zoom-in {
						left: 25%;
						top: 50%;
					}
					.el-icon-delete {
						left: 55%;
						top: 50%;
					}
				}
				.el-upload-list__item-thumbnail {
					margin-left: -75px;
				}
			}
		}
	}
}
</style>