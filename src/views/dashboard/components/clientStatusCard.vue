<template>
  <a-card hoverable style="height: 100%" :header-style="{ height: 'auto' }">
    <template #title>
      <a-typography-title
        :style="{ margin: '0px' }"
        :ellipsis="{
          rows: 2,
          showTooltip: true
        }"
      >
        {{ downloader.name }}
      </a-typography-title>
    </template>
    <a-skeleton v-if="!client" :animation="true">
      <a-space direction="vertical" :style="{ width: '100%' }" :size="0">
        <a-skeleton-line
          :rows="4"
          :line-height="22"
          :line-spacing="14"
          :widths="['60%', '70%', '50%', '60%']"
        />
      </a-space>
    </a-skeleton>
    <a-descriptions
      v-if="client"
      :column="1"
      layout="inline-horizontal"
      class="space"
      :label-style="{ paddingRight: '10px' }"
    >
      <a-descriptions-item :label="t('page.dashboard.clientStatus.card.type')">
        <a-space>
          <a-tag bordered>{{ downloader.type }}</a-tag>
          <a-tooltip :content="downloader.endpoint">
            <icon-info-circle size="large" />
          </a-tooltip>
        </a-space>
      </a-descriptions-item>

      <a-descriptions-item :label="t('page.dashboard.clientStatus.card.status')">
        <a-typography-text :type="getStatusSafe(client)[0]">
          <icon-check-circle-fill v-if="client.lastStatus == ClientStatusEnum.HEALTHY" />
          <icon-close-circle-fill v-if="client.lastStatus == ClientStatusEnum.ERROR" />
          <icon-exclamation-circle-fill v-if="client.lastStatus == ClientStatusEnum.UNKNOWN" />
          {{ t(getStatusSafe(client)[1]) }}
        </a-typography-text>
      </a-descriptions-item>

      <a-descriptions-item
        v-if="client.lastStatus == ClientStatusEnum.HEALTHY"
        :label="t('page.dashboard.clientStatus.card.status.torrentNumber')"
      >
        <a-space>
          <a-tag color="arcoblue" bordered>{{ client.activeTorrents }}</a-tag>
          <a-tooltip :content="t('page.dashboard.torrentList.tips')">
            <a-button
              @click="() => emits('torrent-view-click', downloader.name)"
              shape="circle"
              type="text"
              size="mini"
            >
              <template #icon>
                <icon-eye size="large" style="color: var(--color-text-1)" />
              </template>
            </a-button>
          </a-tooltip>
        </a-space>
      </a-descriptions-item>

      <a-descriptions-item
        v-if="client.lastStatus == ClientStatusEnum.HEALTHY"
        :label="t('page.dashboard.clientStatus.card.status.peerNumber')"
      >
        <a-tag color="arcoblue" bordered>{{ client.activePeers }}</a-tag>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ClientStatusEnum, type ClientStatus, type Downloader } from '@/api/model/clientStatus'
import { useRequest } from 'vue-request'
import { getClientStatus } from '@/service/downloaders'
import { computed } from 'vue'
import { useAutoUpdate } from '@/stores/autoUpdate'
import { useEndpointStore } from '@/stores/endpoint'
const { t } = useI18n()
const statusMap: Record<ClientStatusEnum, [string, string]> = {
  [ClientStatusEnum.HEALTHY]: ['success', 'page.dashboard.clientStatus.card.status.normal'],
  [ClientStatusEnum.ERROR]: ['warning', 'page.dashboard.clientStatus.card.status.error'],
  [ClientStatusEnum.UNKNOWN]: ['danger', 'page.dashboard.clientStatus.card.status.unknown']
}
const props = defineProps<{
  downloader: Downloader
}>()

const emits = defineEmits<{
  (e: 'torrent-view-click', name: string): void
}>()

const downloader = computed(() => props.downloader)
const autoUpdateState = useAutoUpdate()
const endpointState = useEndpointStore()

const getStatusSafe = (status: ClientStatus | undefined): string[] =>
  statusMap[status?.lastStatus ?? ClientStatusEnum.UNKNOWN] ?? statusMap[ClientStatusEnum.UNKNOWN]

const { data: client } = useRequest(getClientStatus, {
  pollingInterval: computed(() => autoUpdateState.pollingInterval),
  onSuccess: autoUpdateState.renewLastUpdate,
  cacheKey: () => `${endpointState.endpoint}-clientStatus-${downloader.value.name}`,
  defaultParams: [downloader.value.name],
  refreshDeps: [() => downloader.value.name],
  refreshDepsAction: () => {
    autoUpdateState.renewLastUpdate()
  }
})
</script>

<style scoped lang="less">
.space {
  :deep(.arco-descriptions-body) {
    .arco-descriptions-row:not(:last-child) .arco-descriptions-item {
      padding-bottom: 14px;
    }
  }
}
</style>
