<script setup lang="ts">
// @ts-nocheck
import type { UploadFile } from 'element-plus';

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  watch,
} from 'vue';

import { useDebounceFn } from '@vueuse/core';
import Cropper from 'cropperjs';
import { ElDivider, ElMessage, ElTooltip, ElUpload } from 'element-plus';

import { BaseButton } from '#/components/Button';

import 'cropperjs/dist/cropper.min.css';

const props = defineProps({
  boxHeight: {
    default: 320,
    type: [Number, String],
  },
  boxWidth: {
    default: 425,
    type: [Number, String],
  },
  cropBoxHeight: {
    default: 200,
    type: Number,
  },
  cropBoxWidth: {
    default: 200,
    type: Number,
  },
  imageUrl: {
    default: '',
    required: true,
    type: String,
  },
  showActions: {
    default: true,
    type: Boolean,
  },
  showResult: {
    default: true,
    type: Boolean,
  },
});

const getBase64 = useDebounceFn(() => {
  imgBase64.value = unref(cropperRef)?.getCroppedCanvas()?.toDataURL() ?? '';
}, 80);

const resetCropBox = () => {
  const containerData = unref(cropperRef)?.getContainerData();
  unref(cropperRef)?.setCropBoxData({
    height: props.cropBoxHeight,
    left: (containerData?.width || 0) / 2 - 100,
    top: (containerData?.height || 0) / 2 - 100,
    width: props.cropBoxWidth,
  });
  imgBase64.value = unref(cropperRef)?.getCroppedCanvas()?.toDataURL() ?? '';
};

const getBoxStyle = computed(() => {
  return {
    height: `${props.boxHeight}px`,
    width: `${props.boxWidth}px`,
  };
});

const getCropBoxStyle = computed(() => {
  return {
    height: `${props.cropBoxHeight}px`,
    width: `${props.cropBoxWidth}px`,
  };
});

// 获取对应的缩小倍数的宽高
const getScaleSize = (scale: number) => {
  return {
    height: `${props.cropBoxHeight * scale}px`,
    width: `${props.cropBoxWidth * scale}px`,
  };
};

const imgBase64 = ref('');
const imgRef = ref<HTMLImageElement>();
const cropperRef = ref<Cropper>();
const intiCropper = () => {
  if (!unref(imgRef)) return;
  const imgEl = unref(imgRef)!;
  cropperRef.value = new Cropper(imgEl, {
    aspectRatio: 1,
    checkCrossOrigin: false,
    crop() {
      getBase64();
    },
    cropmove() {
      getBase64();
    },
    dragMode: 'move',
    ready() {
      resetCropBox();
    },
    // cropBoxResizable: false,
    // cropBoxMovable: false,
    toggleDragModeOnDblclick: false,
    viewMode: 1,
    zoom() {
      getBase64();
    },
  });
};

const uploadChange = (uploadFile: UploadFile) => {
  // 判断是否是图片
  if (uploadFile?.raw?.type.indexOf('image') === -1) {
    ElMessage.error('请上传图片格式的文件');
    return;
  }
  if (!uploadFile.raw) return;
  // 获取图片的访问地址
  const url = URL.createObjectURL(uploadFile.raw);
  unref(cropperRef)?.replace(url);
};

const reset = () => {
  unref(cropperRef)?.reset();
};

const rotate = (deg: number) => {
  unref(cropperRef)?.rotate(deg);
};

const scaleX = ref(1);
const scaleY = ref(1);
const scale = (type: 'scaleX' | 'scaleY') => {
  if (type === 'scaleX') {
    scaleX.value = scaleX.value === 1 ? -1 : 1;
    unref(cropperRef)?.[type](unref(scaleX));
  } else {
    scaleY.value = scaleY.value === 1 ? -1 : 1;
    unref(cropperRef)?.[type](unref(scaleY));
  }
};

const zoom = (num: number) => {
  unref(cropperRef)?.zoom(num);
};

onMounted(() => {
  intiCropper();
});

watch(
  () => props.imageUrl,
  async (url) => {
    if (url) {
      unref(cropperRef)?.replace(url);
      await nextTick();
      resetCropBox();
    }
  },
);

onBeforeUnmount(() => {
  unref(cropperRef)?.destroy();
});

defineExpose({
  cropperExpose: cropperRef,
});
</script>

<template>
  <div
    class="image-cropping"
    :class="{
      'flex items-center': showResult,
    }"
  >
    <div>
      <div :style="getBoxStyle" class="flex items-center justify-center">
        <img
          v-show="imageUrl"
          ref="imgRef"
          :src="imageUrl"
          class="block max-w-full"
          crossorigin="anonymous"
          alt=""
          srcset=""
        />
      </div>
      <div v-if="showActions" class="mt-10px flex items-center">
        <div class="flex items-center">
          <ElTooltip content="选择文件" placement="bottom">
            <ElUpload
              action="''"
              accept="image/*"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="uploadChange"
            >
              <BaseButton size="small" type="primary" class="mt-2px">
                <Icon icon="ep:upload-filled" />
              </BaseButton>
            </ElUpload>
          </ElTooltip>
        </div>
        <div class="flex flex-1 items-center justify-end">
          <ElTooltip content="重置" placement="bottom">
            <BaseButton size="small" type="primary" @click="reset">
              <Icon icon="ep:refresh" />
            </BaseButton>
          </ElTooltip>
          <ElTooltip content="逆时针旋转" placement="bottom">
            <BaseButton size="small" type="primary" @click="rotate(-45)">
              <Icon icon="ant-design:rotate-left-outlined" />
            </BaseButton>
          </ElTooltip>
          <ElTooltip content="顺时针旋转" placement="bottom">
            <BaseButton size="small" type="primary" @click="rotate(45)">
              <Icon icon="ant-design:rotate-right-outlined" />
            </BaseButton>
          </ElTooltip>
          <ElTooltip content="水平翻转" placement="bottom">
            <BaseButton size="small" type="primary" @click="scale('scaleX')">
              <Icon icon="vaadin:arrows-long-h" />
            </BaseButton>
          </ElTooltip>
          <ElTooltip content="垂直翻转" placement="bottom">
            <BaseButton size="small" type="primary" @click="scale('scaleY')">
              <Icon icon="vaadin:arrows-long-v" />
            </BaseButton>
          </ElTooltip>
          <ElTooltip content="放大" placement="bottom">
            <BaseButton size="small" type="primary" @click="zoom(0.1)">
              <Icon icon="ant-design:zoom-in-outlined" />
            </BaseButton>
          </ElTooltip>
          <ElTooltip content="缩小" placement="bottom">
            <BaseButton size="small" type="primary" @click="zoom(-0.1)">
              <Icon icon="ant-design:zoom-out-outlined" />
            </BaseButton>
          </ElTooltip>
        </div>
      </div>
    </div>
    <div v-if="imgBase64 && showResult" class="ml-20px">
      <div class="flex items-center justify-center">
        <img :src="imgBase64" class="rounded-[50%]" :style="getCropBoxStyle" />
      </div>
      <ElDivider />
      <div class="flex items-center justify-center">
        <img
          :src="imgBase64"
          class="rounded-[50%]"
          :style="getScaleSize(0.2)"
        />
        <img
          :src="imgBase64"
          class="ml-20px rounded-[50%]"
          :style="getScaleSize(0.25)"
        />
        <img
          :src="imgBase64"
          class="ml-20px rounded-[50%]"
          :style="getScaleSize(0.3)"
        />
        <img
          :src="imgBase64"
          class="ml-20px rounded-[50%]"
          :style="getScaleSize(0.35)"
        />
      </div>
    </div>
  </div>
</template>
