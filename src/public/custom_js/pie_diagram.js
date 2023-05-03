// var xValues = ['Italy', 'France', 'Spain', 'USA', 'Argentina', 'fgedgg'];
// var yValues = [50, 49, 44, 24, 10, 10];
// var barColors = [
//   '#b91d47',
//   '#00aba9',
//   '#2b5797',
//   '#e8c3b9',
//   '#1e7145',
//   '#0c1465',
// ];

// new Chart('myChart', {
//   type: 'pie',
//   data: {
//     labels: xValues,
//     datasets: [
//       {
//         backgroundColor: barColors,
//         data: yValues,
//       },
//     ],
//   },
// });
// document.addEventListener('DOMContentLoaded', () => {
//   const employeeName = '<%= employee.name %>';
//   const url = `/profile/${employeeName}`;
//   fetch(url)
//     .then(response => response.json())
//     .then(employeeData => {
//       const techData = employeeData.technologies;
//       const xValues = techData.map(data => data.name);
//       const yValues = techData.map(data => data.percentage);
//       const barColors = techData.map(data => data.color);

//       new Chart('myChart', {
//         type: 'pie',
//         data: {
//           labels: xValues,
//           datasets: [
//             {
//               backgroundColor: barColors,
//               data: yValues,
//             },
//           ],
//         },
//       });
//     })
//     .catch(error => console.error(error));
// });
