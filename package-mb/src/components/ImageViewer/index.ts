import type { VNode } from 'vue';

import type { ImageViewerProps } from './src/types';

import type { Nullable } from '#/types';

import { createVNode, render } from 'vue';

import { isClient } from '#/utils/is';

import ImageViewer from './src/ImageViewer.vue';

let instance: Nullable<VNode> = null;

export function createImageViewer(options: ImageViewerProps) {
  if (!isClient) return;
  const {
    hideOnClickModal = false,
    infinite = true,
    initialIndex = 0,
    show = true,
    teleported = false,
    urlList,
    zIndex = 2000,
  } = options;

  const propsData: Partial<ImageViewerProps> = {};
  const container = document.createElement('div');
  propsData.urlList = urlList;
  propsData.initialIndex = initialIndex;
  propsData.infinite = infinite;
  propsData.hideOnClickModal = hideOnClickModal;
  propsData.teleported = teleported;
  propsData.zIndex = zIndex;
  propsData.show = show;

  document.body.append(container);
  instance = createVNode(ImageViewer, propsData);
  render(instance, container);
}
