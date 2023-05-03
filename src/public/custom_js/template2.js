// import OrgChart from 'https://balkangraph.com/js/OrgChart.js'; // Import OrgChart library

// // Define and export function that fetches data from server-side endpoint
// export function fetchData() {
//   return fetch('/template')
//     .then(response => response.json())
//     .then(data => {
//       return data;
//     })
//     .catch(error => {
//       console.error(error);
//     });
// }
import updateOrgChart from './template.js';

export function updateChart(chart, employees) {
  return updateOrgChart.updateOrgChart(chart, employees);
}
