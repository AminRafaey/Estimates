export default function columnsApi(endpoint) {
  switch (endpoint) {
    case 'Hours and cost by room':
      return hoursAndCostByRoomCol;
    case 'Products by action':
      return productsByActionCol;
    case 'Products by room':
      return productsByRoomCol;
    case 'Hours by Surface':
      return hoursBySurfaceCol;
    default:
      return [];
  }
}

const hoursAndCostByRoomCol = [
  {
    label: 'Surface',
    key: 'surface',
  },
  {
    label: 'Actions',
    key: 'actions',
  },
  {
    label: 'Products',
    key: 'products',
  },
  {
    label: 'Time',
    key: 'time',
  },
  {
    label: 'Cost',
    key: 'cost',
  },
];

const productsByActionCol = [
  {
    label: 'Product Name',
    key: 'productName',
  },
  {
    label: 'Component',
    key: 'componentName',
  },
  {
    label: 'Sheen',
    key: 'sheenName',
  },
  {
    label: 'Quantity',
    key: 'quantity',
  },
  {
    label: 'Color Manufacturer',
    key: 'colorManufacturerName',
  },
  {
    label: 'Color Code',
    key: 'colorCode',
  },
  {
    label: 'Color Name',
    key: 'colorName',
  },
];

const productsByRoomCol = [
  {
    label: 'Surface',
    key: 'surfaceName',
  },
  {
    label: 'Actions',
    key: 'actionName',
  },
  {
    label: 'Manufacturer',
    key: 'manufacturerName',
  },
  {
    label: 'Product',
    key: 'productName',
  },
  {
    label: 'Component',
    key: 'componentName',
  },
  {
    label: 'Sheen',
    key: 'sheenName',
  },
  {
    label: 'Color Manufacturer',
    key: 'colorManufacturerName',
  },
  {
    label: 'Color Name',
    key: 'colorName',
  },
  {
    label: 'Color Code',
    key: 'colorCode',
  },
  {
    label: 'Quantity',
    key: 'quantity',
  },
];
const hoursBySurfaceCol = [
  {
    label: 'Surface',
    key: 'surfaceName',
  },
  {
    label: 'Actions',
    key: 'actionName',
  },
  {
    label: 'Hours',
    key: 'hours',
  },
];
