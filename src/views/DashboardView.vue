<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnType } from 'ant-design-vue'
import { Modal, message } from 'ant-design-vue'
import ProjectHoursChart from '../components/ProjectHoursChart.vue'
import type { WorkOrder } from '../types/workOrder'
import { readSessionUser, clearSessionUser } from '../utils/sessionAuth'
import { loadWorkOrders, persistWorkOrders } from '../utils/workOrderStorage'

const router = useRouter()
const user = readSessionUser()
const isAdmin = computed(() => user?.isAdmin === true)

const dataSource = ref<WorkOrder[]>([])

onMounted(() => {
  if (!user) {
    router.replace('/login')
    return
  }
  dataSource.value = loadWorkOrders()
})

const columns = computed<TableColumnType<WorkOrder>[]>(() => {
  const base: TableColumnType<WorkOrder>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 88 },
    { title: 'Project', dataIndex: 'project', key: 'project', ellipsis: true },
    {
      title: 'Overtime',
      dataIndex: 'overtime',
      key: 'overtime',
      width: 110,
    },
    { title: 'Hours', dataIndex: 'hours', key: 'hours', width: 96 },
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at', width: 168 },
  ]
  if (isAdmin.value) {
    base.push({
      title: 'Actions',
      key: 'actions',
      width: 120,
    })
  }
  return base
})

function persist() {
  persistWorkOrders(dataSource.value)
}

function confirmDelete(record: WorkOrder) {
  Modal.confirm({
    title: '删除工单',
    content: `确定删除工单 ${record.id}（${record.project}）吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      dataSource.value = dataSource.value.filter((r) => r.id !== record.id)
      persist()
      message.success('已删除，图表已更新')
    },
  })
}

function logout() {
  clearSessionUser()
  router.replace('/login')
}
</script>

<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="brand">工单管理与图表</div>
      <div class="header-right">
        <span class="role-tag">
          {{ user?.username }}
          <a-tag :color="isAdmin ? 'red' : 'blue'" style="margin-left: 8px">
            {{ isAdmin ? '管理员' : '普通用户' }}
          </a-tag>
        </span>
        <a-button type="link" @click="logout">退出</a-button>
      </div>
    </a-layout-header>
    <a-layout-content class="content">
      <a-card title="工单列表" :bordered="false" class="card">
        <a-table
          row-key="id"
          :columns="columns"
          :data-source="dataSource"
          :pagination="false"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'overtime'">
              {{ (record as WorkOrder).overtime ? 'Yes' : 'No' }}
            </template>
            <template v-else-if="column.key === 'actions' && isAdmin">
              <a-button danger type="link" size="small" @click="confirmDelete(record as WorkOrder)">
                Delete
              </a-button>
            </template>
          </template>
        </a-table>
      </a-card>

      <a-card title="工时分布" :bordered="false" class="card chart-card">
        <ProjectHoursChart :orders="dataSource" />
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="less">
.layout {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #001529;
  color: #fff;
}

.brand {
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.role-tag {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
}

.content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.chart-card :deep(.ant-card-body) {
  padding-top: 8px;
}
</style>
