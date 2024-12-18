<!-- https://github.com/SortableJS/Vue.Draggable/issues/1212 -->
<template>
  <v-data-table
    ref="myTable"
    v-model="selected"
    :items="desserts"
    :headers="activeHeaders"
    item-key="name"
  >
    <template #body="props">
      <draggable
        :list="props.items"
        tag="tbody"
        item-key="name"
      >
        <template #item="{ element }">
          <tr class="v-data-table__tr">
            <td
              v-for="(field, index) in element"
              :key="index"
              class="v-data-table__td v-data-table-column--align-start"
            >
              {{ field }}
            </td>
          </tr>
        </template>
      </draggable>
    </template>
  </v-data-table>
</template>

<script setup>
import draggable from 'vuedraggable'
import { ref, computed, onMounted } from 'vue'

const allowDrag = ref(true)
const selected = ref([])
const headers = ref([
  { title: 'Lock', key: 'locked', width: '50px', sortable: false },
  { title: 'Dessert (100g serving)', key: 'name', align: 'start', sortable: false },
  { title: 'Calories', key: 'calories' },
  { title: 'Fat (g)', key: 'fat' },
  { title: 'Carbs (g)', key: 'carbs' },
  { title: 'Protein (g)', key: 'protein' },
  { title: 'Iron (%)', key: 'iron' }
])
const desserts = ref([
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: '1%',
    locked: false
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: '1%',
    locked: true
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: '7%',
    locked: false
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: '8%',
    locked: false
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: '16%',
    locked: false
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: '0%',
    locked: false
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: '2%',
    locked: false
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: '45%',
    locked: false
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: '22%',
    locked: true
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: '6%',
    locked: false
  }
])

const activeHeaders = computed(() => {
  return headers.value.filter((h) => {
    if (!allowDrag.value && h.value === 'lock') {
      return false
    }
    return true
  })
})

onMounted(() => {
  console.log(headers.value)
  const sortableTbody = document.querySelector('.v-table__wrapper > table > tbody > tbody')
  const tbody = document.querySelector('.v-table__wrapper > table > tbody')
  if (tbody && tbody.parentNode && sortableTbody) {
    tbody.parentNode.append(sortableTbody)
    tbody.remove()
  }
})
</script>
