import type { VNode } from 'vue';

import type { Nullable } from '#/types';

import { createVNode, render } from 'vue';

import { VideoPlayerViewer } from '#/components/VideoPlayerViewer';
import { toAnyString } from '#/utils';
import { isClient } from '#/utils/is';

let instance: Nullable<VNode> = null;

export function createVideoViewer(options: {
  poster?: string;
  show?: boolean;
  url: string;
}) {
  if (!isClient) return;
  const { poster, url } = options;

  const propsData: Partial<{
    id?: string;
    poster?: string;
    show?: boolean;
    url: string;
  }> = {};
  const container = document.createElement('div');
  const id = toAnyString();
  container.id = id;
  propsData.url = url;
  propsData.poster = poster;
  propsData.show = true;
  propsData.id = id;

  document.body.append(container);
  instance = createVNode(VideoPlayerViewer, propsData);
  render(instance, container);
}

export { default as VideoPlayer } from './src/VideoPlayer.vue';
