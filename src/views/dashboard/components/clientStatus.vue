<template>
  <a-typography-title :heading="3">{{ t('page.dashboard.clientStatus.title') }}</a-typography-title>
  <a-row
    justify="start"
    align="stretch"
    :wrap="true"
    :gutter="[
      { xs: 8, sm: 8, md: 8, lg: 24, xl: 32 },
      { xs: 8, sm: 8, md: 8, lg: 24, xl: 32 }
    ]"
  >
    <!-- 骨架屏 -->
    <a-col v-if="!data || data?.length === 0 || loading" :xs="24" :sm="12" :md="8" :lg="6">
      <a-card hoverable :header-style="{ height: 'auto' }">
        <template #title>
          <a-skeleton :animation="true">
            <a-space direction="vertical" :style="{ width: '100%' }" :size="0">
              <a-skeleton-line :line-height="44" :line-spacing="0" />
            </a-space>
          </a-skeleton>
        </template>
        <a-skeleton :animation="true">
          <a-space direction="vertical" :style="{ width: '100%' }" :size="0">
            <a-skeleton-line
              :rows="4"
              :line-height="22"
              :line-spacing="14"
              :widths="['60%', '70%', '50%', '60%']"
            />
          </a-space>
        </a-skeleton>
      </a-card>
    </a-col>
    <!-- client 卡片 -->
    <a-col v-else :xs="24" :sm="12" :md="8" :lg="6" v-for="client in data" :key="client.name">
      <ClientStatusCard
        :downloader="client"
        @torrent-view-click="() => torrentList?.showModal(client.name)"
      />
    </a-col>
  </a-row>
  <TorrentListModal ref="torrentList" />
</template>
<script setup lang="ts">
import { useEndpointStore } from '@/stores/endpoint'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import TorrentListModal from './torrentListModal.vue'
import ClientStatusCard from './clientStatusCard.vue'
import { useAutoUpdate } from '@/stores/autoUpdate'
import { useRequest } from 'vue-request'
import { getDownloaders } from '@/service/downloaders'
const { t } = useI18n()
const endpointState = useEndpointStore()
const autoUpdateState = useAutoUpdate()
const { data, refresh, loading } = useRequest(getDownloaders, {
  pollingInterval: computed(() => autoUpdateState.pollingInterval),
  cacheKey: () => `${endpointState.endpoint}-downloader`
})

watch(() => endpointState.endpoint, refresh)

const torrentList = ref<InstanceType<typeof TorrentListModal>>()
</script>
