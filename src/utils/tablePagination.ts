// import { useVModel } from '@vueuse/core';
// import defu from 'defu';
// import { get } from 'http';
// import { computed, toRaw } from 'vue';

// import columns from '@/views/kas/jurnal/colDef';

// export const sort = useVModel(props, 'sort', emits, {
//   passive: true,
//   defaultValue: defu({}, props.sort, { column: null, direction: 'asc' }),
// });

// export const savedSort = { column: sort.value.column, direction: 'asc' };

// export function onSort(column: { key: unknown; direction: unknown; }) {
//   if (sort.value.column === column.key) {
//     const direction = sort.value.direction === 'asc' ? 'desc' : 'asc';
//     sort.value = { column: column.key, direction };
//   } else {
//     sort.value = { column: column.key, direction: column.direction || 'asc' };
//   }
// }

// export function isSelected(row: object) {
//   if (!props.modelValue) {
//     return false;
//   }

//   return selected.value.some(item => compare(toRaw(item), toRaw(row)));
// }

// export function onSelect(row: object) {
//   if (!$attrs.onSelect) {
//     return;
//   }

//   // @ts-ignore
//   $attrs.onSelect(row);
// }

// export function selectAllRows() {
//   props.rows.forEach(row => {
//     // If the row is already selected, don't select it again
//     if (isSelected(row)) {
//       return;
//     }

//     // @ts-ignore
//     selected.value.push(row);
//   });
// }

// export function onChange(event: any) {
//   if (event.target.checked) {
//     selectAllRows();
//   } else {
//     selected.value = [];
//   }
// }

// export function getRowData(
//   row: object,
//   rowKey: string | string[],
//   defaultValue: unknown = ''
// ) {
//   return get(row, rowKey, defaultValue);
// }
